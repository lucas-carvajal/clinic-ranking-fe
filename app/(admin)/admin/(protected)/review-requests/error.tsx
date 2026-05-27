"use client";

import { useEffect } from "react";
import { unstable_rethrow } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";

export default function AdminReviewRequestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  unstable_rethrow(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    error instanceof ApiError
      ? error.normalized.message
      : "Die Liste konnte nicht geladen werden.";

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-lg font-semibold">Fehler</h1>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <Button type="button" variant="outline" onClick={() => reset()}>
        Erneut versuchen
      </Button>
    </div>
  );
}
