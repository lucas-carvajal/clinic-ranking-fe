import type { Metadata } from "next";
import { Suspense } from "react";

import { ReviewsPageClient } from "@/components/domains/reviews/reviews-page-client";
import { CenteredSpinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Alle Bewertungen",
  description:
    "Alle Bewertungen zur Facharztweiterbildung in deutschen Krankenhäusern — filterbar nach Bundesland, Stadt und Fachrichtung.",
  alternates: { canonical: "/app/reviews" },
};

export default function ReviewsPage() {
  return (
    <Suspense fallback={<CenteredSpinner label="Lade Bewertungen…" />}>
      <ReviewsPageClient />
    </Suspense>
  );
}
