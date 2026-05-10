"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo } from "react";

import { ReviewsPagerControls } from "@/components/domains/reviews/reviews-pager-controls";
import { ReviewsResults } from "@/components/domains/reviews/reviews-results";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { CenteredSpinner } from "@/components/ui/spinner";
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

  const handleStateChange = (value: string | undefined) =>
    updateFilters({
      ...filters,
      state: value,
      city: undefined,
      hospital: undefined,
    });

  const handleCityChange = (value: string | undefined) =>
    updateFilters({
      ...filters,
      city: value,
      hospital: undefined,
    });

  const handleHospitalChange = (value: string | undefined) =>
    updateFilters({ ...filters, hospital: value });

  const handleSpecialtyChange = (value: string | undefined) =>
    updateFilters({ ...filters, specialty: value });

  const toOption = (item: { name: string }): ComboboxOption => ({
    value: item.name,
    label: item.name,
  });

  const specialtyOptions = specialties.map(toOption);
  const stateOptions = states.map(toOption);
  const cityOptions = cities.map(toOption);
  const hospitalOptions = hospitals.map(toOption);

  const uiError = pager.isError ? mapToUiError(pager.error) : undefined;

  return (
    <div className="text-foreground mx-auto w-full max-w-7xl px-3 py-4 md:p-4">
      <h1 className="app-page-heading mb-6">Alle Bewertungen</h1>

      <div className="mb-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-specialty">Fachrichtung</Label>
          <Combobox
            id="filter-specialty"
            placeholder="Alle Fachrichtungen"
            options={specialtyOptions}
            value={filters.specialty}
            onChange={handleSpecialtyChange}
            ariaLabel="Fachrichtung filtern"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-state">Bundesland</Label>
          <Combobox
            id="filter-state"
            placeholder="Alle Bundesländer"
            options={stateOptions}
            value={filters.state}
            onChange={handleStateChange}
            ariaLabel="Bundesland filtern"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-city">Stadt</Label>
          <Combobox
            id="filter-city"
            placeholder="Alle Städte"
            options={cityOptions}
            value={filters.city}
            onChange={handleCityChange}
            disabled={!filters.state}
            ariaLabel="Stadt filtern"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-hospital">Krankenhaus</Label>
          <Combobox
            id="filter-hospital"
            placeholder="Alle Krankenhäuser"
            options={hospitalOptions}
            value={filters.hospital}
            onChange={handleHospitalChange}
            disabled={!filters.state}
            ariaLabel="Krankenhaus filtern"
          />
        </div>
      </div>

      {pager.isLoading ? <CenteredSpinner label="Lade Bewertungen…" /> : null}

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
