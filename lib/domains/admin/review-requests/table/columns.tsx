"use client";

import { CopyVerificationLinkButton } from "@/components/domains/admin/review-request/copy-verification-link-button";
import { ReviewRequestStatusBadge } from "@/components/domains/admin/review-requests/review-request-status-badge";
import type { ReviewRequestSummary } from "@/lib/contracts/admin.schema";
import { isEmailInboxConfirmed } from "@/lib/domains/admin/review-request/is-email-inbox-confirmed";
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
  helper.display({
    id: "verification",
    header: "E-Mail",
    cell: ({ row }) => {
      if (isEmailInboxConfirmed(row.original.requestStatus)) {
        return <span className="text-sm font-medium text-blue-800">Bestätigt</span>;
      }
      if (row.original.requestStatus === "SUBMITTED") {
        return <CopyVerificationLinkButton requestId={row.original.id} size="sm" />;
      }
      return <span className="text-muted-foreground text-sm">—</span>;
    },
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
