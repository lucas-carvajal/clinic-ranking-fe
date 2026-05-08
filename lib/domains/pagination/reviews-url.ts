export type ReviewsFilterParams = {
  state?: string;
  city?: string;
  hospital?: string;
  specialty?: string;
  cursor?: string;
};

const FILTER_KEYS = ["state", "city", "hospital", "specialty"] as const;

export function parseReviewsUrlParams(searchParams: URLSearchParams): ReviewsFilterParams {
  const result: ReviewsFilterParams = {};

  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      result[key] = value;
    }
  }

  const cursor = searchParams.get("cursor");
  if (cursor) {
    result.cursor = cursor;
  }

  return result;
}

export function serializeReviewsUrlParams(params: ReviewsFilterParams): URLSearchParams {
  const sp = new URLSearchParams();

  for (const key of FILTER_KEYS) {
    const value = params[key];
    if (value) {
      sp.set(key, value);
    }
  }

  if (params.cursor) {
    sp.set("cursor", params.cursor);
  }

  return sp;
}

export function withResetCursorOnFilterChange(
  prev: ReviewsFilterParams,
  next: ReviewsFilterParams,
): ReviewsFilterParams {
  const didFilterChange = FILTER_KEYS.some((key) => prev[key] !== next[key]);
  if (!didFilterChange) {
    return next;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cursor: _ignored, ...rest } = next;
  return rest;
}

export function isReviewsCursorLikelyValid(cursor: string): boolean {
  // Backend describes cursor as opaque base64. We only do a cheap sanity check here.
  // URL-safe base64 variants are common; allow -, _ as well.
  return /^[A-Za-z0-9+/=_-]+$/.test(cursor) && cursor.length >= 8;
}

/**
 * Drops city/hospital when parent filters are missing so hierarchy stays consistent
 * with cascading option loaders.
 */
export function normalizeReviewsFilterParams(
  params: ReviewsFilterParams,
): ReviewsFilterParams {
  const next: ReviewsFilterParams = { ...params };
  if (!next.state) {
    delete next.city;
    delete next.hospital;
  } else if (!next.city) {
    delete next.hospital;
  }
  return next;
}

export function buildAppReviewsHref(params: ReviewsFilterParams): string {
  const sp = serializeReviewsUrlParams(params);
  const qs = sp.toString();
  return `/app/reviews${qs ? `?${qs}` : ""}`;
}

/** Returns normalized params when the URL implied invalid filter hierarchy. */
export function coerceReviewsParamsFromUrl(params: ReviewsFilterParams): {
  params: ReviewsFilterParams;
  didCoerce: boolean;
} {
  const normalized = normalizeReviewsFilterParams(params);
  const changed = FILTER_KEYS.some((k) => params[k] !== normalized[k]);
  return { params: normalized, didCoerce: changed };
}

