"use client";

import { useEffect } from "react";
import { unstable_rethrow } from "next/navigation";

import {
  isAdminAuthMisconfiguredError,
  isBackendUnavailableError,
} from "@/lib/admin/auth-errors";

export default function ProtectedAdminError({
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

  if (isBackendUnavailableError(error)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-lg font-semibold">Backend nicht erreichbar</h1>
        <p className="max-w-md text-muted-foreground text-sm">
          Backend nicht erreichbar — bitte versuche es erneut.
        </p>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
          onClick={() => {
            window.location.reload();
          }}
        >
          Neu laden
        </button>
      </div>
    );
  }

  if (isAdminAuthMisconfiguredError(error)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-lg font-semibold">Konfigurationsfehler</h1>
        <p className="max-w-md text-muted-foreground text-sm">
          Die Admin-Anmeldung ist auf dem Server nicht korrekt konfiguriert. Bitte
          wende dich an die Betreiber — ein erneutes Laden der Seite behebt dies
          nicht.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-semibold">Etwas ist schiefgelaufen</h1>
      <p className="max-w-md text-muted-foreground text-sm">
        Auf dieser Seite ist ein unerwarteter Fehler aufgetreten.
      </p>
      <button
        type="button"
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
        onClick={() => reset()}
      >
        Erneut versuchen
      </button>
    </div>
  );
}
