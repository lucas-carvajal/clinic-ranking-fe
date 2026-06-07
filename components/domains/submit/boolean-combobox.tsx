"use client";

import { useMemo } from "react";

import { Combobox } from "@/components/ui/combobox";

const BOOLEAN_OPTIONS = [
  { value: "true", label: "Ja" },
  { value: "false", label: "Nein" },
] as const;

type Props = {
  id?: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  placeholder?: string;
  /** Whether to show a "Keine Angabe" clear option. Defaults to true. */
  nullable?: boolean;
};

export function BooleanCombobox({
  id,
  value,
  onChange,
  placeholder = "Ja oder Nein?",
  nullable = true,
}: Props) {
  const options = useMemo(() => [...BOOLEAN_OPTIONS], []);

  return (
    <Combobox
      id={id}
      options={options}
      value={value === null ? undefined : String(value)}
      onChange={(v) => {
        if (v === undefined) onChange(null);
        else onChange(v === "true");
      }}
      placeholder={placeholder}
      hideClearOption={!nullable}
      clearLabel="Keine Angabe"
      triggerClassName="bg-background"
    />
  );
}
