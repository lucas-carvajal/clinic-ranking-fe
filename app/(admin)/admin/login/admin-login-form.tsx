"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";
import { cn } from "@/lib/utils";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const redirectTarget = getSafeAdminRedirect(searchParams.get("redirect"));

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);
      setPending(true);
      const form = e.currentTarget;
      const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim();
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;
      if (!username || !password) {
        setFormError("Bitte Benutzername und Passwort eingeben.");
        setPending(false);
        return;
      }

      try {
        const response = await fetch("/api/proxy/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          router.push(redirectTarget);
          router.refresh();
          return;
        }

        let message = "Anmeldung fehlgeschlagen. Prüfe Benutzername und Passwort.";
        try {
          const data: unknown = await response.json();
          if (typeof data === "object" && data !== null) {
            const o = data as Record<string, unknown>;
            if (typeof o.message === "string" && o.message.trim()) {
              message = o.message;
            } else if (typeof o.error === "string" && o.error.trim()) {
              message = o.error;
            }
          }
        } catch {
          /* use default */
        }
        setFormError(message);
      } catch {
        setFormError(
          "Verbindungsproblem. Prüfe deine Netzwerkverbindung und versuch es gleich noch einmal.",
        );
      } finally {
        setPending(false);
      }
    },
    [redirectTarget, router],
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {formError ? (
        <div
          className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm leading-relaxed"
          role="alert"
        >
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="admin-username">Benutzername</Label>
        <Input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          disabled={pending}
          className={cn("bg-surface-lifted border-border shadow-sm")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Passwort</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className={cn("bg-surface-lifted border-border shadow-sm")}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="h-auto min-h-11 w-full px-6 py-3 text-base font-medium md:text-lg"
      >
        {pending ? "Wird angemeldet…" : "Anmelden"}
      </Button>
    </form>
  );
}
