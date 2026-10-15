import { z } from "zod";

export const productionOrderStatuses = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"] as const;

export const spinningOrderSchema = z.object({
  orderNumber: z.string().min(1).max(100),
  yarnId: z.string().min(1),
  bomId: z.string().optional().or(z.literal("")),
  targetQtyKg: z.coerce.number().positive(),
});
export type SpinningOrderInput = z.infer<typeof spinningOrderSchema>;

export const spinningLogSchema = z.object({
  machineId: z.string().min(1),
  employeeId: z.string().optional().or(z.literal("")),
  shiftId: z.string().optional().or(z.literal("")),
  logDate: z.coerce.date(),
  outputKg: z.coerce.number().positive(),
  spindleHours: z.coerce.number().optional().nullable(),
  efficiencyPct: z.coerce.number().optional().nullable(),
  countAchieved: z.coerce.number().optional().nullable(),
  remarks: z.string().optional().or(z.literal("")),
});
export type SpinningLogInput = z.infer<typeof spinningLogSchema>;

export const wasteLogSchema = z.object({
  wasteType: z.string().min(1).max(100),
  quantityKg: z.coerce.number().positive(),
  normPct: z.coerce.number().optional().nullable(),
  actualPct: z.coerce.number().optional().nullable(),
  logDate: z.coerce.date(),
});
export type WasteLogInput = z.infer<typeof wasteLogSchema>;

export const weavingOrderSchema = z.object({
  orderNumber: z.string().min(1).max(100),
  fabricId: z.string().min(1),
  warpBeamId: z.string().optional().or(z.literal("")),
  bomId: z.string().optional().or(z.literal("")),
  targetLengthM: z.coerce.number().positive(),
});
export type WeavingOrderInput = z.infer<typeof weavingOrderSchema>;

export const weavingLogSchema = z.object({
  loomId: z.string().min(1),
  employeeId: z.string().optional().or(z.literal("")),
  shiftId: z.string().optional().or(z.literal("")),
  logDate: z.coerce.date(),
  outputMeters: z.coerce.number().positive(),
  efficiencyPct: z.coerce.number().optional().nullable(),
  pickInsertionRate: z.coerce.number().optional().nullable(),
  stops: z.coerce.number().int().optional().nullable(),
  remarks: z.string().optional().or(z.literal("")),
});
export type WeavingLogInput = z.infer<typeof weavingLogSchema>;

export const beamStatuses = ["READY", "ON_LOOM", "EXHAUSTED"] as const;

export const warpBeamSchema = z.object({
  beamNumber: z.string().min(1).max(100),
  yarnLotId: z.string().min(1),
  totalEnds: z.coerce.number().int().positive(),
  lengthMeters: z.coerce.number().positive(),
  loomId: z.string().optional().or(z.literal("")),
});
export type WarpBeamInput = z.infer<typeof warpBeamSchema>;