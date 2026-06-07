"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { BooleanCombobox } from "@/components/domains/submit/boolean-combobox";
import { OVERTIME_COMPENSATION_OPTIONS } from "@/lib/domains/form-options/review-field-options";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

export function Step5Conditions({ form }: { form: UseFormReturn<ReviewFormState> }) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Arbeitsbedingungen</legend>

      <div className="space-y-2">
        <Label htmlFor="contractualHours">Tariflich vereinbarte Wochenarbeitszeit in Stunden</Label>
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
        <Label htmlFor="weeklyHours">Tatsächliche Wochenarbeitszeit in Stunden</Label>
        <Controller
          control={form.control}
          name="weeklyHours"
          render={({ field }) => (
            <Input
              id="weeklyHours"
              type="number"
              min={0}
              max={100}
              placeholder="z. B. 50"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))
              }
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="onCallShiftsPerMonth">Wie viele Sonderdienste pro Monat?</Label>
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

      <div className="space-y-2">
        <Label htmlFor="correctOvertimeLogging">Werden Überstunden korrekt erfasst?</Label>
        <Controller
          control={form.control}
          name="correctOvertimeLogging"
          render={({ field }) => (
            <BooleanCombobox
              id="correctOvertimeLogging"
              value={field.value}
              onChange={(v) => field.onChange(v ?? false)}
              nullable={false}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="overtimeCompensationType">Wie werden Überstunden vergütet?</Label>
        <Controller
          control={form.control}
          name="overtimeCompensationType"
          render={({ field }) => (
            <Combobox
              id="overtimeCompensationType"
              options={[...OVERTIME_COMPENSATION_OPTIONS]}
              value={field.value || undefined}
              onChange={(v) => field.onChange(v ?? "")}
              placeholder="Wähle eine Option"
              hideClearOption={false}
              clearLabel="Keine Angabe"
              triggerClassName="bg-background"
            />
          )}
        />
      </div>
    </fieldset>
  );
}
