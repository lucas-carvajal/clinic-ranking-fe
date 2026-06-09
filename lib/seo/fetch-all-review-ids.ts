import "server-only";

import { reviewsListResponseSchema } from "@/lib/contracts/reviews.schema";
import { serverGet } from "@/lib/api/server";

export type ReviewSitemapEntry = {
  id: string;
  lastModified: Date;
};

/**
 * Paginates public `GET /reviews` for sitemap generation.
 * Returns an empty array when the backend is unreachable (build still succeeds).
 */
export async function fetchAllReviewSitemapEntries(): Promise<ReviewSitemapEntry[]> {
  const entries: ReviewSitemapEntry[] = [];
  let cursor: string | undefined;

  try {
    for (;;) {
      const path = cursor
        ? `/reviews?cursor=${encodeURIComponent(cursor)}`
        : "/reviews";

      const page = await serverGet(path, {
        responseSchema: reviewsListResponseSchema,
        forwardCookies: false,
        cache: "no-store",
      });

      for (const review of page.data) {
        entries.push({
          id: review.id,
          lastModified: new Date(review.dateTime),
        });
      }

      if (!page.pagination.hasNext || !page.pagination.nextCursor) {
        break;
      }
      cursor = page.pagination.nextCursor;
    }
  } catch (error) {
    console.warn(
      "[sitemap] Could not fetch review IDs from backend; emitting static routes only.",
      error,
    );
    return [];
  }

  return entries;
}