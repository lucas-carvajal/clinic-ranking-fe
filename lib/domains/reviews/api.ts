import type { z } from "zod";

import { get } from "@/lib/api/client";
import { reviewsListResponseSchema } from "@/lib/contracts/reviews.schema";
import {
  type ReviewsFilterParams,
  serializeReviewsUrlParams,
} from "@/lib/domains/pagination/reviews-url";

export type { ReviewSummary } from "@/lib/contracts/reviews.schema";
export type ReviewsListResponse = z.infer<typeof reviewsListResponseSchema>;

/**
 * Cursor-based reviews list. Query keys mirror the public URL filters.
 * Backend route: GET `/reviews` with `state`, `city`, `hospital`, `specialty`, `cursor`
 * as plain name strings (parity with legacy Svelte `+page.svelte`).
 * Do not use `/reviews/search` here — that handler expects a different contract
 * (often ID-shaped params) and responds with errors like "invalid id format".
 */
export async function fetchReviewsList(params: ReviewsFilterParams) {
  const sp = serializeReviewsUrlParams(params);
  const qs = sp.toString();
  const path = qs ? `/reviews?${qs}` : "/reviews";

  return get(path, {
    responseSchema: reviewsListResponseSchema,
  });
}
