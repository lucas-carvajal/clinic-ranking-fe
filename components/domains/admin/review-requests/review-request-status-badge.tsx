import type { ReviewRequestStatus } from "@/lib/contracts/submit.schema";

export const REVIEW_REQUEST_STATUS_LABEL: Record<ReviewRequestStatus, string> = {
  SUBMITTED: "Eingereicht",
  EMAIL_VERIFIED: "E-Mail verifiziert",
  AFFILIATION_VERIFIED: "Zugehörigkeit geprüft",
  APPROVED: "Freigegeben",
  PUBLISHED: "Veröffentlicht",
  REJECTED: "Abgelehnt",
};

export function ReviewRequestStatusBadge({ status }: { status: ReviewRequestStatus }) {
  const label = REVIEW_REQUEST_STATUS_LABEL[status] ?? status;
  const tone =
    status === "REJECTED"
      ? "border-red-300 bg-red-50 text-red-800"
      : status === "APPROVED" || status === "PUBLISHED"
        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
        : status === "AFFILIATION_VERIFIED"
          ? "border-violet-300 bg-violet-50 text-violet-900"
          : status === "EMAIL_VERIFIED"
            ? "border-blue-300 bg-blue-50 text-blue-900"
            : "border-border bg-muted/60 text-foreground";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}
