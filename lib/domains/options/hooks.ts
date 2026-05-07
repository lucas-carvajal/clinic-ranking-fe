import { useQuery } from "@tanstack/react-query";

import {
  fetchCities,
  fetchHospitals,
  fetchSpecialties,
  fetchStates,
} from "@/lib/domains/options/api";
import { optionsKeys } from "@/lib/domains/options/keys";

const LONG_CACHE_MS = 1000 * 60 * 60;
const MEDIUM_CACHE_MS = 1000 * 60 * 10;

export function useStates() {
  return useQuery({
    queryKey: optionsKeys.states(),
    queryFn: fetchStates,
    staleTime: LONG_CACHE_MS,
    gcTime: LONG_CACHE_MS,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: optionsKeys.specialties(),
    queryFn: fetchSpecialties,
    staleTime: LONG_CACHE_MS,
    gcTime: LONG_CACHE_MS,
  });
}

export function useCities(state?: string | null) {
  return useQuery({
    queryKey: optionsKeys.cities(state ?? ""),
    queryFn: () => fetchCities(state ?? ""),
    enabled: Boolean(state),
    staleTime: MEDIUM_CACHE_MS,
    gcTime: MEDIUM_CACHE_MS,
  });
}

export function useHospitals(filters: { state?: string | null; city?: string | null }) {
  const state = filters.state ?? "";

  return useQuery({
    queryKey: optionsKeys.hospitals({ state, city: filters.city }),
    queryFn: () => fetchHospitals({ state, city: filters.city }),
    enabled: Boolean(state),
    staleTime: MEDIUM_CACHE_MS,
    gcTime: MEDIUM_CACHE_MS,
  });
}
