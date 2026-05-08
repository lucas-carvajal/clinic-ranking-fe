import { get } from "@/lib/api/client";
import {
  citiesResponseSchema,
  hospitalsResponseSchema,
  specialtiesResponseSchema,
  statesResponseSchema,
  type CityDto,
  type HospitalDto,
  type SpecialtyDto,
  type StateDto,
} from "@/lib/contracts/options.schema";

export type StatesResponse = { data: StateDto[] };
export type SpecialtiesResponse = { data: SpecialtyDto[] };
export type CitiesResponse = { data: CityDto[] };
export type HospitalsResponse = { data: HospitalDto[] };

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
