# Legal pages

Legal pages publish Impressum, Datenschutzerklärung, and AGB as static German documents with the app header and footer.

## Sub-features

- `legal-imprint` shows Impressum.
- `legal-privacy` shows Datenschutzerklärung.
- `legal-terms` shows AGB.
- `legal-header` keeps `Hauptnavigation` on every legal URL.

## How to get to it (user POV)

- Choose `Impressum`, `Datenschutzerklärung`, or `AGB` in the site footer (any route except `/app/submit*`).
- Open `/legal/imprint`, `/legal/privacy`, or `/legal/terms` directly.
- From submit step 7, choose `Nutzungsbedingungen` (terms) or `Datenschutzerklärung` (privacy). Those links leave the form.

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true`.
- No backend is required.

- **Footer entry.** From `/`, choose `Impressum`. URL is `/legal/imprint`. Heading `Impressum` is visible. Navigation `Hauptnavigation` is present (unlike `/`).
- **Privacy.** Choose `Datenschutzerklärung` in the footer. URL is `/legal/privacy`. Heading `Datenschutzerklärung` is visible. Body includes the Hosting section text that names Amsterdam.
- **Terms.** Choose `AGB` in the footer. URL is `/legal/terms`. Heading `Allgemeine Geschäftsbedingungen (AGB)` is visible. A `§ 1 Geltungsbereich` section is present.
- **Direct URLs.** Run `control-clinic-ranking fetch /legal/imprint`, `fetch /legal/privacy`, and `fetch /legal/terms`. Each returns 200 with the headings above.
- **Proof.** Capture a footer click from `/` into Impressum (action + destination), then a screenshot of one other legal page. SSR `fetch` is acceptable supporting evidence because these pages are static.

## Gotchas

- Footer is hidden on `/app/submit` and `/app/submit/success`. Do not start this recipe there except via the in-form `Nutzungsbedingungen` / `Datenschutzerklärung` links on step 7.
- Imprint still contains placeholder operator copy (`kontakt@example.de`, `[Name und Adresse einfügen]`). Assert the heading and section titles, not a real address.
- Legal layout adds the app header; landing does not. Seeing `Hauptnavigation` on `/legal/imprint` and not on `/` is expected.
