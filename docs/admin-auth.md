# Admin Auth Flow

This document explains how admin authentication works in this repository end-to-end.

## Goals

- protect all `/admin/*` routes except `/admin/login`
- rely on backend-owned session auth as the source of truth
- avoid fetching private admin data before a valid backend session is confirmed

## Core components

- `proxy.ts`
  - request-time gate for `/admin/:path*`
  - checks cookie presence on the hot path
  - only calls backend `/admin/me` on `/admin/login` when a session cookie is present
- `lib/admin/require-admin-user.ts`
  - authoritative server-side session check
  - calls backend `/admin/me` with incoming cookie header
  - redirects to login on 401 or transient errors (fail closed)
- `app/(admin)/admin/(protected)/layout.tsx`
  - wraps protected admin pages
  - calls `requireAdminUser()` before rendering children
- `lib/admin/get-safe-admin-redirect.ts`
  - sanitizes redirect values to allow only relative `/admin...` paths

## Two proxies: do not confuse them

- root `proxy.ts`: route gate for admin navigation/auth checks
- `app/api/proxy/[...path]/route.ts`: API proxy route for browser API calls

`requireAdminUser()` and the root `proxy.ts` use `BACKEND_URL` directly for auth checks.
They do not call `/api/proxy/admin/me`.

## Request flow

### 1) Anonymous user opens `/admin/review-requests`

- root `proxy.ts` sees no session cookie
- redirect to `/admin/login?redirect=/admin/review-requests`

### 2) User opens `/admin/login` with no cookie

- root `proxy.ts` allows request
- login page renders

### 3) User opens `/admin/login` with session cookie

- root `proxy.ts` calls backend `/admin/me`
- if 200: redirect to safe admin target (`redirect` query if safe, else `/admin`)
- if non-200 or network failure: stay on login page

### 4) User opens protected admin route with cookie

- root `proxy.ts` allows request through (cookie presence)
- `(protected)` layout runs `requireAdminUser()`
- `requireAdminUser()` calls backend `/admin/me`
  - 200: render page
  - 401/5xx/network error: redirect to login (fail closed)

## Environment contract

Required:

- `BACKEND_URL`: backend base URL reachable from Next.js server runtime
- `SESSION_COOKIE_NAME`: cookie name set by backend in `Set-Cookie`

Critical rule:

- `SESSION_COOKIE_NAME` must exactly match the backend-issued cookie name.

Examples:

- backend sends `Set-Cookie: admin_auth_token=...` -> `SESSION_COOKIE_NAME=admin_auth_token`
- backend sends `Set-Cookie: admin_session=...` -> `SESSION_COOKIE_NAME=admin_session`

If this value is wrong, valid admin sessions will be treated as logged out.

## Logout (no backend endpoint)

There is **no** backend logout route. Sign-out clears the session **in the browser** by
issuing a new `Set-Cookie` for the same cookie name with an **empty value** and
`Expires` / `maxAge: 0` — implemented in `clearAdminSession()` using Next **`cookies()`**
from a **Server Action** (`adminLogoutAction`). Client-side script never reads or writes
the cookie. **`localStorage` is not cleared** (public submit drafts stay intact).

### Caveat: backend JWT remains valid until natural expiry

The Next-side logout removes the cookie from the **browser**, but it does **not** revoke
the JWT on the backend — the backend issues short-lived JWTs (currently 24h per
[`clinic-ranking-backend/docs/api.md`](../../clinic-ranking-backend/docs/api.md) §
Authentication) and there is no revocation endpoint. This is acceptable because:

- the cookie is `httpOnly`, so client-side JS can never read it
- after logout, the browser no longer sends the cookie on requests, so the JWT cannot
  reach the backend through normal use
- a leaked cookie value would already be exploitable until natural expiry whether or
  not the user clicks "logout" — adding a backend revocation endpoint would not change
  that without a separate session-store + check on every authenticated request

If the threat model changes (e.g. shared-machine usage where copy-pasting cookies is a
realistic risk), revisit by adding a backend revocation endpoint and calling it from
`adminLogoutAction` before `clearAdminSession()`.

## Security model

- cookie presence checks in root `proxy.ts` are UX/efficiency, not final auth
- `requireAdminUser()` is the frontend's authoritative gate
- backend remains ultimate authority; backend `/admin/*` endpoints must still enforce auth

This layered model ensures frontend mistakes degrade to broken UX, not data exposure.

## Troubleshooting

### Symptom: login succeeds but user is redirected back to `/admin/login`

Check:

- `SESSION_COOKIE_NAME` matches backend cookie name exactly
- backend `/admin/me` returns 200 when called with session cookie
- `BACKEND_URL` is correct and reachable from server runtime

### Symptom: admin page flashes then redirects to login

Likely causes:

- backend `/admin/me` returns 401 (invalid/expired session)
- backend transient failure (5xx/network), currently fail-closed by design
