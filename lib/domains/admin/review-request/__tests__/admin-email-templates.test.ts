import { describe, expect, it } from "vitest";

import { verificationEmailContent } from "@/lib/domains/admin/review-request/admin-email-templates";

describe("verificationEmailContent", () => {
  it("includes the generated verify URL when present", () => {
    const body = verificationEmailContent({
      hospital: "Klinikum A",
      city: "München",
      email: "doc@klinikuma.de",
      verificationUrl: "https://example.com/verify?token=abc",
    });

    expect(body).toContain("https://example.com/verify?token=abc");
    expect(body).toContain("Bitte öffne diesen Link, um dein Postfach zu bestätigen:");
  });
});
