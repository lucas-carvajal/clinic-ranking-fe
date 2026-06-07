"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const GRADE_OPTIONS = [
  { value: "1", label: "1 – sehr gut" },
  { value: "2", label: "2 – gut" },
  { value: "3", label: "3 – befriedigend" },
  { value: "4", label: "4 – ausreichend" },
  { value: "5", label: "5 – mangelhaft" },
  { value: "6", label: "6 – ungenügend" },
];

type GradeField =
  | "gradeTheoreticalKnowledge"
  | "gradePracticalKnowledge"
  | "gradeAtmosphere"
  | "gradeFacilities"
  | "gradeWorkingConditions"
  | "gradeFamilyFriendliness"
  | "totalGrade";

const GRADE_FIELDS: { name: GradeField; label: string }[] = [
  { name: "gradeTheoreticalKnowledge", label: "Vermittlung von theoretischem Wissen" },
  { name: "gradePracticalKnowledge", label: "Vermittlung von praktischem Wissen" },
  { name: "gradeAtmosphere", label: "Arbeitsatmosphäre" },
  { name: "gradeFacilities", label: "Klinikausstattung" },
  { name: "gradeWorkingConditions", label: "Arbeitsbedingungen" },
  { name: "gradeFamilyFriendliness", label: "Familienfreundlichkeit" },
  { name: "totalGrade", label: "Gesamtnote" },
];

export function Step6Grades({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Noten</legend>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Vergebe Schulnoten von 1 (beste) bis 6 (schlechteste)
        </p>
      </div>

      {GRADE_FIELDS.map(({ name, label }) => (
        <div key={name} className="space-y-2">
          <Label>{label}</Label>
          <Controller
            control={form.control}
            name={name}
            render={({ field }) => (
              <Combobox
                ariaLabel={label}
                options={GRADE_OPTIONS}
                value={field.value ? String(field.value) : undefined}
                onChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
                placeholder="Note wählen"
                hideClearOption={false}
                clearLabel="Keine Note"
                triggerClassName="bg-background"
              />
            )}
          />
        </div>
      ))}
    </fieldset>
  );
}
