# Clinic Ranking FE

Next.js App Router rewrite scaffold for Clinic Ranking.

## Local Setup

Install dependencies:

```bash
npm install
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

`test:e2e` is intentionally a documented placeholder in T01. Playwright is
not configured yet; E2E coverage belongs to the later QA/regression work.

## Foundation

- Next.js App Router with TypeScript strict mode.
- Tailwind CSS v4.
- shadcn/ui v4 configured via `components.json`.
- TanStack Query wired through `components/providers/QueryProvider.tsx`.
- Vitest, React Testing Library, user-event, jest-dom, and jsdom for unit,
  hook, and component tests.
- Production builds use `next.config.ts` with `output: "standalone"`.

## App structure (routes)

Route groups in parentheses do not affect URLs. Top-level layout (`app/layout.tsx`)
wraps all pages with the global footer (`SiteFooter`). Public marketing content
lives under `app/(public)/` (for example the home page at `/`). Legal pages under
`/legal/*` use a nested layout that adds the public app header (`AppSiteHeader`).
Authenticated user-facing features under `/app/*` use `app/(authed)/app/` and
share the same header. Admin tooling lives under `app/(admin)/admin/` with a
protected layout that adds the admin sidebar (`AdminSidebar`).

## UI Components

The shadcn generator is configured to write primitives to `components/ui` and
shared helpers to `lib`. Add future components with:

```bash
npx shadcn@latest add <component>
```

## Environment

Create local env values from the example (the repo only tracks **`.env.example`**;
**`.env`** is gitignored):

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| **`BACKEND_URL`** | **Yes** (for real API/admin) | Base URL of the Go backend. Used by `app/api/proxy/[...path]`, server-side fetch helpers, `proxy.ts` admin `/admin/me` checks, and actions such as feedback submit. Example: `http://localhost:8080`. |
| **`SESSION_COOKIE_NAME`** | No — defaults to `admin_auth_token` | **Must exactly match** the session cookie name in backend `Set-Cookie` after login. Used by `proxy.ts`, `requireAdminUser()`, and logout cookie clearing. See [Admin Session Cookie Contract](#admin-session-cookie-contract) below. |
| **`SITE_URL`** | Recommended locally | Public origin of this Next app (e.g. `http://localhost:3000`). Documented for future sitemap/robots/canonical work; set it to your dev URL so it is ready when those features read this variable. |
| **`NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`** | No | Optional public token. Not wired in application code yet; leave empty. |
| **`NODE_ENV`** | Automatic | Set by Next.js (`development` / `production`). Do not put in `.env` unless you know you need an override. |

All keys and comments also live in **`.env.example`**.

## Admin Session Cookie Contract

`SESSION_COOKIE_NAME` is a contract between frontend and backend:

- Backend sets the cookie name in login responses (`Set-Cookie: <name>=...`).
- Frontend root `proxy.ts` checks presence of that same cookie name for `/admin/*`.
- Frontend `requireAdminUser()` forwards incoming cookies to backend `/admin/me` for
  authoritative validation.
- The cookie name is **not** a display label and should not be renamed frontend-only.

Always set `SESSION_COOKIE_NAME` to the exact cookie name the backend issues in the
current environment.

See `docs/admin-auth.md` for the full admin cookie contract and troubleshooting notes.
