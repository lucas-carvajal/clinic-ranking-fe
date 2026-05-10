"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";

import {
  feedbackSubmitResponseSchema,
  type FeedbackSubmitRequest,
} from "@/lib/contracts/feedback.schema";
import { feedbackFormActionSchema } from "@/lib/domains/feedback/feedback-form-action.schema";

export type FeedbackActionState = {
  fieldErrors?: Partial<Record<"type" | "email" | "feedback", string>>;
  formError?: string;
};

function entriesToPayload(formData: FormData) {
  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    type: get("type"),
    email: get("email"),
    feedback: get("feedback"),
  };
}

function zodIssuesToFieldErrors(
  error: z.ZodError,
): NonNullable<FeedbackActionState["fieldErrors"]> {
  const fieldErrors: NonNullable<FeedbackActionState["fieldErrors"]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key === "type" || key === "email" || key === "feedback") {
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
  }
  return fieldErrors;
}

export async function submitFeedbackAction(
  _prevState: FeedbackActionState | undefined,
  formData: FormData,
): Promise<FeedbackActionState> {
  const parsed = feedbackFormActionSchema.safeParse(entriesToPayload(formData));
  if (!parsed.success) {
    return {
      fieldErrors: zodIssuesToFieldErrors(parsed.error),
    };
  }

  const backendUrl = process.env.BACKEND_URL?.trim();
  if (!backendUrl) {
    return { formError: "Der Server ist nicht korrekt konfiguriert." };
  }

  const body: FeedbackSubmitRequest = {
    type: parsed.data.type,
    email: parsed.data.email,
    feedback: parsed.data.feedback,
  };

  let response: Response;
  try {
    response = await fetch(new URL("/feedback", backendUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return {
      formError:
        "Das Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.",
    };
  }

  const responseText = await response.text();
  let responseJson: unknown;
  try {
    responseJson = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseJson = responseText;
  }

  if (!response.ok) {
    const maybeMessage =
      typeof responseJson === "object" &&
      responseJson !== null &&
      "message" in responseJson &&
      typeof (responseJson as { message?: unknown }).message === "string"
        ? (responseJson as { message: string }).message
        : undefined;
    return {
      formError:
        maybeMessage ??
        "Das Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.",
    };
  }

  const created = feedbackSubmitResponseSchema.safeParse(responseJson);
  if (!created.success) {
    return {
      formError:
        "Das Feedback wurde möglicherweise gespeichert, aber die Antwort ist ungewöhnlich. Bitte prüfen und ggf. erneut versuchen.",
    };
  }

  redirect("/app/feedback?success=true");
}
