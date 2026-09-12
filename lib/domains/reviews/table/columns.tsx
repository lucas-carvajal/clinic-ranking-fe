"use client";

import type { ReviewSummary } from "@/lib/contracts/reviews.schema";
import { createColumnHelper } from "@/lib/table/createTable";

const helper = createColumnHelper<ReviewSummary>();

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export const reviewColumns = [
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
  helper.accessor("dateTime", {
    header: "Datum",
    cell: ({ getValue }) => formatReviewDate(getValue()),
  }),
  helper.accessor("totalGrade", {
    header: "Note",
    cell: ({ getValue }) => (
      <span className="text-foreground font-semibold tabular-nums">{getValue()}</span>
    ),
  }),
];
