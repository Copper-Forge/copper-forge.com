import { describe, expect, it } from "vitest";
import { ZodIssueCode } from "zod";

import { contactRequestSchema, mapZodFieldErrors } from "@/lib/contact";

describe("contactRequestSchema", () => {
  it("accepts a valid payload with email preference", () => {
    const result = contactRequestSchema.safeParse({
      name: "Alex",
      companyName: "Copper Forge",
      email: "alex@example.com",
      phone: "",
      contactPreference: "email",
      message: "Need help with a project.",
      turnstileToken: "token",
      honeypot: "",
    });

    expect(result.success).toBe(true);
  });

  it("requires phone when phone preference is selected", () => {
    const result = contactRequestSchema.safeParse({
      name: "Alex",
      companyName: "Copper Forge",
      email: "alex@example.com",
      phone: "",
      contactPreference: "phone",
      message: "Need help with a project.",
      turnstileToken: "token",
      honeypot: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = mapZodFieldErrors(result.error.issues);
      expect(errors?.phone).toBe("Phone is required when phone contact is selected.");
    }
  });
});

describe("mapZodFieldErrors", () => {
  it("returns first error per field and ignores non-string paths", () => {
    const errors = mapZodFieldErrors([
      {
        code: ZodIssueCode.custom,
        message: "First",
        path: ["email"],
      },
      {
        code: ZodIssueCode.custom,
        message: "Second",
        path: ["email"],
      },
      {
        code: ZodIssueCode.custom,
        message: "Ignored",
        path: [0],
      },
    ]);

    expect(errors).toEqual({ email: "First" });
  });

  it("returns undefined when no valid field errors exist", () => {
    const errors = mapZodFieldErrors([
      {
        code: ZodIssueCode.custom,
        message: "Ignored",
        path: [0],
      },
    ]);

    expect(errors).toBeUndefined();
  });
});
