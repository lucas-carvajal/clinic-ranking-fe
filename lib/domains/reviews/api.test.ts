import { describe, expect, it, vi } from "vitest";

import { get } from "@/lib/api/client";
import { fetchReviewsList } from "@/lib/domains/reviews/api";

vi.mock("@/lib/api/client", () => ({
  get: vi.fn(),
}));

describe("fetchReviewsList", () => {
  it("calls GET /reviews with serialized query (not /reviews/search)", async () => {
    const getMock = vi.mocked(get).mockResolvedValue({
      data: [],
      pagination: { pageSize: 10, hasNext: false },
    });

    await fetchReviewsList({
      state: "Bayern",
      city: "München",
      specialty: "Biochemie",
    });

    expect(getMock).toHaveBeenCalledWith(
      "/reviews?state=Bayern&city=M%C3%BCnchen&specialty=Biochemie",
      expect.objectContaining({ responseSchema: expect.anything() }),
    );
  });

  it("uses bare /reviews when no filters", async () => {
    const getMock = vi.mocked(get).mockResolvedValue({
      data: [],
      pagination: { pageSize: 10, hasNext: false },
    });

    await fetchReviewsList({});

    expect(getMock).toHaveBeenCalledWith(
      "/reviews",
      expect.objectContaining({ responseSchema: expect.anything() }),
    );
  });
});
