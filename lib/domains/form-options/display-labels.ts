/** Shared `{ label, value }` lookups for review display / submit parity (see T18/T19). */
export type LabeledValue<T extends string = string> = Readonly<{ label: string; value: T }>;

export function labelFor(options: readonly LabeledValue[], value: string): string {
  const match = options.find((o) => o.value === value);
  if (match) return match.label;
  // Fallback: capitalize first letter so raw camelCase/snake_case values don't
  // show up with a lowercase first character when no matching option is found.
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function labelsFor(options: readonly LabeledValue[], values: readonly string[]): string[] {
  return values.map((v) => labelFor(options, v));
}
