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

export type AdminFeedbackUrlParams = {
  page: number;
  pageSize: number;
};

export function parseAdminFeedbackSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): AdminFeedbackUrlParams {
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

export function buildAdminFeedbackHref(params: AdminFeedbackUrlParams): string {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("page_size", String(params.pageSize));
  return `/admin/feedback?${sp.toString()}`;
}

export function adminFeedbackUrlNeedsCoercion(
  sp: URLSearchParams,
  urlParams: AdminFeedbackUrlParams,
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
