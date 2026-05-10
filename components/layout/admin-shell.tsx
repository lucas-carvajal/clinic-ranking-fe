import type { ReactNode } from "react";

import { AdminLogoutForm } from "@/components/layout/admin-logout-form";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background flex min-h-screen">
      <aside
        className="border-border bg-card shadow-sm flex min-h-screen w-64 shrink-0 flex-col border-r p-4"
        aria-label="Administration"
      >
        <AdminSidebar />
        <div className="border-border mt-auto border-t pt-4">
          <AdminLogoutForm />
        </div>
      </aside>
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
