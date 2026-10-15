"use server";

import { prisma } from "@/lib/prisma";

import { fabricRollSchema, type FabricRollInput } from "@/lib/validations/fabric";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getFabricRolls(fabricId: string) {
  const organizationId = await getSessionOrgId();
  const fabric = await prisma.fabricConstruction.findFirst({ where: { id: fabricId, organizationId } });
  if (!fabric) throw new Error("Fabric not found");

  return prisma.fabricRoll.findMany({
    where: { fabricId },
    include: { warehouse: true, loom: true },
    orderBy: { producedAt: "desc" },
  });
}

export async function getRollFormOptions(organizationId: string) {
  const [warehouses, looms] = await Promise.all([
    prisma.warehouse.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.loom.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
  ]);
  return { warehouses, looms };
}

export async function createFabricRoll(fabricId: string, input: FabricRollInput) {
  const organizationId = await getSessionOrgId();
  const fabric = await prisma.fabricConstruction.findFirst({ where: { id: fabricId, organizationId } });
  if (!fabric) throw new Error("Fabric not found");

  const data = fabricRollSchema.parse({ ...input, fabricId });

  await prisma.fabricRoll.create({
    data: {
      fabricId,
      rollNumber: data.rollNumber,
      warehouseId: data.warehouseId,
      loomId: data.loomId || null,
      lengthMeters: data.lengthMeters,
      weightKg: data.weightKg ?? null,
      qualityGrade: data.qualityGrade,
      status: "IN_STOCK",
    },
  });

  revalidatePath(`/dashboard/fabrics/${fabricId}/rolls`);
}

export async function deleteFabricRoll(fabricId: string, rollId: string) {
  await prisma.fabricRoll.delete({ where: { id: rollId } });
  revalidatePath(`/dashboard/fabrics/${fabricId}/rolls`);
}