import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

type UpstreamHeaders = Headers & {
  getSetCookie?: () => string[];
};

type ProxyHandler = (request: NextRequest, context: RouteContext) => Promise<Response>;

/**
 * Only backend paths the browser actually consumes may pass through the proxy.
 * Everything else (health/metrics/debug endpoints, internal APIs, future backend
 * routes) is rejected with 404 so the proxy does not widen the backend's attack
 * surface — it forwards cookies, so an open proxy would also relay admin sessions.
 * Add new entries here when a client-side feature starts calling a new backend route.
 */
const ALLOWED_EXACT_PATHS = new Set(["/auth/login", "/reviews", "/review"]);
const ALLOWED_PATH_PREFIXES = ["/admin/", "/types/"];

export function isAllowedProxyPath(path: string): boolean {
  return (
    ALLOWED_EXACT_PATHS.has(path) ||
    ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

export function stripDomainFromSetCookie(cookie: string): string {
  return cookie
    .split(";")
    .map((part) => part.trim())
    .filter((part) => !/^domain=/i.test(part))
    .join("; ");
}

function getSetCookieHeaders(headers: Headers): string[] {
  const upstreamHeaders = headers as UpstreamHeaders;
  if (typeof upstreamHeaders.getSetCookie === "function") {
    return upstreamHeaders.getSetCookie();
  }

  return [];
}

export function createForwardResponseHeaders(upstreamHeaders: Headers): Headers {
  const responseHeaders = new Headers(upstreamHeaders);
  responseHeaders.delete("set-cookie");

  for (const cookieValue of sanitizeSetCookieHeaders(upstreamHeaders)) {
    responseHeaders.append("set-cookie", cookieValue);
  }

  return responseHeaders;
}

export function sanitizeSetCookieHeaders(upstreamHeaders: Headers): string[] {
  return getSetCookieHeaders(upstreamHeaders).map(stripDomainFromSetCookie);
}

function normalizeProxyError(status: number, code: string, message: string) {
  return NextResponse.json(
    {
      status,
      code,
      message,
      details: null,
    },
    { status },
  );
}

async function getPathFromContext(context: RouteContext): Promise<string[]> {
  const resolved = await context.params;
  return resolved.path ?? [];
}

async function proxy(request: NextRequest, context: RouteContext): Promise<Response> {
  const pathSegments = await getPathFromContext(context);
  if (!isAllowedProxyPath(`/${pathSegments.join("/")}`)) {
    return normalizeProxyError(
      404,
      "PROXY_PATH_NOT_ALLOWED",
      "The requested path is not exposed through the API proxy.",
    );
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return normalizeProxyError(
      500,
      "PROXY_BACKEND_URL_MISSING",
      "BACKEND_URL is missing. Configure backend URL before using the proxy.",
    );
  }

  const targetUrl = new URL(
    `/${pathSegments.map((segment) => encodeURIComponent(segment)).join("/")}${
      request.nextUrl.search
    }`,
    backendUrl,
  );

  const upstreamHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const cookie = request.headers.get("cookie");
  const userAgent = request.headers.get("user-agent");
  const correlationId =
    request.headers.get("x-correlation-id") ?? request.headers.get("x-request-id");

  if (contentType) upstreamHeaders.set("content-type", contentType);
  if (accept) upstreamHeaders.set("accept", accept);
  if (cookie) upstreamHeaders.set("cookie", cookie);
  if (userAgent) upstreamHeaders.set("user-agent", userAgent);
  if (correlationId) upstreamHeaders.set("x-correlation-id", correlationId);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: upstreamHeaders,
      body,
      redirect: "manual",
      cache: "no-store",
    });
  } catch (error) {
    return normalizeProxyError(
      502,
      "PROXY_UPSTREAM_UNREACHABLE",
      error instanceof Error ? error.message : "Unable to reach backend",
    );
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: createForwardResponseHeaders(upstreamResponse.headers),
  });
}

export const GET: ProxyHandler = proxy;
export const POST: ProxyHandler = proxy;
export const PUT: ProxyHandler = proxy;
export const DELETE: ProxyHandler = proxy;
export const PATCH: ProxyHandler = proxy;
