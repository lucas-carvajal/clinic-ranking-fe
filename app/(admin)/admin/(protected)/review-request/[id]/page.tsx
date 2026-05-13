import { notFound } from "next/navigation";
import { z } from "zod";

import { AdminReviewRequestDetailClient } from "@/components/domains/admin/review-request/admin-review-request-detail-client";
import { reviewRequestSchema } from "@/lib/contracts/admin.schema";
import { ApiError } from "@/lib/api/errors";
import { serverGet } from "@/lib/api/server";

type AdminReviewRequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminReviewRequestDetailPage({
  params,
}: AdminReviewRequestDetailPageProps) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  let request;
  try {
    request = await serverGet(`/admin/review-requests/${id}`, {
      responseSchema: reviewRequestSchema,
    });
  } catch (error) {
    if (error instanceof ApiError && error.normalized.status === 404) {
      notFound();
    }
    throw error;
  }

  return <AdminReviewRequestDetailClient request={request} />;
}
