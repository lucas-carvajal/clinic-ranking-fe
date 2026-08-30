import { ApiError } from "@/lib/api/errors";
import { consumeVerificationErrorCodeSchema } from "@/lib/contracts/verify.schema";

export type ConsumeVerificationResult =
  | { kind: "success" }
  | { kind: "dead_link" }
  | { kind: "failed"; message: string };

const FAILED_FALLBACK = "Die Bestätigung hat nicht geklappt. Versuch es später noch einmal.";

export function consumeVerificationResultFromError(error: unknown): ConsumeVerificationResult {
  if (error instanceof ApiError) {
    const parsed = consumeVerificationErrorCodeSchema.safeParse(error.normalized.code);
    if (parsed.success) {
      return { kind: "dead_link" };
    }
    return { kind: "failed", message: error.normalized.message || FAILED_FALLBACK };
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { kind: "failed", message: error.message };
  }

  return { kind: "failed", message: FAILED_FALLBACK };
}
