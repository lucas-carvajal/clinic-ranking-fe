import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";
import { getSessionCookieName } from "@/lib/admin/session-cookie-name";
import { serverGet } from "@/lib/api/server";
import { adminMeResponseSchema, type AdminMeResponse } from "@/lib/contracts/auth.schema";

export type AdminUser = AdminMeResponse;

const DEFAULT_ADMIN_REDIRECT = "/admin/review-requests";
const ADMIN_ME_PATH = "/admin/me";

function redirectToLogin(path: string): never {
  const loginUrl = new URL("/admin/login", "http://localhost");
  loginUrl.searchParams.set("redirect", getSafeAdminRedirect(path));
  return redirect(`${loginUrl.pathname}${loginUrl.search}`);
}

export async function requireAdminUser(
  redirectPath = DEFAULT_ADMIN_REDIRECT,
): Promise<AdminUser> {
  const cookieStore = await cookies();

  if (!cookieStore.get(getSessionCookieName())?.value) {
    return redirectToLogin(redirectPath);
  }

  try {
    return await serverGet(ADMIN_ME_PATH, {
      responseSchema: adminMeResponseSchema,
    });
  } catch {
    return redirectToLogin(redirectPath);
  }
}
