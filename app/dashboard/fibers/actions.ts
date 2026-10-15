"use server";

import { prisma } from "@/lib/prisma";

import { fiberSchema, type FiberInput } from "@/lib/validations/fiber";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getFibers(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.fiber.findMany({
    where: {
      organizationId,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { fiberType: { contains: search } },
              { origin: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: { _count: { select: { lots: true } } },
  });
}

export async function getFiberById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.fiber.findFirst({ where: { id, organizationId } });
}

export async function createFiber(input: FiberInput) {
  const organizationId = await getSessionOrgId();
  const data = fiberSchema.parse(input);

  await prisma.fiber.create({
    data: {
      ...data,
      grade: data.grade || null,
      origin: data.origin || null,
      organizationId,
    },
  });

  revalidatePath("/dashboard/fibers");
  redirect("/dashboard/fibers");
}

export async function updateFiber(id: string, input: FiberInput) {
  const organizationId = await getSessionOrgId();
  const data = fiberSchema.parse(input);

  const existing = await prisma.fiber.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Fiber not found");

  await prisma.fiber.update({
    where: { id },
    data: { ...data, grade: data.grade || null, origin: data.origin || null },
  });

  revalidatePath("/dashboard/fibers");
  redirect("/dashboard/fibers");
}

export async function deleteFiber(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.fiber.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Fiber not found");

  await prisma.fiber.delete({ where: { id } });
  revalidatePath("/dashboard/fibers");
}
