import type { AdminFeedback } from "@/lib/contracts/admin.schema";

const FEEDBACK_TYPE_LABEL: Record<string, string> = {
  bug: "Fehler",
  feature: "Feature-Wunsch",
  general: "Allgemein",
  other: "Sonstiges",
  submission_feedback: "Einsendung",
};

const FEEDBACK_TYPE_TONE: Record<string, string> = {
  bug: "border-red-300 bg-red-50 text-red-800",
  feature: "border-blue-300 bg-blue-50 text-blue-900",
  general: "border-border bg-muted/60 text-foreground",
  other: "border-violet-300 bg-violet-50 text-violet-900",
  submission_feedback: "border-amber-300 bg-amber-50 text-amber-900",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type Props = { feedback: AdminFeedback };

export function AdminFeedbackCard({ feedback }: Props) {
  const typeLabel = FEEDBACK_TYPE_LABEL[feedback.type] ?? feedback.type;
  const typeTone =
    FEEDBACK_TYPE_TONE[feedback.type] ?? "border-border bg-muted/60 text-foreground";

  return (
    <article className="border-border bg-surface-lifted rounded-md border p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeTone}`}
        >
          {typeLabel}
        </span>

        {feedback.processed && (
          <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-900">
            Erledigt
          </span>
        )}

        <time
          dateTime={feedback.createdAt}
          className="text-muted-foreground ml-auto text-xs tabular-nums"
        >
          {formatDate(feedback.createdAt)}
        </time>
      </div>

      {feedback.email && (
        <p className="text-muted-foreground mb-2 text-xs">
          <a
            href={`mailto:${feedback.email}`}
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {feedback.email}
          </a>
        </p>
      )}

      <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
        {feedback.feedback}
      </p>
    </article>
  );
}
