import { describe, expect, it } from "vitest";

import {
  ROTATION_OPTIONS,
  labelFor,
  labelsFor,
} from "@/lib/domains/form-options";

describe("display label helpers", () => {
  it("capitalizes unknown values when absent from options", () => {
    expect(labelFor(ROTATION_OPTIONS, "generalWard")).toBe("Normalstation");
    expect(labelFor(ROTATION_OPTIONS, "unknownEnum")).toBe("UnknownEnum");
  });

  it("maps arrays in stable order", () => {
    expect(labelsFor(ROTATION_OPTIONS, ["icu", "surgery"])).toEqual([
      "Intensivstation",
      "OP",
    ]);
  });
});
