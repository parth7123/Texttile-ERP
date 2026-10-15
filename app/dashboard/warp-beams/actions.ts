"use server";

import { prisma } from "@/lib/prisma";
import { warpBeamSchema } from "@/lib/validations/production";
import { revalidatePath } from "next/cache";

export async function getWarpBeams() {
  return prisma.warpBeam.findMany({ include: { yarnLot: { include: { yarn: true } }, loom: true }, orderBy: { createdAt: "desc" } });
}

export async function createWarpBeam(formData: FormData) {
  const data = warpBeamSchema.parse({
    beamNumber: formData.get("beamNumber"),
    yarnLotId: formData.get("yarnLotId"),
    totalEnds: formData.get("totalEnds"),
    lengthMeters: formData.get("lengthMeters"),
    loomId: formData.get("loomId"),
  });

  await prisma.warpBeam.create({
    data: {
      beamNumber: data.beamNumber,
      yarnLotId: data.yarnLotId,
      totalEnds: data.totalEnds,
      lengthMeters: data.lengthMeters,
      loomId: data.loomId || null,
      status: "READY",
    },
  });

  revalidatePath("/dashboard/warp-beams");
}