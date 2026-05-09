import { z } from "zod";

import {
  createdResourceSchema,
  cursorPaginationSchema,
} from "@/lib/contracts/pagination.schema";
import { reviewSubmitSchema } from "@/lib/contracts/submit.schema";

/** Go emits RFC 3339 with numeric offsets (e.g. +01:00); Zod's default datetime only allows Z. */
const reviewApiDateTimeSchema = z.string().datetime({ offset: true });

export const reviewSummarySchema = z.object({
  id: z.string().uuid(),
  dateTime: reviewApiDateTimeSchema,
  state: z.string(),
  city: z.string(),
  hospital: z.string(),
  specialty: z.string(),
  totalGrade: z.number(),
});

const reviewDetailBaseSchema = reviewSubmitSchema.omit({
  isCustomState: true,
  isCustomCity: true,
  isCustomHospital: true,
  isCustomSpecialty: true,
  publishAtDate: true,
  email: true,
});

export const reviewDetailSchema = z.object({
  id: z.string().uuid(),
  dateTime: reviewApiDateTimeSchema,
  ...reviewDetailBaseSchema.shape,
});

export const reviewsListResponseSchema = z.object({
  data: z.array(reviewSummarySchema),
  pagination: cursorPaginationSchema,
});

export const reviewSubmitResponseSchema = createdResourceSchema;

export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
export type ReviewDetail = z.infer<typeof reviewDetailSchema>;
