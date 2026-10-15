import { z } from "zod";

export const bomOutputTypes = ["YARN", "FABRIC"] as const;

export const bomSchema = z.object({
  name: z.string().min(1).max(255),
  outputType: z.enum(bomOutputTypes),
  yarnOutputId: z.string().optional().or(z.literal("")),
  fabricOutputId: z.string().optional().or(z.literal("")),
});
export type BOMInput = z.infer<typeof bomSchema>;

export const bomItemSchema = z.object({
  fiberId: z.string().optional().or(z.literal("")),
  inputYarnId: z.string().optional().or(z.literal("")),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1).max(20),
  wastagePct: z.coerce.number().min(0).max(100).default(0),
});
export type BOMItemInput = z.infer<typeof bomItemSchema>;

export const costSheetItemSchema = z.object({
  description: z.string().min(1).max(255),
  quantity: z.coerce.number().positive(),
  rate: z.coerce.number().min(0),
});
export type CostSheetItemInput = z.infer<typeof costSheetItemSchema>;