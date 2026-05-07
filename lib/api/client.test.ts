import { z } from "zod";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { get, setAdminUnauthorizedHandler } from "@/lib/api/client";

const originalFetch = global.fetch;

describe("api client", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    setAdminUnauthorizedHandler(undefined);
    vi.restoreAllMocks();
  });

  it("parses response using supplied schema", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ value: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    const response = await get("/types/states", {
      responseSchema: z.object({ value: z.string() }),
    });

    expect(response.value).toBe("ok");
  });

  it("throws normalized schema validation errors", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ value: 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json", "x-request-id": "req-9" },
      }),
    ) as typeof fetch;

    await expect(
      get("/types/states", {
        responseSchema: z.object({ value: z.string() }),
      }),
    ).rejects.toMatchObject({
      normalized: {
        code: "SCHEMA_VALIDATION_ERROR",
        status: 200,
        correlationId: "req-9",
      },
    });
  });

  it("calls admin unauthorized handler on admin 401", async () => {
    const handler = vi.fn();
    setAdminUnauthorizedHandler(handler);

    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await expect(get("/admin/me")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
