import { useCallback, useMemo } from "react";

export type OffsetPaginationState = {
  page: number;
  pageSize: number;
};

export type OffsetPaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type Options = {
  page: number;
  pageSize: number;
  totalPages?: number;
};

export function clampPage(page: number, totalPages?: number) {
  const safe = Number.isFinite(page) ? Math.floor(page) : 1;
  const min = Math.max(1, safe);
  if (!totalPages || totalPages <= 0) {
    return min;
  }
  return Math.min(min, totalPages);
}

export function parseOffsetPaginationParams(searchParams: URLSearchParams) {
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "20");

  return {
    page: clampPage(page),
    pageSize: Math.max(1, Math.floor(Number.isFinite(pageSize) ? pageSize : 20)),
  };
}

export function serializeOffsetPaginationParams(state: OffsetPaginationState) {
  const sp = new URLSearchParams();
  sp.set("page", String(clampPage(state.page)));
  sp.set("page_size", String(Math.max(1, Math.floor(state.pageSize))));
  return sp;
}

export function useOffsetPagination(options: Options) {
  const page = clampPage(options.page, options.totalPages);
  const pageSize = Math.max(1, Math.floor(options.pageSize));

  const setPage = useCallback(
    (nextPage: number) => ({ page: clampPage(nextPage, options.totalPages), pageSize }),
    [options.totalPages, pageSize],
  );

  const next = useCallback(
    () => ({ page: clampPage(page + 1, options.totalPages), pageSize }),
    [page, options.totalPages, pageSize],
  );

  const prev = useCallback(() => ({ page: clampPage(page - 1, options.totalPages), pageSize }), [
    page,
    options.totalPages,
    pageSize,
  ]);

  return useMemo(
    () => ({
      page,
      pageSize,
      setPage,
      next,
      prev,
    }),
    [page, pageSize, setPage, next, prev],
  );
}

