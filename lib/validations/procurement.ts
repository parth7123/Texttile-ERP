import { z } from "zod";

export const poStatuses = ["DRAFT", "APPROVED", "PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"] as const;

export const poItemSchema = z.object({
  fiberId: z.string().optional().or(z.literal("")),
  yarnId: z.string().optional().or(z.literal("")),
  description: z.string().min(1).max(255),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1).max(20),
  rate: z.coerce.number().min(0),
});
export type POItemInput = z.infer<typeof poItemSchema>;

export const grnItemSchema = z.object({
  description: z.string().min(1).max(255),
  orderedQty: z.coerce.number(),
  receivedQty: z.coerce.number().min(0),
  rejectedQty: z.coerce.number().min(0).default(0),
  unit: z.string().min(1).max(20),
});
export type GRNItemInput = z.infer<typeof grnItemSchema>;