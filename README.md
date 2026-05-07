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

No environment variables are required for this baseline scaffold. Backend
proxying and API configuration will be added in follow-up migration tasks.
