# Reviews

Reviews lets a visitor browse public hospital-training reviews, narrow them by specialty and location, page through results, and open a single review.

## Sub-features

- `reviews-list` renders the list page heading and either rows, empty copy, or an error.
- `reviews-filter` updates the URL from the four comboboxes and reloads results.
- `reviews-empty` shows `Keine Bewertungen gefunden` when the query has no rows.
- `reviews-error` shows an alert and `Aktualisieren` when the list request fails.
- `reviews-page` moves between pages with `Seitennavigation`.
- `reviews-detail` opens `/app/review/<id>` from a row or card.

## How to get to it (user POV)

- Choose `Bewertungen Ansehen` on `/`.
- Choose `Alle Bewertungen` in `Hauptnavigation`.
- Open `/app/reviews` (optional query: `state`, `city`, `hospital`, `specialty`, `page`).
- Choose a desktop row named `Bewertung <hospital>: Details anzeigen`, or a mobile card link, or open `/app/review/<id>` directly.

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true`.
- For `reviews-list` rows, `reviews-filter` options, `reviews-page`, and `reviews-detail` success: a live backend via `CLINIC_RANKING_VERIFY_BACKEND_URL`. Without it, only `reviews-error` (and the heading) are in play — report the rest `verified-unreachable`.
- Desktop viewport (≥768px) for table rows; narrower for cards.

- **Open list.** Go to `/app/reviews`. Run `control-clinic-ranking screenshot /app/reviews`. Heading `Alle Bewertungen` is visible. Four comboboxes named `Fachrichtung filtern`, `Bundesland filtern`, `Stadt filtern`, and `Krankenhaus filtern` are present. Stadt and Krankenhaus start disabled until a Bundesland is chosen.
- **Loading.** On first paint the status `Lade Bewertungen…` may appear. Wait until it is gone before asserting empty, error, or rows.
- **Error (no backend).** If the list request fails, an alert contains a failure message and a button `Aktualisieren`. Choosing `Aktualisieren` retries; without a backend the alert returns. This is sufficient proof of `reviews-error`.
- **Rows (backend).** A table of reviews appears on desktop. Run `control-clinic-ranking snapshot /app/reviews`. At least one `role="link"` named `Bewertung …: Details anzeigen` exists, **or** (mobile) a link whose URL is `/app/review/<id>`.
- **Filter.** Open combobox `Bundesland filtern`, choose a listed state. The URL gains `?state=<name>` (no `page`). Stadt and Krankenhaus enable. Results update. Clearing the combobox (option labeled `—`) drops the param.
- **Empty.** Apply a filter combination with no reviews, or observe a backend that returns none. Text `Keine Bewertungen gefunden` is visible and the pager is absent.
- **Pager.** When more than one page exists, navigation `Seitennavigation` shows `Vorherige Seite`, `Nächste Seite`, and `Seite N` (`aria-current="page"` on the current). Choose `Nächste Seite`. The URL contains `page=2` (or higher) and the heading remains `Alle Bewertungen`.
- **Detail.** Choose a review row/card. URL is `/app/review/<id>`. Success: heading is the hospital name and a link `Alle Bewertungen` is present. Unknown id: heading `Bewertung nicht gefunden`. Backend down: heading `Bewertung konnte nicht geladen werden`.
- **Proof.** Capture list state (rows **or** the real error/empty UI) and, when a row exists, the detail heading after the click. Do not call `/api/proxy/reviews` as the only proof.

## Gotchas

- `fetch /app/reviews` is the SSR shell plus an `sr-only` snippet of page-1 rows when the **server** could reach the backend. The interactive table is client-side. Prefer `snapshot` / screenshot after loading finishes.
- Invalid `page` or a leftover `cursor` query param is coerced on load; assert the cleaned URL, not the URL you typed.
- Stadt and Krankenhaus stay disabled until Bundesland is set. Clicking them first is not a product bug.
- Desktop `role="link"` is on the `<tr>`, not an `<a>`. Accessible name is `Bewertung ${hospital}: Details anzeigen`.
- Pagination is hidden when there is only one page and no next page.
- Opening detail without a backend is still a valid `reviews-detail` error proof if you used a real navigation to `/app/review/<id>`.
