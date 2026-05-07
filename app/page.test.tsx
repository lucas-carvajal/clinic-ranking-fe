import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the static landing page hero copy", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Das Assistenz Arzt Ranking",
      }),
    ).toHaveClass("page-title");
    expect(screen.getByText("Ärzte helfen Ärzten").parentElement).toHaveClass(
      "text-brand-mint",
    );
    expect(
      screen.getByText("Für eine faire Facharztweiterbildung"),
    ).toBeInTheDocument();
    expect(document.querySelector(".mint-accent-bar")).not.toBeInTheDocument();
  });

  it("renders two responsive landing content blocks with one button each", () => {
    render(<Home />);

    const contentGrid = screen.getByLabelText("Landing page content");
    expect(contentGrid).toHaveClass("grid-cols-1", "md:grid-cols-2");

    const blocks = screen.getAllByRole("article");
    expect(blocks).toHaveLength(2);

    for (const block of blocks) {
      expect(block).not.toHaveClass("bg-card", "border", "shadow-sm");
      expect(within(block).getByRole("heading", { level: 3 })).toHaveClass(
        "section-title",
      );
      const [button] = within(block).getAllByRole("button");
      expect(button).toHaveClass("self-center", "h-12", "sm:h-14");
    }
  });
});
