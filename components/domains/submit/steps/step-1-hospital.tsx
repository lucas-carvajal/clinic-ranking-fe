"use client";

import type { ComponentProps } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { DynamicOptionField } from "@/components/domains/submit/dynamic-option-field";
import type { ComboboxOption } from "@/components/ui/combobox";
import {
  useStates,
  useSpecialties,
  useCities,
  useHospitals,
} from "@/lib/domains/options/hooks";
import type { ReviewFormState } from "@/lib/domains/submit/schema";

function toOptions(items: { name: string }[]): ComboboxOption[] {
  return items.map((item) => ({ value: item.name, label: item.name }));
}

type StringField = "state" | "city" | "hospital" | "specialty";
type CustomFlag =
  | "isCustomState"
  | "isCustomCity"
  | "isCustomHospital"
  | "isCustomSpecialty";

type DynamicFieldProps = Omit<
  ComponentProps<typeof DynamicOptionField>,
  "value" | "isCustom" | "onChange" | "onCustomToggle"
> & {
  form: UseFormReturn<ReviewFormState>;
  name: StringField;
  customName: CustomFlag;
  /**
   * Extra cascade to run after the custom flag flips. Note the Combobox also
   * fires onCustomToggle(false) on every concrete selection and on clear, so
   * this is the single place to reset dependent fields — onChange only ever
   * sets the value (which keeps free-text typing from re-triggering cascades).
   */
  onCascade?: (isCustom: boolean) => void;
};

/** Binds a single string field + its `isCustom*` flag to a DynamicOptionField. */
function DynamicField({ form, name, customName, onCascade, ...rest }: DynamicFieldProps) {
  const isCustom = form.watch(customName);
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <DynamicOptionField
          {...rest}
          value={field.value}
          isCustom={isCustom}
          onChange={(v) => field.onChange(v)}
          onCustomToggle={(custom) => {
            form.setValue(customName, custom);
            onCascade?.(custom);
          }}
        />
      )}
    />
  );
}

export function Step1Hospital({ form }: { form: UseFormReturn<ReviewFormState> }) {
  const stateValue = form.watch("state");
  const cityValue = form.watch("city");
  const isCustomState = form.watch("isCustomState");
  const isCustomCity = form.watch("isCustomCity");

  const statesQuery = useStates();
  const citiesQuery = useCities(isCustomState ? null : stateValue || null);
  const hospitalsQuery = useHospitals({
    state: isCustomState ? null : stateValue || null,
    city: isCustomCity ? null : cityValue || null,
  });
  const specialtiesQuery = useSpecialties();

  const cityDisabled = !stateValue || isCustomState;
  // Hospitals are only queryable for a concrete state + (optional) city, so the
  // list is unavailable when the state or city is custom/free-typed.
  const hospitalDisabled = !stateValue || isCustomState || isCustomCity;

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Dein Krankenhaus</legend>

      {/* Bundesland */}
      <div className="space-y-2">
        <Label htmlFor="state">Bundesland</Label>
        <DynamicField
          form={form}
          name="state"
          customName="isCustomState"
          id="state"
          options={toOptions(statesQuery.data?.data ?? [])}
          isLoading={statesQuery.isLoading}
          isError={statesQuery.isError}
          placeholder="Bundesland wählen…"
          searchPlaceholder="Bundesland suchen…"
          freeTextPlaceholder="Bundesland eingeben…"
          customOptionLabel="ANDERES BUNDESLAND…"
          onCascade={(isCustom) => {
            // A free-typed state has no queryable cities/hospitals, so cascade
            // both into custom mode; a concrete state resets them to list mode.
            form.setValue("city", "");
            form.setValue("hospital", "");
            form.setValue("isCustomCity", isCustom);
            form.setValue("isCustomHospital", isCustom);
          }}
        />
      </div>

      {/* Stadt */}
      <div className="space-y-2">
        <Label htmlFor="city">Stadt</Label>
        <DynamicField
          form={form}
          name="city"
          customName="isCustomCity"
          id="city"
          options={toOptions(citiesQuery.data?.data ?? [])}
          isLoading={citiesQuery.isLoading}
          isError={citiesQuery.isError}
          placeholder="Stadt wählen…"
          searchPlaceholder="Stadt suchen…"
          freeTextPlaceholder="Stadt eingeben…"
          customOptionLabel="ANDERE STADT…"
          disabled={cityDisabled}
          onCascade={(isCustom) => {
            // A free-typed city has no queryable hospitals → cascade the hospital.
            form.setValue("hospital", "");
            form.setValue("isCustomHospital", isCustom);
          }}
        />
      </div>

      {/* Krankenhaus */}
      <div className="space-y-2">
        <Label htmlFor="hospital">Krankenhaus</Label>
        <DynamicField
          form={form}
          name="hospital"
          customName="isCustomHospital"
          id="hospital"
          options={toOptions(hospitalsQuery.data?.data ?? [])}
          isLoading={hospitalsQuery.isLoading}
          isError={hospitalsQuery.isError}
          placeholder="Krankenhaus wählen…"
          searchPlaceholder="Krankenhaus suchen…"
          freeTextPlaceholder="Krankenhaus eingeben…"
          customOptionLabel="ANDERES KRANKENHAUS…"
          disabled={hospitalDisabled}
        />
      </div>

      {/* Fachrichtung */}
      <div className="space-y-2">
        <Label htmlFor="specialty">Fachrichtung</Label>
        <DynamicField
          form={form}
          name="specialty"
          customName="isCustomSpecialty"
          id="specialty"
          options={toOptions(specialtiesQuery.data?.data ?? [])}
          isLoading={specialtiesQuery.isLoading}
          isError={specialtiesQuery.isError}
          placeholder="Fachrichtung wählen…"
          searchPlaceholder="Fachrichtung suchen…"
          freeTextPlaceholder="Fachrichtung eingeben…"
          customOptionLabel="ANDERE FACHRICHTUNG…"
        />
      </div>
    </fieldset>
  );
}
