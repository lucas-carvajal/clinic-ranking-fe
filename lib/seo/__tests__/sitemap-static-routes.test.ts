import { describe, expect, it } from "vitest";

import {
  STATIC_SITEMAP_ROUTES,
  buildStaticSitemapEntries,
} from "@/lib/seo/sitemap-static-routes";

describe("sitemap static routes", () => {
  it("includes home, app hub routes, and legal pages", () => {
    const paths = STATIC_SITEMAP_ROUTES.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/app/reviews");
    expect(paths).toContain("/app/submit");
    expect(paths).toContain("/legal/imprint");
  });

  it("builds absolute URLs from site origin", () => {
    const entries = buildStaticSitemapEntries("https://assistenz-arzt-ranking.de");
    expect(entries[0]?.url).toBe("https://assistenz-arzt-ranking.de/");
    expect(entries.some((e) => e.url === "https://assistenz-arzt-ranking.de/app/reviews")).toBe(
      true,
    );
  });
});