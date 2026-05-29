import { reviewFormSchema, type ReviewFormState } from "./schema";

type SchemaShape = typeof reviewFormSchema.shape;
type FormSchemaKey = keyof SchemaShape;
type PickMask = { [K in FormSchemaKey]?: true };

export interface StepConfig {
  number: number;
  label: string;
  /** Top-level reviewFormSchema keys that must pass safeParse for the step to be complete. */
  requiredFields: ReadonlyArray<FormSchemaKey>;
}

export const FORM_STEPS: readonly StepConfig[] = [
  {
    number: 1,
    label: "Dein Krankenhaus",
    requiredFields: ["state", "city", "hospital", "specialty"],
  },
  {
    number: 2,
    label: "Deine Weiterbildung",
    requiredFields: [],
  },
  {
    number: 3,
    label: "Einsatzbereiche",
    requiredFields: [],
  },
  {
    number: 4,
    label: "Weiterbildungsqualität",
    requiredFields: [],
  },
  {
    number: 5,
    label: "Arbeitsbedingungen",
    requiredFields: [],
  },
  {
    number: 6,
    label: "Noten",
    requiredFields: [
      "gradeTheoreticalKnowledge",
      "gradePracticalKnowledge",
      "gradeAtmosphere",
      "gradeFacilities",
      "gradeWorkingConditions",
      "gradeFamilyFriendliness",
      "totalGrade",
    ],
  },
  {
    number: 7,
    label: "Freiwilliges",
    requiredFields: ["email", "acceptedTerms"],
  },
] as const;

export const TOTAL_STEPS = FORM_STEPS.length;

/**
 * Returns true when all of a step's required fields pass the reviewFormSchema sub-schema.
 * Completeness is determined by safeParse, not by ad-hoc type checks — so the schema
 * rules (z.literal(true) for acceptedTerms, non-nullable grades, z.string().email(), etc.)
 * are the single source of truth.
 */
export function isStepComplete(stepNumber: number, data: ReviewFormState): boolean {
  const step = FORM_STEPS.find((s) => s.number === stepNumber);
  if (!step) return false;
  if (step.requiredFields.length === 0) return true;

  const mask = step.requiredFields.reduce<PickMask>(
    (acc, k) => ({ ...acc, [k]: true }),
    {},
  );

  return reviewFormSchema.pick(mask).safeParse(data).success;
}
