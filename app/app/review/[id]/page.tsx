import type { Metadata } from "next";
import Link from "next/link";

import { ReviewDetailView } from "@/components/domains/reviews/review-detail-view";
import { fetchReviewDetail } from "@/lib/domains/reviews/detail/fetch-review-detail";

type AppReviewDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AppReviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchReviewDetail(id);
  if (result.status !== "ok") {
    return {
      title: "Bewertung",
      openGraph: { title: "Bewertung | Assistenz Arzt Ranking", type: "article" },
      twitter: { title: "Bewertung | Assistenz Arzt Ranking" },
    };
  }

  const { hospital, city, state, specialty, totalGrade } = result.review;
  const title = `${hospital} · Bewertung`;
  const description = `Bewertung für ${hospital} (${city}, ${state}) — Fachrichtung ${specialty}, Gesamtnote ${totalGrade}.`;

  return {
    title,
    description,
    alternates: { canonical: `/app/review/${id}` },
    openGraph: {
      title: `${title} | Assistenz Arzt Ranking`,
      description,
      url: `/app/review/${id}`,
      type: "article",
    },
    twitter: {
      title: `${title} | Assistenz Arzt Ranking`,
      description,
    },
  };
}

function ReviewDetailError({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-foreground mx-auto max-w-4xl overflow-x-hidden px-3 py-10 md:p-6">
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link
          href="/app/reviews"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Alle Bewertungen
        </Link>
      </nav>
      <div className="border-border bg-surface-lifted rounded-lg border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default async function AppReviewDetailPage({ params }: AppReviewDetailPageProps) {
  const { id } = await params;
  const result = await fetchReviewDetail(id);

  if (result.status === "ok") {
    const { hospital, city, state, totalGrade } = result.review;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Hospital",
        name: hospital,
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressRegion: state,
        },
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: totalGrade,
        bestRating: 1,
        worstRating: 6,
      },
      publisher: { "@type": "Organization", name: "Assistenz Arzt Ranking" },
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReviewDetailView review={result.review} />
      </>
    );
  }

  if (result.status === "not_found") {
    return (
      <ReviewDetailError
        title="Bewertung nicht gefunden"
        description="Es gibt keine öffentliche Bewertung mit dieser Kennung. Prüfe den Link oder kehre zur Übersicht zurück."
      />
    );
  }

  return (
    <ReviewDetailError
      title="Bewertung konnte nicht geladen werden"
      description="Beim Abrufen der Bewertung ist ein Fehler aufgetreten. Bitte versuche es später erneut."
    />
  );
}
