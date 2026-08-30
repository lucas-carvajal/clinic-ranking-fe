import { describe, expect, it } from "vitest";

import { parseVerifyTokenParam } from "@/lib/domains/verify/parse-verify-token";

describe("parseVerifyTokenParam", () => {
  it("returns a trimmed token", () => {
    expect(parseVerifyTokenParam("  abc  ")).toBe("abc");
  });

  it("uses the first value from an array", () => {
    expect(parseVerifyTokenParam(["one", "two"])).toBe("one");
  });

  it("returns undefined for missing or blank values", () => {
    expect(parseVerifyTokenParam(undefined)).toBeUndefined();
    expect(parseVerifyTokenParam("")).toBeUndefined();
    expect(parseVerifyTokenParam("   ")).toBeUndefined();
    expect(parseVerifyTokenParam([])).toBeUndefined();
  });
});
