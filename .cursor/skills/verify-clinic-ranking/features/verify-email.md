# Verify email

A reviewer who opens the confirmation link from their inbox lands on `/verify`. The page consumes the token and shows success, a dead link, or a failed confirmation. There is no header nav item for this route.

## Sub-features

- `verify-dead` shows the dead-link card when the token is missing or the API treats it as invalid/expired/used.
- `verify-failed` shows the failed-confirmation card when consume cannot complete (backend down or other error).
- `verify-home` sends the visitor back to the marketing homepage.
- `verify-success` shows the confirmed-email card after a real consume (backend + valid token).

## How to get to it (user POV)

- Open `/verify` with no query (broken or stripped link).
- Open `/verify?token=<token>` from the email the backend sent.
- Choose `Zur Startseite` on any verify result card.
- Direct URLs only — `Hauptnavigation` has no Verify link.

## Driving it with control-clinic-ranking

Preconditions:

- Clinic Ranking FE is healthy at the origin from `control-clinic-ranking origin`.
- `control-clinic-ranking doctor` reports `ok=true` and `robots_disallow_verify=true`.
- `verify-success` needs a live backend that accepts `POST /review-requests/verify` plus a real unused token. Without it, prove dead + failed and mark success `verified-unreachable`.

- **Dead link (no token).** Open `/verify`. Run `control-clinic-ranking screenshot /verify`. Heading `Dieser Link funktioniert nicht :(` is visible. Body says the link is invalid, expired, or already used. Button `Zur Startseite` is present. Navigation `Hauptnavigation` is present (unlike `/`).
- **Home CTA.** Choose `Zur Startseite`. The URL is `/` and the heading `Das Assistenz Arzt Ranking` is visible.
- **Failed consume (no backend).** Open `/verify?token=not-a-real-token`. Run `control-clinic-ranking fetch /verify?token=not-a-real-token` and `screenshot` the same path. Heading `Bestätigung fehlgeschlagen` is visible. Body is the real error (often `Network error while calling API`). URL still has the token; it is not rewritten to success.
- **Loading.** A slow consume may flash `Wird bestätigt…` (`role="status"`). Do not treat that as the final state.
- **Success (backend).** Open `/verify?token=<unused-valid-token>` against a live API. Heading `Email bestätigt` is visible. Body says the email is confirmed and the review will be published anonymously. Direct GET without a successful consume is **not** proof — there is no `?success=` short-circuit.
- **Proof.** Capture `/verify` (dead) and `/verify?token=…` (failed **or** success). The `Zur Startseite` click needs the verify screenshot and the landing destination.

## Gotchas

- `/verify` is `noindex` and listed in `robots.txt` as `Disallow: /verify`. That is expected; do not treat it as a missing public page.
- There is no in-app entry in `Hauptnavigation`. Starting from `/` and looking for a Verify link will fail.
- A missing token is always `verify-dead`. A present token with no API is `verify-failed`, not dead.
- Success copy is `Email bestätigt` (not “E-Mail”). Do not assert a review preview, grade, or the confirmed address on this page.
- Admin “copy verification link” is out of map. Do not log into `/admin` to mint a token for this recipe.
