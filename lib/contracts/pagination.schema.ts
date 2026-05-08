import { z } from "zod";

export const offsetPaginationSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const cursorPaginationSchema = z.object({
  nextCursor: z.string().optional(),
  pageSize: z.number().int().positive(),
  hasNext: z.boolean(),
});

export const createdResourceSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;
export type CursorPagination = z.infer<typeof cursorPaginationSchema>;
export type CreatedResource = z.infer<typeof createdResourceSchema>;
