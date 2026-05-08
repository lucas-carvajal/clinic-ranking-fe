import { z } from "zod";

import {
  createdResourceSchema,
  cursorPaginationSchema,
} from "@/lib/contracts/pagination.schema";
import { reviewSubmitSchema } from "@/lib/contracts/submit.schema";

export const reviewSummarySchema = z.object({
  id: z.string().uuid(),
  dateTime: z.string().datetime(),
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
  dateTime: z.string().datetime(),
  ...reviewDetailBaseSchema.shape,
});

export const reviewsListResponseSchema = z.object({
  data: z.array(reviewSummarySchema),
  pagination: cursorPaginationSchema,
});

export const reviewSubmitResponseSchema = createdResourceSchema;

export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
export type ReviewDetail = z.infer<typeof reviewDetailSchema>;
