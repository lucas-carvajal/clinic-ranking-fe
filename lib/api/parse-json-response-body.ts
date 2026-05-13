import { ApiError } from "@/lib/api/errors";

/** Parse JSON from a fetch `Response`; empty body → `null`; invalid JSON → `ApiError`. */
export async function parseJsonResponseBody(response: Response): Promise<unknown> {
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
