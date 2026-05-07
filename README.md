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
- TanStack Query wired through `components/providers/QueryProvider.tsx`.
- Vitest, React Testing Library, user-event, jest-dom, and jsdom for unit,
  hook, and component tests.
- Production builds use `next.config.ts` with `output: "standalone"`.

## Environment

Create local env values from the example:

```bash
cp .env.example .env
```

Environment variables:

- `BACKEND_URL`: Backend base URL used by server-side fetches and the Next.js
  proxy route handler (for example `http://localhost:8080` in local development).
- `SITE_URL`: Canonical public app URL used by metadata, sitemap, and robots
  generation (for example `http://localhost:3000` locally).
- `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`: Optional public analytics token.
  Leave empty to disable client analytics injection.
