import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminAuthMisconfiguredError, BackendUnavailableError } from "@/lib/admin/auth-errors";
import { requireAdminUser } from "@/lib/admin/require-admin-user";

const { redirectMock, serverBackendGetMock, cookiesMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    const err = new Error(`REDIRECT:${url}`);
    throw err;
  }),
  serverBackendGetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/api/server", () => ({
  serverBackendGet: serverBackendGetMock,
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

/** Session cookie is preserved on transient paths: this module must not pull in logout/clear. */
it("module does not import session-clearing helpers", () => {
  const sourcePath = join(process.cwd(), "lib/admin/require-admin-user.ts");
  const source = readFileSync(sourcePath, "utf8");
  expect(source).not.toMatch(/clear-admin-session|clearAdminSession/);
});

describe("requireAdminUser", () => {
  const sessionName = "admin_session";

  beforeEach(() => {
    process.env.BACKEND_URL = "http://backend.test";
    process.env.SESSION_COOKIE_NAME = sessionName;
    redirectMock.mockClear();
    serverBackendGetMock.mockReset();
    cookiesMock.mockReset();
    cookiesMock.mockResolvedValue({
      get: (name: string) =>
        name === sessionName ? { name: sessionName, value: "abc" } : undefined,
      toString: () => `${sessionName}=abc`,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects to login when session cookie is absent", async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
      toString: () => "",
    });

    await expect(requireAdminUser("/admin/foo")).rejects.toThrow(/REDIRECT:/);
    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining("/admin/login?redirect=%2Fadmin%2Ffoo"),
    );
    expect(serverBackendGetMock).not.toHaveBeenCalled();
  });

  it("401 redirects to /admin/login with safe redirect query", async () => {
    serverBackendGetMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "nope" }), { status: 401 }),
    );

    await expect(requireAdminUser("/admin/review-requests")).rejects.toThrow(/REDIRECT:/);
    expect(redirectMock).toHaveBeenCalledWith(
      "/admin/login?redirect=%2Fadmin%2Freview-requests",
    );
  });

  it("403 redirects to /admin/login", async () => {
    serverBackendGetMock.mockResolvedValue(new Response(null, { status: 403 }));

    await expect(requireAdminUser()).rejects.toThrow(/REDIRECT:/);
    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringMatching(/^\/admin\/login\?redirect=/),
    );
  });

  it.each([500, 502, 503, 504] as const)("status %s throws BackendUnavailableError", async (status) => {
    serverBackendGetMock.mockResolvedValue(new Response("err", { status }));

    await expect(requireAdminUser()).rejects.toMatchObject({
      kind: "BACKEND_UNAVAILABLE",
      status,
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("network failure from serverBackendGet throws BackendUnavailableError", async () => {
    serverBackendGetMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(requireAdminUser()).rejects.toBeInstanceOf(BackendUnavailableError);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("invalid JSON on 200 throws BackendUnavailableError", async () => {
    serverBackendGetMock.mockResolvedValue(
      new Response("not-json", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(requireAdminUser()).rejects.toBeInstanceOf(BackendUnavailableError);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("200 body failing adminMeResponseSchema throws BackendUnavailableError", async () => {
    serverBackendGetMock.mockResolvedValue(
      new Response(JSON.stringify({ loggedIn: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(requireAdminUser()).rejects.toMatchObject({
      kind: "BACKEND_UNAVAILABLE",
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("missing BACKEND_URL throws AdminAuthMisconfiguredError (no login redirect)", async () => {
    delete process.env.BACKEND_URL;

    await expect(requireAdminUser()).rejects.toBeInstanceOf(AdminAuthMisconfiguredError);
    expect(serverBackendGetMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("returns parsed admin user on 200 success", async () => {
    serverBackendGetMock.mockResolvedValue(
      new Response(
        JSON.stringify({ loggedIn: true, username: "admin" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(requireAdminUser()).resolves.toEqual({
      loggedIn: true,
      username: "admin",
    });
  });
});
