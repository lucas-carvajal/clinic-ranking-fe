import { z } from "zod";

export const consumeVerificationRequestSchema = z.object({
  token: z.string().min(1),
});

export const consumeVerificationSuccessSchema = z.object({
  ok: z.literal(true),
});

export const consumeVerificationErrorCodeSchema = z.enum([
  "invalid",
  "expired",
  "already_used",
  "wrong_status",
]);

export const verificationLinkResponseSchema = z.object({
  url: z.string().min(1),
});

export type ConsumeVerificationRequest = z.infer<typeof consumeVerificationRequestSchema>;
export type ConsumeVerificationSuccess = z.infer<typeof consumeVerificationSuccessSchema>;
export type ConsumeVerificationErrorCode = z.infer<typeof consumeVerificationErrorCodeSchema>;
export type VerificationLinkResponse = z.infer<typeof verificationLinkResponseSchema>;
