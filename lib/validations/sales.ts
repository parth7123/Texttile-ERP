import { z } from "zod";

export const soItemSchema = z.object({
  fabricId: z.string().optional().or(z.literal("")),
  yarnId: z.string().optional().or(z.literal("")),
  description: z.string().min(1).max(255),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1).max(20),
  rate: z.coerce.number().min(0),
});
export type SOItemInput = z.infer<typeof soItemSchema>;