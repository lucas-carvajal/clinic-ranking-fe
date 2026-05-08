import { Suspense } from "react";

import { ReviewsPageClient } from "@/components/domains/reviews/reviews-page-client";

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground mx-auto max-w-7xl px-3 py-8 text-center">
          Lade Bewertungen...
        </div>
      }
    >
      <ReviewsPageClient />
    </Suspense>
  );
}
