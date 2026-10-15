import { z } from "zod";

export const yarnCountSystems = ["NE", "NM", "DENIER", "TEX"] as const;

export const yarnSchema = z.object({
  countValue: z.coerce.number().positive("Count value is required"),
  countSystem: z.enum(yarnCountSystems).default("NE"),
  ply: z.coerce.number().int().min(1).default(1),
  blendRatio: z.string().max(100).optional().or(z.literal("")),
  yarnType: z.string().max(100).optional().or(z.literal("")),
  unit: z.string().min(1).max(20).default("KG"),
  standardCostPerKg: z.coerce.number().min(0).optional().nullable(),
  isActive: z.coerce.boolean().default(true),
});
export type YarnInput = z.infer<typeof yarnSchema>;

export const yarnLotSchema = z.object({
  yarnId: z.string().min(1),
  lotNumber: z.string().min(1).max(100),
  warehouseId: z.string().min(1, "Warehouse is required"),
  quantityIn: z.coerce.number().positive("Quantity must be greater than 0"),
  qualityGrade: z.string().max(20).optional().or(z.literal("")),
  producedAt: z.coerce.date().optional(),
});
export type YarnLotInput = z.infer<typeof yarnLotSchema>;