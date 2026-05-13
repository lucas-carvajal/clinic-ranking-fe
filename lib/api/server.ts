import "server-only";

import { cookies } from "next/headers";
import { ZodType } from "zod";

import { ApiError, normalizeErrorFromResponse } from "@/lib/api/errors";
import { parseJsonResponseBody } from "@/lib/api/parse-json-response-body";

type ServerUnauthorizedHandler = (error: ApiError) => void;

export type ServerApiRequestOptions<TRequest, TResponse> = Omit<RequestInit, "body"> & {
  body?: TRequest;
  requestSchema?: ZodType<TRequest>;
  responseSchema?: ZodType<TResponse>;
  onUnauthorized?: ServerUnauthorizedHandler;
  /**
   * When `false`, do not attach inbound Next.js request cookies to the backend call.
   * Default `true`.
   */
  forwardCookies?: boolean;
};

let serverAdminUnauthorizedHandler: ServerUnauthorizedHandler | undefined;

/** Optional global handler for admin `401` responses (parity with `setAdminUnauthorizedHandler` on the browser client). */
export function setServerAdminUnauthorizedHandler(handler?: ServerUnauthorizedHandler) {
  serverAdminUnauthorizedHandler = handler;
}

function requireBackendUrl(): string {
  const url = process.env.BACKEND_URL?.trim();
  if (!url) {
    throw new Error(
      "BACKEND_URL is not configured. Set BACKEND_URL in the environment for server-side API calls to the Go backend.",
    );
  }
  return url;
}

function buildBackendUrl(path: string): URL {
  const base = requireBackendUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, base);
}

/**
 * Low-level GET to the Go backend returning the raw {@link Response}.
 * Forwards inbound Next.js cookies. Throws {@link ApiError} with `NETWORK_ERROR`
 * when `fetch` rejects. Does **not** throw on HTTP error status — inspect
 * `response.ok` / `response.status`.
 *
 * Used by admin auth to distinguish 401/403 (redirect) from 5xx (soft error).
 */
export async function serverBackendGet(
  path: string,
  init?: RequestInit & { forwardCookies?: boolean },
): Promise<Response> {
  const { forwardCookies = true, ...rest } = init ?? {};

  const requestHeaders = new Headers(rest.headers);
  if (!requestHeaders.has("accept")) {
    requestHeaders.set("accept", "application/json");
  }

  if (forwardCookies !== false) {
    const cookieStore = await cookies();
    requestHeaders.set("cookie", cookieStore.toString());
  }

  const targetUrl = buildBackendUrl(path);

  try {
    return await fetch(targetUrl, {
      ...rest,
      method: "GET",
      cache: rest.cache ?? "no-store",
      headers: requestHeaders,
    });
  } catch (error) {
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network error while calling API",
      details: error,
    });
  }
}

async function serverRequest<TRequest, TResponse>(
  method: string,
  path: string,
  options: ServerApiRequestOptions<TRequest, TResponse> = {},
): Promise<TResponse> {
  const {
    body,
    requestSchema,
    responseSchema,
    headers,
    onUnauthorized,
    forwardCookies = true,
    ...rest
  } = options;

  let requestBody: BodyInit | undefined;
  if (typeof body !== "undefined") {
    const parsedRequest = requestSchema ? requestSchema.parse(body) : body;
    requestBody = JSON.stringify(parsedRequest);
  }

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("accept")) {
    requestHeaders.set("accept", "application/json");
  }
  if (typeof requestBody !== "undefined") {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (forwardCookies !== false) {
    const cookieStore = await cookies();
    requestHeaders.set("cookie", cookieStore.toString());
  }

  const targetUrl = buildBackendUrl(path);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      ...rest,
      method,
      cache: rest.cache ?? "no-store",
      headers: requestHeaders,
      body: requestBody,
    });
  } catch (error) {
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network error while calling API",
      details: error,
    });
  }

  const parsedBody = await parseJsonResponseBody(response);

  if (!response.ok) {
    const apiError = new ApiError(normalizeErrorFromResponse(response, parsedBody));

    if (response.status === 401 && path.startsWith("/admin")) {
      onUnauthorized?.(apiError);
      serverAdminUnauthorizedHandler?.(apiError);
    }

    throw apiError;
  }

  if (!responseSchema) {
    return parsedBody as TResponse;
  }

  const parsed = responseSchema.safeParse(parsedBody);
  if (!parsed.success) {
    throw new ApiError({
      status: response.status,
      code: "SCHEMA_VALIDATION_ERROR",
      message: "API response does not match the expected schema",
      details: parsed.error.issues,
      correlationId:
        response.headers.get("x-correlation-id") ??
        response.headers.get("x-request-id") ??
        undefined,
    });
  }

  return parsed.data;
}

export function serverGet<TResponse>(
  path: string,
  options?: ServerApiRequestOptions<never, TResponse>,
): Promise<TResponse> {
  return serverRequest<never, TResponse>("GET", path, options);
}

export function serverPost<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  options?: ServerApiRequestOptions<TRequest, TResponse>,
): Promise<TResponse> {
  return serverRequest<TRequest, TResponse>("POST", path, { ...options, body });
}

export function serverPut<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  options?: ServerApiRequestOptions<TRequest, TResponse>,
): Promise<TResponse> {
  return serverRequest<TRequest, TResponse>("PUT", path, { ...options, body });
}

export function serverDel<TResponse>(
  path: string,
  options?: ServerApiRequestOptions<never, TResponse>,
): Promise<TResponse> {
  return serverRequest<never, TResponse>("DELETE", path, options);
}
