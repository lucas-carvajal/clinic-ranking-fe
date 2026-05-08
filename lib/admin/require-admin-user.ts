import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";
import { adminMeResponseSchema, type AdminMeResponse } from "@/lib/contracts/auth.schema";

export type AdminUser = AdminMeResponse;

const DEFAULT_ADMIN_REDIRECT = "/admin";
const ADMIN_ME_PATH = "/admin/me";

function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? "admin_auth_token";
}

function redirectToLogin(path: string): never {
  const loginUrl = new URL("/admin/login", "http://localhost");
  loginUrl.searchParams.set("redirect", getSafeAdminRedirect(path));
  return redirect(`${loginUrl.pathname}${loginUrl.search}`);
}

export async function requireAdminUser(
  redirectPath = DEFAULT_ADMIN_REDIRECT,
): Promise<AdminUser> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieStore.get(getSessionCookieName())?.value) {
    return redirectToLogin(redirectPath);
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return redirectToLogin(redirectPath);
  }

  let response: Response;
  try {
    response = await fetch(new URL(ADMIN_ME_PATH, backendUrl), {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    return redirectToLogin(redirectPath);
  }

  if (!response.ok) {
    return redirectToLogin(redirectPath);
  }

  try {
    return adminMeResponseSchema.parse(await response.json());
  } catch {
    return redirectToLogin(redirectPath);
  }
}
