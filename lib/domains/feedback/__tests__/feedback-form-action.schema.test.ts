import { describe, expect, it } from "vitest";

import { feedbackFormActionSchema } from "@/lib/domains/feedback/feedback-form-action.schema";

describe("feedbackFormActionSchema", () => {
  it("parses whitelisted payload", () => {
    const parsed = feedbackFormActionSchema.parse({
      type: "submission_feedback",
      email: "  u@example.com ",
      feedback: "  hi ",
    });
    expect(parsed.type).toBe("submission_feedback");
    expect(parsed.email).toBe("u@example.com");
    expect(parsed.feedback).toBe("hi");
  });

  it("rejects unknown type with German message", () => {
    const parsed = feedbackFormActionSchema.safeParse({
      type: "malicious_type",
      email: "x@example.com",
      feedback: "x",
    });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.some((i) => i.message.includes("Formular"))).toBe(
      true,
    );
  });
});
