import { z } from "zod";

import { get } from "@/lib/api/client";

const stringArraySchema = z.array(z.string());

const statesResponseSchema = z.object({
  states: stringArraySchema,
});

const specialtiesResponseSchema = z.object({
  specialties: stringArraySchema,
});

const citiesResponseSchema = z.object({
  cities: stringArraySchema,
});

const hospitalsResponseSchema = z.object({
  hospitals: stringArraySchema,
});

export type StatesResponse = z.infer<typeof statesResponseSchema>;
export type SpecialtiesResponse = z.infer<typeof specialtiesResponseSchema>;
export type CitiesResponse = z.infer<typeof citiesResponseSchema>;
export type HospitalsResponse = z.infer<typeof hospitalsResponseSchema>;

export function fetchStates() {
  return get<StatesResponse>("/types/states", {
    responseSchema: statesResponseSchema,
  });
}

export function fetchSpecialties() {
  return get<SpecialtiesResponse>("/types/specialties", {
    responseSchema: specialtiesResponseSchema,
  });
}

export function fetchCities(state: string) {
  const params = new URLSearchParams({ state });
  return get<CitiesResponse>(`/types/cities?${params.toString()}`, {
    responseSchema: citiesResponseSchema,
  });
}

export function fetchHospitals(filters: { state: string; city?: string | null }) {
  const params = new URLSearchParams({ state: filters.state });
  if (filters.city) {
    params.set("city", filters.city);
  }

  return get<HospitalsResponse>(`/types/hospitals?${params.toString()}`, {
    responseSchema: hospitalsResponseSchema,
  });
}
