# Landing and ranking

The landing page tells a visitor what Assistenz Arzt Ranking is and sends them to submit a review or browse reviews. Ranking is a separate app route that currently shows a coming-soon placeholder.

## Sub-features

- `landing-render` shows the marketing hero on `/` without the app header.
- `landing-cta-submit` sends the visitor to the submit form.
- `landing-cta-reviews` sends the visitor to the reviews list.
- `landing-footer-legal` exposes Impressum, Datenschutzerklärung, and AGB on `/`.
- `app-header-nav` exposes Alle Bewertungen, Das Ranking, Feedback, and Bewerten on `/app/*`.
- `ranking-placeholder` shows the coming-soon ranking page.

## How to get to it (user POV)

- Open `/`.
- Choose `Jetzt Berichten` on the landing page.
- Choose `Bewertungen Ansehen` on the landing page.
- Choose a footer legal link on `/`.
- From any `/app/*` page except the landing, use the header: `Alle Bewertungen`, `Das Ranking`, `Feedback`, or `Bewerten`.
- Open `/app/ranking` directly.

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true` and `homepage_has_marker=true`.
- Viewport is desktop (≥768px) unless a bullet says mobile.

- **Open landing.** Go to `/`. Run `control-clinic-ranking fetch /` and `control-clinic-ranking screenshot /`. The heading `Das Assistenz Arzt Ranking` is visible, the region `Landing page content` contains both CTAs, and there is **no** navigation named `Hauptnavigation`.
- **Submit CTA.** Choose `Jetzt Berichten`. Browser: click the link named `Jetzt Berichten`. The URL is `/app/submit` and the heading `Dein Krankenhaus` (or step chrome `1 / 7`) is visible.
- **Reviews CTA.** Return to `/` and choose `Bewertungen Ansehen`. Browser: click the link named `Bewertungen Ansehen`. The URL is `/app/reviews` and the heading `Alle Bewertungen` is visible. Capture `control-clinic-ranking screenshot /app/reviews`.
- **Footer legal.** From `/`, choose `Impressum`. The heading `Impressum` is visible at `/legal/imprint`.
- **Header nav.** From `/app/reviews`, use navigation `Hauptnavigation`. Click `Das Ranking`. The URL is `/app/ranking` and the heading `Krankenhaus Ranking` is visible with `Demnächst verfügbar`. Click `Bewerten`. The URL is `/app/submit`.
- **Ranking direct.** Open `/app/ranking`. Run `control-clinic-ranking fetch /app/ranking`. HTML contains `Krankenhaus Ranking` and `Demnächst verfügbar`.
- **Proof.** Keep the landing screenshot that shows both CTAs and the heading, plus the destination screenshot after `Bewertungen Ansehen`. Filenames must identify `landing-render` and `landing-cta-reviews`.

## Gotchas

- `/` does not render `AppSiteHeader`. Proving header links from the landing page will fail; open `/app/reviews` or `/legal/imprint` first.
- Footer is hidden on `/app/submit` and `/app/submit/success`. Prove footer links from `/` or `/app/reviews`, not from submit.
- Mobile header hides the desktop links. Open with button `Menü öffnen` (`aria-expanded` becomes true; a dialog appears) before clicking `Alle Bewertungen`.
- Reviews after the landing CTA may show an error or empty state without a backend. The heading `Alle Bewertungen` is still the success signal for this feature; list rows belong to [Reviews](./reviews.md).
- `next dev` paints a Next.js “N” badge on screenshots. Ignore it; it is not product UI.
