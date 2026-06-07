/**
 * Public site origin for sitemap, robots, and metadata canonical URLs.
 * Set `SITE_URL` per environment (e.g. `https://assistenz-arzt-ranking.de` in prod).
 */
export function getSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) {
    throw new Error(
      "SITE_URL is required. Set it in .env (see .env.example), e.g. http://localhost:3000 for local dev.",
    );
  }
  return raw.replace(/\/$/, "");
}