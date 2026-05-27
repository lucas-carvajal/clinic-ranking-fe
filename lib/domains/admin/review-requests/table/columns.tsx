"use client";

import type { ReviewRequestSummary } from "@/lib/contracts/admin.schema";
import { ReviewRequestStatusBadge } from "@/components/domains/admin/review-requests/review-request-status-badge";
import { createColumnHelper } from "@/lib/table/createTable";

const helper = createColumnHelper<ReviewRequestSummary>();

function formatListDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export const adminReviewRequestColumns = [
  helper.accessor("dateTime", {
    header: "Datum",
    cell: ({ getValue }) => formatListDate(getValue()),
  }),
  helper.accessor("requestStatus", {
    header: "Status",
    cell: ({ getValue }) => <ReviewRequestStatusBadge status={getValue()} />,
  }),
  helper.accessor("city", {
    header: "Stadt",
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  helper.accessor("specialty", {
    header: "Fachrichtung",
  }),
  helper.accessor("hospital", {
    header: "Krankenhaus",
    cell: ({ getValue }) => (
      <span className="text-foreground font-medium">{getValue()}</span>
    ),
  }),
  helper.accessor("totalGrade", {
    header: "Note",
    cell: ({ getValue }) => (
      <span className="text-brand-mint font-semibold tabular-nums">{getValue()}</span>
    ),
  }),
];
