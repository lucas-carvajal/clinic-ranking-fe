import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FeedbackSuccess() {
  return (
    <div className="text-foreground mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="border-border bg-cream-surface rounded-xl border p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <span className="text-3xl leading-none shrink-0 select-none" aria-hidden>
            ✅
          </span>
          <div className="flex-1 space-y-4">
            <h3 className="text-foreground text-xl font-bold tracking-tight">
              Vielen Dank für dein Feedback ❤️
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Wir haben dein Feedback erhalten und werden uns schnellstmöglich darum kümmern!
            </p>
            <Button
              asChild
              size="lg"
              className="h-auto min-h-11 w-full px-6 py-3 text-base font-medium md:text-lg"
            >
              <Link href="/app/feedback">Weiteres Feedback geben</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
