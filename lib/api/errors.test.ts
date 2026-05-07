import { describe, expect, it } from "vitest";

import {
  ApiError,
  mapToUiError,
  normalizeErrorFromResponse,
} from "@/lib/api/errors";

describe("normalizeErrorFromResponse", () => {
  it("maps backend errors with envelope fields", () => {
    const response = new Response(null, {
      status: 422,
      headers: {
        "x-request-id": "req-123",
      },
    });

    const normalized = normalizeErrorFromResponse(response, {
      code: "VALIDATION_FAILED",
      message: "Validation failed",
      details: { field: "email" },
    });

    expect(normalized).toEqual({
      status: 422,
      code: "VALIDATION_FAILED",
      message: "Validation failed",
      details: { field: "email" },
      correlationId: "req-123",
    });
  });

  it("falls back to proxy/backend defaults and response status", () => {
    const response = new Response(null, { status: 503 });
    const normalized = normalizeErrorFromResponse(response, "upstream timeout");

    expect(normalized.status).toBe(503);
    expect(normalized.code).toBe("BACKEND_ERROR");
    expect(normalized.message).toContain("503");
  });
});

describe("mapToUiError", () => {
  it("returns normalized shape for ApiError", () => {
    const normalized = {
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      details: { reason: "expired" },
    };
    const mapped = mapToUiError(new ApiError(normalized));

    expect(mapped).toEqual(normalized);
  });

  it("maps unknown errors into consistent envelope", () => {
    const mapped = mapToUiError(new Error("boom"));

    expect(mapped).toEqual({
      status: 0,
      code: "UNKNOWN_ERROR",
      message: "boom",
    });
  });
});
