/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

import { consumeReviewVerification } from "@/lib/domains/verify/consume-review-verification";

describe("consumeReviewVerification", () => {
  const originalFetch = global.fetch;
  const originalBackendUrl = process.env.BACKEND_URL;

  beforeEach(() => {
    process.env.BACKEND_URL = "http://backend.internal:8080";
    vi.mocked(cookies).mockResolvedValue({
      toString: () => "admin_auth_token=should-not-be-sent",
      get: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.BACKEND_URL = originalBackendUrl;
    vi.restoreAllMocks();
  });

  it("POSTs the token to /review-requests/verify without cookies", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    const result = await consumeReviewVerification("tok-1");

    expect(result).toEqual({ kind: "success" });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(global.fetch).mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("http://backend.internal:8080/review-requests/verify");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ token: "tok-1" }));
    expect((init.headers as Headers).get("cookie")).toBeNull();
  });

  it("returns dead_link for already_used", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: "already_used", message: "used" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await expect(consumeReviewVerification("tok-1")).resolves.toEqual({ kind: "dead_link" });
  });

  it("returns failed when the backend is unreachable", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")) as typeof fetch;

    const result = await consumeReviewVerification("tok-1");
    expect(result.kind).toBe("failed");
  });
});
