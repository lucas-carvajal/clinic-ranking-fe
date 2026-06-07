"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { defaultFormState, type ReviewFormState } from "@/lib/domains/submit/schema";
import {
  loadCurrentStep,
  loadDraft,
  saveCurrentStep,
  saveDraft,
} from "@/lib/domains/submit/persistence";
import { FORM_STEPS, TOTAL_STEPS, isStepComplete } from "@/lib/domains/submit/steps";
import { reviewFormSchema } from "@/lib/domains/submit/schema";
import { useSubmitReview } from "@/lib/domains/submit/use-submit-review";
import { SubmitMobileHeader } from "./submit-mobile-header";
import { SubmitSidebar } from "./submit-sidebar";

const SAVE_DEBOUNCE_MS = 300;

export function SubmitForm() {
  const form = useForm<ReviewFormState>({
    defaultValues: defaultFormState(),
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [visitedSteps, setVisitedSteps] = useState<ReadonlySet<number>>(new Set([1]));
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitMutation = useSubmitReview();

  // Load draft and current step on mount
  useEffect(() => {
    const draft = loadDraft();
    const savedStep = loadCurrentStep();
    if (draft) {
      form.reset(draft);
    }
    if (savedStep !== null && savedStep >= 1 && savedStep <= TOTAL_STEPS) {
      setCurrentStep(savedStep);
      setVisitedSteps((prev) => {
        const next = new Set(prev);
        for (let i = 1; i <= savedStep; i++) next.add(i);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave on form value changes
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveDraft(values as ReviewFormState);
      }, SAVE_DEBOUNCE_MS);
    });
    return () => {
      subscription.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form]);

  function goToStep(n: number) {
    setCurrentStep(n);
    saveCurrentStep(n);
    setVisitedSteps((prev) => {
      const next = new Set(prev);
      next.add(n);
      return next;
    });
  }

  function handlePrev() {
    if (currentStep > 1) goToStep(currentStep - 1);
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  }

  function handleSubmitAttempt() {
    const values = form.getValues();
    const result = reviewFormSchema.safeParse(values);
    if (!result.success) {
      const firstInvalid = FORM_STEPS.find((s) => !isStepComplete(s.number, values));
      if (firstInvalid) goToStep(firstInvalid.number);
      setSubmitError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    setSubmitError(null);
    submitMutation.mutate(values);
  }

  const stepConfig = FORM_STEPS[currentStep - 1];
  const StepComponent = stepConfig?.Component;

  const formValues = form.getValues();

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Desktop sidebar */}
      <SubmitSidebar
        currentStep={currentStep}
        visitedSteps={visitedSteps}
        formValues={formValues}
        onStepSelect={goToStep}
      />

      {/* Main area */}
      <main className="flex flex-1 flex-col overflow-hidden min-h-0">
        {/* Mobile header */}
        <SubmitMobileHeader currentStep={currentStep} />

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              {stepConfig?.label}
            </h2>

            {StepComponent && <StepComponent form={form} />}
          </div>
        </div>

        {/* Footer navigation bar */}
        <div className="shrink-0 border-t bg-background px-6 py-4">
          <div className="mx-auto max-w-xl">
            {submitError && (
              <p
                role="alert"
                aria-live="assertive"
                className="mb-3 text-sm text-destructive text-center"
              >
                {submitError}
              </p>
            )}

            {submitMutation.isError && (
              <p role="alert" className="text-sm text-destructive mt-1 text-center mb-3">
                Fehler beim Absenden. Deine Eingaben wurden gespeichert – bitte versuche es erneut.
              </p>
            )}

            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                Zurück
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentStep} / {TOTAL_STEPS}
              </span>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Weiter
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitMutation.isPending}
                  onClick={handleSubmitAttempt}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Wird abgeschickt…
                    </>
                  ) : (
                    "Abschicken"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
