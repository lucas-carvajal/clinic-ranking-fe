/** Shared `{ label, value }` lookups for review display / submit parity (see T18/T19). */
export type LabeledValue<T extends string = string> = Readonly<{ label: string; value: T }>;

export function labelFor(options: readonly LabeledValue[], value: string): string {
  const match = options.find((o) => o.value === value);
  return match?.label ?? value;
}

export function labelsFor(options: readonly LabeledValue[], values: readonly string[]): string[] {
  return values.map((v) => labelFor(options, v));
}
