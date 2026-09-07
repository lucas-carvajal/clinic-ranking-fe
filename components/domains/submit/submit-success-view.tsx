import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const FEEDBACK_HREF = "/app/feedback?type=submission_feedback";

export function SubmitSuccessView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6 text-center">
        <div className="mb-8 flex justify-center">
          <div
            className="bg-success/20 flex h-20 w-20 items-center justify-center rounded-full"
            aria-hidden
          >
            <Check className="text-foreground h-10 w-10 stroke-[2.5]" />
          </div>
        </div>

        <h1 className="page-title mb-6 text-3xl sm:text-4xl">
          Danke für deine Bewertung! ❤️
        </h1>

        <p className="text-ink-utility font-serif text-lg leading-relaxed">
          Wir werden uns so schnell wie möglich bei dir per Email melden, um deine
          Bewertung zu verifizieren und zu veröffentlichen.
        </p>

        <div className="mt-12">
          <p className="text-ink-utility font-serif mb-4 leading-relaxed">
            Wenn du Feedback zum Bewertungsprozess hast, lass es uns gerne wissen :)
          </p>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href={FEEDBACK_HREF}>Feedback geben!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}