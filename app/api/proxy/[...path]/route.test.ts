/* @vitest-environment node */
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GET,
  POST,
  isAllowedProxyPath,
  sanitizeSetCookieHeaders,
  stripDomainFromSetCookie,
} from "@/app/api/proxy/[...path]/route";

const originalFetch = global.fetch;
const originalBackendUrl = process.env.BACKEND_URL;

function mockUpstreamHeaders(values: string[]): Headers {
  const headers = new Headers({ "content-type": "application/json" }) as Headers & {
    getSetCookie?: () => string[];
  };
  headers.getSetCookie = () => values;
  return headers;
}

describe("proxy route handler", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    process.env.BACKEND_URL = originalBackendUrl;
    vi.restoreAllMocks();
  });

  it("forwards method/query/body/cookie and response status", async () => {
    process.env.BACKEND_URL = "http://backend.internal:8080";
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    ) as typeof fetch;

    const request = new NextRequest(
      "http://localhost:3000/api/proxy/admin/feedback?page=2",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: "session=abc; csrf=def",
        },
        body: JSON.stringify({ query: "abc" }),
      },
    );

    const response = await POST(request, {
      params: Promise.resolve({ path: ["admin", "feedback"] }),
    });

    expect(response.status).toBe(201);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = vi.mocked(global.fetch).mock.calls[0] as [
      URL,
      RequestInit,
    ];
    expect(url.toString()).toBe("http://backend.internal:8080/admin/feedback?page=2");
    expect(options.method).toBe("POST");
    expect((options.headers as Headers).get("cookie")).toContain("session=abc");
    expect(options.body).toBeTruthy();
  });

  it("rejects paths outside the allowlist with 404 and never contacts the backend", async () => {
    process.env.BACKEND_URL = "http://backend.internal:8080";
    global.fetch = vi.fn() as typeof fetch;

    const request = new NextRequest("http://localhost:3000/api/proxy/metrics");
    const response = await GET(request, {
      params: Promise.resolve({ path: ["metrics"] }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      status: 404,
      code: "PROXY_PATH_NOT_ALLOWED",
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("matches allowlist prefixes on segment boundaries only", () => {
    expect(isAllowedProxyPath("/auth/login")).toBe(true);
    expect(isAllowedProxyPath("/reviews")).toBe(true);
    expect(isAllowedProxyPath("/review")).toBe(true);
    expect(isAllowedProxyPath("/admin/feedback")).toBe(true);
    expect(isAllowedProxyPath("/types/states")).toBe(true);

    expect(isAllowedProxyPath("/auth/register")).toBe(false);
    expect(isAllowedProxyPath("/reviews/search")).toBe(false);
    expect(isAllowedProxyPath("/administrator/me")).toBe(false);
    expect(isAllowedProxyPath("/admin")).toBe(false);
    expect(isAllowedProxyPath("/types")).toBe(false);
    expect(isAllowedProxyPath("/health")).toBe(false);
    expect(isAllowedProxyPath("/debug/pprof")).toBe(false);
  });

  it("returns explicit error when BACKEND_URL is missing", async () => {
    delete process.env.BACKEND_URL;

    const request = new NextRequest("http://localhost:3000/api/proxy/types/states");
    const response = await GET(request, {
      params: Promise.resolve({ path: ["types", "states"] }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toMatchObject({
      status: 500,
      code: "PROXY_BACKEND_URL_MISSING",
    });
  });

  it("strips Domain while preserving cookie attributes", () => {
    const cookie =
      "session=abc; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=backend.internal";
    expect(stripDomainFromSetCookie(cookie)).toBe(
      "session=abc; Path=/; HttpOnly; Secure; SameSite=Lax",
    );
  });

  it("preserves commas in Expires and keeps multiple set-cookie entries", () => {
    const cookieWithExpires =
      "session=abc; Path=/; Expires=Wed, 21 Oct 2026 07:28:00 GMT; HttpOnly; Domain=backend.internal";
    const extraCookie = "csrf=def; Path=/; SameSite=Lax; Domain=backend.internal";

    const sanitized = sanitizeSetCookieHeaders(
      mockUpstreamHeaders([cookieWithExpires, extraCookie]),
    );

    const serialized = sanitized.join(" | ");

    expect(serialized).toContain("Expires=Wed, 21 Oct 2026 07:28:00 GMT");
    expect(serialized).toContain("csrf=def; Path=/; SameSite=Lax");
    expect(serialized).not.toMatch(/Domain=/i);
  });

  it("normalizes unreachable backend errors", async () => {
    process.env.BACKEND_URL = "http://backend.internal:8080";
    global.fetch = vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")) as typeof fetch;

    const request = new NextRequest("http://localhost:3000/api/proxy/types/states");
    const response = await GET(request, {
      params: Promise.resolve({ path: ["types", "states"] }),
    });
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toMatchObject({
      status: 502,
      code: "PROXY_UPSTREAM_UNREACHABLE",
      message: "connect ECONNREFUSED",
    });
  });
});
