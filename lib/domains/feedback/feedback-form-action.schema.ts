import { z } from "zod";

/** Public route supports these `?type=` / hidden-field variants only */
const FEEDBACK_PAGE_TYPES = ["feedback", "submission_feedback"] as const;

export type FeedbackPageType = (typeof FEEDBACK_PAGE_TYPES)[number];

function isFeedbackPageType(v: string): v is FeedbackPageType {
  return (FEEDBACK_PAGE_TYPES as readonly string[]).includes(v);
}

export const feedbackFormActionSchema = z.object({
  type: z.string().refine(isFeedbackPageType, {
    message:
      "Dieses Formular ist nicht mehr gültig. Bitte lade die Seite neu und sende das Feedback noch einmal.",
  }),
  email: z
    .string()
    .trim()
    .min(1, "Bitte gib eine E-Mail-Adresse ein.")
    .email("Bitte gib eine gültige E-Mail-Adresse ein."),
  feedback: z.string().trim().min(1, "Bitte gib Feedback ein."),
});
