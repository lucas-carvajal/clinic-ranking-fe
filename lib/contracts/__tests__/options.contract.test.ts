import { describe, expect, it } from "vitest";

import {
  citiesResponseSchema,
  hospitalsResponseSchema,
  specialtiesResponseSchema,
  statesResponseSchema,
} from "@/lib/contracts/options.schema";

describe("options contracts", () => {
  it("parses valid reference-data envelopes", () => {
    expect(
      statesResponseSchema.parse({
        data: [{ name: "Bayern", countryName: "Deutschland" }],
      }).data[0].name,
    ).toBe("Bayern");

    expect(
      citiesResponseSchema.parse({
        data: [{ name: "Muenchen", stateName: "Bayern", countryName: "Deutschland" }],
      }).data[0].name,
    ).toBe("Muenchen");

    expect(
      hospitalsResponseSchema.parse({
        data: [
          {
            name: "Klinikum A",
            cityName: "Muenchen",
            stateName: "Bayern",
            countryName: "Deutschland",
          },
        ],
      }).data.length,
    ).toBe(1);

    expect(
      specialtiesResponseSchema.parse({
        data: [{ name: "Innere Medizin" }],
      }).data[0].name,
    ).toBe("Innere Medizin");
  });

  it("fails when required fields are missing", () => {
    expect(() => statesResponseSchema.parse({ data: [{ countryName: "Deutschland" }] })).toThrow();
  });

  it("allows unknown response fields", () => {
    expect(
      statesResponseSchema.parse({
        data: [{ name: "Bayern", countryName: "Deutschland", extra: "ignored" }],
      }).data[0],
    ).toEqual({
      name: "Bayern",
      countryName: "Deutschland",
    });
  });
});
