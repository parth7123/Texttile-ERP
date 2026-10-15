"use server";

import { prisma } from "@/lib/prisma";

import { machineSchema, type MachineInput } from "@/lib/validations/machine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getMachines(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.machine.findMany({
    where: { organizationId, ...(search ? { name: { contains: search } } : {}) },
    include: { branch: true, _count: { select: { downtimeLogs: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getMachineById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.machine.findFirst({ where: { id, organizationId } });
}

export async function getMachineFormOptions(organizationId: string) {
  return prisma.branch.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
}

export async function createMachine(input: MachineInput) {
  const organizationId = await getSessionOrgId();
  const data = machineSchema.parse(input);

  await prisma.machine.create({
    data: {
      ...data,
      branchId: data.branchId || null,
      manufacturer: data.manufacturer || null,
      spindles: data.spindles ?? null,
      capacityPerShift: data.capacityPerShift ?? null,
      installedAt: data.installedAt ?? null,
      organizationId,
    },
  });

  revalidatePath("/dashboard/machines");
  redirect("/dashboard/machines");
}

export async function updateMachine(id: string, input: MachineInput) {
  const organizationId = await getSessionOrgId();
  const data = machineSchema.parse(input);

  const existing = await prisma.machine.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Machine not found");

  await prisma.machine.update({
    where: { id },
    data: {
      ...data,
      branchId: data.branchId || null,
      manufacturer: data.manufacturer || null,
      spindles: data.spindles ?? null,
      capacityPerShift: data.capacityPerShift ?? null,
      installedAt: data.installedAt ?? null,
    },
  });

  revalidatePath("/dashboard/machines");
  redirect("/dashboard/machines");
}

export async function deleteMachine(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.machine.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Machine not found");

  await prisma.machine.delete({ where: { id } });
  revalidatePath("/dashboard/machines");
}
