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
    expect(screen.getByRole("button", { name: "Jetzt Berichten" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Bewertungen Ansehen" }),
    ).toBeInTheDocument();
  });
});
