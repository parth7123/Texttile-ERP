import { z } from "zod";

export const fiberSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  fiberType: z.string().min(1, "Fiber type is required").max(100),
  grade: z.string().max(50).optional().or(z.literal("")),
  origin: z.string().max(100).optional().or(z.literal("")),
  micronaire: z.coerce.number().optional().nullable(),
  staple: z.coerce.number().optional().nullable(),
  unit: z.string().min(1).max(20).default("KG"),
  reorderLevel: z.coerce.number().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});
export type FiberInput = z.infer<typeof fiberSchema>;

export const fiberLotSchema = z.object({
  fiberId: z.string().min(1),
  lotNumber: z.string().min(1).max(100),
  supplierId: z.string().optional().or(z.literal("")),
  warehouseId: z.string().min(1, "Warehouse is required"),
  quantityIn: z.coerce.number().positive("Quantity must be greater than 0"),
  bags: z.coerce.number().int().optional().nullable(),
  qualityNotes: z.string().optional().or(z.literal("")),
  receivedAt: z.coerce.date().optional(),
});
export type FiberLotInput = z.infer<typeof fiberLotSchema>;