import type { Metadata } from "next";

import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdminUser } from "@/lib/admin/require-admin-user";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminUser();

  return <AdminShell>{children}</AdminShell>;
}
