/**
 * Some backends return the review object wrapped (e.g. `{ "review": { ... } }`
 * or `{ "data": { ... } }`). The public detail contract is the inner object.
 */
export function unwrapReviewDetailResponse(body: unknown): unknown {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const top = body as Record<string, unknown>;

  for (const key of ["review", "data", "result"] as const) {
    const candidate = top[key];
    if (looksLikeReviewDetail(candidate)) {
      return candidate;
    }
  }

  return body;
}

function looksLikeReviewDetail(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const o = value as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.hospital === "string";
}
