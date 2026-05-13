import { z } from "zod";

export const reviewRequestStatusSchema = z.enum([
  "SUBMITTED",
  "EMAIL_VERIFIED",
  "AFFILIATION_VERIFIED",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
]);

export const rotationsSchema = z.enum([
  "generalWard",
  "intermediateCare",
  "icu",
  "emergencyRoom",
  "ambulatoryCare",
  "functionaldiagnostics",
  "surgery",
  "preClinic",
  "consultations",
  "studyNurse",
  "misc",
]);

export const surgeryRolesSchema = z.enum([
  "mainSurgeon",
  "firstAssist",
  "secondAssist",
  "retractorHolder",
  "anesthesiologist",
]);

export const trainingQualitySchema = z.enum([
  "structuredOnboarding",
  "mentor",
  "seniorDoctorTeaching",
  "internalTraining",
  "externalTrainingSupported",
  "skillsLabs",
]);

export const workStructureSchema = z.enum([
  "structuredTrainingProgram",
  "specialistInRegularTime",
  "internationalRotation",
  "researchExpected",
]);

export const workAtmosphereSchema = z.enum([
  "niceColleagues",
  "goodCoffee",
  "flatHierarchies",
  "relaxedAtmosphere",
  "stressFreeWork",
  "understaffed",
  "valuedWork",
]);

const gradeSchema = z.number().int().min(1).max(6);

export const reviewSubmitSchema = z.object({
  state: z.string(),
  city: z.string(),
  hospital: z.string(),
  specialty: z.string(),
  isCustomState: z.boolean(),
  isCustomCity: z.boolean(),
  isCustomHospital: z.boolean(),
  isCustomSpecialty: z.boolean(),
  yearOfTraining: z.number().int(),
  yearAtHospital: z.number().int(),
  homeUniversity: z.string(),
  trainingHospitalChanged: z.boolean(),
  rotations: z.array(rotationsSchema),
  otherRotations: z.string(),
  surgeryRoles: z.array(surgeryRolesSchema),
  surgeryComplexProcedures: z.boolean(),
  surgeryTimePercentage: z.number().int(),
  ownDiagnosticsExecution: z.boolean(),
  diagnosticsTimePercentage: z.number().int(),
  trainingQuality: z.array(trainingQualitySchema),
  workStructure: z.array(workStructureSchema),
  averageTrainingTimeYears: z.number().int(),
  workAtmosphere: z.array(workAtmosphereSchema),
  weeklyHours: z.number().int(),
  contractualHours: z.number().int(),
  overtimeCompensationType: z.string().nullable(),
  correctOvertimeLogging: z.boolean(),
  onCallShiftsPerMonth: z.number().int(),
  gradeTheoreticalKnowledge: gradeSchema,
  gradePracticalKnowledge: gradeSchema,
  gradeAtmosphere: gradeSchema,
  gradeFacilities: gradeSchema,
  gradeWorkingConditions: gradeSchema,
  gradeFamilyFriendliness: gradeSchema,
  totalGrade: gradeSchema,
  wouldRecommendHospital: z.boolean().nullable(),
  textReviewTraining: z.string(),
  textReviewApplication: z.string(),
  publishAtDate: z.string().datetime({ offset: true }).nullable(),
  email: z.string().email(),
});

export type ReviewRequestStatus = z.infer<typeof reviewRequestStatusSchema>;
export type ReviewSubmit = z.infer<typeof reviewSubmitSchema>;
