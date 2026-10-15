"use server";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getInvoices(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.salesInvoice.findMany({
    where: {
      customer: { organizationId },
      ...(search
        ? { invoiceNumber: { contains: search } }
        : {}),
    },
    include: {
      customer: true,
      salesOrder: true,
      _count: { select: { items: true, receipts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoiceById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.salesInvoice.findFirst({
    where: { id, customer: { organizationId } },
    include: {
      customer: true,
      salesOrder: true,
      items: true,
      receipts: true,
    },
  });
}

export async function getInvoiceFormOptions() {
  const organizationId = await getSessionOrgId();

  // Only sales orders that don't already have an invoice attached
  const salesOrders = await prisma.salesOrder.findMany({
    where: { organizationId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return { salesOrders };
}

export async function createInvoice(formData: FormData) {
  const organizationId = await getSessionOrgId();

  const salesOrderId = formData.get("salesOrderId") as string;
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const invoiceDate = formData.get("invoiceDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const currency = (formData.get("currency") as string) || "BDT";

  const salesOrder = await prisma.salesOrder.findFirst({
    where: { id: salesOrderId, organizationId },
  });
  if (!salesOrder) throw new Error("Invalid sales order for this organization");

  await prisma.salesInvoice.create({
    data: {
      salesOrderId,
      customerId: salesOrder.customerId,
      invoiceNumber,
      invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      totalAmount: totalAmount || 0,
      currency,
    },
  });

  // Keep the sales order status in sync
  await prisma.salesOrder.update({
    where: { id: salesOrderId },
    data: { status: "INVOICED" },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function recordReceipt(formData: FormData) {
  const organizationId = await getSessionOrgId();

  const invoiceId = formData.get("invoiceId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = (formData.get("method") as string) || "BANK_TRANSFER";
  const referenceNo = formData.get("referenceNo") as string | null;

  const invoice = await prisma.salesInvoice.findFirst({
    where: { id: invoiceId, customer: { organizationId } },
  });
  if (!invoice) throw new Error("Invoice not found");

  await prisma.receipt.create({
    data: {
      invoiceId,
      customerId: invoice.customerId,
      amount,
      method: method as never,
      referenceNo: referenceNo || null,
    },
  });

  const newPaidAmount = invoice.paidAmount + amount;
  const newStatus =
    newPaidAmount >= invoice.totalAmount
      ? "PAID"
      : newPaidAmount > 0
      ? "PARTIALLY_PAID"
      : "UNPAID";

  await prisma.salesInvoice.update({
    where: { id: invoiceId },
    data: { paidAmount: newPaidAmount, status: newStatus as never },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

export async function deleteInvoice(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.salesInvoice.findFirst({
    where: { id, customer: { organizationId } },
  });
  if (!existing) throw new Error("Invoice not found");

  await prisma.salesInvoice.delete({ where: { id } });
  revalidatePath("/dashboard/invoices");
}