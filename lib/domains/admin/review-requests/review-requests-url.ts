const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === "") {
    return fallback;
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    return fallback;
  }
  return n;
}

export type AdminReviewRequestsUrlParams = {
  page: number;
  pageSize: number;
};

/**
 * Parses `page` and `page_size` from the URL. Non-numeric values fall back to defaults
 * (parity with the Go backend list handler).
 */
export function parseAdminReviewRequestsSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): AdminReviewRequestsUrlParams {
  const pageRaw = searchParams.page;
  const pageSizeRaw = searchParams.page_size;

  const pageStr = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw;
  const pageSizeStr = Array.isArray(pageSizeRaw) ? pageSizeRaw[0] : pageSizeRaw;

  const page = parsePositiveInt(pageStr, DEFAULT_PAGE);
  let pageSize = parsePositiveInt(pageSizeStr, DEFAULT_PAGE_SIZE);
  if (pageSize > MAX_PAGE_SIZE) {
    pageSize = MAX_PAGE_SIZE;
  }

  return { page, pageSize };
}

export function buildAdminReviewRequestsHref(params: AdminReviewRequestsUrlParams): string {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("page_size", String(params.pageSize));
  return `/admin/review-requests?${sp.toString()}`;
}

/**
 * Returns true when the URL should be normalized (invalid numbers, out-of-range page_size
 * before clamping, or page/page_size disagreeing with the parsed params used for the fetch).
 */
export function adminReviewRequestsUrlNeedsCoercion(
  sp: URLSearchParams,
  urlParams: AdminReviewRequestsUrlParams,
): boolean {
  const pageRaw = sp.get("page");
  const pageSizeRaw = sp.get("page_size");
  if (pageRaw === null && pageSizeRaw === null) {
    return false;
  }

  if (pageRaw !== null && pageRaw !== "") {
    const n = Number.parseInt(pageRaw, 10);
    if (!Number.isFinite(n) || n < 1 || n !== urlParams.page) {
      return true;
    }
  }

  if (pageSizeRaw !== null && pageSizeRaw !== "") {
    const n = Number.parseInt(pageSizeRaw, 10);
    if (!Number.isFinite(n) || n < 1) {
      return true;
    }
    const effective = Math.min(n, MAX_PAGE_SIZE);
    if (effective !== urlParams.pageSize || n !== urlParams.pageSize) {
      return true;
    }
  }

  return false;
}
