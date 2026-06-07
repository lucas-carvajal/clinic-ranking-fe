import type { MetadataRoute } from "next";

import { fetchAllReviewSitemapEntries } from "@/lib/seo/fetch-all-review-ids";
import { buildStaticSitemapEntries } from "@/lib/seo/sitemap-static-routes";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticEntries = buildStaticSitemapEntries(siteUrl);
  const reviews = await fetchAllReviewSitemapEntries();

  const reviewEntries: MetadataRoute.Sitemap = reviews.map(({ id, lastModified }) => ({
    url: `${siteUrl}/app/review/${id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...reviewEntries];
}