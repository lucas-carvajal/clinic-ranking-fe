export function parseVerifyTokenParam(
  raw: string | string[] | undefined,
): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return undefined;
  const token = value.trim();
  return token.length > 0 ? token : undefined;
}
