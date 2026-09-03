import "server-only";

import { serverPost } from "@/lib/api/server";
import {
  consumeVerificationRequestSchema,
  consumeVerificationSuccessSchema,
} from "@/lib/contracts/verify.schema";
import {
  consumeVerificationResultFromError,
  type ConsumeVerificationResult,
} from "@/lib/domains/verify/consume-result";

/**
 * Public consume. No auth cookies. Backend: POST /review-requests/verify
 */
export async function consumeReviewVerification(token: string): Promise<ConsumeVerificationResult> {
  try {
    await serverPost("/review-requests/verify", { token }, {
      requestSchema: consumeVerificationRequestSchema,
      responseSchema: consumeVerificationSuccessSchema,
      forwardCookies: false,
    });
    return { kind: "success" };
  } catch (error) {
    return consumeVerificationResultFromError(error);
  }
}
