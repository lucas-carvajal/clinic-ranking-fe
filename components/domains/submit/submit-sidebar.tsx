"use client";

import { Check, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { FORM_STEPS, TOTAL_STEPS, isStepComplete } from "@/lib/domains/submit/steps";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

type Props = {
  currentStep: number;
  visitedSteps: ReadonlySet<number>;
  formValues: ReviewFormState;
  onStepSelect: (step: number) => void;
};

export function SubmitSidebar({ currentStep, visitedSteps, formValues, onStepSelect }: Props) {
  return (
    <nav
      role="navigation"
      aria-label="Formular-Schritte"
      className="hidden lg:flex lg:w-72 flex-col border-r overflow-y-auto bg-background py-6"
    >
      <p className="px-6 pb-4 text-xs font-semibold uppercase tracking-wider text-foreground/50">
        Schritte ({TOTAL_STEPS})
      </p>

      <ol className="flex flex-col gap-1 px-3">
        {FORM_STEPS.map((step) => {
          const isActive = step.number === currentStep;
          const isComplete = isStepComplete(step.number, formValues);
          const hasBeenVisited = visitedSteps.has(step.number);

          return (
            <li key={step.number}>
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => onStepSelect(step.number)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-foreground/8",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : isComplete
                        ? "bg-success text-foreground"
                        : hasBeenVisited && !isComplete
                          ? "bg-warning text-foreground"
                          : "bg-foreground/10 text-foreground/50",
                  )}
                  aria-hidden="true"
                >
                  {isComplete && !isActive ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : hasBeenVisited && !isComplete && !isActive ? (
                    <CircleAlert className="h-4 w-4 stroke-[2]" />
                  ) : (
                    step.number
                  )}
                </span>
                <span className="flex-1 text-left">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
