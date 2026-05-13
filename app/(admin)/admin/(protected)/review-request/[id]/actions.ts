"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/admin/require-admin-user";
import { ApiError } from "@/lib/api/errors";
import { serverPost } from "@/lib/api/server";
import { reviewRequestSchema } from "@/lib/contracts/admin.schema";
import type { ModerationIntent } from "@/lib/domains/admin/review-request-actions";

export type ModerationActionState = {
  error?: string;
};

function isModerationIntent(value: string): value is ModerationIntent {
  return (
    value === "verify-email" ||
    value === "verify-affiliation" ||
    value === "approve" ||
    value === "reject"
  );
}

function pathForIntent(intent: ModerationIntent): string {
  switch (intent) {
    case "verify-email":
      return "verify-email";
    case "verify-affiliation":
      return "verify-affiliation";
    case "approve":
      return "approve";
    case "reject":
      return "reject";
    default: {
      const _exhaustive: never = intent;
      return _exhaustive;
    }
  }
}

export async function runReviewRequestModerationAction(
  _prev: ModerationActionState | undefined,
  formData: FormData,
): Promise<ModerationActionState> {
  const id = formData.get("id");
  const intent = formData.get("intent");
  if (typeof id !== "string" || id.length === 0) {
    return { error: "Ungültige Anfrage." };
  }
  if (typeof intent !== "string" || !isModerationIntent(intent)) {
    return { error: "Ungültige Aktion." };
  }

  await requireAdminUser(`/admin/review-request/${id}`);

  const suffix = pathForIntent(intent);

  try {
    await serverPost(`/admin/review-requests/${id}/${suffix}`, undefined, {
      responseSchema: reviewRequestSchema,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const { status, message } = error.normalized;
      if (status === 401 || status === 403) {
        return {
          error:
            "Nicht autorisiert oder Sitzung abgelaufen. Bitte erneut anmelden und die Aktion wiederholen.",
        };
      }
      return { error: message };
    }
    return { error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/review-request/${id}`);
  revalidatePath("/admin/review-requests");
  return {};
}
