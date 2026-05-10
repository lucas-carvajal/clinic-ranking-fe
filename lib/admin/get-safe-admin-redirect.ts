const ADMIN_PREFIX = "/admin";

/** Default landing after admin login — `/admin` itself redirects here (see protected `admin/page.tsx`). */
const DEFAULT_ADMIN_FALLBACK = "/admin/review-requests";

export function getSafeAdminRedirect(
  redirect: string | null | undefined,
  fallback = DEFAULT_ADMIN_FALLBACK,
): string {
  if (!redirect) {
    return fallback;
  }

  if (!redirect.startsWith("/")) {
    return fallback;
  }

  if (redirect.startsWith("//")) {
    return fallback;
  }

  if (!redirect.startsWith(ADMIN_PREFIX)) {
    return fallback;
  }

  const nextChar = redirect.charAt(ADMIN_PREFIX.length);
  if (nextChar && nextChar !== "/" && nextChar !== "?" && nextChar !== "#") {
    return fallback;
  }

  if (redirect === "/admin" || redirect === "/admin/") {
    return DEFAULT_ADMIN_FALLBACK;
  }

  return redirect;
}
