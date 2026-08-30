import { describe, expect, it } from "vitest";

import { isEmailInboxConfirmed } from "@/lib/domains/admin/review-request/is-email-inbox-confirmed";

describe("isEmailInboxConfirmed", () => {
  it("is true after the inbox was confirmed", () => {
    expect(isEmailInboxConfirmed("EMAIL_VERIFIED")).toBe(true);
    expect(isEmailInboxConfirmed("AFFILIATION_VERIFIED")).toBe(true);
    expect(isEmailInboxConfirmed("APPROVED")).toBe(true);
    expect(isEmailInboxConfirmed("PUBLISHED")).toBe(true);
  });

  it("is false before they click or after reject", () => {
    expect(isEmailInboxConfirmed("SUBMITTED")).toBe(false);
    expect(isEmailInboxConfirmed("REJECTED")).toBe(false);
  });
});
