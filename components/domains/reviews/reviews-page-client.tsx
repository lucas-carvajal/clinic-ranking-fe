"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { ReviewsResults } from "@/components/domains/reviews/reviews-results";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mapToUiError } from "@/lib/api/errors";
import { fetchReviewsList } from "@/lib/domains/reviews/api";
import { reviewsKeys } from "@/lib/domains/reviews/keys";
import {
  buildAppReviewsHref,
  coerceReviewsParamsFromUrl,
  isReviewsCursorLikelyValid,
  parseReviewsUrlParams,
  withResetCursorOnFilterChange,
  type ReviewsFilterParams,
} from "@/lib/domains/pagination/reviews-url";
import { useCursorPagination } from "@/lib/domains/pagination/use-cursor-pagination";
import {
  useCities,
  useHospitals,
  useSpecialties,
  useStates,
} from "@/lib/domains/options/hooks";

export function ReviewsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKey = searchParams.toString();
  const { normalized, didCoerce } = useMemo(() => {
    const raw = parseReviewsUrlParams(new URLSearchParams(urlKey));
    const coerced = coerceReviewsParamsFromUrl(raw);
    return { normalized: coerced.params, didCoerce: coerced.didCoerce };
  }, [urlKey]);

  const params = normalized;
  const cursorPagination = useCursorPagination({
    cursor: params.cursor,
    isCursorLikelyValid: isReviewsCursorLikelyValid,
  });

  useLayoutEffect(() => {
    if (didCoerce) {
      router.replace(buildAppReviewsHref(params), { scroll: false });
    }
  }, [didCoerce, params, router]);

  useLayoutEffect(() => {
    if (didCoerce) {
      return;
    }
    const resolution = cursorPagination.resolveInvalidCursor();
    if (!resolution.didReset) {
      return;
    }
    router.replace(
      buildAppReviewsHref({ ...params, cursor: undefined }),
      { scroll: false },
    );
  }, [cursorPagination, didCoerce, params, router]);

  const filterSnap = [
    params.state ?? "",
    params.city ?? "",
    params.hospital ?? "",
    params.specialty ?? "",
  ].join("|");

  const prevFilterSnap = useRef<string | null>(null);
  useEffect(() => {
    if (prevFilterSnap.current === null) {
      prevFilterSnap.current = filterSnap;
      return;
    }
    if (prevFilterSnap.current !== filterSnap) {
      cursorPagination.reset();
      prevFilterSnap.current = filterSnap;
    }
  }, [cursorPagination, filterSnap]);

  const { data: statesRes } = useStates();
  const { data: specialtiesRes } = useSpecialties();
  const { data: citiesRes } = useCities(params.state);
  const { data: hospitalsRes } = useHospitals({
    state: params.state,
    city: params.city,
  });

  const states = statesRes?.data ?? [];
  const specialties = specialtiesRes?.data ?? [];
  const cities = citiesRes?.data ?? [];
  const hospitals = hospitalsRes?.data ?? [];

  const reviewsQuery = useQuery({
    queryKey: reviewsKeys.list(params),
    queryFn: () => fetchReviewsList(params),
    staleTime: 0,
  });

  const pushParams = useCallback(
    (next: ReviewsFilterParams, replace: boolean) => {
      const href = buildAppReviewsHref(next);
      if (replace) {
        router.replace(href, { scroll: false });
        return;
      }
      router.push(href, { scroll: false });
    },
    [router],
  );

  const updateFilters = useCallback(
    (
      mutator: (current: ReviewsFilterParams) => ReviewsFilterParams,
      replace = true,
    ) => {
      const draft = mutator(params);
      const merged = withResetCursorOnFilterChange(params, draft);
      cursorPagination.reset();
      pushParams(merged, replace);
    },
    [cursorPagination, params, pushParams],
  );

  const handleStateChange = (value: string) => {
    updateFilters(() => ({
      ...params,
      state: value || undefined,
      city: undefined,
      hospital: undefined,
      cursor: undefined,
    }));
  };

  const handleCityChange = (value: string) => {
    updateFilters(() => ({
      ...params,
      city: value || undefined,
      hospital: undefined,
      cursor: undefined,
    }));
  };

  const handleHospitalChange = (value: string) => {
    updateFilters(() => ({
      ...params,
      hospital: value || undefined,
      cursor: undefined,
    }));
  };

  const handleSpecialtyChange = (value: string) => {
    updateFilters(() => ({
      ...params,
      specialty: value || undefined,
      cursor: undefined,
    }));
  };

  const handleNextPage = () => {
    const nextCursor = reviewsQuery.data?.pagination.nextCursor;
    if (!reviewsQuery.data?.pagination.hasNext || !nextCursor) {
      return;
    }
    const step = cursorPagination.goNext(nextCursor);
    if (!step) {
      return;
    }
    pushParams({ ...params, cursor: step.cursor }, false);
  };

  const handlePrevPage = () => {
    const step = cursorPagination.goPrev();
    if (!step) {
      return;
    }
    pushParams({ ...params, cursor: step.cursor }, true);
  };

  const clearCursorAndRefetch = () => {
    cursorPagination.reset();
    pushParams({ ...params, cursor: undefined }, true);
  };

  const selectClass =
    "border-input bg-background text-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2";

  const rows = reviewsQuery.data?.data ?? [];
  const pagination = reviewsQuery.data?.pagination;
  const uiError = reviewsQuery.isError
    ? mapToUiError(reviewsQuery.error)
    : undefined;

  return (
    <div className="text-foreground mx-auto w-full max-w-7xl px-3 py-4 md:p-4">
      <h1 className="mb-6 text-3xl font-bold">Alle Bewertungen</h1>

      <div className="mb-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-specialty">Fachrichtung</Label>
          <select
            id="filter-specialty"
            className={selectClass}
            value={params.specialty ?? ""}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
          >
            <option value="">Alle Fachrichtungen</option>
            {specialties.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-state">Bundesland</Label>
          <select
            id="filter-state"
            className={selectClass}
            value={params.state ?? ""}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">Alle Bundesländer</option>
            {states.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-city">Stadt</Label>
          <select
            id="filter-city"
            disabled={!params.state}
            className={selectClass}
            value={params.city ?? ""}
            onChange={(e) => handleCityChange(e.target.value)}
          >
            <option value="">Alle Städte</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-hospital">Krankenhaus</Label>
          <select
            id="filter-hospital"
            disabled={!params.state}
            className={selectClass}
            value={params.hospital ?? ""}
            onChange={(e) => handleHospitalChange(e.target.value)}
          >
            <option value="">Alle Krankenhäuser</option>
            {hospitals.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {reviewsQuery.isLoading ? (
        <p className="text-muted-foreground text-center">Lade Bewertungen...</p>
      ) : null}

      {reviewsQuery.isError && uiError ? (
        <div
          className="border-border bg-destructive/10 text-destructive mb-4 rounded-md border px-4 py-3 text-sm"
          role="alert"
        >
          <p>{uiError.message}</p>
          {params.cursor ? (
            <Button className="mt-3" type="button" onClick={clearCursorAndRefetch}>
              Zur ersten Seite
            </Button>
          ) : null}
        </div>
      ) : null}

      {!reviewsQuery.isLoading &&
      !reviewsQuery.isError &&
      rows.length === 0 ? (
        <p className="text-muted-foreground text-center">
          Keine Bewertungen gefunden
        </p>
      ) : null}

      {!reviewsQuery.isLoading && !reviewsQuery.isError && rows.length > 0 ? (
        <ReviewsResults data={rows} />
      ) : null}

      {pagination && rows.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {cursorPagination.canGoPrev ? (
            <Button type="button" variant="outline" onClick={handlePrevPage}>
              Zurück
            </Button>
          ) : null}
          {pagination.hasNext ? (
            <Button type="button" onClick={handleNextPage}>
              Weiter
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
