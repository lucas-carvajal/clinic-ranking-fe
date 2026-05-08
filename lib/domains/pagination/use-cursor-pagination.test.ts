import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCursorPagination } from "@/lib/domains/pagination/use-cursor-pagination";

describe("useCursorPagination", () => {
  it("signals invalid cursor and suggests reset message", () => {
    const { result } = renderHook(() =>
      useCursorPagination({
        cursor: "!!!",
        isCursorLikelyValid: (c) => c.length > 5,
      }),
    );

    expect(result.current.resolveInvalidCursor()).toEqual({
      didReset: true,
      message: expect.any(String),
    });
  });

  it("tracks previous cursor in-memory and supports goPrev", () => {
    const { result, rerender } = renderHook(
      ({ cursor }) => useCursorPagination({ cursor }),
      { initialProps: { cursor: "c1" as string | undefined } },
    );

    const next = result.current.goNext("c2");
    expect(next).toEqual({ cursor: "c2" });

    rerender({ cursor: "c2" });

    expect(result.current.canGoPrev).toBe(true);
    const prev = result.current.goPrev();
    expect(prev).toEqual({ cursor: "c1", replace: true });
  });

  it("reset clears cursor and visited stack", () => {
    const { result, rerender } = renderHook(
      ({ cursor }) => useCursorPagination({ cursor }),
      { initialProps: { cursor: "c1" as string | undefined } },
    );

    result.current.goNext("c2");
    rerender({ cursor: "c2" });

    expect(result.current.canGoPrev).toBe(true);
    expect(result.current.reset()).toEqual({ cursor: undefined, replace: true });
  });
});

