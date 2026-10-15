"use server";

import { prisma } from "@/lib/prisma";

import { bomSchema, bomItemSchema, costSheetItemSchema } from "@/lib/validations/bom";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrgId } from "@/lib/session";

export async function getBOMs() {
  const organizationId = await getSessionOrgId();
  return prisma.bOM.findMany({
    where: { organizationId },
    include: { yarnOutput: true, fabricOutput: true, _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBOMFormOptions(organizationId: string) {
  const [yarns, fabrics, fibers] = await Promise.all([
    prisma.yarnMaster.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } }),
    prisma.fabricConstruction.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
    prisma.fiber.findMany({ where: { organizationId }, orderBy: { name: "asc" } }),
  ]);
  return { yarns, fabrics, fibers };
}

export async function createBOM(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const data = bomSchema.parse({
    name: formData.get("name"),
    outputType: formData.get("outputType"),
    yarnOutputId: formData.get("yarnOutputId"),
    fabricOutputId: formData.get("fabricOutputId"),
  });

  // find current max version for this output to auto-increment
  const version = 1;

  const bom = await prisma.bOM.create({
    data: {
      organizationId,
      name: data.name,
      outputType: data.outputType,
      yarnOutputId: data.outputType === "YARN" ? data.yarnOutputId || null : null,
      fabricOutputId: data.outputType === "FABRIC" ? data.fabricOutputId || null : null,
      version,
    },
  });

  redirect(`/dashboard/boms/${bom.id}`);
}

export async function getBOMById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.bOM.findFirst({
    where: { id, organizationId },
    include: {
      yarnOutput: true,
      fabricOutput: true,
      items: { include: { fiber: true } },
      costSheets: { include: { items: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function addBOMItem(bomId: string, formData: FormData) {
  const data = bomItemSchema.parse({
    fiberId: formData.get("fiberId"),
    inputYarnId: formData.get("inputYarnId"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    wastagePct: formData.get("wastagePct"),
  });

  await prisma.bOMItem.create({
    data: {
      bomId,
      fiberId: data.fiberId || null,
      inputYarnId: data.inputYarnId || null,
      quantity: data.quantity,
      unit: data.unit,
      wastagePct: data.wastagePct,
    },
  });

  revalidatePath(`/dashboard/boms/${bomId}`);
}

export async function deleteBOMItem(bomId: string, itemId: string) {
  await prisma.bOMItem.delete({ where: { id: itemId } });
  revalidatePath(`/dashboard/boms/${bomId}`);
}

export async function toggleBOMActive(bomId: string, isActive: boolean) {
  await prisma.bOM.update({ where: { id: bomId }, data: { isActive: !isActive } });
  revalidatePath(`/dashboard/boms/${bomId}`);
}

// Cost sheets are generated against a completed production order (Spinning or Weaving)
export async function createCostSheet(
  bomId: string,
  referenceType: "SPINNING_ORDER" | "WEAVING_ORDER",
  referenceId: string,
  outputQty: number,
  laborCost: number,
  overheadCost: number
) {
  const bom = await prisma.bOM.findUnique({ where: { id: bomId }, include: { items: { include: { fiber: true } } } });
  if (!bom) throw new Error("BOM not found");

  let materialCost = 0;
  let wastageCost = 0;
  for (const item of bom.items) {
    const rate = item.fiber ? 0 : 0; // fiber cost rate would come from latest PO item; simplified to 0 baseline
    const qty = item.quantity * outputQty;
    const wasteQty = qty * (item.wastagePct / 100);
    materialCost += qty * rate;
    wastageCost += wasteQty * rate;
  }

  const totalCost = materialCost + laborCost + overheadCost + wastageCost;
  const costPerUnit = outputQty > 0 ? totalCost / outputQty : 0;

  const costSheet = await prisma.costSheet.create({
    data: {
      bomId,
      referenceType,
      referenceId,
      materialCost,
      laborCost,
      overheadCost,
      wastageCost,
      totalCost,
      costPerUnit,
      outputQty,
    },
  });

  revalidatePath(`/dashboard/boms/${bomId}`);
  return costSheet;
}

export async function addCostSheetItem(costSheetId: string, bomId: string, formData: FormData) {
  const data = costSheetItemSchema.parse({
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    rate: formData.get("rate"),
  });

  await prisma.costSheetItem.create({
    data: { costSheetId, description: data.description, quantity: data.quantity, rate: data.rate, amount: data.quantity * data.rate },
  });

  // recalc total on the sheet
  const items = await prisma.costSheetItem.findMany({ where: { costSheetId } });
  const extra = items.reduce((sum, i) => sum + i.amount, 0);
  const sheet = await prisma.costSheet.findUnique({ where: { id: costSheetId } });
  if (sheet) {
    const totalCost = sheet.materialCost + sheet.laborCost + sheet.overheadCost + sheet.wastageCost + extra;
    await prisma.costSheet.update({
      where: { id: costSheetId },
      data: { totalCost, costPerUnit: sheet.outputQty > 0 ? totalCost / sheet.outputQty : 0 },
    });
  }

  revalidatePath(`/dashboard/boms/${bomId}`);
}
