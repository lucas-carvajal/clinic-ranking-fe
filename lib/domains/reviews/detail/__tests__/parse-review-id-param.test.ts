import { describe, expect, it } from "vitest";

import { parsePublicReviewIdParam } from "@/lib/domains/reviews/detail/parse-review-id-param";

describe("parsePublicReviewIdParam", () => {
  it("accepts list-style UUIDs", () => {
    expect(
      parsePublicReviewIdParam("62db672b-d95a-4eeb-97f1-a97935095622"),
    ).toBe("62db672b-d95a-4eeb-97f1-a97935095622");
  });

  it("trims whitespace", () => {
    expect(
      parsePublicReviewIdParam(
        "  62db672b-d95a-4eeb-97f1-a97935095622  ",
      ),
    ).toBe("62db672b-d95a-4eeb-97f1-a97935095622");
  });

  it("rejects non-UUID paths", () => {
    expect(parsePublicReviewIdParam("undefined")).toBeUndefined();
    expect(parsePublicReviewIdParam("")).toBeUndefined();
    expect(parsePublicReviewIdParam("62db672b")).toBeUndefined();
  });
});
