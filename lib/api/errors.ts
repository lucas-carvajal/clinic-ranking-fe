export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "INVALID_JSON"
  | "SCHEMA_VALIDATION_ERROR"
  | "PROXY_ERROR"
  | "BACKEND_ERROR"
  | "UNKNOWN_ERROR";

export type NormalizedApiError = {
  status: number;
  code: ApiErrorCode | string;
  message: string;
  details?: unknown;
  correlationId?: string;
};

export class ApiError extends Error {
  readonly normalized: NormalizedApiError;

  constructor(normalized: NormalizedApiError) {
    super(normalized.message);
    this.name = "ApiError";
    this.normalized = normalized;
  }
}

type ErrorBody = {
  code?: string;
  message?: string;
  error?: string;
  details?: unknown;
  correlationId?: string;
  requestId?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toErrorBody(value: unknown): ErrorBody {
  if (!isObject(value)) {
    return {};
  }

  return value as ErrorBody;
}

function correlationFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-correlation-id") ??
    headers.get("x-request-id") ??
    headers.get("trace-id") ??
    undefined
  );
}

export function mapToUiError(error: unknown): NormalizedApiError {
  if (error instanceof ApiError) {
    return error.normalized;
  }

  if (error instanceof Error) {
    return {
      status: 0,
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message: "Unexpected error",
    details: error,
  };
}

export function normalizeErrorFromResponse(
  response: Response,
  parsedBody?: unknown,
): NormalizedApiError {
  const body = toErrorBody(parsedBody);
  const message =
    body.message ??
    body.error ??
    `Request failed with status ${response.status}`;

  const status = response.status;
  const code = body.code ?? (status >= 500 ? "BACKEND_ERROR" : "PROXY_ERROR");
  const correlationId =
    body.correlationId ??
    body.requestId ??
    correlationFromHeaders(response.headers);

  return {
    status,
    code,
    message,
    details: body.details ?? parsedBody,
    correlationId,
  };
}
