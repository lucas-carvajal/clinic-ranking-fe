"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillMultiSelect } from "@/components/domains/submit/pill-multi-select";
import {
  ROTATION_OPTIONS,
  SURGERY_ROLE_OPTIONS,
} from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Step3Rotations({ form }: { form: UseFormReturn<ReviewFormState> }) {
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
                <select
                  id="surgeryComplexProcedures"
                  className={SELECT_CLASS}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => {
                    if (e.target.value === "") field.onChange(false);
                    else field.onChange(e.target.value === "true");
                  }}
                >
                  <option value="">Keine Angabe</option>
                  <option value="true">Ja</option>
                  <option value="false">Nein</option>
                </select>
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
                <select
                  id="surgeryTimePercentage"
                  className={SELECT_CLASS}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => {
                    if (e.target.value === "") field.onChange(null);
                    else field.onChange(Number(e.target.value));
                  }}
                >
                  <option value="">Keine Angabe</option>
                  {Array.from({ length: 21 }, (_, i) => i * 5).map((v) => (
                    <option key={v} value={v}>
                      {v}%
                    </option>
                  ))}
                </select>
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
                <select
                  id="diagnosticsOwnExecution"
                  className={SELECT_CLASS}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => {
                    if (e.target.value === "") field.onChange(false);
                    else field.onChange(e.target.value === "true");
                  }}
                >
                  <option value="">Keine Angabe</option>
                  <option value="true">Ja</option>
                  <option value="false">Nein</option>
                </select>
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
                <select
                  id="diagnosticsTimePercentage"
                  className={SELECT_CLASS}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => {
                    if (e.target.value === "") field.onChange(null);
                    else field.onChange(Number(e.target.value));
                  }}
                >
                  <option value="">Keine Angabe</option>
                  {Array.from({ length: 21 }, (_, i) => i * 5).map((v) => (
                    <option key={v} value={v}>
                      {v}%
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
