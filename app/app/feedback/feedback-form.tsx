"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackPageType } from "@/lib/domains/feedback/feedback-form-action.schema";
import { cn } from "@/lib/utils";

import { submitFeedbackAction, type FeedbackActionState } from "./actions";

const COPY: Record<
  FeedbackPageType,
  {
    title: string;
    subtitle: string;
    feedbackPlaceholder: string;
    emailPlaceholder: string;
  }
> = {
  feedback: {
    title: "Feedback geben",
    subtitle:
      "Wir freuen uns über dein Feedback! Teile uns mit, was wir verbessern können, was du dir wünschst oder was dir besonders gut gefällt.",
    feedbackPlaceholder: "Dein Feedback...",
    emailPlaceholder: "deine.email@beispiel.de",
  },
  submission_feedback: {
    title: "Feedback zum Bewertungsprozess",
    subtitle:
      "Teile uns mit, wie wir den Bewertungsprozess verbessern können. Was war gut? Was könnte besser sein?",
    feedbackPlaceholder: "Dein Feedback zum Bewertungsprozess...",
    emailPlaceholder: "deine.email@beispiel.de",
  },
};

const initialFeedbackState: FeedbackActionState = {};

function SubmitFeedbackButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="brand"
      disabled={pending}
      size="lg"
      className="h-auto min-h-11 w-full px-6 py-3 text-base font-medium md:text-lg"
    >
      {pending ? "Wird gesendet…" : "Feedback absenden"}
    </Button>
  );
}

export function FeedbackForm({ defaultType }: Readonly<{ defaultType: FeedbackPageType }>) {
  const [state, formAction] = useActionState(submitFeedbackAction, initialFeedbackState);
  const copy = COPY[defaultType];

  return (
    <div className="text-foreground mx-auto max-w-3xl px-4 py-8 md:px-6">
      <h1 className="app-page-heading mb-3">{copy.title}</h1>

      <p className="text-muted-foreground mb-8 leading-relaxed">{copy.subtitle}</p>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="type" value={defaultType} />

        {state.formError ? (
          <div
            className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm leading-relaxed"
            role="alert"
          >
            {state.formError}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="feedback">Dein Feedback</Label>
          <Textarea
            id="feedback"
            name="feedback"
            rows={8}
            placeholder={copy.feedbackPlaceholder}
            aria-invalid={!!state.fieldErrors?.feedback}
            className={cn(
              "bg-background border-border min-h-[200px] resize-y",
              state.fieldErrors?.feedback &&
                "border-destructive focus-visible:border-destructive",
            )}
          />
          {state.fieldErrors?.feedback ? (
            <p className="text-destructive text-sm" role="alert">
              {state.fieldErrors.feedback}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Deine E-Mail-Adresse</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            aria-invalid={!!state.fieldErrors?.email}
            className={cn(
              "bg-background border-border",
              state.fieldErrors?.email &&
                "border-destructive focus-visible:border-destructive",
            )}
          />
          <p className="text-muted-foreground text-xs">
            Für Rückfragen bei Bearbeitung deines Feedbacks :)
          </p>
          {state.fieldErrors?.email ? (
            <p className="text-destructive text-sm" role="alert">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>

        {state.fieldErrors?.type ? (
          <p className="text-destructive text-sm" role="alert">
            {state.fieldErrors.type}
          </p>
        ) : null}

        <SubmitFeedbackButton />
      </form>
    </div>
  );
}
