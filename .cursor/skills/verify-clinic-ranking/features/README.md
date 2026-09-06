# Clinic Ranking FE verification map

This directory is the maintained source for verifying the user-facing behavior of Clinic Ranking FE. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking launch` (degraded UI) or `launch --mock` (fixture API on `BACKEND_URL`).
- Origin is `http://127.0.0.1:<port>` (default try 4173), not a shared `:3000` unless doctor says we own it.
- Run `control-clinic-ranking doctor` and require `ok=true`, `homepage_has_marker=true`, `port_owner` `us` or `us-child`, and `robots_disallow_verify=true`. After `--mock`, also require `mock_alive=true` and `mock_has_rows=true`.
- Never drive an instance that was not started by this verification run.
- A Go backend is optional. Landing, ranking placeholder, legal, submit chrome, feedback **validation**, and `/verify` dead/failed states work without it. Reviews rows, review detail success, successful feedback POST, successful submit POST, and `/verify` success need `launch --mock` or `CLINIC_RANKING_VERIFY_BACKEND_URL` pointing at a live API. Without either, prove the real error/empty UI — do not skip those sub-features silently.

## Driving conventions

- Start every recipe from the baseline origin unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position. Copy is German.
- Treat every helper command as literal. Keep quoted names and flags unchanged.
- Browser clicks/fills go through Cursor browser or CDP against `control-clinic-ranking origin`.
- HTTP and Chrome captures go through `control-clinic-ranking fetch|snapshot|screenshot`.
- `/` has **no** `AppSiteHeader`. Header nav exists on `/app/*`, `/legal/*`, and `/verify`. Footer is hidden on `/app/submit` and `/app/submit/success`.
- Desktop reviews table (`role="link"` rows) is `md+`. Below that, reviews are card `link`s. Drive the viewport you claim.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a screenshot with the heading visible and either a dump-dom snapshot or SSR `fetch`.
- Mutation proof includes a second user-facing view (reload, other route, or query-string change).
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted URL and the unmet precondition (usually no backend).
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-clinic-ranking` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Landing and ranking](./landing.md) covers the marketing homepage, both CTAs, header/footer chrome on app routes, and the ranking placeholder.
- [Reviews](./reviews.md) covers the filterable list, empty/error states, pagination, and review detail.
- [Submit a review](./submit-review.md) covers the seven-step form, draft persistence, validation, and success.
- [Feedback](./feedback.md) covers both form types, client validation, submit, and the success screen.
- [Legal pages](./legal.md) covers Impressum, Datenschutzerklärung, and AGB from the footer.
- [Verify email](./verify-email.md) covers the public `/verify` consume page (dead link, failed consume, success).
