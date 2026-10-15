"use server";

import { prisma } from "@/lib/prisma";

import { inspectionSchema, defectSchema } from "@/lib/validations/quality";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getInspections() {
  const organizationId = await getSessionOrgId();
  return prisma.qualityInspection.findMany({
    where: { fabricRoll: { fabric: { organizationId } } },
    include: { fabricRoll: { include: { fabric: true } }, defects: true },
    orderBy: { inspectedAt: "desc" },
  });
}

export async function getInspectionFormOptions(organizationId: string) {
  return prisma.fabricRoll.findMany({ where: { fabric: { organizationId } }, include: { fabric: true }, orderBy: { producedAt: "desc" }, take: 100 });
}

export async function createInspection(formData: FormData) {
  const data = inspectionSchema.parse({
    fabricRollId: formData.get("fabricRollId"),
    inspectionType: formData.get("inspectionType"),
    pointsScore: formData.get("pointsScore"),
    grade: formData.get("grade"),
    remarks: formData.get("remarks"),
  });

  const inspection = await prisma.qualityInspection.create({
    data: {
      fabricRollId: data.fabricRollId,
      inspectionType: data.inspectionType,
      pointsScore: data.pointsScore ?? null,
      grade: data.grade,
      remarks: data.remarks || null,
    },
  });

  await prisma.fabricRoll.update({ where: { id: data.fabricRollId }, data: { qualityGrade: data.grade } });

  redirect(`/dashboard/quality/${inspection.id}`);
}

export async function getInspectionById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.qualityInspection.findFirst({
    where: { id, fabricRoll: { fabric: { organizationId } } },
    include: { fabricRoll: { include: { fabric: true } }, defects: true },
  });
}

export async function addDefect(inspectionId: string, formData: FormData) {
  const data = defectSchema.parse({
    defectCode: formData.get("defectCode"),
    points: formData.get("points"),
    positionMeter: formData.get("positionMeter"),
  });

  await prisma.qualityDefect.create({
    data: { inspectionId, defectCode: data.defectCode, points: data.points, positionMeter: data.positionMeter ?? null },
  });

  revalidatePath(`/dashboard/quality/${inspectionId}`);
}
