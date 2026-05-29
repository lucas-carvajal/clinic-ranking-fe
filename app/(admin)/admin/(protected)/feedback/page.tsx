import { Suspense } from "react";

import { AdminFeedbackTable } from "@/components/domains/admin/feedback/admin-feedback-table";
import { CenteredSpinner } from "@/components/ui/spinner";
import {
  adminFeedbackListResponseSchema,
  type AdminFeedbackListResponse,
} from "@/lib/contracts/admin.schema";
import { serverGet } from "@/lib/api/server";
import { parseAdminFeedbackSearchParams } from "@/lib/domains/admin/feedback/feedback-url";

type AdminFeedbackPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function AdminFeedbackContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const urlParams = parseAdminFeedbackSearchParams(searchParams);
  const query = new URLSearchParams({
    page: String(urlParams.page),
    page_size: String(urlParams.pageSize),
  });

  const data: AdminFeedbackListResponse = await serverGet(
    `/admin/feedback?${query.toString()}`,
    {
      responseSchema: adminFeedbackListResponseSchema,
    },
  );

  return (
    <AdminFeedbackTable rows={data.data} pagination={data.pagination} urlParams={urlParams} />
  );
}

export default async function AdminFeedbackPage({ searchParams }: AdminFeedbackPageProps) {
  const sp = searchParams ? await searchParams : {};

  return (
    <Suspense fallback={<CenteredSpinner label="Lade Feedback…" />}>
      <AdminFeedbackContent searchParams={sp} />
    </Suspense>
  );
}
