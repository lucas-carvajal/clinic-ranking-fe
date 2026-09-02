---
name: verify-clinic-ranking
description: "Verify the Clinic Ranking FE Next.js web UI (landing, reviews, submit, feedback, legal) by launching an isolated next dev instance and driving it in the browser. Use when proving user-facing behavior, checking a UI change, or after edits to app routes."
---

# Verify Clinic Ranking FE

This skill drives the **Clinic Ranking FE** (`clinic-ranking-fe`) the way a user does. Primary surface is the German-language Next.js App Router website. Secondary surfaces: browser JSON via `/api/proxy/*`, Vitest unit tests, a documented-but-unconfigured `npm run test:e2e` placeholder. Do not treat Vitest or the e2e placeholder as a substitute for this skill.

Write for a later agent that has never seen the app. Follow the feature map in `features/` — a proof that hits one convenient URL is incomplete when the map lists other entry points.

## Launch

Repo root is the directory that contains `.cursor/` (the helper resolves it from `scripts/`). Documented start is `npm run dev` (Next.js 16, default port 3000). Verification does **not** use that default: it binds `127.0.0.1` on an isolated port so a human `npm run dev` on :3000 is never stolen.

Helper (executable; invocations below are literal):

```bash
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking launch
```

The helper:

- Requires `node_modules/next` (run `npm install` at the repo root if missing).
- Does **not** copy `.env`. It exports `SITE_URL` to the isolated origin (required — `getSiteUrl()` throws otherwise), `SESSION_COOKIE_NAME=admin_auth_token`, and `BACKEND_URL=http://127.0.0.1:18080` unless `CLINIC_RANKING_VERIFY_BACKEND_URL` is set. That default backend is unused on purpose so a leftover Go API on :8080 is not shared.
- Starts `npx next dev --hostname 127.0.0.1 --port <port>`.
- Picks port **4173**, then scans upward if taken. Refuses to launch a second **default** instance; a second isolated instance needs a new `CLINIC_RANKING_VERIFY_RUN_ID`.
- Is ready when `GET <origin>/` returns 200 (typically a log line `Local: http://127.0.0.1:<port>` and `Ready in …` as well). Timeout 90s.

Prints `export CLINIC_RANKING_VERIFY_RUN_ID=…`. Later commands reuse that, or the `latest` symlink under `/tmp/clinic-ranking-verify/`.

Teardown is `cleanup` (see Cleanup). Never `pkill -f next`.

## Doctor

Run this first whenever anything looks off, and before the first drive:

```bash
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking doctor
```

It is read-only. Require `ok=true` plus:

- `pid_alive=true` for the PID the launch wrote
- `port_owner=us` or `us-child` (Next may listen on a child)
- `homepage_status=200` and `homepage_has_marker=true` (`Das Assistenz Arzt Ranking` in `/`)
- `robots_disallow_admin=true` (`Disallow: /admin` in `/robots.txt`)

If `port_owner` is `foreign`, **stop**. Driving someone else's process is forbidden. If `ok=false`, do not drive; relaunch after `cleanup`.

Doctor does not require a live Go backend. Features that need one say so in the map — report those `verified-unreachable` with the attempted URL when `BACKEND_URL` does not answer.

## Drive

There is no Playwright/Cypress harness (`npm run test:e2e` is a stub). Drive the **real UI** with Cursor browser / CDP tools against the origin from `control-clinic-ranking origin`. Use the helper for HTTP captures and Chrome screenshots.

```bash
ORIGIN="$(.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking origin)"
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking fetch /
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking snapshot /
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking screenshot /
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking fetch /app/reviews
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking screenshot /app/reviews
```

`fetch` is the HTML document (SSR). `snapshot` is Chrome `--dump-dom` after JS. `screenshot` is a 1280×800 PNG. Prefer **role + accessible name** over CSS or coordinates.

The helper uses the real Chrome binary (`/opt/google/chrome/chrome` when present) and a per-run `--user-data-dir`. Do not point it at a PATH `google-chrome` wrapper that shares the desktop profile — that hangs headless captures.

Stable handles from this repo (German copy is the UI):

| Surface | Handle |
|---|---|
| Landing h1 | heading `Das Assistenz Arzt Ranking` |
| Landing CTAs | link `Jetzt Berichten` → `/app/submit`; link `Bewertungen Ansehen` → `/app/reviews` |
| Landing region | `aria-label="Landing page content"` |
| App header nav | `aria-label="Hauptnavigation"` — **not on `/`**. Links: `Alle Bewertungen`, `Das Ranking`, `Feedback`. CTA link `Bewerten` → `/app/submit`. Logo link goes to `/`. |
| Mobile menu | button `Menü öffnen` / `Menü schließen`; dialog with `aria-modal="true"` |
| Footer (hidden on `/app/submit*`) | links `Impressum`, `Datenschutzerklärung`, `AGB` |
| Reviews h1 | `Alle Bewertungen` |
| Review filters | combobox `Fachrichtung filtern`, `Bundesland filtern`, `Stadt filtern`, `Krankenhaus filtern` (`htmlFor` ids `filter-specialty`, `filter-state`, `filter-city`, `filter-hospital`) |
| Reviews empty | text `Keine Bewertungen gefunden` |
| Reviews loading | `Lade Bewertungen…` |
| Reviews retry | button `Aktualisieren` on the error alert |
| Desktop review row | `role="link"` name `Bewertung <hospital>: Details anzeigen` |
| Pager | `aria-label="Seitennavigation"`; buttons `Vorherige Seite`, `Nächste Seite`, `Seite N` |
| Ranking h1 | `Krankenhaus Ranking` plus `Demnächst verfügbar` |
| Submit sidebar | `aria-label="Formular-Schritte"`; current step `aria-current="step"` |
| Submit step 1 | heading `Dein Krankenhaus`; labels `Bundesland`, `Stadt`, `Krankenhaus`, `Fachrichtung` |
| Submit nav | buttons `Zurück`, `Weiter`; last step `Abschicken`; counter `N / 7` |
| Submit mobile | `role="progressbar"` `Schritt N von 7: <label>` |
| Feedback h1 | `Feedback geben` (or `Feedback zum Bewertungsprozess` when `?type=submission_feedback`) |
| Feedback fields | `Dein Feedback`, `Deine E-Mail-Adresse`; submit `Feedback absenden` |
| Feedback success | heading `Vielen Dank für dein Feedback ❤️`; link `Weiteres Feedback geben` |
| Legal h1s | `Impressum`, `Datenschutzerklärung`, `Allgemeine Geschäftsbedingungen (AGB)` |
| Admin login h1 | `Admin-Anmeldung`; fields `Benutzername`, `Passwort`; submit `Anmelden` |

Open the origin in a **dedicated** browser profile/tab. Do not attach to a user's already-open `localhost:3000`.

Start every recipe from the launched origin unless the feature file says otherwise. After a mutation, confirm with a second user-facing view (reload, other route, or `fetch` of the destination). Do not call test-only endpoints or Vitest as proof of UI behavior.

## Evidence

Store proof under `/tmp/clinic-ranking-verify-evidence/<run-id>/` (printed by `doctor` as `evidence=`). Cleanup must not delete that directory.

Proof standards:

- Exercise the real user path (click the named link/button, fill the labeled field). `fetch` of a destination is supporting evidence, not a substitute for the click unless the browser is unavailable — then say so.
- Capture the **action and the resulting state**, not only the final screen: landing CTA click needs a landing screenshot **and** the destination screenshot.
- Side effects: submit writes `localStorage` keys `clinic-ranking-submit:form-draft` and `clinic-ranking-submit:current-step`; a successful submit navigates to `/app/submit/success` and clears those keys. Feedback success is `?success=true`. List filters change the query string (`state`, `city`, `hospital`, `specialty`, `page`).
- No Go backend is bundled here. Do not mock the UI. When the backend is down, prove the **real** degraded UI (reviews error + `Aktualisieren`; feedback `role="alert"` after submit; submit comboboxes empty/error). Do not invent a passing list.
- Record the feature ID and entry point with every artifact (filename prefix is enough: `landing-cta-reviews-before.png`).

`control-clinic-ranking fetch|snapshot|screenshot` already write into the evidence dir. Browser-tool screenshots should be copied there too.

## Cleanup

```bash
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking cleanup
```

Kills the PID tree recorded at launch (TERM, then KILL), removes `/tmp/clinic-ranking-verify/<run-id>/`, and leaves `/tmp/clinic-ranking-verify-evidence/<run-id>/` in place. After cleanup, confirm evidence still exists at that path.

On a failed iteration, run this same cleanup before the next launch so ports and PIDs are not stranded.

## Helpers

All commands are on:

```bash
.cursor/skills/verify-clinic-ranking/scripts/control-clinic-ranking
```

| Command | Purpose |
|---|---|
| `launch` | Start isolated `next dev`; print run id |
| `doctor` | Read-only health; exit non-zero if not ours |
| `origin` | Print `http://127.0.0.1:<port>` |
| `status` | PID / origin / evidence path |
| `fetch <path>` | Save SSR HTML + `.meta` (status, url) |
| `snapshot <path>` | Chrome dump-dom after JS |
| `screenshot <path>` | Chrome 1280×800 PNG |
| `cleanup` | Tear down the instance we started |

`--out <file>` overrides the evidence path for fetch/snapshot/screenshot.

## Isolate

Two verification instances can run side by side **only** with distinct `CLINIC_RANKING_VERIFY_RUN_ID` values (different ports). The default `launch` refuses if `latest` is still alive. Never drive port 3000 unless `doctor` says this run owns it. Submit drafts live in the browser profile's `localStorage`; use a fresh profile or clear those two keys between submit proofs.

## Out of map (for now)

Admin (`/admin/login`, cookie `admin_auth_token`, `proxy.ts` gating) needs a real backend and credentials. Do not fake a session. If a task is admin-only, report `verified-unreachable` with `/admin/login` as the attempted route.
