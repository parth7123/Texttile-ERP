import { z } from "zod";

export const inspectionTypes = ["GREY_FABRIC_4POINT", "YARN_LAB_TEST", "FINAL_INSPECTION"] as const;
export const fabricGrades = ["A", "B", "C", "REJECT"] as const;

export const inspectionSchema = z.object({
  fabricRollId: z.string().min(1),
  inspectionType: z.enum(inspectionTypes),
  pointsScore: z.coerce.number().optional().nullable(),
  grade: z.enum(fabricGrades).default("A"),
  remarks: z.string().optional().or(z.literal("")),
});
export type InspectionInput = z.infer<typeof inspectionSchema>;

export const defectSchema = z.object({
  defectCode: z.string().min(1).max(100),
  points: z.coerce.number().min(0).default(0),
  positionMeter: z.coerce.number().optional().nullable(),
});
export type DefectInput = z.infer<typeof defectSchema>;