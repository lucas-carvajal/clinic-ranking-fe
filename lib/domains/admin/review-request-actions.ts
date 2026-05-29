import type { ReviewRequestStatus } from "@/lib/contracts/submit.schema";

export type ModerationIntent =
  | "verify-email"
  | "verify-affiliation"
  | "approve"
  | "reject";

export type ModerationActionPresentation = {
  intent: ModerationIntent;
  label: string;
  variant: "default" | "destructive" | "outline";
};

/**
 * Controls which moderation buttons are shown for a status. The backend remains
 * authoritative for allowed transitions; this map is presentation-only.
 */
export function moderationActionsForStatus(
  status: ReviewRequestStatus,
): ModerationActionPresentation[] {
  switch (status) {
    case "SUBMITTED":
      return [{ intent: "verify-email", label: "E-Mail verifizieren", variant: "default" }];
    case "EMAIL_VERIFIED":
      return [
        {
          intent: "verify-affiliation",
          label: "Zugehörigkeit verifizieren",
          variant: "default",
        },
      ];
    case "AFFILIATION_VERIFIED":
      return [
        { intent: "approve", label: "Freigeben", variant: "default" },
        { intent: "reject", label: "Ablehnen", variant: "destructive" },
      ];
    default:
      return [];
  }
}
