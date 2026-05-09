import { describe, expect, it } from "vitest";

import {
  initialReviewsPagerState,
  reviewsPagerReducer,
} from "@/lib/domains/reviews/pager/reviews-pager-reducer";

describe("reviewsPagerReducer", () => {
  it("RESET initializes filtersKey", () => {
    const next = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    expect(next.filtersKey).toBe("key-A");
    expect(next.cursors).toEqual([null]);
  });

  it("RESET to same key with no cursors is a no-op (same reference)", () => {
    const a = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const b = reviewsPagerReducer(a, { type: "RESET", filtersKey: "key-A" });
    expect(b).toBe(a);
  });

  it("RESET to a new filtersKey clears cursors", () => {
    const a = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const withCursor = reviewsPagerReducer(a, {
      type: "SET_CURSOR_AT",
      pageIndex: 1,
      cursor: "abc",
    });
    expect(withCursor.cursors).toEqual([null, "abc"]);

    const reset = reviewsPagerReducer(withCursor, {
      type: "RESET",
      filtersKey: "key-B",
    });
    expect(reset.cursors).toEqual([null]);
    expect(reset.filtersKey).toBe("key-B");
  });

  it("SET_CURSOR_AT appends cursor for next page", () => {
    const initialized = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const next = reviewsPagerReducer(initialized, {
      type: "SET_CURSOR_AT",
      pageIndex: 1,
      cursor: "abc",
    });
    expect(next.cursors).toEqual([null, "abc"]);
  });

  it("SET_CURSOR_AT with same cursor is a no-op", () => {
    const a = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const b = reviewsPagerReducer(a, {
      type: "SET_CURSOR_AT",
      pageIndex: 1,
      cursor: "abc",
    });
    const c = reviewsPagerReducer(b, {
      type: "SET_CURSOR_AT",
      pageIndex: 1,
      cursor: "abc",
    });
    expect(c).toBe(b);
  });

  it("SET_CURSOR_AT pads with nulls if pageIndex skips ahead", () => {
    const a = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const next = reviewsPagerReducer(a, {
      type: "SET_CURSOR_AT",
      pageIndex: 3,
      cursor: "xyz",
    });
    expect(next.cursors).toEqual([null, null, null, "xyz"]);
  });

  it("SET_CURSOR_AT ignores pageIndex < 1", () => {
    const a = reviewsPagerReducer(initialReviewsPagerState, {
      type: "RESET",
      filtersKey: "key-A",
    });
    const next = reviewsPagerReducer(a, {
      type: "SET_CURSOR_AT",
      pageIndex: 0,
      cursor: "x",
    });
    expect(next).toBe(a);
  });
});
