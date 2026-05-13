import { Suspense } from "react";

import { AdminReviewRequestsTable } from "@/components/domains/admin/review-requests/admin-review-requests-table";
import { CenteredSpinner } from "@/components/ui/spinner";
import {
  reviewRequestsResponseSchema,
  type ReviewRequestsResponse,
} from "@/lib/contracts/admin.schema";
import { serverGet } from "@/lib/api/server";
import { parseAdminReviewRequestsSearchParams } from "@/lib/domains/admin/review-requests/review-requests-url";

type AdminReviewRequestsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function AdminReviewRequestsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const urlParams = parseAdminReviewRequestsSearchParams(searchParams);
  const query = new URLSearchParams({
    status: "open",
    page: String(urlParams.page),
    page_size: String(urlParams.pageSize),
  });

  const data: ReviewRequestsResponse = await serverGet(
    `/admin/review-requests?${query.toString()}`,
    {
      responseSchema: reviewRequestsResponseSchema,
    },
  );

  return (
    <AdminReviewRequestsTable rows={data.data} pagination={data.pagination} urlParams={urlParams} />
  );
}

export default async function AdminReviewRequestsPage({ searchParams }: AdminReviewRequestsPageProps) {
  const sp = searchParams ? await searchParams : {};

  return (
    <Suspense fallback={<CenteredSpinner label="Lade Bewertungsanfragen…" />}>
      <AdminReviewRequestsContent searchParams={sp} />
    </Suspense>
  );
}
