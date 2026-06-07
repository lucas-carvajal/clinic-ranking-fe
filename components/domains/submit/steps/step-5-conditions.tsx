"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { OVERTIME_COMPENSATION_OPTIONS } from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step5Conditions({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Arbeitsbedingungen</legend>

      <div className="space-y-2">
        <Label htmlFor="weeklyHours">Wochenstunden</Label>
        <Controller
          control={form.control}
          name="weeklyHours"
          render={({ field }) => (
            <Input
              id="weeklyHours"
              type="number"
              min={0}
              max={100}
              placeholder="z. B. 42"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractualHours">Vertragliche Stunden</Label>
        <Controller
          control={form.control}
          name="contractualHours"
          render={({ field }) => (
            <Input
              id="contractualHours"
              type="number"
              min={0}
              max={100}
              placeholder="z. B. 40"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="overtimeCompensationType">Überstundenausgleich</Label>
        <Controller
          control={form.control}
          name="overtimeCompensationType"
          render={({ field }) => (
            <Select
              id="overtimeCompensationType"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            >
              <option value="">Bitte wählen</option>
              {OVERTIME_COMPENSATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        <Controller
          control={form.control}
          name="correctOvertimeLogging"
          render={({ field }) => (
            <Checkbox
              id="correctOvertimeLogging"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        <Label htmlFor="correctOvertimeLogging">Werden Überstunden korrekt erfasst?</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="onCallShiftsPerMonth">Bereitschaftsdienste pro Monat</Label>
        <Controller
          control={form.control}
          name="onCallShiftsPerMonth"
          render={({ field }) => (
            <Input
              id="onCallShiftsPerMonth"
              type="number"
              min={0}
              placeholder="z. B. 4"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>
    </fieldset>
  );
}
