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
  /** When present, show a confirmation dialog before running the action. */
  confirm?: {
    title: string;
    description: string;
    confirmLabel: string;
  };
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
          confirm: {
            title: "Zugehörigkeit verifizieren?",
            description:
              "Damit bestätigst du, dass der Nachweis der Zugehörigkeit zur Klinik geprüft wurde. Der Status wechselt zu „Zugehörigkeit geprüft“ und lässt sich über die Oberfläche nicht zurücksetzen.",
            confirmLabel: "Verifizieren",
          },
        },
      ];
    case "AFFILIATION_VERIFIED":
      return [
        {
          intent: "approve",
          label: "Freigeben",
          variant: "default",
          confirm: {
            title: "Bewertung freigeben?",
            description:
              "Die Bewertung wird zur Veröffentlichung freigegeben. Dieser Schritt lässt sich über die Oberfläche nicht zurücksetzen.",
            confirmLabel: "Freigeben",
          },
        },
        {
          intent: "reject",
          label: "Ablehnen",
          variant: "destructive",
          confirm: {
            title: "Bewertung ablehnen?",
            description:
              "Die Bewertungsanfrage wird abgelehnt. Der Vorgang kann nicht rückgängig gemacht werden.",
            confirmLabel: "Ablehnen",
          },
        },
      ];
    default:
      return [];
  }
}
