import { Check, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ConsumeVerificationResult } from "@/lib/domains/verify/consume-result";
import {
  VERIFY_DEAD_LINK_BODY,
  VERIFY_DEAD_LINK_TITLE,
  VERIFY_FAILED_TITLE,
  VERIFY_SUCCESS_BODY,
  VERIFY_SUCCESS_TITLE,
} from "@/lib/domains/verify/copy";

type VerifyResultViewProps = {
  result: ConsumeVerificationResult;
};

export function VerifyResultView({ result }: VerifyResultViewProps) {
  switch (result.kind) {
    case "success":
      return (
        <VerifyCard
          title={VERIFY_SUCCESS_TITLE}
          body={VERIFY_SUCCESS_BODY}
          tone="success"
        />
      );
    case "dead_link":
      return (
        <VerifyCard
          title={VERIFY_DEAD_LINK_TITLE}
          body={VERIFY_DEAD_LINK_BODY}
          tone="dead"
        />
      );
    case "failed":
      return (
        <VerifyCard title={VERIFY_FAILED_TITLE} body={result.message} tone="failed" />
      );
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}

function VerifyCard({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "success" | "dead" | "failed";
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6 text-center">
        <div className="border-border bg-cream-surface rounded-xl border p-8 md:p-12">
          <div className="mb-8 flex justify-center">
            <div
              className={
                tone === "success"
                  ? "bg-success/20 flex h-20 w-20 items-center justify-center rounded-full"
                  : "bg-muted flex h-20 w-20 items-center justify-center rounded-full"
              }
              aria-hidden
            >
              {tone === "success" ? (
                <Check className="text-foreground h-10 w-10 stroke-[2.5]" />
              ) : (
                <X className="text-foreground h-10 w-10 stroke-[2.5]" />
              )}
            </div>
          </div>

          <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{body}</p>
        </div>

        <Button asChild variant="outline" size="lg">
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </div>
  );
}
