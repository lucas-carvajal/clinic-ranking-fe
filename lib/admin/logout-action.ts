"use server";

import { redirect } from "next/navigation";

import { clearAdminSession } from "@/lib/admin/clear-admin-session";

/** Ends the admin session locally and sends the user to login. No backend logout API. */
export async function adminLogoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
