export const BACKEND_UNAVAILABLE_KIND = "BACKEND_UNAVAILABLE" as const;
export const ADMIN_AUTH_MISCONFIGURED_KIND = "ADMIN_AUTH_MISCONFIGURED" as const;

export type BackendUnavailableKind = typeof BACKEND_UNAVAILABLE_KIND;
export type AdminAuthMisconfiguredKind = typeof ADMIN_AUTH_MISCONFIGURED_KIND;

export class BackendUnavailableError extends Error {
  readonly kind = BACKEND_UNAVAILABLE_KIND;
  readonly status?: number;

  constructor(options?: { message?: string; status?: number; cause?: unknown }) {
    super(options?.message ?? "Backend unavailable", { cause: options?.cause });
    this.name = "BackendUnavailableError";
    this.status = options?.status;
  }
}

export class AdminAuthMisconfiguredError extends Error {
  readonly kind = ADMIN_AUTH_MISCONFIGURED_KIND;

  constructor(message = "Admin authentication is misconfigured (BACKEND_URL missing)") {
    super(message);
    this.name = "AdminAuthMisconfiguredError";
  }
}

export function isBackendUnavailableError(
  error: unknown,
): error is BackendUnavailableError {
  return (
    error instanceof BackendUnavailableError ||
    (typeof error === "object" &&
      error !== null &&
      (error as { kind?: unknown }).kind === BACKEND_UNAVAILABLE_KIND)
  );
}

export function isAdminAuthMisconfiguredError(
  error: unknown,
): error is AdminAuthMisconfiguredError {
  return (
    error instanceof AdminAuthMisconfiguredError ||
    (typeof error === "object" &&
      error !== null &&
      (error as { kind?: unknown }).kind === ADMIN_AUTH_MISCONFIGURED_KIND)
  );
}
