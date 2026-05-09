import { Suspense } from "react";

import { ReviewsPageClient } from "@/components/domains/reviews/reviews-page-client";
import { CenteredSpinner } from "@/components/ui/spinner";

export default function ReviewsPage() {
  return (
    <Suspense fallback={<CenteredSpinner label="Lade Bewertungen…" />}>
      <ReviewsPageClient />
    </Suspense>
  );
}
