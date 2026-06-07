"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

type GradeField =
  | "gradeTheoreticalKnowledge"
  | "gradePracticalKnowledge"
  | "gradeAtmosphere"
  | "gradeFacilities"
  | "gradeWorkingConditions"
  | "gradeFamilyFriendliness"
  | "totalGrade";

const GRADE_FIELDS: { name: GradeField; label: string }[] = [
  { name: "gradeTheoreticalKnowledge", label: "Theoretische Ausbildung" },
  { name: "gradePracticalKnowledge", label: "Praktische Ausbildung" },
  { name: "gradeAtmosphere", label: "Arbeitsatmosphäre" },
  { name: "gradeFacilities", label: "Ausstattung" },
  { name: "gradeWorkingConditions", label: "Arbeitsbedingungen" },
  { name: "gradeFamilyFriendliness", label: "Familienfreundlichkeit" },
  { name: "totalGrade", label: "Gesamtnote" },
];

export function Step6Grades({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Noten</legend>

      {GRADE_FIELDS.map(({ name, label }) => (
        <div key={name} className="space-y-2">
          <Label>{label}</Label>
          <Controller
            control={form.control}
            name={name}
            render={({ field }) => (
              <Select
                aria-label={label}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10));
                }}
              >
                <option value="">Note wählen</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={String(g)}>
                    {g}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      ))}
    </fieldset>
  );
}
