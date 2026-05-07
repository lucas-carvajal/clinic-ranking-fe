import { ZodType } from "zod";

import { ApiError, normalizeErrorFromResponse } from "@/lib/api/errors";

type UnauthorizedHandler = (error: ApiError) => void;

type ApiRequestOptions<TRequest, TResponse> = Omit<RequestInit, "body"> & {
  body?: TRequest;
  requestSchema?: ZodType<TRequest>;
  responseSchema?: ZodType<TResponse>;
  onUnauthorized?: UnauthorizedHandler;
};

let adminUnauthorizedHandler: UnauthorizedHandler | undefined;

export function setAdminUnauthorizedHandler(handler?: UnauthorizedHandler) {
  adminUnauthorizedHandler = handler;
}

function buildProxyPath(path: string): string {
  return `/api/proxy${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError({
      status: response.status || 500,
      code: "INVALID_JSON",
      message: "Invalid JSON received from API",
      details: text,
      correlationId:
        response.headers.get("x-correlation-id") ??
        response.headers.get("x-request-id") ??
        undefined,
    });
  }
}

async function request<TRequest, TResponse>(
  method: string,
  path: string,
  options: ApiRequestOptions<TRequest, TResponse> = {},
): Promise<TResponse> {
  const {
    body,
    requestSchema,
    responseSchema,
    headers,
    onUnauthorized,
    ...rest
  } = options;

  let requestBody: BodyInit | undefined;
  if (typeof body !== "undefined") {
    const parsedRequest = requestSchema ? requestSchema.parse(body) : body;
    requestBody = JSON.stringify(parsedRequest);
  }

  let response: Response;
  try {
    response = await fetch(buildProxyPath(path), {
      ...rest,
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
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

  const parsedBody = await parseResponseBody(response);

  if (!response.ok) {
    const apiError = new ApiError(normalizeErrorFromResponse(response, parsedBody));

    if (response.status === 401 && path.startsWith("/admin")) {
      onUnauthorized?.(apiError);
      adminUnauthorizedHandler?.(apiError);
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

export function get<TResponse>(
  path: string,
  options?: ApiRequestOptions<never, TResponse>,
): Promise<TResponse> {
  return request<never, TResponse>("GET", path, options);
}

export function post<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  options?: ApiRequestOptions<TRequest, TResponse>,
): Promise<TResponse> {
  return request<TRequest, TResponse>("POST", path, { ...options, body });
}

export function put<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  options?: ApiRequestOptions<TRequest, TResponse>,
): Promise<TResponse> {
  return request<TRequest, TResponse>("PUT", path, { ...options, body });
}

export function del<TResponse>(
  path: string,
  options?: ApiRequestOptions<never, TResponse>,
): Promise<TResponse> {
  return request<never, TResponse>("DELETE", path, options);
}
