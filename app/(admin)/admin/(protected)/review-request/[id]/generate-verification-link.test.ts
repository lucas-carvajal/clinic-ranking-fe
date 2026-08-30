/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/admin/require-admin-user", () => ({
  requireAdminUser: vi.fn(),
}));

import { cookies } from "next/headers";

import { requireAdminUser } from "@/lib/admin/require-admin-user";

import { generateReviewRequestVerificationLink } from "./generate-verification-link";

const REQUEST_ID = "550e8400-e29b-41d4-a716-446655440010";

describe("generateReviewRequestVerificationLink", () => {
  const originalFetch = global.fetch;
  const originalBackendUrl = process.env.BACKEND_URL;

  beforeEach(() => {
    process.env.BACKEND_URL = "http://backend.internal:8080";
    vi.mocked(requireAdminUser).mockResolvedValue({
      loggedIn: true,
      username: "admin",
    });
    vi.mocked(cookies).mockResolvedValue({
      toString: () => "admin_auth_token=session",
      get: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.BACKEND_URL = originalBackendUrl;
    vi.restoreAllMocks();
  });

  it("POSTs to the admin verification-link path and returns the url", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ url: "https://example.com/verify?token=x" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    const result = await generateReviewRequestVerificationLink(REQUEST_ID);

    expect(result).toEqual({ kind: "ok", url: "https://example.com/verify?token=x" });
    const [url, init] = vi.mocked(global.fetch).mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe(
      `http://backend.internal:8080/admin/review-requests/${REQUEST_ID}/verification-link`,
    );
    expect(init.method).toBe("POST");
    expect((init.headers as Headers).get("cookie")).toContain("admin_auth_token=session");
  });

  it("returns a real error when the backend fails", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: "wrong_status", message: "not submitted" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;

    await expect(generateReviewRequestVerificationLink(REQUEST_ID)).resolves.toEqual({
      kind: "error",
      message: "not submitted",
    });
  });

  it("rejects a non-uuid id without calling the backend", async () => {
    global.fetch = vi.fn() as typeof fetch;
    await expect(generateReviewRequestVerificationLink("nope")).resolves.toEqual({
      kind: "error",
      message: "Ungültige Anfrage.",
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
