import type { ReactNode } from "react";

import { AdminLogoutForm } from "@/components/layout/admin-logout-form";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar footer={<AdminLogoutForm />} />
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
