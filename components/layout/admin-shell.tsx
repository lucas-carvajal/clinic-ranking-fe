import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar />
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
