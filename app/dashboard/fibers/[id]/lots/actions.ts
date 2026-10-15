"use server";

import { prisma } from "@/lib/prisma";

import { fiberLotSchema, type FiberLotInput } from "@/lib/validations/fiber";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getFiberLots(fiberId: string) {
  const organizationId = await getSessionOrgId();
  const fiber = await prisma.fiber.findFirst({ where: { id: fiberId, organizationId } });
  if (!fiber) throw new Error("Fiber not found");

  return prisma.fiberLot.findMany({
    where: { fiberId },
    include: { supplier: true, warehouse: true },
    orderBy: { receivedAt: "desc" },
  });
}

export async function getLotFormOptions(organizationId: string) {
  const [warehouses, suppliers] = await Promise.all([
    prisma.warehouse.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.supplier.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
  ]);
  return { warehouses, suppliers };
}

export async function createFiberLot(fiberId: string, input: FiberLotInput) {
  const organizationId = await getSessionOrgId();
  const fiber = await prisma.fiber.findFirst({ where: { id: fiberId, organizationId } });
  if (!fiber) throw new Error("Fiber not found");

  const data = fiberLotSchema.parse({ ...input, fiberId });

  await prisma.fiberLot.create({
    data: {
      fiberId,
      lotNumber: data.lotNumber,
      supplierId: data.supplierId || null,
      warehouseId: data.warehouseId,
      quantityIn: data.quantityIn,
      quantityLeft: data.quantityIn,
      bags: data.bags ?? null,
      qualityNotes: data.qualityNotes || null,
      receivedAt: data.receivedAt ?? new Date(),
    },
  });

  revalidatePath(`/dashboard/fibers/${fiberId}/lots`);
}

export async function deleteFiberLot(fiberId: string, lotId: string) {
  await prisma.fiberLot.delete({ where: { id: lotId } });
  revalidatePath(`/dashboard/fibers/${fiberId}/lots`);
}