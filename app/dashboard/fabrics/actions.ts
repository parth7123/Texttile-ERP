"use server";

import { prisma } from "@/lib/prisma";

import { fabricSchema, type FabricInput } from "@/lib/validations/fabric";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getFabrics(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.fabricConstruction.findMany({
    where: { organizationId, ...(search ? { name: { contains: search } } : {}) },
    include: { warpYarn: true, weftYarn: true, _count: { select: { rolls: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFabricById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.fabricConstruction.findFirst({ where: { id, organizationId } });
}

export async function getFabricFormOptions(organizationId: string) {
  return prisma.yarnMaster.findMany({ where: { organizationId, isActive: true }, orderBy: { createdAt: "desc" } });
}

export async function createFabric(input: FabricInput) {
  const organizationId = await getSessionOrgId();
  const data = fabricSchema.parse(input);

  await prisma.fabricConstruction.create({
    data: {
      ...data,
      warpCount: data.warpCount || null,
      weftCount: data.weftCount || null,
      gsm: data.gsm ?? null,
      standardCostPerUnit: data.standardCostPerUnit ?? null,
      organizationId,
    },
  });

  revalidatePath("/dashboard/fabrics");
  redirect("/dashboard/fabrics");
}

export async function updateFabric(id: string, input: FabricInput) {
  const organizationId = await getSessionOrgId();
  const data = fabricSchema.parse(input);

  const existing = await prisma.fabricConstruction.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Fabric not found");

  await prisma.fabricConstruction.update({
    where: { id },
    data: {
      ...data,
      warpCount: data.warpCount || null,
      weftCount: data.weftCount || null,
      gsm: data.gsm ?? null,
      standardCostPerUnit: data.standardCostPerUnit ?? null,
    },
  });

  revalidatePath("/dashboard/fabrics");
  redirect("/dashboard/fabrics");
}

export async function deleteFabric(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.fabricConstruction.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Fabric not found");

  await prisma.fabricConstruction.delete({ where: { id } });
  revalidatePath("/dashboard/fabrics");
}
