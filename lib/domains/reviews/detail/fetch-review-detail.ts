import { cache } from "react";

import { reviewDetailSchema, type ReviewDetail } from "@/lib/contracts/reviews.schema";

export type FetchReviewDetailResult =
  | { status: "ok"; review: ReviewDetail }
  | { status: "not_found" }
  | { status: "upstream_error"; httpStatus: number }
  | { status: "schema_mismatch"; issues: unknown }
  | { status: "misconfigured" }
  | { status: "network_error"; message: string };

async function fetchReviewDetailUncached(id: string): Promise<FetchReviewDetailResult> {
  const backendUrl = process.env.BACKEND_URL?.trim();
  if (!backendUrl) {
    return { status: "misconfigured" };
  }

  const targetUrl = new URL(`/review/${encodeURIComponent(id)}`, backendUrl);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream request failed unexpectedly";
    return { status: "network_error", message };
  }

  if (response.status === 404) {
    return { status: "not_found" };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      return { status: "upstream_error", httpStatus: response.status };
    }
    return { status: "upstream_error", httpStatus: response.status };
  }

  if (!response.ok) {
    return { status: "upstream_error", httpStatus: response.status };
  }

  const parsed = reviewDetailSchema.safeParse(body);
  if (!parsed.success) {
    return { status: "schema_mismatch", issues: parsed.error.issues };
  }

  return { status: "ok", review: parsed.data };
}

/**
 * Deduped per request (RSC `generateMetadata` + page share one upstream call).
 */
export const fetchReviewDetail = cache(fetchReviewDetailUncached);
