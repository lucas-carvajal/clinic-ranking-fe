import { z } from "zod";

export const authLoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const authLoginResponseSchema = z.object({
  username: z.string(),
  expiresAt: z.string().datetime(),
});

export const adminMeResponseSchema = z.object({
  loggedIn: z.literal(true),
  username: z.string(),
});

export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AdminMeResponse = z.infer<typeof adminMeResponseSchema>;
