"use client";

import { useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { BooleanCombobox } from "@/components/domains/submit/boolean-combobox";
import { PillMultiSelect } from "@/components/domains/submit/pill-multi-select";
import {
  ROTATION_OPTIONS,
  SURGERY_ROLE_OPTIONS,
} from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const PERCENTAGE_OPTIONS = Array.from({ length: 21 }, (_, i) => ({
  value: String(i * 5),
  label: `${i * 5}%`,
}));

export function Step3Rotations({ form }: { form: UseFormReturn<ReviewFormState> }) {
  const percentageOptions = useMemo(() => PERCENTAGE_OPTIONS, []);
  const rotationsValue = form.watch("rotations");
  const showOtherRotations = rotationsValue.includes("misc");
  const isSurgerySelected = rotationsValue.includes("surgery");
  const isDiagnosticsSelected = rotationsValue.includes("functionaldiagnostics");

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

      {isSurgerySelected && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">OP-Details</p>

          {/* surgery.surgeryRoles — pill multi-select */}
          <div className="space-y-2">
            <Label>OP-Rollen</Label>
            <Controller
              control={form.control}
              name="surgery.surgeryRoles"
              render={({ field }) => (
                <PillMultiSelect
                  options={SURGERY_ROLE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* surgery.surgeryComplexProcedures — boolean */}
          <div className="space-y-2">
            <Label htmlFor="surgeryComplexProcedures">Komplexe Eingriffe durchgeführt?</Label>
            <Controller
              control={form.control}
              name="surgery.surgeryComplexProcedures"
              render={({ field }) => (
                <BooleanCombobox
                  id="surgeryComplexProcedures"
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? false)}
                  nullable={false}
                />
              )}
            />
          </div>

          {/* surgery.surgeryTimePercentage — 0..100 in steps of 5 */}
          <div className="space-y-2">
            <Label htmlFor="surgeryTimePercentage">Anteil OP-Zeit</Label>
            <Controller
              control={form.control}
              name="surgery.surgeryTimePercentage"
              render={({ field }) => (
                <Combobox
                  id="surgeryTimePercentage"
                  options={percentageOptions}
                  value={field.value === null ? undefined : String(field.value)}
                  onChange={(v) => field.onChange(v === undefined ? null : Number(v))}
                  placeholder="Keine Angabe"
                  hideClearOption={false}
                  clearLabel="Keine Angabe"
                  triggerClassName="bg-background"
                />
              )}
            />
          </div>
        </div>
      )}

      {isDiagnosticsSelected && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Funktionsdiagnostik-Details</p>

          {/* diagnostics.ownExecution — boolean */}
          <div className="space-y-2">
            <Label htmlFor="diagnosticsOwnExecution">Eigenständige Durchführung?</Label>
            <Controller
              control={form.control}
              name="diagnostics.ownExecution"
              render={({ field }) => (
                <BooleanCombobox
                  id="diagnosticsOwnExecution"
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? false)}
                  nullable={false}
                />
              )}
            />
          </div>

          {/* diagnostics.diagnosticsTimePercentage — 0..100 in steps of 5 */}
          <div className="space-y-2">
            <Label htmlFor="diagnosticsTimePercentage">Anteil Diagnostik-Zeit</Label>
            <Controller
              control={form.control}
              name="diagnostics.diagnosticsTimePercentage"
              render={({ field }) => (
                <Combobox
                  id="diagnosticsTimePercentage"
                  options={percentageOptions}
                  value={field.value === null ? undefined : String(field.value)}
                  onChange={(v) => field.onChange(v === undefined ? null : Number(v))}
                  placeholder="Keine Angabe"
                  hideClearOption={false}
                  clearLabel="Keine Angabe"
                  triggerClassName="bg-background"
                />
              )}
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
