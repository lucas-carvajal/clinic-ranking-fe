import type { Metadata } from "next";

import type { FeedbackPageType } from "@/lib/domains/feedback/feedback-form-action.schema";

import { FeedbackForm } from "./feedback-form";
import { FeedbackSuccess } from "./feedback-success";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Feedback zum Produkt oder zum Bewertungsprozess — wir freuen uns über deine Hinweise.",
};

type AppFeedbackPageProps = {
  searchParams?: Promise<{ type?: string; success?: string }>;
};

export default async function AppFeedbackPage({ searchParams }: AppFeedbackPageProps) {
  const sp = searchParams ? await searchParams : undefined;
  const showSuccess = sp?.success === "true";
  const defaultType: FeedbackPageType =
    sp?.type === "submission_feedback" ? "submission_feedback" : "feedback";

  if (showSuccess) {
    return <FeedbackSuccess />;
  }

  return <FeedbackForm defaultType={defaultType} />;
}
