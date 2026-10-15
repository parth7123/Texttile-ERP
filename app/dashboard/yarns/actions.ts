"use server";

import { prisma } from "@/lib/prisma";

import { yarnSchema, type YarnInput } from "@/lib/validations/yarn";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getYarns(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.yarnMaster.findMany({
    where: {
      organizationId,
      ...(search
        ? { OR: [{ yarnType: { contains: search } }, { blendRatio: { contains: search } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lots: true } } },
  });
}

export async function getYarnById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.yarnMaster.findFirst({ where: { id, organizationId } });
}

export async function createYarn(input: YarnInput) {
  const organizationId = await getSessionOrgId();
  const data = yarnSchema.parse(input);

  await prisma.yarnMaster.create({
    data: {
      ...data,
      blendRatio: data.blendRatio || null,
      yarnType: data.yarnType || null,
      standardCostPerKg: data.standardCostPerKg ?? null,
      organizationId,
    },
  });

  revalidatePath("/dashboard/yarns");
  redirect("/dashboard/yarns");
}

export async function updateYarn(id: string, input: YarnInput) {
  const organizationId = await getSessionOrgId();
  const data = yarnSchema.parse(input);

  const existing = await prisma.yarnMaster.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Yarn not found");

  await prisma.yarnMaster.update({
    where: { id },
    data: {
      ...data,
      blendRatio: data.blendRatio || null,
      yarnType: data.yarnType || null,
      standardCostPerKg: data.standardCostPerKg ?? null,
    },
  });

  revalidatePath("/dashboard/yarns");
  redirect("/dashboard/yarns");
}

export async function deleteYarn(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.yarnMaster.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Yarn not found");

  await prisma.yarnMaster.delete({ where: { id } });
  revalidatePath("/dashboard/yarns");
}
