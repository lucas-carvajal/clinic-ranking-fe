import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { defaultFormState, type ReviewFormState } from "@/lib/domains/submit/schema";

import { Step7Optional } from "./step-7-optional";

function Step7Harness() {
  const form = useForm<ReviewFormState>({ defaultValues: defaultFormState() });
  return <Step7Optional form={form} />;
}

describe("Step7Optional", () => {
  it("keeps the hospital email label exactly", () => {
    render(<Step7Harness />);
    expect(
      screen.getByRole("heading", { name: /Krankenhaus Email für Verifikation/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^E-Mail$/ })).not.toBeInTheDocument();
  });
});
