"use client";

import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { BooleanCombobox } from "@/components/domains/submit/boolean-combobox";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const YEAR_AT_HOSPITAL_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} Jahr${i + 1 > 1 ? "e" : ""}`,
}));

const TRAINING_YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}. Jahr`,
}));

export function Step2Training({ form }: { form: UseFormReturn<ReviewFormState> }) {
  const yearAtHospitalOptions = useMemo(() => YEAR_AT_HOSPITAL_OPTIONS, []);
  const trainingYearOptions = useMemo(() => TRAINING_YEAR_OPTIONS, []);

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Deine Weiterbildung</legend>

      {/* Jahr an diesem Krankenhaus */}
      <div className="space-y-2">
        <Label htmlFor="yearAtHospital">Jahr an diesem Krankenhaus</Label>
        <Controller
          control={form.control}
          name="yearAtHospital"
          render={({ field }) => (
            <Combobox
              id="yearAtHospital"
              options={yearAtHospitalOptions}
              value={field.value ? String(field.value) : undefined}
              onChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
              placeholder="Wähle ein Jahr"
              hideClearOption={false}
              clearLabel="Keine Angabe"
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          Wie lange hast du bisher schon an dem Krankenhaus gearbeitet? (inkl. angefangener Jahre)
        </p>
      </div>

      {/* Weiterbildungsjahr */}
      <div className="space-y-2">
        <Label htmlFor="yearOfTraining">Weiterbildungsjahr</Label>
        <Controller
          control={form.control}
          name="yearOfTraining"
          render={({ field }) => (
            <Combobox
              id="yearOfTraining"
              options={trainingYearOptions}
              value={field.value ? String(field.value) : undefined}
              onChange={(v) => field.onChange(v ? parseInt(v, 10) : null)}
              placeholder="Wähle ein Jahr"
              hideClearOption={false}
              clearLabel="Keine Angabe"
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          In welchem Weiterbildungsjahr befindest du dich?
        </p>
      </div>

      {/* Krankenhaus gewechselt */}
      <div className="space-y-2">
        <Label htmlFor="trainingHospitalChanged">
          Hast du während deiner Weiterbildung das Krankenhaus gewechselt?
        </Label>
        <Controller
          control={form.control}
          name="trainingHospitalChanged"
          render={({ field }) => (
            <BooleanCombobox
              id="trainingHospitalChanged"
              value={field.value}
              onChange={field.onChange}
              nullable
            />
          )}
        />
      </div>

      {/* Heimatuniversität */}
      <div className="space-y-2">
        <Label htmlFor="homeUniversity">Heimatuniversität</Label>
        <Input
          id="homeUniversity"
          type="text"
          placeholder="z. B. Ludwig-Maximilians-Universität München"
          {...form.register("homeUniversity")}
        />
        <p className="text-xs text-muted-foreground">
          Optional: An welcher Universität hast du studiert?
        </p>
      </div>
    </fieldset>
  );
}
