"use client";

import { Check, Copy } from "lucide-react";
import { useState, useTransition } from "react";

import { generateReviewRequestVerificationLink } from "@/app/(admin)/admin/(protected)/review-request/[id]/generate-verification-link";
import { Button } from "@/components/ui/button";

type CopyVerificationLinkButtonProps = {
  requestId: string;
  label?: string;
  size?: "default" | "sm";
  onCopied?: (url: string) => void;
};

export function CopyVerificationLinkButton({
  requestId,
  label = "Link kopieren",
  size = "default",
  onCopied,
}: CopyVerificationLinkButtonProps) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    startTransition(async () => {
      const result = await generateReviewRequestVerificationLink(requestId);
      if (result.kind === "error") {
        setCopied(false);
        setError(result.message);
        return;
      }

      try {
        await navigator.clipboard.writeText(result.url);
        setCopied(true);
        onCopied?.(result.url);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
        setError(`Link erzeugt, Kopieren fehlgeschlagen: ${result.url}`);
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="outline"
        size={size}
        disabled={pending}
        onClick={handleClick}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
        {copied ? "Kopiert" : pending ? "Erzeuge…" : label}
      </Button>
      {error ? (
        <p className="text-destructive max-w-xs text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
