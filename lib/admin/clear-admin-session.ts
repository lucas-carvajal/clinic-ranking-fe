import { cookies } from "next/headers";

import { getSessionCookieName } from "@/lib/admin/session-cookie-name";

/**
 * Clears the admin session cookie by issuing `Set-Cookie` (server-side only).
 * Use from Server Actions or Route Handlers — not from client JS.
 * Does not call a backend logout endpoint and does not touch localStorage.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const name = getSessionCookieName();
  cookieStore.set(name, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
