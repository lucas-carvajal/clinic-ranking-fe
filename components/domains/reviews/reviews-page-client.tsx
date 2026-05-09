"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo } from "react";

import { ReviewsPagerControls } from "@/components/domains/reviews/reviews-pager-controls";
import { ReviewsResults } from "@/components/domains/reviews/reviews-results";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mapToUiError } from "@/lib/api/errors";
import {
  buildAppReviewsHref,
  coerceReviewsParamsFromUrl,
  parseReviewsUrlParams,
  type ReviewsFilterParams,
} from "@/lib/domains/pagination/reviews-url";
import {
  useCities,
  useHospitals,
  useSpecialties,
  useStates,
} from "@/lib/domains/options/hooks";
import { useReviewsPager } from "@/lib/domains/reviews/pager/use-reviews-pager";

export function ReviewsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKey = searchParams.toString();
  const { normalized, didCoerce } = useMemo(() => {
    const raw = parseReviewsUrlParams(new URLSearchParams(urlKey));
    // The new pager owns the `page` query param; strip any stray `cursor` from URL too.
    delete raw.cursor;
    const coerced = coerceReviewsParamsFromUrl(raw);
    return { normalized: coerced.params, didCoerce: coerced.didCoerce };
  }, [urlKey]);

  // The filter object is used as a stable identity for filters only.
  const filters: ReviewsFilterParams = normalized;

  // If the URL contained an invalid filter combination (e.g. orphan city), clean it up.
  useLayoutEffect(() => {
    if (didCoerce) {
      router.replace(buildAppReviewsHref(filters), { scroll: false });
    }
  }, [didCoerce, filters, router]);

  const pager = useReviewsPager(filters);

  const { data: statesRes } = useStates();
  const { data: specialtiesRes } = useSpecialties();
  const { data: citiesRes } = useCities(filters.state);
  const { data: hospitalsRes } = useHospitals({
    state: filters.state,
    city: filters.city,
  });

  const states = statesRes?.data ?? [];
  const specialties = specialtiesRes?.data ?? [];
  const cities = citiesRes?.data ?? [];
  const hospitals = hospitalsRes?.data ?? [];

  // Filter changes drop `?page` and `?cursor` automatically because we rebuild
  // the URL from `filters` only. The pager hook resets cursors internally
  // because the `filtersKey` changes.
  const updateFilters = useCallback(
    (next: ReviewsFilterParams) => {
      router.replace(buildAppReviewsHref(next), { scroll: false });
    },
    [router],
  );

  const handleStateChange = (value: string) =>
    updateFilters({
      ...filters,
      state: value || undefined,
      city: undefined,
      hospital: undefined,
    });

  const handleCityChange = (value: string) =>
    updateFilters({
      ...filters,
      city: value || undefined,
      hospital: undefined,
    });

  const handleHospitalChange = (value: string) =>
    updateFilters({ ...filters, hospital: value || undefined });

  const handleSpecialtyChange = (value: string) =>
    updateFilters({ ...filters, specialty: value || undefined });

  const selectClass =
    "border-input bg-background text-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2";

  const uiError = pager.isError ? mapToUiError(pager.error) : undefined;

  return (
    <div className="text-foreground mx-auto w-full max-w-7xl px-3 py-4 md:p-4">
      <h1 className="mb-6 text-3xl font-bold">Alle Bewertungen</h1>

      <div className="mb-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-specialty">Fachrichtung</Label>
          <select
            id="filter-specialty"
            className={selectClass}
            value={filters.specialty ?? ""}
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
            value={filters.state ?? ""}
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
            disabled={!filters.state}
            className={selectClass}
            value={filters.city ?? ""}
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
            disabled={!filters.state}
            className={selectClass}
            value={filters.hospital ?? ""}
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

      {pager.isLoading ? (
        <p className="text-muted-foreground text-center">Lade Bewertungen...</p>
      ) : null}

      {pager.isError && uiError ? (
        <div
          className="border-border bg-destructive/10 text-destructive mb-4 rounded-md border px-4 py-3 text-sm"
          role="alert"
        >
          <p>{uiError.message}</p>
          <Button className="mt-3" type="button" onClick={pager.refresh}>
            Aktualisieren
          </Button>
        </div>
      ) : null}

      {!pager.isLoading && !pager.isError && pager.rows.length === 0 ? (
        <p className="text-muted-foreground text-center">
          Keine Bewertungen gefunden
        </p>
      ) : null}

      {!pager.isLoading && !pager.isError && pager.rows.length > 0 ? (
        <ReviewsResults data={pager.rows} />
      ) : null}

      {!pager.isLoading && !pager.isError && pager.rows.length > 0 ? (
        <ReviewsPagerControls
          currentPage={pager.currentPage}
          visitedPages={pager.visitedPages}
          hasNext={pager.hasNext}
          isFetching={pager.isFetching}
          onGoToPage={pager.goToPage}
          onNext={pager.next}
          onPrev={pager.prev}
        />
      ) : null}
    </div>
  );
}
