# Clinic Ranking FE

Next.js App Router frontend for [Assistenz Arzt Ranking](https://assistenz-arzt-ranking.de) — the clinic ranking website, backed by a Go backend.

## Local Setup

Install dependencies:

```bash
npm install
```

Copy environment variables and set at least `BACKEND_URL` and `SITE_URL`:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run format
npm run test:e2e
```

`test:e2e` is intentionally a documented placeholder. Playwright is not configured yet; E2E coverage belongs to later QA/regression work.

## Foundation

- Next.js App Router with TypeScript strict mode.
- Tailwind CSS v4.
- shadcn/ui v4 configured via `components.json`.
- TanStack Query wired through `components/providers/QueryProvider.tsx`.
- Vitest, React Testing Library, user-event, jest-dom, and jsdom for unit, hook, and component tests.
- Production builds use `next.config.ts` with `output: "standalone"`.
- Domain logic lives under `lib/domains/*`; shared API helpers under `lib/api/*`.

## App structure (routes)

Route groups in parentheses do not affect URLs. Top-level layout (`app/layout.tsx`) wraps all pages with the global footer (`SiteFooter`) and sets root metadata (`metadataBase`, default title/description).

| URL | Source | Notes |
|-----|--------|-------|
| `/` | `app/(public)/page.tsx` | Marketing landing |
| `/legal/*` | `app/(public)/legal/` | Imprint, privacy, terms — nested layout adds `AppSiteHeader` |
| `/app/reviews` | `app/app/reviews/` | Paginated reviews table (TanStack Query + Table) |
| `/app/review/[id]` | `app/app/review/[id]/` | Review detail (server-fetched for metadata/SSR) |
| `/app/submit` | `app/app/submit/` | Multi-step review submission form |
| `/app/submit/success` | `app/app/submit/success/` | Post-submit confirmation (`noindex`) |
| `/app/ranking` | `app/app/ranking/` | Ranking placeholder |
| `/app/feedback` | `app/app/feedback/` | Public feedback form (server action → backend) |
| `/admin/login` | `app/(admin)/admin/login/` | Admin login (`noindex`) |
| `/admin/*` | `app/(admin)/admin/(protected)/` | Protected admin shell (`noindex`) — review requests, feedback list |

Public user-facing features under `/app/*` live at `app/app/` (not inside a route group) and share `AppSiteHeader`. Admin tooling lives under `app/(admin)/admin/` with `proxy.ts` cookie gating and `requireAdminUser()` for server-side session validation.

Browser API calls go through `app/api/proxy/[...path]` to the Go backend (`BACKEND_URL`). Server components and actions use `lib/api/server.ts` directly.

## SEO

- **`SITE_URL`** — public origin used by `lib/site-url.ts`, `app/robots.ts`, `app/sitemap.ts`, and root `metadataBase` for canonical URLs.
- **`/robots.txt`** — allows public routes; disallows `/admin` and `/api`.
- **`/sitemap.xml`** — static marketing/app/legal routes plus paginated `GET /reviews` IDs when `BACKEND_URL` is reachable at build time (falls back to static routes only if the backend is down).
- Admin pages and `/app/submit/success` set `robots: noindex`.

## UI Components

The shadcn generator is configured to write primitives to `components/ui` and shared helpers to `lib`. Add future components with:

```bash
npx shadcn@latest add <component>
```

Visual design rules live in `docs/design-philosophy.md`.

## Environment

Create local env values from the example (the repo only tracks **`.env.example`**; **`.env`** is gitignored):

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| **`BACKEND_URL`** | **Yes** (for real API/admin/build sitemap) | Base URL of the Go backend. Used by `app/api/proxy/[...path]`, `lib/api/server.ts` (server actions, admin auth, review detail SSR), `proxy.ts` admin `/admin/me` checks, feedback submit, and sitemap review-ID pagination (`lib/seo/fetch-all-review-ids.ts`). Example: `http://localhost:8080`. |
| **`SESSION_COOKIE_NAME`** | No — defaults to `admin_auth_token` | **Must exactly match** the session cookie name in backend `Set-Cookie` after login. Used by `proxy.ts`, `requireAdminUser()`, and logout cookie clearing. See [Admin Session Cookie Contract](#admin-session-cookie-contract) below. |
| **`SITE_URL`** | **Yes** (required for `next build`) | Public origin of this Next app (e.g. `http://localhost:3000` in dev, `https://assistenz-arzt-ranking.de` in prod). Used at build and runtime for `robots.ts`, `sitemap.ts`, page `metadataBase`/canonicals, and `alternates.canonical` on key routes. |
| **`NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`** | No | Optional public token. Not wired in application code yet; leave empty. |
| **`NODE_ENV`** | Automatic | Set by Next.js (`development` / `production`). Do not put in `.env` unless you know you need an override. |

All keys and comments also live in **`.env.example`**.

### Production / CI

`npm run build` requires **`SITE_URL`** (throws via `getSiteUrl()` if missing). For a complete sitemap including review detail URLs, **`BACKEND_URL`** must point at a reachable backend during the build. Admin routes additionally need both vars at runtime.

## Admin Session Cookie Contract

`SESSION_COOKIE_NAME` is a contract between frontend and backend:

- Backend sets the cookie name in login responses (`Set-Cookie: <name>=...`).
- Frontend root `proxy.ts` checks presence of that same cookie name for `/admin/*`.
- Frontend `requireAdminUser()` forwards incoming cookies to backend `/admin/me` for authoritative validation.
- The cookie name is **not** a display label and should not be renamed frontend-only.

Always set `SESSION_COOKIE_NAME` to the exact cookie name the backend issues in the current environment.

See `docs/admin-auth.md` for the full admin cookie contract and troubleshooting notes.