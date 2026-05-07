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

## UI Components

The shadcn generator is configured to write primitives to `components/ui` and
shared helpers to `lib`. Add future components with:

```bash
npx shadcn@latest add <component>
```

## Environment

Create local env values from the example:

```bash
cp .env.example .env
```

Environment variables:

- `BACKEND_URL`: Backend base URL used by server-side fetches and the Next.js
  proxy route handler (for example `http://localhost:8080` in local development).
- `SESSION_COOKIE_NAME`: **Must exactly match the cookie name issued by the backend**
  in `Set-Cookie` (for example `session` or `admin_session`). The frontend uses this
  name only to locate the auth cookie for admin gating and backend `/admin/me` checks.
  If it does not match the backend cookie name, authenticated admins will be treated
  as logged out and redirected to `/admin/login`. Defaults to `session`.
- `SITE_URL`: Canonical public app URL used by metadata, sitemap, and robots
  generation (for example `http://localhost:3000` locally).
- `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`: Optional public analytics token.
  Leave empty to disable client analytics injection.

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
