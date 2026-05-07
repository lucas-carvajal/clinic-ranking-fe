import { NextRequest, NextResponse } from "next/server";

import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";

const ADMIN_LOGIN_PATH = "/admin/login";

function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? "session";
}

function buildLoginRedirect(request: NextRequest): URL {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("redirect", getSafeAdminRedirect(requestedPath));
  return loginUrl;
}

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return false;
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return false;
  }

  try {
    const response = await fetch(new URL("/admin/me", backendUrl), {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(getSessionCookieName())?.value?.trim();

  if (pathname === ADMIN_LOGIN_PATH) {
    if (!sessionCookie) {
      return NextResponse.next();
    }

    if (await hasValidAdminSession(request)) {
      const redirectTarget = getSafeAdminRedirect(
        request.nextUrl.searchParams.get("redirect"),
      );
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }

    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
