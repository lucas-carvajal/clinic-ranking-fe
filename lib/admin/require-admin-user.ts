import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AdminAuthMisconfiguredError,
  BackendUnavailableError,
} from "@/lib/admin/auth-errors";
import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";
import { getSessionCookieName } from "@/lib/admin/session-cookie-name";
import { serverBackendGet } from "@/lib/api/server";
import { adminMeResponseSchema, type AdminMeResponse } from "@/lib/contracts/auth.schema";

export type AdminUser = AdminMeResponse;

const DEFAULT_ADMIN_REDIRECT = "/admin/review-requests";
const ADMIN_ME_PATH = "/admin/me";

function redirectToLogin(path: string): never {
  const loginUrl = new URL("/admin/login", "http://localhost");
  loginUrl.searchParams.set("redirect", getSafeAdminRedirect(path));
  return redirect(`${loginUrl.pathname}${loginUrl.search}`);
}

function toBackendUnavailable(cause?: unknown, status?: number): never {
  throw new BackendUnavailableError({
    status,
    cause,
  });
}

export async function requireAdminUser(
  redirectPath = DEFAULT_ADMIN_REDIRECT,
): Promise<AdminUser> {
  const cookieStore = await cookies();

  if (!cookieStore.get(getSessionCookieName())?.value) {
    return redirectToLogin(redirectPath);
  }

  if (!process.env.BACKEND_URL?.trim()) {
    throw new AdminAuthMisconfiguredError();
  }

  let response: Response;
  try {
    response = await serverBackendGet(ADMIN_ME_PATH);
  } catch (error) {
    toBackendUnavailable(error);
  }

  if (response.status === 401 || response.status === 403) {
    return redirectToLogin(redirectPath);
  }

  if (response.status >= 500) {
    toBackendUnavailable(undefined, response.status);
  }

  if (!response.ok) {
    toBackendUnavailable(undefined, response.status);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (cause) {
    toBackendUnavailable(cause);
  }

  const parsed = adminMeResponseSchema.safeParse(body);
  if (!parsed.success) {
    toBackendUnavailable(parsed.error);
  }

  return parsed.data;
}
