import { z } from "zod";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

import { ApiError } from "@/lib/api/errors";
import { serverGet, setServerAdminUnauthorizedHandler } from "@/lib/api/server";
import { adminMeResponseSchema } from "@/lib/contracts/auth.schema";

describe("server API helpers", () => {
  const originalFetch = global.fetch;
  const originalBackendUrl = process.env.BACKEND_URL;

  beforeEach(() => {
    process.env.BACKEND_URL = "http://localhost:8080";
    setServerAdminUnauthorizedHandler(undefined);
    vi.mocked(cookies).mockResolvedValue({
      toString: () => "admin_auth_token=session-token",
      get: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.BACKEND_URL = originalBackendUrl;
    vi.clearAllMocks();
  });

  it("forwards cookies from cookies() as cookie header on fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ loggedIn: true, username: "admin" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    const data = await serverGet("/admin/me", {
      responseSchema: adminMeResponseSchema,
    });

    expect(data.username).toBe("admin");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [URL, RequestInit];
    expect(init.cache).toBe("no-store");
    const headers = init.headers as Headers;
    expect(headers.get("cookie")).toBe("admin_auth_token=session-token");
  });

  it("does not forward cookies when forwardCookies is false", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await serverGet("/public/ping", {
      forwardCookies: false,
      responseSchema: z.object({ ok: z.literal(true) }),
    });

    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [URL, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get("cookie")).toBeNull();
  });

  it("throws a clear error when BACKEND_URL is missing", async () => {
    delete process.env.BACKEND_URL;
    await expect(serverGet("/admin/me")).rejects.toThrow(/BACKEND_URL is not configured/);
  });

  it("defaults cache to no-store and allows override", async () => {
    const okBody = { loggedIn: true, username: "admin" };
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(okBody), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(okBody), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ) as typeof fetch;

    await serverGet("/admin/me", { responseSchema: adminMeResponseSchema });
    expect(vi.mocked(global.fetch).mock.calls[0][1]).toMatchObject({ cache: "no-store" });

    await serverGet("/admin/me", {
      cache: "force-cache",
      responseSchema: adminMeResponseSchema,
    });
    expect(vi.mocked(global.fetch).mock.calls[1][1]).toMatchObject({ cache: "force-cache" });
  });

  it("throws ApiError with normalized fields on non-2xx", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "nope" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await expect(serverGet("/admin/me")).rejects.toMatchObject({
      normalized: expect.objectContaining({
        status: 400,
        message: "nope",
      }),
    });
  });

  it("throws SCHEMA_VALIDATION_ERROR when response schema fails", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ wrong: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", "x-request-id": "r1" },
      }),
    ) as typeof fetch;

    await expect(
      serverGet("/admin/me", {
        responseSchema: adminMeResponseSchema,
      }),
    ).rejects.toMatchObject({
      normalized: {
        code: "SCHEMA_VALIDATION_ERROR",
        status: 200,
        correlationId: "r1",
      },
    });
  });

  it("invokes server admin unauthorized handler on admin 401", async () => {
    const handler = vi.fn();
    setServerAdminUnauthorizedHandler(handler);

    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await expect(serverGet("/admin/me")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
