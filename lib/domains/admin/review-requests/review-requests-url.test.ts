import { describe, expect, it } from "vitest";

import {
  adminReviewRequestsUrlNeedsCoercion,
  buildAdminReviewRequestsHref,
  parseAdminReviewRequestsSearchParams,
} from "@/lib/domains/admin/review-requests/review-requests-url";

function sp(entries: Record<string, string>) {
  return new URLSearchParams(entries);
}

describe("parseAdminReviewRequestsSearchParams", () => {
  it("defaults page and page_size", () => {
    expect(parseAdminReviewRequestsSearchParams({})).toEqual({ page: 1, pageSize: 20 });
  });

  it("parses valid integers", () => {
    expect(
      parseAdminReviewRequestsSearchParams({
        page: "3",
        page_size: "50",
      }),
    ).toEqual({ page: 3, pageSize: 50 });
  });

  it("falls back on non-numeric page", () => {
    expect(parseAdminReviewRequestsSearchParams({ page: "abc" })).toEqual({
      page: 1,
      pageSize: 20,
    });
  });

  it("caps page_size at 100", () => {
    expect(parseAdminReviewRequestsSearchParams({ page_size: "500" })).toEqual({
      page: 1,
      pageSize: 100,
    });
  });
});

describe("buildAdminReviewRequestsHref", () => {
  it("serializes snake_case query", () => {
    expect(buildAdminReviewRequestsHref({ page: 2, pageSize: 20 })).toBe(
      "/admin/review-requests?page=2&page_size=20",
    );
  });
});

describe("adminReviewRequestsUrlNeedsCoercion", () => {
  it("returns false when no pagination params", () => {
    expect(adminReviewRequestsUrlNeedsCoercion(new URLSearchParams(), { page: 1, pageSize: 20 })).toBe(
      false,
    );
  });

  it("returns true when page is not a number", () => {
    expect(adminReviewRequestsUrlNeedsCoercion(sp({ page: "nope" }), { page: 1, pageSize: 20 })).toBe(
      true,
    );
  });

  it("returns true when page_size exceeds cap vs effective params", () => {
    expect(
      adminReviewRequestsUrlNeedsCoercion(sp({ page: "1", page_size: "200" }), { page: 1, pageSize: 100 }),
    ).toBe(true);
  });
});
