import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/domains/verify/consume-review-verification", () => ({
  consumeReviewVerification: vi.fn(),
}));

import { consumeReviewVerification } from "@/lib/domains/verify/consume-review-verification";
import {
  VERIFY_DEAD_LINK_BODY,
  VERIFY_SUCCESS_BODY,
} from "@/lib/domains/verify/copy";

import VerifyPage from "./page";

describe("VerifyPage", () => {
  it("shows the dead-link state when the token is missing", async () => {
    const ui = await VerifyPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByText(VERIFY_DEAD_LINK_BODY)).toBeInTheDocument();
    expect(consumeReviewVerification).not.toHaveBeenCalled();
  });

  it("consumes the token and shows success", async () => {
    vi.mocked(consumeReviewVerification).mockResolvedValue({ kind: "success" });

    const ui = await VerifyPage({
      searchParams: Promise.resolve({ token: "tok-1" }),
    });
    render(ui);

    expect(consumeReviewVerification).toHaveBeenCalledWith("tok-1");
    expect(screen.getByText(VERIFY_SUCCESS_BODY)).toBeInTheDocument();
  });

  it("shows the dead-link state when consume returns dead_link", async () => {
    vi.mocked(consumeReviewVerification).mockResolvedValue({ kind: "dead_link" });

    const ui = await VerifyPage({
      searchParams: Promise.resolve({ token: "used" }),
    });
    render(ui);

    expect(screen.getByText(VERIFY_DEAD_LINK_BODY)).toBeInTheDocument();
  });
});
