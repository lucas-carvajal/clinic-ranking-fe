"use client";

import type { AdminFeedback } from "@/lib/contracts/admin.schema";
import { createColumnHelper } from "@/lib/table/createTable";

const helper = createColumnHelper<AdminFeedback>();

const FEEDBACK_TYPE_LABEL: Record<string, string> = {
  bug: "Fehler",
  feature: "Feature-Wunsch",
  general: "Allgemein",
  other: "Sonstiges",
};

const FEEDBACK_TYPE_TONE: Record<string, string> = {
  bug: "border-red-300 bg-red-50 text-red-800",
  feature: "border-blue-300 bg-blue-50 text-blue-900",
  general: "border-border bg-muted/60 text-foreground",
  other: "border-violet-300 bg-violet-50 text-violet-900",
};

function FeedbackTypeBadge({ type }: { type: string }) {
  const label = FEEDBACK_TYPE_LABEL[type] ?? type;
  const tone = FEEDBACK_TYPE_TONE[type] ?? "border-border bg-muted/60 text-foreground";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

function formatListDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const MAX_PREVIEW = 100;

export const adminFeedbackColumns = [
  helper.accessor("createdAt", {
    header: "Datum",
    cell: ({ getValue }) => (
      <span className="tabular-nums text-sm">{formatListDate(getValue())}</span>
    ),
  }),
  helper.accessor("type", {
    header: "Typ",
    cell: ({ getValue }) => <FeedbackTypeBadge type={getValue()} />,
  }),
  helper.accessor("email", {
    header: "E-Mail",
    cell: ({ getValue }) => {
      const email = getValue();
      return email ? (
        <a
          href={`mailto:${email}`}
          className="text-sm underline-offset-4 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {email}
        </a>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  }),
  helper.accessor("processed", {
    header: "Bearbeitet",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-900">
          Ja
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  }),
  helper.accessor("feedback", {
    header: "Feedback",
    cell: ({ getValue }) => {
      const text = getValue();
      const preview = text.length > MAX_PREVIEW ? text.slice(0, MAX_PREVIEW) + "…" : text;
      return <span className="text-sm">{preview}</span>;
    },
  }),
];
