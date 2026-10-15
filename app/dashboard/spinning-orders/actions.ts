"use server";

import { prisma } from "@/lib/prisma";

import { spinningOrderSchema, spinningLogSchema, wasteLogSchema } from "@/lib/validations/production";
import { createCostSheet } from "@/app/dashboard/boms/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getSpinningOrders() {
  const organizationId = await getSessionOrgId();
  return prisma.spinningProductionOrder.findMany({
    where: { organizationId },
    include: { yarnLots: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSpinningFormOptions(organizationId: string) {
  const [yarns, boms, machines, employees, shifts] = await Promise.all([
    prisma.yarnMaster.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.bOM.findMany({ where: { organizationId, outputType: "YARN", isActive: true } }),
    prisma.machine.findMany({ where: { organizationId } }),
    prisma.employee.findMany({ where: { organizationId, status: "ACTIVE" } }),
    prisma.shift.findMany({ where: { organizationId } }),
  ]);
  return { yarns, boms, machines, employees, shifts };
}

export async function createSpinningOrder(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const data = spinningOrderSchema.parse({
    orderNumber: formData.get("orderNumber"),
    yarnId: formData.get("yarnId"),
    bomId: formData.get("bomId"),
    targetQtyKg: formData.get("targetQtyKg"),
  });

  const order = await prisma.spinningProductionOrder.create({
    data: {
      organizationId,
      orderNumber: data.orderNumber,
      yarnId: data.yarnId,
      bomId: data.bomId || null,
      targetQtyKg: data.targetQtyKg,
    },
  });

  redirect(`/dashboard/spinning-orders/${order.id}`);
}

export async function getSpinningOrderById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.spinningProductionOrder.findFirst({
    where: { id, organizationId },
    include: {
      logs: { include: { machine: true, employee: true, shift: true }, orderBy: { logDate: "desc" } },
      wasteLogs: { orderBy: { logDate: "desc" } },
      yarnLots: true,
    },
  });
}

export async function addSpinningLog(orderId: string, formData: FormData) {
  const data = spinningLogSchema.parse({
    machineId: formData.get("machineId"),
    employeeId: formData.get("employeeId"),
    shiftId: formData.get("shiftId"),
    logDate: formData.get("logDate"),
    outputKg: formData.get("outputKg"),
    spindleHours: formData.get("spindleHours"),
    efficiencyPct: formData.get("efficiencyPct"),
    countAchieved: formData.get("countAchieved"),
    remarks: formData.get("remarks"),
  });

  await prisma.spinningProductionLog.create({
    data: {
      productionOrderId: orderId,
      machineId: data.machineId,
      employeeId: data.employeeId || null,
      shiftId: data.shiftId || null,
      logDate: data.logDate,
      outputKg: data.outputKg,
      spindleHours: data.spindleHours ?? null,
      efficiencyPct: data.efficiencyPct ?? null,
      countAchieved: data.countAchieved ?? null,
      remarks: data.remarks || null,
    },
  });

  const order = await prisma.spinningProductionOrder.update({
    where: { id: orderId },
    data: {
      producedQtyKg: { increment: data.outputKg },
      status: "IN_PROGRESS",
      startDate: { set: undefined },
    },
  });
  if (!order.startDate) {
    await prisma.spinningProductionOrder.update({ where: { id: orderId }, data: { startDate: new Date() } });
  }

  revalidatePath(`/dashboard/spinning-orders/${orderId}`);
}

export async function addWasteLog(orderId: string, formData: FormData) {
  const data = wasteLogSchema.parse({
    wasteType: formData.get("wasteType"),
    quantityKg: formData.get("quantityKg"),
    normPct: formData.get("normPct"),
    actualPct: formData.get("actualPct"),
    logDate: formData.get("logDate"),
  });

  await prisma.wasteLog.create({
    data: {
      productionOrderId: orderId,
      wasteType: data.wasteType,
      quantityKg: data.quantityKg,
      normPct: data.normPct ?? null,
      actualPct: data.actualPct ?? null,
      logDate: data.logDate,
    },
  });

  revalidatePath(`/dashboard/spinning-orders/${orderId}`);
}

// Completes order: creates a YarnLot from produced qty, optionally generates a cost sheet
export async function completeSpinningOrder(orderId: string, formData: FormData) {
  const warehouseId = String(formData.get("warehouseId"));
  const lotNumber = String(formData.get("lotNumber"));
  const laborCost = Number(formData.get("laborCost") ?? 0);
  const overheadCost = Number(formData.get("overheadCost") ?? 0);

  const order = await prisma.spinningProductionOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const yarnLot = await prisma.yarnLot.create({
    data: {
      yarnId: order.yarnId,
      lotNumber,
      warehouseId,
      quantityIn: order.producedQtyKg,
      quantityLeft: order.producedQtyKg,
      productionOrderId: orderId,
    },
  });

  await prisma.spinningProductionOrder.update({
    where: { id: orderId },
    data: { status: "COMPLETED", endDate: new Date() },
  });

  if (order.bomId) {
    await createCostSheet(order.bomId, "SPINNING_ORDER", orderId, order.producedQtyKg, laborCost, overheadCost);
  }

  revalidatePath(`/dashboard/spinning-orders/${orderId}`);
  revalidatePath(`/dashboard/yarns/${order.yarnId}/lots`);
  return yarnLot;
}
