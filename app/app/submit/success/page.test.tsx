import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppSubmitSuccessPage from "./page";

describe("AppSubmitSuccessPage", () => {
  it("renders thank-you copy and feedback CTA with submission_feedback type", () => {
    render(<AppSubmitSuccessPage />);

    expect(
      screen.getByRole("heading", { name: /Danke für deine Bewertung/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wir werden uns so schnell wie möglich bei dir per Email melden/i),
    ).toBeInTheDocument();

    const feedbackLink = screen.getByRole("link", { name: /Feedback geben/i });
    expect(feedbackLink).toHaveAttribute(
      "href",
      "/app/feedback?type=submission_feedback",
    );
  });
});