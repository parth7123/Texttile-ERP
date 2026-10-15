"use server";

import { prisma } from "@/lib/prisma";

import { loomSchema, type LoomInput } from "@/lib/validations/machine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getLooms(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.loom.findMany({
    where: { organizationId, ...(search ? { name: { contains: search } } : {}) },
    include: { branch: true, _count: { select: { downtimeLogs: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getLoomById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.loom.findFirst({ where: { id, organizationId } });
}

export async function getLoomFormOptions(organizationId: string) {
  return prisma.branch.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
}

export async function createLoom(input: LoomInput) {
  const organizationId = await getSessionOrgId();
  const data = loomSchema.parse(input);

  await prisma.loom.create({
    data: {
      ...data,
      branchId: data.branchId || null,
      manufacturer: data.manufacturer || null,
      width: data.width ?? null,
      installedAt: data.installedAt ?? null,
      organizationId,
    },
  });

  revalidatePath("/dashboard/looms");
  redirect("/dashboard/looms");
}

export async function updateLoom(id: string, input: LoomInput) {
  const organizationId = await getSessionOrgId();
  const data = loomSchema.parse(input);

  const existing = await prisma.loom.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Loom not found");

  await prisma.loom.update({
    where: { id },
    data: {
      ...data,
      branchId: data.branchId || null,
      manufacturer: data.manufacturer || null,
      width: data.width ?? null,
      installedAt: data.installedAt ?? null,
    },
  });

  revalidatePath("/dashboard/looms");
  redirect("/dashboard/looms");
}

export async function deleteLoom(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.loom.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Loom not found");

  await prisma.loom.delete({ where: { id } });
  revalidatePath("/dashboard/looms");
}
