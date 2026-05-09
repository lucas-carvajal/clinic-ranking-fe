import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const OPTIONS: ComboboxOption[] = [
  { value: "Berlin", label: "Berlin" },
  { value: "Hamburg", label: "Hamburg" },
  { value: "Bayern", label: "Bayern" },
  { value: "Sachsen", label: "Sachsen" },
];

function Harness({
  initialValue,
  onChange,
}: {
  initialValue?: string;
  onChange?: (v: string | undefined) => void;
}) {
  const [value, setValue] = useState<string | undefined>(initialValue);
  return (
    <Combobox
      options={OPTIONS}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      placeholder="Bundesland"
      ariaLabel="Bundesland"
    />
  );
}

describe("Combobox", () => {
  it("shows the placeholder when no value is selected", () => {
    render(<Harness />);
    expect(
      screen.getByRole("combobox", { name: "Bundesland" }),
    ).toHaveTextContent("Bundesland");
  });

  it("shows the selected label when a value is set", () => {
    render(<Harness initialValue="Bayern" />);
    expect(
      screen.getByRole("combobox", { name: "Bundesland" }),
    ).toHaveTextContent("Bayern");
  });

  it("opens on click and lists all options plus the clear item", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));

    const listbox = await screen.findByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options.map((o) => o.textContent?.trim())).toEqual([
      "—",
      "Berlin",
      "Hamburg",
      "Bayern",
      "Sachsen",
    ]);
  });

  it("filters options as the user types in the search input", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));

    const searchInput = await screen.findByPlaceholderText("Suchen…");
    await user.type(searchInput, "ber");

    const listbox = screen.getByRole("listbox");
    const labels = within(listbox)
      .getAllByRole("option")
      .map((o) => o.textContent?.trim());
    // "—" clear stays; "Berlin" matches.
    expect(labels).toEqual(["—", "Berlin"]);
  });

  it("commits selection by clicking an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));

    const listbox = await screen.findByRole("listbox");
    await user.click(within(listbox).getByText("Hamburg"));

    expect(onChange).toHaveBeenCalledWith("Hamburg");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("combobox", { name: "Bundesland" }),
    ).toHaveTextContent("Hamburg");
  });

  it("clears selection via the synthetic clear option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue="Bayern" onChange={onChange} />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));

    const listbox = await screen.findByRole("listbox");
    await user.click(within(listbox).getByText("—"));

    expect(onChange).toHaveBeenCalledWith(undefined);
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Bundesland" }),
      ).toHaveTextContent("Bundesland");
    });
  });

  it("supports arrow navigation + enter to select", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));

    // First focused item is the clear "—"; arrow down to Berlin, Hamburg.
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("Hamburg");
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        options={OPTIONS}
        value={undefined}
        onChange={() => {}}
        placeholder="Stadt"
        disabled
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Stadt" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows empty text when search has no matches", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox", { name: "Bundesland" }));
    const search = await screen.findByPlaceholderText("Suchen…");
    await user.type(search, "zzzzzzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("Keine Treffer.")).toBeInTheDocument();
  });
});
