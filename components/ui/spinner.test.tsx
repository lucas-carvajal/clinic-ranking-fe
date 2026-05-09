import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CenteredSpinner, Spinner } from "@/components/ui/spinner";

describe("Spinner", () => {
  it("renders a status element with the visually hidden label", () => {
    render(<Spinner label="Lade Daten…" />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("animate-spin");
    expect(screen.getByText("Lade Daten…")).toHaveClass("sr-only");
  });

  it("applies the requested size class", () => {
    render(<Spinner size="lg" label="x" />);
    expect(screen.getByRole("status")).toHaveClass("size-10");
  });

  it("renders without a label", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".sr-only")).toBeNull();
  });
});

describe("CenteredSpinner", () => {
  it("centers the spinner horizontally and vertically", () => {
    render(<CenteredSpinner label="Lade…" />);
    const status = screen.getByRole("status");
    const wrapper = status.parentElement;
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("items-center");
    expect(wrapper).toHaveClass("justify-center");
  });
});
