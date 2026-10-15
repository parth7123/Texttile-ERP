"use server";

import { prisma } from "@/lib/prisma";

import { poItemSchema, grnItemSchema } from "@/lib/validations/procurement";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getPurchaseOrders() {
  const organizationId = await getSessionOrgId();
  return prisma.purchaseOrder.findMany({
    where: { organizationId },
    include: { supplier: true, items: true },
    orderBy: { orderDate: "desc" },
  });
}

export async function getPOFormOptions(organizationId: string) {
  const [suppliers, fibers, yarns] = await Promise.all([
    prisma.supplier.findMany({ where: { organizationId } }),
    prisma.fiber.findMany({ where: { organizationId } }),
    prisma.yarnMaster.findMany({ where: { organizationId } }),
  ]);
  return { suppliers, fibers, yarns };
}

export async function createPurchaseOrder(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const poNumber = String(formData.get("poNumber"));
  const supplierId = String(formData.get("supplierId"));
  const expectedDate = formData.get("expectedDate") ? new Date(String(formData.get("expectedDate"))) : null;

  const po = await prisma.purchaseOrder.create({
    data: { organizationId, poNumber, supplierId, expectedDate, status: "DRAFT" },
  });

  redirect(`/dashboard/purchase-orders/${po.id}`);
}

export async function getPOById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.purchaseOrder.findFirst({
    where: { id, organizationId },
    include: { supplier: true, items: { include: { fiber: true, yarn: true } }, grns: { include: { items: true } } },
  });
}

export async function addPOItem(poId: string, formData: FormData) {
  const data = poItemSchema.parse({
    fiberId: formData.get("fiberId"),
    yarnId: formData.get("yarnId"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    rate: formData.get("rate"),
  });

  const amount = data.quantity * data.rate;

  await prisma.purchaseOrderItem.create({
    data: {
      purchaseOrderId: poId,
      fiberId: data.fiberId || null,
      yarnId: data.yarnId || null,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      rate: data.rate,
      amount,
    },
  });

  const items = await prisma.purchaseOrderItem.findMany({ where: { purchaseOrderId: poId } });
  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
  await prisma.purchaseOrder.update({ where: { id: poId }, data: { totalAmount } });

  revalidatePath(`/dashboard/purchase-orders/${poId}`);
}

export async function approvePO(poId: string) {
  await prisma.purchaseOrder.update({ where: { id: poId }, data: { status: "APPROVED" } });
  revalidatePath(`/dashboard/purchase-orders/${poId}`);
}

// Records a GRN and creates FiberLot/YarnLot for received items automatically
export async function createGRN(poId: string, formData: FormData) {
  const grnNumber = String(formData.get("grnNumber"));
  const warehouseId = String(formData.get("warehouseId"));

  const po = await prisma.purchaseOrder.findUnique({ where: { id: poId }, include: { items: true } });
  if (!po) throw new Error("PO not found");

  const grn = await prisma.goodsReceivedNote.create({
    data: { purchaseOrderId: poId, grnNumber, receivedBy: null },
  });

  for (const item of po.items) {
    const receivedQty = Number(formData.get(`received_${item.id}`) ?? 0);
    const rejectedQty = Number(formData.get(`rejected_${item.id}`) ?? 0);
    if (receivedQty <= 0) continue;

    await prisma.gRNItem.create({
      data: {
        grnId: grn.id,
        description: item.description,
        orderedQty: item.quantity,
        receivedQty,
        rejectedQty,
        unit: item.unit,
      },
    });

    if (item.fiberId) {
      await prisma.fiberLot.create({
        data: {
          fiberId: item.fiberId,
          lotNumber: `${grnNumber}-${item.id.slice(0, 6)}`,
          supplierId: po.supplierId,
          warehouseId,
          quantityIn: receivedQty,
          quantityLeft: receivedQty,
        },
      });
    }
    if (item.yarnId) {
      await prisma.yarnLot.create({
        data: {
          yarnId: item.yarnId,
          lotNumber: `${grnNumber}-${item.id.slice(0, 6)}`,
          warehouseId,
          quantityIn: receivedQty,
          quantityLeft: receivedQty,
        },
      });
    }
  }

  const grnItems = await prisma.gRNItem.findMany({ where: { grn: { purchaseOrderId: poId } } });
  const totalReceived = grnItems.reduce((sum, i) => sum + i.receivedQty, 0);
  const totalOrdered = po.items.reduce((sum, i) => sum + i.quantity, 0);

  await prisma.purchaseOrder.update({
    where: { id: poId },
    data: { status: totalReceived >= totalOrdered ? "RECEIVED" : "PARTIALLY_RECEIVED" },
  });

  revalidatePath(`/dashboard/purchase-orders/${poId}`);
}
