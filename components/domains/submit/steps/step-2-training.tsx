"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step2Training({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Deine Weiterbildung</legend>

      <div className="space-y-2">
        <Label htmlFor="yearOfTraining">In welchem Weiterbildungsjahr befindest du dich?</Label>
        <Controller
          control={form.control}
          name="yearOfTraining"
          render={({ field }) => (
            <Input
              id="yearOfTraining"
              type="number"
              min={1}
              max={8}
              placeholder="z. B. 3"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearAtHospital">Wie lange bist du schon an diesem Krankenhaus? (Jahre)</Label>
        <Controller
          control={form.control}
          name="yearAtHospital"
          render={({ field }) => (
            <Input
              id="yearAtHospital"
              type="number"
              min={0}
              placeholder="z. B. 2"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeUniversity">Heimatuniversität</Label>
        <Input
          id="homeUniversity"
          type="text"
          placeholder="z. B. LMU München"
          {...form.register("homeUniversity")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainingHospitalChanged">
          Hast du während deiner Weiterbildung das Krankenhaus gewechselt?
        </Label>
        <Controller
          control={form.control}
          name="trainingHospitalChanged"
          render={({ field }) => (
            <Select
              id="trainingHospitalChanged"
              value={field.value === null ? "" : String(field.value)}
              onChange={(e) => {
                if (e.target.value === "") field.onChange(null);
                else field.onChange(e.target.value === "true");
              }}
            >
              <option value="">Keine Angabe</option>
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </Select>
          )}
        />
      </div>
    </fieldset>
  );
}
