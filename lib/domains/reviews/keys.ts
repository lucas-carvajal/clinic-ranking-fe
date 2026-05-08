import type { ReviewsFilterParams } from "@/lib/domains/pagination/reviews-url";

export const reviewsKeys = {
  all: ["reviews"] as const,
  list: (params: ReviewsFilterParams) =>
    [
      ...reviewsKeys.all,
      "list",
      params.state ?? "",
      params.city ?? "",
      params.hospital ?? "",
      params.specialty ?? "",
      params.cursor ?? "",
    ] as const,
};
