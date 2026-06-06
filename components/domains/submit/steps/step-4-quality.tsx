"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillMultiSelect } from "@/components/domains/submit/pill-multi-select";
import {
  TRAINING_QUALITY_OPTIONS,
  WORK_STRUCTURE_OPTIONS,
  WORK_ATMOSPHERE_OPTIONS,
} from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step4Quality({ form }: { form: UseFormReturn<ReviewFormState> }) {
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
            <Input
              id="averageTrainingTimeYears"
              type="number"
              min={1}
              max={20}
              placeholder="z. B. 5"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
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
