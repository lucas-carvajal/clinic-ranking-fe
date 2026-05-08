import { z } from "zod";

export const stateDtoSchema = z.object({
  name: z.string(),
  countryName: z.string(),
});

export const cityDtoSchema = z.object({
  name: z.string(),
  stateName: z.string(),
  countryName: z.string(),
});

export const hospitalDtoSchema = z.object({
  name: z.string(),
  cityName: z.string(),
  stateName: z.string(),
  countryName: z.string(),
});

export const specialtyDtoSchema = z.object({
  name: z.string(),
});

export const statesResponseSchema = z.object({
  data: z.array(stateDtoSchema),
});

export const citiesResponseSchema = z.object({
  data: z.array(cityDtoSchema),
});

export const hospitalsResponseSchema = z.object({
  data: z.array(hospitalDtoSchema),
});

export const specialtiesResponseSchema = z.object({
  data: z.array(specialtyDtoSchema),
});

export type StateDto = z.infer<typeof stateDtoSchema>;
export type CityDto = z.infer<typeof cityDtoSchema>;
export type HospitalDto = z.infer<typeof hospitalDtoSchema>;
export type SpecialtyDto = z.infer<typeof specialtyDtoSchema>;
