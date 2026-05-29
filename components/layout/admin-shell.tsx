import type { ReactNode } from "react";
import Link from "next/link";

import { AdminHeaderNav } from "@/components/layout/admin-header-nav";
import { AdminLogoutForm } from "@/components/layout/admin-logout-form";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border bg-card border-b shadow-sm">
        <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/review-requests"
              className="text-foreground hover:text-brand-red text-xl font-bold transition-colors"
            >
              Admin
            </Link>
            <AdminHeaderNav />
          </div>
          <AdminLogoutForm />
        </div>
      </header>
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
