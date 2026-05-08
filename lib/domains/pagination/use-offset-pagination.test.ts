import { describe, expect, it } from "vitest";

import {
  clampPage,
  parseOffsetPaginationParams,
  serializeOffsetPaginationParams,
} from "@/lib/domains/pagination/use-offset-pagination";

describe("offset pagination helpers", () => {
  it("clamps pages to valid ranges", () => {
    expect(clampPage(0)).toBe(1);
    expect(clampPage(5, 3)).toBe(3);
    expect(clampPage(2, 3)).toBe(2);
  });

  it("parses and serializes page params", () => {
    const parsed = parseOffsetPaginationParams(
      new URLSearchParams({ page: "2", page_size: "50" }),
    );
    expect(parsed).toEqual({ page: 2, pageSize: 50 });

    const sp = serializeOffsetPaginationParams(parsed);
    expect(sp.get("page")).toBe("2");
    expect(sp.get("page_size")).toBe("50");
  });
});

