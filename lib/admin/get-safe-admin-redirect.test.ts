import { describe, expect, it } from "vitest";

import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";

describe("getSafeAdminRedirect", () => {
  it("allows relative admin paths", () => {
    expect(getSafeAdminRedirect("/admin")).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("/admin/")).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("/admin/review-requests?page=2")).toBe(
      "/admin/review-requests?page=2",
    );
  });

  it("rejects unsafe redirect targets", () => {
    expect(getSafeAdminRedirect("https://evil.site")).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("//evil.site/admin")).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("/app/reviews")).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("/administrator")).toBe("/admin/review-requests");
  });

  it("uses fallback for empty values", () => {
    expect(getSafeAdminRedirect(null)).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect(undefined)).toBe("/admin/review-requests");
    expect(getSafeAdminRedirect("", "/admin/login")).toBe("/admin/login");
  });
});
