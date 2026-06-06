"use client";

import { FORM_STEPS, TOTAL_STEPS } from "@/lib/domains/submit/steps";

type Props = {
  currentStep: number;
};

export function SubmitMobileHeader({ currentStep }: Props) {
  const step = FORM_STEPS.find((s) => s.number === currentStep);
  const label = step?.label ?? "";
  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="shrink-0 border-b bg-[#fff8ed] px-4 py-3 lg:hidden">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#0a0a0a]">{label}</span>
        <span className="text-[#0a0a0a]/60">
          {currentStep} / {TOTAL_STEPS}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label={`Schritt ${currentStep} von ${TOTAL_STEPS}: ${label}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-[#0a0a0a]/10"
      >
        <div
          className="h-full rounded-full bg-[#39f5a6] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
