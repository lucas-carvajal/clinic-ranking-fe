export const optionsKeys = {
  all: ["options"] as const,
  states: () => [...optionsKeys.all, "states"] as const,
  specialties: () => [...optionsKeys.all, "specialties"] as const,
  cities: (state: string) => [...optionsKeys.all, "cities", state] as const,
  hospitals: (filters: { state: string; city?: string | null }) =>
    [...optionsKeys.all, "hospitals", filters.state, filters.city ?? ""] as const,
};
