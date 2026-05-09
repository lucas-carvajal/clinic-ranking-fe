import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./(public)/page";

describe("Home", () => {
  it("renders the landing page hero and content blocks", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Das Assistenz Arzt Ranking" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ärzte helfen Ärzten")).toBeInTheDocument();
    const reportLink = screen.getByRole("link", { name: "Jetzt Berichten" });
    expect(reportLink).toBeInTheDocument();
    expect(reportLink).toHaveAttribute("href", "/app/submit");

    const reviewsLink = screen.getByRole("link", { name: "Bewertungen Ansehen" });
    expect(reviewsLink).toBeInTheDocument();
    expect(reviewsLink).toHaveAttribute("href", "/app/reviews");
  });
});
