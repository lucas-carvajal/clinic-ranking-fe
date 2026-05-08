import { describe, expect, it } from "vitest";

import {
  adminFeedbackResponseSchema,
  feedbackSubmitRequestSchema,
  feedbackSubmitResponseSchema,
} from "@/lib/contracts/feedback.schema";

describe("feedback contracts", () => {
  it("parses feedback submit request/response", () => {
    expect(
      feedbackSubmitRequestSchema.parse({
        type: "bug",
        email: "user@example.com",
        feedback: "Something broke",
      }).type,
    ).toBe("bug");

    expect(
      feedbackSubmitResponseSchema.parse({
        id: "550e8400-e29b-41d4-a716-446655440050",
        createdAt: "2026-05-07T14:32:11.000Z",
      }).id,
    ).toBe("550e8400-e29b-41d4-a716-446655440050");
  });

  it("parses admin feedback list", () => {
    const parsed = adminFeedbackResponseSchema.parse({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440051",
          type: "bug",
          email: "user@example.com",
          feedback: "Issue",
          processed: false,
          createdAt: "2026-05-07T14:32:11.000Z",
          unknown: "ignored",
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    });

    expect(parsed.data[0].processed).toBe(false);
  });

  it("fails for invalid email", () => {
    expect(() =>
      feedbackSubmitRequestSchema.parse({
        type: "bug",
        email: "invalid",
        feedback: "Issue",
      }),
    ).toThrow();
  });
});
