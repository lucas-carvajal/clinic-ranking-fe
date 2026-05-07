import { describe, expect, it } from "vitest";

import { optionsKeys } from "@/lib/domains/options/keys";

describe("optionsKeys", () => {
  it("builds stable top-level keys", () => {
    expect(optionsKeys.states()).toEqual(["options", "states"]);
    expect(optionsKeys.specialties()).toEqual(["options", "specialties"]);
  });

  it("builds dependent keys for cascading options", () => {
    expect(optionsKeys.cities("Bayern")).toEqual(["options", "cities", "Bayern"]);
    expect(optionsKeys.hospitals({ state: "Bayern", city: "Muenchen" })).toEqual([
      "options",
      "hospitals",
      "Bayern",
      "Muenchen",
    ]);
  });
});
