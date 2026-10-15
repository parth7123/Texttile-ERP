import { z } from "zod";

export const machineTypes = ["BLOW_ROOM","CARDING","DRAWING","COMBER","SIMPLEX","RING_FRAME","AUTOCONER","OE_ROTOR","WARPING","SIZING","OTHER"] as const;
export const loomTypes = ["SHUTTLE","AIR_JET","WATER_JET","RAPIER","PROJECTILE"] as const;
export const machineStatuses = ["RUNNING","IDLE","MAINTENANCE","BREAKDOWN","RETIRED"] as const;

export const machineSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  machineType: z.enum(machineTypes),
  branchId: z.string().optional().or(z.literal("")),
  spindles: z.coerce.number().int().optional().nullable(),
  capacityPerShift: z.coerce.number().optional().nullable(),
  manufacturer: z.string().max(100).optional().or(z.literal("")),
  installedAt: z.coerce.date().optional().nullable(),
  status: z.enum(machineStatuses).default("RUNNING"),
});
export type MachineInput = z.infer<typeof machineSchema>;

export const loomSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  loomType: z.enum(loomTypes),
  branchId: z.string().optional().or(z.literal("")),
  width: z.coerce.number().optional().nullable(),
  manufacturer: z.string().max(100).optional().or(z.literal("")),
  installedAt: z.coerce.date().optional().nullable(),
  status: z.enum(machineStatuses).default("RUNNING"),
});
export type LoomInput = z.infer<typeof loomSchema>;

export const downtimeSchema = z.object({
  reasonCode: z.string().min(1, "Reason is required").max(100),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().or(z.literal("")),
});
export type DowntimeInput = z.infer<typeof downtimeSchema>;