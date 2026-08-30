import { describe, expect, it } from "vitest";

import {
  consumeVerificationErrorCodeSchema,
  consumeVerificationRequestSchema,
  verificationLinkResponseSchema,
} from "@/lib/contracts/verify.schema";

describe("verify contracts", () => {
  it("parses a consume request", () => {
    expect(consumeVerificationRequestSchema.parse({ token: "abc" }).token).toBe("abc");
  });

  it("rejects an empty token", () => {
    expect(consumeVerificationRequestSchema.safeParse({ token: "" }).success).toBe(false);
  });

  it("parses known consume error codes", () => {
    expect(consumeVerificationErrorCodeSchema.parse("invalid")).toBe("invalid");
    expect(consumeVerificationErrorCodeSchema.parse("expired")).toBe("expired");
    expect(consumeVerificationErrorCodeSchema.parse("already_used")).toBe("already_used");
    expect(consumeVerificationErrorCodeSchema.parse("wrong_status")).toBe("wrong_status");
  });

  it("rejects unknown consume error codes", () => {
    expect(consumeVerificationErrorCodeSchema.safeParse("nope").success).toBe(false);
  });

  it("parses a generated verification URL", () => {
    expect(
      verificationLinkResponseSchema.parse({ url: "https://example.com/verify?token=x" }).url,
    ).toBe("https://example.com/verify?token=x");
  });
});
