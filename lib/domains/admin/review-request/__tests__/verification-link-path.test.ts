import { describe, expect, it } from "vitest";

import { adminVerificationLinkPath } from "@/lib/domains/admin/review-request/verification-link-path";

describe("adminVerificationLinkPath", () => {
  it("uses the existing admin review-request prefix", () => {
    expect(adminVerificationLinkPath("550e8400-e29b-41d4-a716-446655440010")).toBe(
      "/admin/review-requests/550e8400-e29b-41d4-a716-446655440010/verification-link",
    );
  });
});
