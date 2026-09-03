"use server";

import { z } from "zod";

import { requireAdminUser } from "@/lib/admin/require-admin-user";
import { ApiError } from "@/lib/api/errors";
import { serverPost } from "@/lib/api/server";
import { verificationLinkResponseSchema } from "@/lib/contracts/verify.schema";
import { adminVerificationLinkPath } from "@/lib/domains/admin/review-request/verification-link-path";

export type GenerateVerificationLinkResult =
  | { kind: "ok"; url: string }
  | { kind: "error"; message: string };

export async function generateReviewRequestVerificationLink(
  id: string,
): Promise<GenerateVerificationLinkResult> {
  if (!z.string().uuid().safeParse(id).success) {
    return { kind: "error", message: "Ungültige Anfrage." };
  }

  await requireAdminUser(`/admin/review-request/${id}`);

  try {
    const data = await serverPost(adminVerificationLinkPath(id), undefined, {
      responseSchema: verificationLinkResponseSchema,
    });
    return { kind: "ok", url: data.url };
  } catch (error) {
    if (error instanceof ApiError) {
      const { status, message } = error.normalized;
      if (status === 401 || status === 403) {
        return {
          kind: "error",
          message:
            "Nicht autorisiert oder Sitzung abgelaufen. Bitte erneut anmelden und die Aktion wiederholen.",
        };
      }
      return { kind: "error", message };
    }
    return { kind: "error", message: "Unerwarteter Fehler." };
  }
}
