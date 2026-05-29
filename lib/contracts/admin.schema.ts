import { z } from "zod";

import { offsetPaginationSchema } from "@/lib/contracts/pagination.schema";
import {
  reviewRequestStatusSchema,
  reviewSubmitSchema,
} from "@/lib/contracts/submit.schema";

/** Go emits RFC 3339 with numeric offsets (e.g. +01:00); Zod's default datetime only allows Z. */
const adminApiDateTimeSchema = z.string().datetime({ offset: true });

export const reviewRequestSummarySchema = z.object({
  id: z.string().uuid(),
  requestStatus: reviewRequestStatusSchema,
  dateTime: adminApiDateTimeSchema,
  state: z.string(),
  city: z.string(),
  hospital: z.string(),
  specialty: z.string(),
  totalGrade: z.number(),
});

export const reviewRequestSchema = z.object({
  id: z.string().uuid(),
  createdAt: adminApiDateTimeSchema,
  updatedAt: adminApiDateTimeSchema,
  requestStatus: reviewRequestStatusSchema,
  ...reviewSubmitSchema.shape,
});

export const reviewRequestsResponseSchema = z.object({
  data: z.array(reviewRequestSummarySchema),
  pagination: offsetPaginationSchema,
});

export type ReviewRequestSummary = z.infer<typeof reviewRequestSummarySchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
export type ReviewRequestsResponse = z.infer<typeof reviewRequestsResponseSchema>;

// FEEDBACK
export const adminFeedbackSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  email: z.string(),
  feedback: z.string(),
  processed: z.boolean(),
  createdAt: adminApiDateTimeSchema,
});

export const adminFeedbackListResponseSchema = z.object({
  data: z.array(adminFeedbackSchema),
  pagination: offsetPaginationSchema,
});

export type AdminFeedback = z.infer<typeof adminFeedbackSchema>;
export type AdminFeedbackListResponse = z.infer<typeof adminFeedbackListResponseSchema>;
