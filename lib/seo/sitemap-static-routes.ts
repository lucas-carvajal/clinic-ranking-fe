import type { MetadataRoute } from "next";

export type StaticSitemapRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/** Paths emitted on every sitemap generation (review detail URLs added separately). */
export const STATIC_SITEMAP_ROUTES: readonly StaticSitemapRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/app/reviews", changeFrequency: "daily", priority: 0.9 },
  { path: "/app/submit", changeFrequency: "monthly", priority: 0.8 },
  { path: "/app/ranking", changeFrequency: "weekly", priority: 0.7 },
  { path: "/app/feedback", changeFrequency: "monthly", priority: 0.4 },
  { path: "/legal/imprint", changeFrequency: "yearly", priority: 0.5 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.5 },
] as const;

export function buildStaticSitemapEntries(
  siteUrl: string,
  lastModified: Date = new Date(),
): MetadataRoute.Sitemap {
  return STATIC_SITEMAP_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}