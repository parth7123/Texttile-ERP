"use server";

import { prisma } from "@/lib/prisma";

import { downtimeSchema, type DowntimeInput } from "@/lib/validations/machine";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getLoomDowntime(loomId: string) {
  const organizationId = await getSessionOrgId();
  const loom = await prisma.loom.findFirst({ where: { id: loomId, organizationId } });
  if (!loom) throw new Error("Loom not found");

  return prisma.machineDowntime.findMany({ where: { loomId }, orderBy: { startTime: "desc" } });
}

export async function logLoomDowntime(loomId: string, input: DowntimeInput) {
  const organizationId = await getSessionOrgId();
  const loom = await prisma.loom.findFirst({ where: { id: loomId, organizationId } });
  if (!loom) throw new Error("Loom not found");

  const data = downtimeSchema.parse(input);
  const durationMin =
    data.endTime ? Math.round((data.endTime.getTime() - data.startTime.getTime()) / 60000) : null;

  await prisma.machineDowntime.create({
    data: {
      loomId,
      reasonCode: data.reasonCode,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      durationMin,
      remarks: data.remarks || null,
    },
  });

  await prisma.loom.update({
    where: { id: loomId },
    data: { status: data.endTime ? "RUNNING" : "BREAKDOWN" },
  });

  revalidatePath(`/dashboard/looms/${loomId}/downtime`);
}

export async function resolveLoomDowntime(loomId: string, downtimeId: string) {
  const record = await prisma.machineDowntime.findUnique({ where: { id: downtimeId } });
  if (!record) throw new Error("Downtime record not found");

  const endTime = new Date();
  const durationMin = Math.round((endTime.getTime() - record.startTime.getTime()) / 60000);

  await prisma.machineDowntime.update({ where: { id: downtimeId }, data: { endTime, durationMin } });
  await prisma.loom.update({ where: { id: loomId }, data: { status: "RUNNING" } });

  revalidatePath(`/dashboard/looms/${loomId}/downtime`);
}