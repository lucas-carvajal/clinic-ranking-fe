import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { consumeVerificationResultFromError } from "@/lib/domains/verify/consume-result";

describe("consumeVerificationResultFromError", () => {
  it.each(["invalid", "expired", "already_used", "wrong_status"] as const)(
    "maps %s to dead_link",
    (code) => {
      expect(
        consumeVerificationResultFromError(
          new ApiError({ status: 400, code, message: "nope" }),
        ),
      ).toEqual({ kind: "dead_link" });
    },
  );

  it("maps a code in the error message field to dead_link", () => {
    expect(
      consumeVerificationResultFromError(
        new ApiError({ status: 400, code: "PROXY_ERROR", message: "expired" }),
      ),
    ).toEqual({ kind: "dead_link" });
  });

  it("maps other API errors to failed without inventing success", () => {
    expect(
      consumeVerificationResultFromError(
        new ApiError({ status: 502, code: "BACKEND_ERROR", message: "upstream down" }),
      ),
    ).toEqual({ kind: "failed", message: "upstream down" });
  });

  it("maps unknown errors to failed", () => {
    expect(consumeVerificationResultFromError(new Error("boom"))).toEqual({
      kind: "failed",
      message: "boom",
    });
  });
});
