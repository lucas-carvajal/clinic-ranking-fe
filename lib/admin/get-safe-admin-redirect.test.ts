import { describe, expect, it } from "vitest";

import { getSafeAdminRedirect } from "@/lib/admin/get-safe-admin-redirect";

describe("getSafeAdminRedirect", () => {
  it("allows relative admin paths", () => {
    expect(getSafeAdminRedirect("/admin")).toBe("/admin");
    expect(getSafeAdminRedirect("/admin/review-requests?page=2")).toBe(
      "/admin/review-requests?page=2",
    );
  });

  it("rejects unsafe redirect targets", () => {
    expect(getSafeAdminRedirect("https://evil.site")).toBe("/admin");
    expect(getSafeAdminRedirect("//evil.site/admin")).toBe("/admin");
    expect(getSafeAdminRedirect("/app/reviews")).toBe("/admin");
    expect(getSafeAdminRedirect("/administrator")).toBe("/admin");
  });

  it("uses fallback for empty values", () => {
    expect(getSafeAdminRedirect(null)).toBe("/admin");
    expect(getSafeAdminRedirect(undefined)).toBe("/admin");
    expect(getSafeAdminRedirect("", "/admin/login")).toBe("/admin/login");
  });
});
