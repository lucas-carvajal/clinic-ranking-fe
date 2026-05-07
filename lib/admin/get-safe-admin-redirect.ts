const ADMIN_ROOT = "/admin";

export function getSafeAdminRedirect(
  redirect: string | null | undefined,
  fallback = ADMIN_ROOT,
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

  if (!redirect.startsWith(ADMIN_ROOT)) {
    return fallback;
  }

  const nextChar = redirect.charAt(ADMIN_ROOT.length);
  if (nextChar && nextChar !== "/" && nextChar !== "?" && nextChar !== "#") {
    return fallback;
  }

  return redirect;
}
