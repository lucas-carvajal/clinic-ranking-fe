import { z } from "zod";
import {
  rotationsSchema,
  surgeryRolesSchema,
  trainingQualitySchema,
  workStructureSchema,
  workAtmosphereSchema,
} from "@/lib/contracts/submit.schema";

const gradeSchema = z.number().int().min(1).max(6);

export const reviewFormSchema = z.object({
  // Step 1: Hospital Selection
  state: z.string().min(1),
  city: z.string().min(1),
  hospital: z.string().min(1),
  specialty: z.string().min(1),
  isCustomState: z.boolean(),
  isCustomCity: z.boolean(),
  isCustomHospital: z.boolean(),
  isCustomSpecialty: z.boolean(),

  // Step 2: Training Info
  yearOfTraining: z.number().int().nullable(),
  yearAtHospital: z.number().int().nullable(),
  homeUniversity: z.string(),
  // null = not yet answered; false/true = real answer — z.boolean() so null fails required-pick
  trainingHospitalChanged: z.boolean().nullable(),

  // Step 3: Rotations and Skills
  rotations: z.array(rotationsSchema),
  otherRotations: z.string(),
  surgery: z.object({
    surgeryRoles: z.array(surgeryRolesSchema),
    // false is a valid answer, not "empty" — z.boolean() (not literal)
    surgeryComplexProcedures: z.boolean(),
    surgeryTimePercentage: z.number().int().min(0).max(100).nullable(),
  }),
  diagnostics: z.object({
    ownExecution: z.boolean(),
    diagnosticsTimePercentage: z.number().int().min(0).max(100).nullable(),
  }),

  // Step 4: Training Quality
  trainingQuality: z.array(trainingQualitySchema),
  workStructure: z.array(workStructureSchema),
  averageTrainingTimeYears: z.number().int().nullable(),
  workAtmosphere: z.array(workAtmosphereSchema),

  // Step 5: Working Conditions
  weeklyHours: z.number().int().nullable(),
  contractualHours: z.number().int().nullable(),
  overtimeCompensationType: z.string(),
  correctOvertimeLogging: z.boolean(),
  onCallShiftsPerMonth: z.number().int().nullable(),

  // Step 6: Grades
  // Intentionally non-nullable even though ReviewFormState holds `number | null`.
  // This makes null fail the step-6 pick check (isStepComplete) so an unset grade
  // correctly marks the step incomplete. Do NOT add .nullable() here — it would
  // break step completion. The type mismatch with ReviewFormState is deliberate.
  gradeTheoreticalKnowledge: gradeSchema,
  gradePracticalKnowledge: gradeSchema,
  gradeAtmosphere: gradeSchema,
  gradeFacilities: gradeSchema,
  gradeWorkingConditions: gradeSchema,
  gradeFamilyFriendliness: gradeSchema,
  totalGrade: gradeSchema,

  // Step 7: Optional extras
  // null = not answered; any boolean is a valid answer
  wouldRecommendHospital: z.boolean().nullable(),
  textReviewTraining: z.string(),
  textReviewApplication: z.string(),
  // "YYYY-MM-DD" from <input type="date">; .date() enforces the format so an
  // invalid string never reaches the mapper's new Date() call. Never a Date object.
  publishAtDate: z.string().date().nullable(),
  email: z.string().email(),
  // Must be explicitly true; false = step incomplete
  acceptedTerms: z.literal(true),
});

/**
 * The in-progress form state held in memory and localStorage.
 * Wider than reviewFormSchema: nullable grades, boolean acceptedTerms,
 * and string | null publishAtDate (never Date).
 */
export type ReviewFormState = {
  // Step 1
  state: string;
  city: string;
  hospital: string;
  specialty: string;
  isCustomState: boolean;
  isCustomCity: boolean;
  isCustomHospital: boolean;
  isCustomSpecialty: boolean;
  // Step 2
  yearOfTraining: number | null;
  yearAtHospital: number | null;
  homeUniversity: string;
  trainingHospitalChanged: boolean | null;
  // Step 3
  rotations: string[];
  otherRotations: string;
  surgery: {
    surgeryRoles: string[];
    surgeryComplexProcedures: boolean;
    surgeryTimePercentage: number | null;
  };
  diagnostics: {
    ownExecution: boolean;
    diagnosticsTimePercentage: number | null;
  };
  // Step 4
  trainingQuality: string[];
  workStructure: string[];
  averageTrainingTimeYears: number | null;
  workAtmosphere: string[];
  // Step 5
  weeklyHours: number | null;
  contractualHours: number | null;
  overtimeCompensationType: string;
  correctOvertimeLogging: boolean;
  onCallShiftsPerMonth: number | null;
  // Step 6
  gradeTheoreticalKnowledge: number | null;
  gradePracticalKnowledge: number | null;
  gradeAtmosphere: number | null;
  gradeFacilities: number | null;
  gradeWorkingConditions: number | null;
  gradeFamilyFriendliness: number | null;
  totalGrade: number | null;
  // Step 7
  wouldRecommendHospital: boolean | null;
  textReviewTraining: string;
  textReviewApplication: string;
  publishAtDate: string | null;
  email: string;
  acceptedTerms: boolean;
};

/**
 * Looser schema used only for persistence validation.
 * Overrides the strict fields in reviewFormSchema (non-nullable grades,
 * min(1) strings, z.literal(true) acceptedTerms, z.string().email()) to match
 * the nullable/in-progress reality of ReviewFormState, then makes everything
 * partial so older drafts with missing fields still load.
 */
export const storedDraftSchema = reviewFormSchema
  .extend({
    state: z.string(),
    city: z.string(),
    hospital: z.string(),
    specialty: z.string(),
    email: z.string(),
    acceptedTerms: z.boolean(),
    gradeTheoreticalKnowledge: z.number().int().min(1).max(6).nullable(),
    gradePracticalKnowledge: z.number().int().min(1).max(6).nullable(),
    gradeAtmosphere: z.number().int().min(1).max(6).nullable(),
    gradeFacilities: z.number().int().min(1).max(6).nullable(),
    gradeWorkingConditions: z.number().int().min(1).max(6).nullable(),
    gradeFamilyFriendliness: z.number().int().min(1).max(6).nullable(),
    totalGrade: z.number().int().min(1).max(6).nullable(),
  })
  .partial();

export function defaultFormState(): ReviewFormState {
  return {
    state: "",
    city: "",
    hospital: "",
    specialty: "",
    isCustomState: false,
    isCustomCity: false,
    isCustomHospital: false,
    isCustomSpecialty: false,
    yearOfTraining: null,
    yearAtHospital: null,
    homeUniversity: "",
    trainingHospitalChanged: null,
    rotations: [],
    otherRotations: "",
    surgery: {
      surgeryRoles: [],
      surgeryComplexProcedures: false,
      surgeryTimePercentage: null,
    },
    diagnostics: {
      ownExecution: false,
      diagnosticsTimePercentage: null,
    },
    trainingQuality: [],
    workStructure: [],
    averageTrainingTimeYears: null,
    workAtmosphere: [],
    weeklyHours: null,
    contractualHours: null,
    overtimeCompensationType: "",
    correctOvertimeLogging: false,
    onCallShiftsPerMonth: null,
    gradeTheoreticalKnowledge: null,
    gradePracticalKnowledge: null,
    gradeAtmosphere: null,
    gradeFacilities: null,
    gradeWorkingConditions: null,
    gradeFamilyFriendliness: null,
    totalGrade: null,
    wouldRecommendHospital: null,
    textReviewTraining: "",
    textReviewApplication: "",
    publishAtDate: null,
    email: "",
    acceptedTerms: false,
  };
}
