import { describe, expect, it } from "vitest";

import {
  adminMeResponseSchema,
  authLoginRequestSchema,
  authLoginResponseSchema,
} from "@/lib/contracts/auth.schema";

describe("auth contracts", () => {
  it("parses login request and response samples", () => {
    expect(
      authLoginRequestSchema.parse({
        username: "admin",
        password: "secret",
      }).username,
    ).toBe("admin");

    expect(
      authLoginResponseSchema.parse({
        username: "admin",
        expiresAt: "2026-05-08T14:32:11.000Z",
      }).username,
    ).toBe("admin");
  });

  it("parses /admin/me response and strips unknown fields", () => {
    expect(
      adminMeResponseSchema.parse({
        loggedIn: true,
        username: "admin",
        extra: "ignored",
      }),
    ).toEqual({
      loggedIn: true,
      username: "admin",
    });
  });

  it("fails for invalid /admin/me payload", () => {
    expect(() => adminMeResponseSchema.parse({ loggedIn: false, username: "admin" })).toThrow();
  });
});
