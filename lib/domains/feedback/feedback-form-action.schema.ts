import { z } from "zod";

export const feedbackPageTypeSchema = z.enum(["feedback", "submission_feedback"]);

export const feedbackFormActionSchema = z.object({
  type: feedbackPageTypeSchema,
  email: z
    .string()
    .trim()
    .min(1, "Bitte gib eine E-Mail-Adresse ein.")
    .email("Bitte gib eine gültige E-Mail-Adresse ein."),
  feedback: z.string().trim().min(1, "Bitte gib Feedback ein."),
});

export type FeedbackPageType = z.infer<typeof feedbackPageTypeSchema>;
