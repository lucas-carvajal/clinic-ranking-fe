import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdminUser } from "@/lib/admin/require-admin-user";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminUser("/admin");

  return <AdminShell>{children}</AdminShell>;
}
