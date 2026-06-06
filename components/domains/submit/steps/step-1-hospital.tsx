"use client";

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

  const stateOptions = toOptions(statesQuery.data?.data ?? []);
  const cityOptions = toOptions(citiesQuery.data?.data ?? []);
  const hospitalOptions = toOptions(hospitalsQuery.data?.data ?? []);
  const specialtyOptions = toOptions(specialtiesQuery.data?.data ?? []);

  const cityDisabled = !stateValue || isCustomState;
  const hospitalDisabled = !stateValue || isCustomState;

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Dein Krankenhaus</legend>

      {/* Bundesland */}
      <div className="space-y-2">
        <Label htmlFor="state">Bundesland</Label>
        <Controller
          control={form.control}
          name="state"
          render={({ field }) => (
            <Controller
              control={form.control}
              name="isCustomState"
              render={({ field: customField }) => (
                <DynamicOptionField
                  id="state"
                  options={stateOptions}
                  value={field.value}
                  isCustom={customField.value}
                  isLoading={statesQuery.isLoading}
                  isError={statesQuery.isError}
                  placeholder="Bundesland wählen…"
                  searchPlaceholder="Bundesland suchen…"
                  freeTextPlaceholder="Bundesland eingeben…"
                  onChange={(v) => {
                    field.onChange(v);
                    form.setValue("city", "");
                    form.setValue("isCustomCity", false);
                    form.setValue("hospital", "");
                    form.setValue("isCustomHospital", false);
                  }}
                  onCustomToggle={(isCustom) => {
                    customField.onChange(isCustom);
                    if (isCustom) {
                      form.setValue("city", "");
                      form.setValue("isCustomCity", false);
                      form.setValue("hospital", "");
                      form.setValue("isCustomHospital", false);
                    }
                  }}
                />
              )}
            />
          )}
        />
      </div>

      {/* Stadt */}
      <div className="space-y-2">
        <Label htmlFor="city">Stadt</Label>
        <Controller
          control={form.control}
          name="city"
          render={({ field }) => (
            <Controller
              control={form.control}
              name="isCustomCity"
              render={({ field: customField }) => (
                <DynamicOptionField
                  id="city"
                  options={cityOptions}
                  value={field.value}
                  isCustom={customField.value}
                  isLoading={citiesQuery.isLoading}
                  isError={citiesQuery.isError}
                  placeholder="Stadt wählen…"
                  searchPlaceholder="Stadt suchen…"
                  freeTextPlaceholder="Stadt eingeben…"
                  disabled={cityDisabled}
                  onChange={(v) => {
                    field.onChange(v);
                    form.setValue("hospital", "");
                    form.setValue("isCustomHospital", false);
                  }}
                  onCustomToggle={(isCustom) => {
                    customField.onChange(isCustom);
                    if (isCustom) {
                      form.setValue("hospital", "");
                      form.setValue("isCustomHospital", false);
                    }
                  }}
                />
              )}
            />
          )}
        />
      </div>

      {/* Krankenhaus */}
      <div className="space-y-2">
        <Label htmlFor="hospital">Krankenhaus</Label>
        <Controller
          control={form.control}
          name="hospital"
          render={({ field }) => (
            <Controller
              control={form.control}
              name="isCustomHospital"
              render={({ field: customField }) => (
                <DynamicOptionField
                  id="hospital"
                  options={hospitalOptions}
                  value={field.value}
                  isCustom={customField.value}
                  isLoading={hospitalsQuery.isLoading}
                  isError={hospitalsQuery.isError}
                  placeholder="Krankenhaus wählen…"
                  searchPlaceholder="Krankenhaus suchen…"
                  freeTextPlaceholder="Krankenhaus eingeben…"
                  disabled={hospitalDisabled}
                  onChange={(v) => {
                    field.onChange(v);
                  }}
                  onCustomToggle={(isCustom) => {
                    customField.onChange(isCustom);
                  }}
                />
              )}
            />
          )}
        />
      </div>

      {/* Fachrichtung */}
      <div className="space-y-2">
        <Label htmlFor="specialty">Fachrichtung</Label>
        <Controller
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <Controller
              control={form.control}
              name="isCustomSpecialty"
              render={({ field: customField }) => (
                <DynamicOptionField
                  id="specialty"
                  options={specialtyOptions}
                  value={field.value}
                  isCustom={customField.value}
                  isLoading={specialtiesQuery.isLoading}
                  isError={specialtiesQuery.isError}
                  placeholder="Fachrichtung wählen…"
                  searchPlaceholder="Fachrichtung suchen…"
                  freeTextPlaceholder="Fachrichtung eingeben…"
                  onChange={(v) => {
                    field.onChange(v);
                  }}
                  onCustomToggle={(isCustom) => {
                    customField.onChange(isCustom);
                  }}
                />
              )}
            />
          )}
        />
      </div>
    </fieldset>
  );
}
