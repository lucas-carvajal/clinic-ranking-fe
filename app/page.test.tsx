import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the migration scaffold heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Clinic Ranking" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Next.js rewrite")).toBeInTheDocument();
  });
});
