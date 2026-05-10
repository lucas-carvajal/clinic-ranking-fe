import { z } from "zod";

/**
 * Path param for `/app/review/[id]` must be a UUID matching list `ReviewSummary.id`.
 * Rejects garbage before calling the backend (`400 invalid id format` on Go).
 */
export function parsePublicReviewIdParam(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const ok = z.string().uuid().safeParse(t);
  return ok.success ? t : undefined;
}
