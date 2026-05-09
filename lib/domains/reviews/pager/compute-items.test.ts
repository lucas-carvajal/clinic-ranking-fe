import { describe, expect, it } from "vitest";

import {
  computeItems,
  computeReachableLastPage,
} from "@/lib/domains/reviews/pager/compute-items";

describe("computeReachableLastPage", () => {
  it("extends frontier by 1 when hasNext is true at frontier", () => {
    expect(computeReachableLastPage(1, 1, true)).toBe(2);
    expect(computeReachableLastPage(3, 3, true)).toBe(4);
  });

  it("does not extend when not at the frontier", () => {
    expect(computeReachableLastPage(1, 3, true)).toBe(3);
    expect(computeReachableLastPage(2, 3, true)).toBe(3);
  });

  it("does not extend when hasNext is false", () => {
    expect(computeReachableLastPage(3, 3, false)).toBe(3);
  });
});

describe("computeItems", () => {
  it("renders only page 1 when there is just one page", () => {
    expect(computeItems({ currentPage: 1, visitedPages: 1, hasNext: false })).toEqual([
      { page: 1 },
    ]);
  });

  it("page 1 with hasNext shows 1, 2 (next-hint chip)", () => {
    expect(computeItems({ currentPage: 1, visitedPages: 1, hasNext: true })).toEqual([
      { page: 1 },
      { page: 2 },
    ]);
  });

  it("page 2 walked from 1, hasNext", () => {
    expect(computeItems({ currentPage: 2, visitedPages: 2, hasNext: true })).toEqual([
      { page: 1 },
      { page: 2 },
      { page: 3 },
    ]);
  });

  it("page 5 walked from 1, hasNext: 1 … 4 5 6", () => {
    expect(computeItems({ currentPage: 5, visitedPages: 5, hasNext: true })).toEqual([
      { page: 1 },
      "ellipsis",
      { page: 4 },
      { page: 5 },
      { page: 6 },
    ]);
  });

  it("page 5 walked from 1, last page (no hasNext): 1 … 4 5", () => {
    expect(computeItems({ currentPage: 5, visitedPages: 5, hasNext: false })).toEqual([
      { page: 1 },
      "ellipsis",
      { page: 4 },
      { page: 5 },
    ]);
  });

  it("clicked page 1 from page 5: window collapses around current, last still shown", () => {
    expect(computeItems({ currentPage: 1, visitedPages: 5, hasNext: true })).toEqual([
      { page: 1 },
      { page: 2 },
      "ellipsis",
      { page: 5 },
    ]);
  });

  it("middle page in long list: 1 … 4 5 6 … 10", () => {
    expect(computeItems({ currentPage: 5, visitedPages: 10, hasNext: false })).toEqual([
      { page: 1 },
      "ellipsis",
      { page: 4 },
      { page: 5 },
      { page: 6 },
      "ellipsis",
      { page: 10 },
    ]);
  });
});
