import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ReviewsPageClient } from "@/components/domains/reviews/reviews-page-client";
import { CenteredSpinner } from "@/components/ui/spinner";
import { serverGet } from "@/lib/api/server";
import { reviewsListResponseSchema } from "@/lib/contracts/reviews.schema";
import type { ReviewSummary } from "@/lib/contracts/reviews.schema";
import {
  normalizeReviewsFilterParams,
  parseReviewsUrlParams,
  serializeReviewsUrlParams,
  type ReviewsFilterParams,
} from "@/lib/domains/pagination/reviews-url";

const FILTER_KEYS = ["state", "city", "hospital", "specialty"] as const;

type ReviewsSearchParams = {
  state?: string;
  city?: string;
  hospital?: string;
  specialty?: string;
  page?: string;
};

type ReviewsPageProps = {
  searchParams?: Promise<ReviewsSearchParams>;
};

function parsePageNumber(raw: string | undefined): number {
  if (!raw) return 1;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return 1;
  return n;
}

function hasActiveFilters(filters: ReviewsFilterParams): boolean {
  return FILTER_KEYS.some((k) => !!filters[k]);
}

export async function generateMetadata({ searchParams }: ReviewsPageProps): Promise<Metadata> {
  const sp = searchParams ? await searchParams : undefined;

  const urlParams = parseReviewsUrlParams(
    new URLSearchParams(sp as Record<string, string> | undefined),
  );
  const filters = normalizeReviewsFilterParams(urlParams);
  const page = parsePageNumber(sp?.page);
  const filtered = hasActiveFilters(filters);

  const filterSp = serializeReviewsUrlParams(filters);
  const filterQs = filterSp.toString();

  let canonical: string;
  let noIndex: boolean;

  if (!filtered) {
    canonical = "/app/reviews";
    noIndex = page > 1;
  } else {
    canonical = `/app/reviews${filterQs ? `?${filterQs}` : ""}`;
    noIndex = page > 1;
  }

  const baseTitle = "Alle Bewertungen";
  const baseDescription =
    "Alle Bewertungen zur Facharztweiterbildung in deutschen Krankenhäusern — filterbar nach Bundesland, Stadt und Fachrichtung.";

  return {
    title: baseTitle,
    description: baseDescription,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: "Alle Bewertungen | Assistenz Arzt Ranking",
      description: baseDescription,
      url: canonical,
      type: "website",
    },
    twitter: {
      title: "Alle Bewertungen | Assistenz Arzt Ranking",
      description: baseDescription,
    },
  };
}

async function fetchFirstPageSsr(): Promise<ReviewSummary[] | null> {
  try {
    const data = await serverGet("/reviews", {
      responseSchema: reviewsListResponseSchema,
      forwardCookies: false,
    });
    return data.data;
  } catch {
    return null;
  }
}

function SsrReviewsSnippet({ reviews }: { reviews: ReviewSummary[] }) {
  if (reviews.length === 0) return null;
  return (
    <ul className="sr-only" aria-hidden="true">
      {reviews.map((r) => (
        <li key={r.id}>
          <Link href={`/app/review/${r.id}`}>
            {r.hospital}, {r.city} ({r.state}) — {r.specialty}, Note {r.totalGrade}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const sp = searchParams ? await searchParams : undefined;
  const page = parsePageNumber(sp?.page);

  const ssrReviews = page === 1 ? await fetchFirstPageSsr() : null;

  return (
    <>
      {ssrReviews && ssrReviews.length > 0 ? (
        <SsrReviewsSnippet reviews={ssrReviews} />
      ) : null}
      <Suspense fallback={<CenteredSpinner label="Lade Bewertungen…" />}>
        <ReviewsPageClient />
      </Suspense>
    </>
  );
}
