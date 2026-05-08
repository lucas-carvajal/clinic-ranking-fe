import { z } from "zod";

import {
  createdResourceSchema,
  offsetPaginationSchema,
} from "@/lib/contracts/pagination.schema";

export const feedbackSubmitRequestSchema = z.object({
  type: z.string(),
  email: z.string().email(),
  feedback: z.string(),
});

export const feedbackSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  email: z.string().email(),
  feedback: z.string(),
  processed: z.boolean(),
  createdAt: z.string().datetime(),
});

export const feedbackSubmitResponseSchema = createdResourceSchema;

export const adminFeedbackResponseSchema = z.object({
  data: z.array(feedbackSchema),
  pagination: offsetPaginationSchema,
});

export type FeedbackSubmitRequest = z.infer<typeof feedbackSubmitRequestSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
