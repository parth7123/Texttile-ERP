"use server";

import { prisma } from "@/lib/prisma";

import { yarnLotSchema, type YarnLotInput } from "@/lib/validations/yarn";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getYarnLots(yarnId: string) {
  const organizationId = await getSessionOrgId();
  const yarn = await prisma.yarnMaster.findFirst({ where: { id: yarnId, organizationId } });
  if (!yarn) throw new Error("Yarn not found");

  return prisma.yarnLot.findMany({
    where: { yarnId },
    include: { warehouse: true },
    orderBy: { producedAt: "desc" },
  });
}

export async function getYarnLotFormOptions(organizationId: string) {
  return prisma.warehouse.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
}

export async function createYarnLot(yarnId: string, input: YarnLotInput) {
  const organizationId = await getSessionOrgId();
  const yarn = await prisma.yarnMaster.findFirst({ where: { id: yarnId, organizationId } });
  if (!yarn) throw new Error("Yarn not found");

  const data = yarnLotSchema.parse({ ...input, yarnId });

  await prisma.yarnLot.create({
    data: {
      yarnId,
      lotNumber: data.lotNumber,
      warehouseId: data.warehouseId,
      quantityIn: data.quantityIn,
      quantityLeft: data.quantityIn,
      qualityGrade: data.qualityGrade || null,
      producedAt: data.producedAt ?? new Date(),
    },
  });

  revalidatePath(`/dashboard/yarns/${yarnId}/lots`);
}

export async function deleteYarnLot(yarnId: string, lotId: string) {
  await prisma.yarnLot.delete({ where: { id: lotId } });
  revalidatePath(`/dashboard/yarns/${yarnId}/lots`);
}