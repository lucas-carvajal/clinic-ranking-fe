import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock(
  "@/app/(admin)/admin/(protected)/review-request/[id]/generate-verification-link",
  () => ({
    generateReviewRequestVerificationLink: vi.fn(),
  }),
);

import { generateReviewRequestVerificationLink } from "@/app/(admin)/admin/(protected)/review-request/[id]/generate-verification-link";

import { CopyVerificationLinkButton } from "./copy-verification-link-button";

const REQUEST_ID = "550e8400-e29b-41d4-a716-446655440010";

describe("CopyVerificationLinkButton", () => {
  it("copies the generated URL", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    vi.mocked(generateReviewRequestVerificationLink).mockResolvedValue({
      kind: "ok",
      url: "https://example.com/verify?token=abc",
    });

    render(<CopyVerificationLinkButton requestId={REQUEST_ID} />);
    await user.click(screen.getByRole("button", { name: "Link kopieren" }));

    expect(generateReviewRequestVerificationLink).toHaveBeenCalledWith(REQUEST_ID);
    expect(writeText).toHaveBeenCalledWith("https://example.com/verify?token=abc");
    expect(await screen.findByRole("button", { name: /Kopiert/ })).toBeInTheDocument();
  });

  it("shows a real error when generate fails", async () => {
    const user = userEvent.setup();
    vi.mocked(generateReviewRequestVerificationLink).mockResolvedValue({
      kind: "error",
      message: "Request failed with status 502",
    });

    render(<CopyVerificationLinkButton requestId={REQUEST_ID} />);
    await user.click(screen.getByRole("button", { name: "Link kopieren" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Request failed with status 502",
    );
    expect(screen.queryByRole("button", { name: /Kopiert/ })).not.toBeInTheDocument();
  });
});
