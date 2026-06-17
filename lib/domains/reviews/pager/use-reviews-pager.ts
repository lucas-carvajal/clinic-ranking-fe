"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";

import { fetchReviewsList } from "@/lib/domains/reviews/api";
import {
  serializeReviewsUrlParams,
  type ReviewsFilterParams,
} from "@/lib/domains/pagination/reviews-url";
import { useReviewsPagerContext } from "@/lib/domains/reviews/pager/reviews-pager-context";

const REVIEWS_QUERY_KEY_PREFIX = "reviews" as const;

function serializeFiltersKey(filters: ReviewsFilterParams): string {
  return JSON.stringify({
    state: filters.state ?? "",
    city: filters.city ?? "",
    hospital: filters.hospital ?? "",
    specialty: filters.specialty ?? "",
  });
}

function parsePageFromUrl(sp: URLSearchParams): { page: number; wasInvalid: boolean } {
  const raw = sp.get("page");
  if (!raw) return { page: 1, wasInvalid: false };
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1)
    return { page: 1, wasInvalid: true };
  return { page: n, wasInvalid: false };
}

function buildReviewsUrl(filters: ReviewsFilterParams, page: number): string {
  const sp = serializeReviewsUrlParams({ ...filters, cursor: undefined });
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `/app/reviews${qs ? `?${qs}` : ""}`;
}

export type UseReviewsPagerResult = {
  rows: ReturnType<typeof useQuery>["data"] extends infer T
    ? T extends { data: infer R }
      ? R
      : never
    : never;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;

  currentPage: number;
  visitedPages: number;
  hasNext: boolean;

  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
  refresh: () => void;
};

export function useReviewsPager(filters: ReviewsFilterParams) {
  const ctx = useReviewsPagerContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const filtersKey = useMemo(() => serializeFiltersKey(filters), [filters]);
  const { page: requestedPage, wasInvalid: pageParamWasInvalid } = useMemo(
    () => parsePageFromUrl(searchParams),
    [searchParams],
  );

  // Reset cursor list when filters change.
  useLayoutEffect(() => {
    if (ctx.state.filtersKey !== filtersKey) {
      ctx.reset(filtersKey);
    }
  }, [ctx, filtersKey]);

  // Determine the actual reachable page given the cursor list.
  // While filters are not yet aligned with context, treat as page 1 to avoid flashes.
  const filtersAligned = ctx.state.filtersKey === filtersKey;
  const reachablePage = filtersAligned
    ? Math.min(Math.max(1, requestedPage), ctx.state.cursors.length)
    : 1;
  const currentPage = reachablePage;

  // If the URL page param is unreachable or invalid (cold load, manual edit), fix the URL.
  useLayoutEffect(() => {
    if (!filtersAligned) return;
    if (requestedPage !== currentPage || pageParamWasInvalid) {
      router.replace(buildReviewsUrl(filters, currentPage), { scroll: false });
    }
  }, [filtersAligned, requestedPage, currentPage, pageParamWasInvalid, filters, router]);

  // Cursor for the current page (null = first page, no cursor).
  const currentCursor = filtersAligned
    ? (ctx.state.cursors[currentPage - 1] ?? null)
    : null;

  const query = useQuery({
    queryKey: [REVIEWS_QUERY_KEY_PREFIX, "list", filtersKey, currentCursor ?? "@first"],
    queryFn: () =>
      fetchReviewsList({
        ...filters,
        cursor: currentCursor ?? undefined,
      }),
    staleTime: 60_000,
  });

  // After every successful fetch at the frontier, store the cursor for the next page
  // so we know it's reachable.
  useEffect(() => {
    if (!filtersAligned) return;
    const data = query.data;
    if (!data) return;
    const nextCursor = data.pagination.nextCursor;
    if (data.pagination.hasNext && nextCursor) {
      const nextPageIndex = currentPage; // pageIndex for page (currentPage + 1)
      if (ctx.state.cursors[nextPageIndex] !== nextCursor) {
        ctx.setCursorAt(nextPageIndex, nextCursor);
      }
    }
  }, [filtersAligned, currentPage, query.data, ctx]);

  const goToPage = useCallback(
    (target: number) => {
      const max = Math.max(1, ctx.state.cursors.length);
      const clamped = Math.min(Math.max(1, target), max);
      if (clamped === currentPage) return;
      router.push(buildReviewsUrl(filters, clamped), { scroll: false });
    },
    [ctx.state.cursors.length, currentPage, filters, router],
  );

  const next = useCallback(() => {
    const data = query.data;
    if (!data?.pagination.hasNext) return;
    const nextCursor = data.pagination.nextCursor;
    if (!nextCursor) return;

    const nextPageIndex = currentPage;
    // Make sure the cursor is recorded synchronously (same React batch as the URL push)
    // so the next render can fetch the correct page even before the data effect fires.
    if (ctx.state.cursors[nextPageIndex] !== nextCursor) {
      ctx.setCursorAt(nextPageIndex, nextCursor);
    }
    router.push(buildReviewsUrl(filters, currentPage + 1), { scroll: false });
  }, [ctx, currentPage, filters, query.data, router]);

  const prev = useCallback(() => {
    if (currentPage <= 1) return;
    router.push(buildReviewsUrl(filters, currentPage - 1), { scroll: false });
  }, [currentPage, filters, router]);

  const refresh = useCallback(() => {
    ctx.reset(filtersKey);
    queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY_PREFIX] });
    router.replace(buildReviewsUrl(filters, 1), { scroll: false });
  }, [ctx, filtersKey, filters, queryClient, router]);

  return {
    rows: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    currentPage,
    visitedPages: filtersAligned ? ctx.state.cursors.length : 1,
    hasNext: query.data?.pagination.hasNext ?? false,

    next,
    prev,
    goToPage,
    refresh,
  };
}
