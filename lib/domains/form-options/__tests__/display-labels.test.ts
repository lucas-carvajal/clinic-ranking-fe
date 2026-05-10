import { describe, expect, it } from "vitest";

import {
  ROTATION_OPTIONS,
  labelFor,
  labelsFor,
} from "@/lib/domains/form-options";

describe("display label helpers", () => {
  it("falls back to raw values when absent from options", () => {
    expect(labelFor(ROTATION_OPTIONS, "generalWard")).toBe("Normalstation");
    expect(labelFor(ROTATION_OPTIONS, "unknownEnum")).toBe("unknownEnum");
  });

  it("maps arrays in stable order", () => {
    expect(labelsFor(ROTATION_OPTIONS, ["icu", "surgery"])).toEqual([
      "Intensivstation",
      "OP",
    ]);
  });
});
