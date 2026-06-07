"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillMultiSelect } from "@/components/domains/submit/pill-multi-select";
import { ROTATION_OPTIONS } from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step3Rotations({ form }: { form: UseFormReturn<ReviewFormState> }) {
  const rotationsValue = form.watch("rotations");
  const showOtherRotations = rotationsValue.includes("misc");

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Einsatzbereiche</legend>

      <div className="space-y-2">
        <Label>Einsatzbereiche</Label>
        <Controller
          control={form.control}
          name="rotations"
          render={({ field }) => (
            <PillMultiSelect
              options={ROTATION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {showOtherRotations && (
        <div className="space-y-2">
          <Label htmlFor="otherRotations">Weitere Einsatzbereiche</Label>
          <Input
            id="otherRotations"
            type="text"
            placeholder="Weitere Einsatzbereiche..."
            {...form.register("otherRotations")}
          />
        </div>
      )}

      {/* T19B: surgery/diagnostics conditional sections */}
    </fieldset>
  );
}
