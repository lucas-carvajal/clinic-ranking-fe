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
 * Cursor-based reviews search. Query keys mirror the public URL filters.
 * Backend route: GET `/reviews/search` (forwarded via `/api/proxy`).
 */
export async function fetchReviewsList(params: ReviewsFilterParams) {
  const sp = serializeReviewsUrlParams(params);
  const qs = sp.toString();
  const path = qs ? `/reviews/search?${qs}` : "/reviews/search";

  return get(path, {
    responseSchema: reviewsListResponseSchema,
  });
}
