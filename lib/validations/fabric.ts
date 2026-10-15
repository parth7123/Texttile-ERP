import { z } from "zod";

export const fabricSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  weaveType: z.string().min(1, "Weave type is required").max(50),
  warpYarnId: z.string().min(1, "Warp yarn is required"),
  weftYarnId: z.string().min(1, "Weft yarn is required"),
  warpCount: z.string().max(20).optional().or(z.literal("")),
  weftCount: z.string().max(20).optional().or(z.literal("")),
  epi: z.coerce.number().int().positive("EPI is required"),
  ppi: z.coerce.number().int().positive("PPI is required"),
  width: z.coerce.number().positive("Width is required"),
  gsm: z.coerce.number().optional().nullable(),
  unit: z.string().min(1).max(20).default("METER"),
  standardCostPerUnit: z.coerce.number().min(0).optional().nullable(),
  isActive: z.coerce.boolean().default(true),
});
export type FabricInput = z.infer<typeof fabricSchema>;

export const fabricGrades = ["A", "B", "C", "REJECT"] as const;

export const fabricRollSchema = z.object({
  fabricId: z.string().min(1),
  rollNumber: z.string().min(1).max(100),
  warehouseId: z.string().min(1, "Warehouse is required"),
  loomId: z.string().optional().or(z.literal("")),
  lengthMeters: z.coerce.number().positive("Length must be greater than 0"),
  weightKg: z.coerce.number().optional().nullable(),
  qualityGrade: z.enum(fabricGrades).default("A"),
});
export type FabricRollInput = z.infer<typeof fabricRollSchema>;