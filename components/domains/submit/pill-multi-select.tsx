"use client";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: readonly Option[];
  value: string[];
  onChange: (vals: string[]) => void;
  className?: string;
};

export function PillMultiSelect({ options, value, onChange, className }: Props) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group">
      {options.map((opt) => {
        const selected = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(opt.value)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              selected
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
