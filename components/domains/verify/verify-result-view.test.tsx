import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VerifyResultView } from "@/components/domains/verify/verify-result-view";
import {
  VERIFY_DEAD_LINK_BODY,
  VERIFY_SUCCESS_BODY,
} from "@/lib/domains/verify/copy";

describe("VerifyResultView", () => {
  it("renders success without review or email", () => {
    render(<VerifyResultView result={{ kind: "success" }} />);

    expect(screen.getByRole("heading", { name: "Email bestätigt" })).toBeInTheDocument();
    expect(screen.getByText(VERIFY_SUCCESS_BODY)).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bewertungstext|Note|Krankenhaus/i)).not.toBeInTheDocument();
  });

  it("renders the dead-link copy", () => {
    render(<VerifyResultView result={{ kind: "dead_link" }} />);

    expect(
      screen.getByRole("heading", { name: "Dieser Link funktioniert nicht" }),
    ).toBeInTheDocument();
    expect(screen.getByText(VERIFY_DEAD_LINK_BODY)).toBeInTheDocument();
  });

  it("renders a real failure message", () => {
    render(
      <VerifyResultView result={{ kind: "failed", message: "BACKEND_URL is not configured" }} />,
    );

    expect(
      screen.getByRole("heading", { name: "Bestätigung fehlgeschlagen" }),
    ).toBeInTheDocument();
    expect(screen.getByText("BACKEND_URL is not configured")).toBeInTheDocument();
  });
});
