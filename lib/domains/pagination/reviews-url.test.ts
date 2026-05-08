import { describe, expect, it } from "vitest";

import {
  isReviewsCursorLikelyValid,
  parseReviewsUrlParams,
  serializeReviewsUrlParams,
  withResetCursorOnFilterChange,
} from "@/lib/domains/pagination/reviews-url";

describe("reviews url helpers", () => {
  it("parses and serializes filters and cursor", () => {
    const sp = new URLSearchParams({
      state: "Bayern",
      city: "Muenchen",
      cursor: "abc12345==",
    });

    const parsed = parseReviewsUrlParams(sp);
    expect(parsed).toEqual({ state: "Bayern", city: "Muenchen", cursor: "abc12345==" });

    const serialized = serializeReviewsUrlParams(parsed);
    expect(serialized.get("state")).toBe("Bayern");
    expect(serialized.get("cursor")).toBe("abc12345==");
  });

  it("resets cursor on filter change", () => {
    const prev = { state: "Bayern", cursor: "c1" };
    const next = { state: "Berlin", cursor: "c2" };
    expect(withResetCursorOnFilterChange(prev, next)).toEqual({ state: "Berlin" });
  });

  it("does not reset cursor if filters unchanged", () => {
    const prev = { state: "Bayern", cursor: "c1" };
    const next = { state: "Bayern", cursor: "c2" };
    expect(withResetCursorOnFilterChange(prev, next)).toEqual(next);
  });

  it("sanity-checks cursors", () => {
    expect(isReviewsCursorLikelyValid("MjAyNi0wNS0wN1Qx...")).toBe(false);
    expect(isReviewsCursorLikelyValid("MjAyNi0wNS0wN1Qx")).toBe(true);
  });
});

