"use server";

import { prisma } from "@/lib/prisma";

import { weavingOrderSchema, weavingLogSchema } from "@/lib/validations/production";
import { createCostSheet } from "@/app/dashboard/boms/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getWeavingOrders() {
  const organizationId = await getSessionOrgId();
  return prisma.weavingProductionOrder.findMany({
    where: { organizationId },
    include: { warpBeam: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWeavingFormOptions(organizationId: string) {
  const [fabrics, boms, beams, looms, employees, shifts] = await Promise.all([
    prisma.fabricConstruction.findMany({ where: { organizationId } }),
    prisma.bOM.findMany({ where: { organizationId, outputType: "FABRIC", isActive: true } }),
    prisma.warpBeam.findMany({ where: { status: "READY" } }),
    prisma.loom.findMany({ where: { organizationId } }),
    prisma.employee.findMany({ where: { organizationId, status: "ACTIVE" } }),
    prisma.shift.findMany({ where: { organizationId } }),
  ]);
  return { fabrics, boms, beams, looms, employees, shifts };
}

export async function createWeavingOrder(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const data = weavingOrderSchema.parse({
    orderNumber: formData.get("orderNumber"),
    fabricId: formData.get("fabricId"),
    warpBeamId: formData.get("warpBeamId"),
    bomId: formData.get("bomId"),
    targetLengthM: formData.get("targetLengthM"),
  });

  const order = await prisma.weavingProductionOrder.create({
    data: {
      organizationId,
      orderNumber: data.orderNumber,
      fabricId: data.fabricId,
      warpBeamId: data.warpBeamId || null,
      bomId: data.bomId || null,
      targetLengthM: data.targetLengthM,
    },
  });

  if (data.warpBeamId) {
    await prisma.warpBeam.update({ where: { id: data.warpBeamId }, data: { status: "ON_LOOM" } });
  }

  redirect(`/dashboard/weaving-orders/${order.id}`);
}

export async function getWeavingOrderById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.weavingProductionOrder.findFirst({
    where: { id, organizationId },
    include: { logs: { include: { loom: true, employee: true, shift: true }, orderBy: { logDate: "desc" } }, warpBeam: true },
  });
}

export async function addWeavingLog(orderId: string, formData: FormData) {
  const data = weavingLogSchema.parse({
    loomId: formData.get("loomId"),
    employeeId: formData.get("employeeId"),
    shiftId: formData.get("shiftId"),
    logDate: formData.get("logDate"),
    outputMeters: formData.get("outputMeters"),
    efficiencyPct: formData.get("efficiencyPct"),
    pickInsertionRate: formData.get("pickInsertionRate"),
    stops: formData.get("stops"),
    remarks: formData.get("remarks"),
  });

  await prisma.weavingProductionLog.create({
    data: {
      productionOrderId: orderId,
      loomId: data.loomId,
      employeeId: data.employeeId || null,
      shiftId: data.shiftId || null,
      logDate: data.logDate,
      outputMeters: data.outputMeters,
      efficiencyPct: data.efficiencyPct ?? null,
      pickInsertionRate: data.pickInsertionRate ?? null,
      stops: data.stops ?? null,
      remarks: data.remarks || null,
    },
  });

  const order = await prisma.weavingProductionOrder.findUnique({ where: { id: orderId } });
  await prisma.weavingProductionOrder.update({
    where: { id: orderId },
    data: {
      producedLengthM: { increment: data.outputMeters },
      status: "IN_PROGRESS",
      startDate: order?.startDate ?? new Date(),
    },
  });

  revalidatePath(`/dashboard/weaving-orders/${orderId}`);
}

export async function completeWeavingOrder(orderId: string, formData: FormData) {
  const laborCost = Number(formData.get("laborCost") ?? 0);
  const overheadCost = Number(formData.get("overheadCost") ?? 0);

  const order = await prisma.weavingProductionOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  await prisma.weavingProductionOrder.update({
    where: { id: orderId },
    data: { status: "COMPLETED", endDate: new Date() },
  });

  if (order.warpBeamId) {
    await prisma.warpBeam.update({ where: { id: order.warpBeamId }, data: { status: "EXHAUSTED" } });
  }

  if (order.bomId) {
    await createCostSheet(order.bomId, "WEAVING_ORDER", orderId, order.producedLengthM, laborCost, overheadCost);
  }

  revalidatePath(`/dashboard/weaving-orders/${orderId}`);
}
