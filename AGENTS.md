<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# API proxy allowlist

`app/api/proxy/[...path]/route.ts` only forwards allowlisted backend paths (`isAllowedProxyPath`) and returns 404 for everything else. If you add a client-side feature that calls a new backend route through `lib/api/client.ts`, you MUST add the path to the allowlist in that file — and only do so for routes meant to be reachable from the browser. Server-side calls (`lib/api/server.ts`) bypass the proxy and need no allowlist entry.
