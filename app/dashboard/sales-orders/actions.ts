"use server";

import { prisma } from "@/lib/prisma";

import { soItemSchema } from "@/lib/validations/sales";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getSalesOrders() {
  const organizationId = await getSessionOrgId();
  return prisma.salesOrder.findMany({
    where: { organizationId },
    include: { customer: true, items: true },
    orderBy: { orderDate: "desc" },
  });
}

export async function getSOFormOptions(organizationId: string) {
  const [customers, fabrics, yarns] = await Promise.all([
    prisma.customer.findMany({ where: { organizationId } }),
    prisma.fabricConstruction.findMany({ where: { organizationId } }),
    prisma.yarnMaster.findMany({ where: { organizationId } }),
  ]);
  return { customers, fabrics, yarns };
}

export async function createSalesOrder(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const soNumber = String(formData.get("soNumber"));
  const customerId = String(formData.get("customerId"));
  const deliveryDate = formData.get("deliveryDate") ? new Date(String(formData.get("deliveryDate"))) : null;

  const so = await prisma.salesOrder.create({
    data: { organizationId, soNumber, customerId, deliveryDate, status: "DRAFT" },
  });

  redirect(`/dashboard/sales-orders/${so.id}`);
}

export async function getSOById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.salesOrder.findFirst({
    where: { id, organizationId },
    include: {
      customer: true,
      items: { include: { fabric: true, yarn: true } },
      dispatches: { include: { items: true } },
      invoices: true,
    },
  });
}

export async function addSOItem(soId: string, formData: FormData) {
  const data = soItemSchema.parse({
    fabricId: formData.get("fabricId"),
    yarnId: formData.get("yarnId"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    rate: formData.get("rate"),
  });

  const amount = data.quantity * data.rate;

  await prisma.salesOrderItem.create({
    data: {
      salesOrderId: soId,
      fabricId: data.fabricId || null,
      yarnId: data.yarnId || null,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      rate: data.rate,
      amount,
    },
  });

  const items = await prisma.salesOrderItem.findMany({ where: { salesOrderId: soId } });
  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
  await prisma.salesOrder.update({ where: { id: soId }, data: { totalAmount, status: "CONFIRMED" } });

  revalidatePath(`/dashboard/sales-orders/${soId}`);
}

// Dispatch: select fabric rolls to ship, mark them DISPATCHED
export async function createDispatch(soId: string, formData: FormData) {
  const dispatchNumber = String(formData.get("dispatchNumber"));
  const vehicleNumber = String(formData.get("vehicleNumber") ?? "");
  const rollIds = formData.getAll("rollIds").map(String);

  if (rollIds.length === 0) throw new Error("Select at least one roll to dispatch");

  const dispatch = await prisma.dispatch.create({
    data: { salesOrderId: soId, dispatchNumber, vehicleNumber: vehicleNumber || null },
  });

  for (const rollId of rollIds) {
    const roll = await prisma.fabricRoll.findUnique({ where: { id: rollId } });
    if (!roll) continue;
    await prisma.dispatchItem.create({
      data: { dispatchId: dispatch.id, fabricRollId: rollId, quantity: roll.lengthMeters, unit: "METER" },
    });
    await prisma.fabricRoll.update({ where: { id: rollId }, data: { status: "DISPATCHED" } });
  }

  await prisma.salesOrder.update({ where: { id: soId }, data: { status: "DISPATCHED" } });
  revalidatePath(`/dashboard/sales-orders/${soId}`);
}

export async function createInvoice(soId: string, formData: FormData) {
  const invoiceNumber = String(formData.get("invoiceNumber"));
  const dueDate = formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : null;

  const so = await prisma.salesOrder.findUnique({ where: { id: soId }, include: { items: true } });
  if (!so) throw new Error("Sales order not found");

  const invoice = await prisma.salesInvoice.create({
    data: {
      salesOrderId: soId,
      customerId: so.customerId,
      invoiceNumber,
      dueDate,
      totalAmount: so.totalAmount,
      currency: so.currency,
      status: "UNPAID",
      items: {
        create: so.items.map((i) => ({ description: i.description, quantity: i.quantity, unit: i.unit, rate: i.rate, amount: i.amount })),
      },
    },
  });

  await prisma.salesOrder.update({ where: { id: soId }, data: { status: "INVOICED" } });
  revalidatePath(`/dashboard/sales-orders/${soId}`);
  return invoice;
}

export async function recordReceipt(invoiceId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  const bankAccountId = String(formData.get("bankAccountId") ?? "");

  const invoice = await prisma.salesInvoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new Error("Invoice not found");

  await prisma.receipt.create({
    data: { customerId: invoice.customerId, invoiceId, bankAccountId: bankAccountId || null, amount, method: "BANK_TRANSFER" },
  });

  const paidAmount = invoice.paidAmount + amount;
  const status = paidAmount >= invoice.totalAmount ? "PAID" : "PARTIALLY_PAID";

  await prisma.salesInvoice.update({ where: { id: invoiceId }, data: { paidAmount, status } });
  revalidatePath(`/dashboard/sales-orders/${invoice.salesOrderId}`);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}
