"use client";

import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { PillMultiSelect } from "@/components/domains/submit/pill-multi-select";
import {
  TRAINING_QUALITY_OPTIONS,
  WORK_STRUCTURE_OPTIONS,
  WORK_ATMOSPHERE_OPTIONS,
} from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const AVG_TRAINING_YEARS_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} Jahr${i + 1 > 1 ? "e" : ""}`,
}));

export function Step4Quality({ form }: { form: UseFormReturn<ReviewFormState> }) {
  const avgTrainingYearsOptions = useMemo(() => AVG_TRAINING_YEARS_OPTIONS, []);

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Weiterbildungsqualität</legend>

      <div className="space-y-2">
        <Label>Weiterbildungsqualität</Label>
        <Controller
          control={form.control}
          name="trainingQuality"
          render={({ field }) => (
            <PillMultiSelect
              options={TRAINING_QUALITY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Arbeitsstruktur</Label>
        <Controller
          control={form.control}
          name="workStructure"
          render={({ field }) => (
            <PillMultiSelect
              options={WORK_STRUCTURE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="averageTrainingTimeYears">
          Durchschnittliche Weiterbildungsdauer in Jahren
        </Label>
        <Controller
          control={form.control}
          name="averageTrainingTimeYears"
          render={({ field }) => (
            <Combobox
              id="averageTrainingTimeYears"
              options={avgTrainingYearsOptions}
              value={field.value ? String(field.value) : undefined}
              onChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
              placeholder="Wähle ein Jahr"
              hideClearOption={false}
              clearLabel="Keine Angabe"
              triggerClassName="bg-background"
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Arbeitsatmosphäre</Label>
        <Controller
          control={form.control}
          name="workAtmosphere"
          render={({ field }) => (
            <PillMultiSelect
              options={WORK_ATMOSPHERE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </fieldset>
  );
}
