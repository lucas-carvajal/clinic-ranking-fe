/**
 * Cookie name for the backend-issued admin session. Must match `Set-Cookie` from login.
 * @see docs/admin-auth.md
 */
export function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? "admin_auth_token";
}
