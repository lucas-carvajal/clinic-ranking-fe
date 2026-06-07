import type { ComponentType } from "react";
import type { UseFormReturn } from "react-hook-form";

import { reviewFormSchema, type ReviewFormState } from "./schema";
import { Step1Hospital } from "@/components/domains/submit/steps/step-1-hospital";
import { Step2Training } from "@/components/domains/submit/steps/step-2-training";
import { Step3Rotations } from "@/components/domains/submit/steps/step-3-rotations";
import { Step4Quality } from "@/components/domains/submit/steps/step-4-quality";
import { Step5Conditions } from "@/components/domains/submit/steps/step-5-conditions";
import { Step6Grades } from "@/components/domains/submit/steps/step-6-grades";
import { Step7Optional } from "@/components/domains/submit/steps/step-7-optional";

type SchemaShape = typeof reviewFormSchema.shape;
type FormSchemaKey = keyof SchemaShape;
type PickMask = { [K in FormSchemaKey]?: true };

export interface StepConfig {
  number: number;
  label: string;
  /** Top-level reviewFormSchema keys that must pass safeParse for the step to be complete. */
  requiredFields: ReadonlyArray<FormSchemaKey>;
  Component: ComponentType<{ form: UseFormReturn<ReviewFormState> }>;
}

export const FORM_STEPS: readonly StepConfig[] = [
  {
    number: 1,
    label: "Dein Krankenhaus",
    requiredFields: ["state", "city", "hospital", "specialty"],
    Component: Step1Hospital,
  },
  {
    number: 2,
    label: "Deine Weiterbildung",
    requiredFields: [],
    Component: Step2Training,
  },
  {
    number: 3,
    label: "Einsatzbereiche",
    requiredFields: [],
    Component: Step3Rotations,
  },
  {
    number: 4,
    label: "Weiterbildungsqualität",
    requiredFields: [],
    Component: Step4Quality,
  },
  {
    number: 5,
    label: "Arbeitsbedingungen",
    requiredFields: [],
    Component: Step5Conditions,
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
    Component: Step6Grades,
  },
  {
    number: 7,
    label: "Freiwilliges",
    requiredFields: ["email", "acceptedTerms"],
    Component: Step7Optional,
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
