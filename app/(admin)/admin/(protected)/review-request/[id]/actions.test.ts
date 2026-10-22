/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/admin/require-admin-user", () => ({
  requireAdminUser: vi.fn(),
}));

import { cookies } from "next/headers";

import { requireAdminUser } from "@/lib/admin/require-admin-user";

import { runReviewRequestModerationAction } from "./actions";

const REQUEST_ID = "550e8400-e29b-41d4-a716-446655440010";

function formData(id: string, intent: string): FormData {
  const data = new FormData();
  data.set("id", id);
  data.set("intent", intent);
  return data;
}

describe("runReviewRequestModerationAction", () => {
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

  it("does not call the backend when the admin session check rejects", async () => {
    vi.mocked(requireAdminUser).mockRejectedValue(new Error("REDIRECT:/admin/login"));
    global.fetch = vi.fn() as typeof fetch;

    await expect(
      runReviewRequestModerationAction(undefined, formData(REQUEST_ID, "approve")),
    ).rejects.toThrow(/REDIRECT:/);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
