"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { CUSTOM_OPTION_VALUE } from "@/lib/domains/submit/constants";

type DynamicOptionFieldProps = {
  id?: string;
  options: ComboboxOption[];
  value: string;
  isCustom: boolean;
  isLoading?: boolean;
  isError?: boolean;
  placeholder: string;
  searchPlaceholder?: string;
  freeTextPlaceholder?: string;
  onChange: (value: string) => void;
  onCustomToggle: (isCustom: boolean) => void;
  disabled?: boolean;
};

export function DynamicOptionField({
  id,
  options,
  value,
  isCustom,
  isLoading,
  placeholder,
  searchPlaceholder,
  freeTextPlaceholder,
  onChange,
  onCustomToggle,
  disabled,
}: DynamicOptionFieldProps) {
  const allOptions = useMemo(
    () => [...options, { value: CUSTOM_OPTION_VALUE, label: "Anderes…" }],
    [options],
  );

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={freeTextPlaceholder ?? placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onCustomToggle(false);
            onChange("");
          }}
        >
          ← Liste
        </Button>
      </div>
    );
  }

  return (
    <Combobox
      id={id}
      options={allOptions}
      value={value || undefined}
      onChange={(v) => {
        if (v === CUSTOM_OPTION_VALUE) {
          onCustomToggle(true);
          onChange("");
        } else {
          onCustomToggle(false);
          onChange(v ?? "");
        }
      }}
      placeholder={isLoading ? "Laden…" : placeholder}
      searchPlaceholder={searchPlaceholder}
      disabled={isLoading || disabled}
      hideClearOption={false}
    />
  );
}
