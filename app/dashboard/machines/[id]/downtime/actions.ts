"use server";

import { prisma } from "@/lib/prisma";

import { downtimeSchema, type DowntimeInput } from "@/lib/validations/machine";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getMachineDowntime(machineId: string) {
  const organizationId = await getSessionOrgId();
  const machine = await prisma.machine.findFirst({ where: { id: machineId, organizationId } });
  if (!machine) throw new Error("Machine not found");

  return prisma.machineDowntime.findMany({ where: { machineId }, orderBy: { startTime: "desc" } });
}

export async function logMachineDowntime(machineId: string, input: DowntimeInput) {
  const organizationId = await getSessionOrgId();
  const machine = await prisma.machine.findFirst({ where: { id: machineId, organizationId } });
  if (!machine) throw new Error("Machine not found");

  const data = downtimeSchema.parse(input);
  const durationMin =
    data.endTime ? Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000) : null;

  await prisma.machineDowntime.create({
    data: {
      machineId,
      reasonCode: data.reasonCode,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      durationMin,
      remarks: data.remarks || null,
    },
  });

  if (data.endTime) {
    await prisma.machine.update({ where: { id: machineId }, data: { status: "RUNNING" } });
  } else {
    await prisma.machine.update({ where: { id: machineId }, data: { status: "BREAKDOWN" } });
  }

  revalidatePath(`/dashboard/machines/${machineId}/downtime`);
}

export async function resolveDowntime(machineId: string, downtimeId: string) {
  const record = await prisma.machineDowntime.findUnique({ where: { id: downtimeId } });
  if (!record) throw new Error("Downtime record not found");

  const endTime = new Date();
  const durationMin = Math.round((endTime.getTime() - record.startTime.getTime()) / 60000);

  await prisma.machineDowntime.update({ where: { id: downtimeId }, data: { endTime, durationMin } });
  await prisma.machine.update({ where: { id: machineId }, data: { status: "RUNNING" } });

  revalidatePath(`/dashboard/machines/${machineId}/downtime`);
}