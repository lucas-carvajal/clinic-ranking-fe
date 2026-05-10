import type { Metadata } from "next";
import { Suspense } from "react";

import { CenteredSpinner } from "@/components/ui/spinner";

import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Anmeldung für den Administrationsbereich.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="bg-background text-foreground flex min-h-[calc(100vh-4rem)] justify-center px-4 py-12 md:px-6">
      <div className="w-full max-w-md">
        <h1 className="app-page-heading mb-2">Admin-Anmeldung</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Melde dich mit deinen Zugangsdaten an.
        </p>

        <div className="border-border bg-card rounded-xl border p-6 shadow-sm md:p-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <CenteredSpinner label="Lade Anmeldung…" />
              </div>
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
