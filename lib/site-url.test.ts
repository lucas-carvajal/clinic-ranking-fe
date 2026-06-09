import { afterEach, describe, expect, it } from "vitest";

import { getSiteUrl } from "./site-url";

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

describe("getSiteUrl", () => {
  it("returns trimmed URL without trailing slash", () => {
    process.env.SITE_URL = "https://assistenz-arzt-ranking.de/";
    expect(getSiteUrl()).toBe("https://assistenz-arzt-ranking.de");
  });

  it("throws when SITE_URL is missing", () => {
    delete process.env.SITE_URL;
    expect(() => getSiteUrl()).toThrow(/SITE_URL is required/);
  });
});