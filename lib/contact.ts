import { z } from "zod";

export const contactPreferenceOptions = ["email", "phone"] as const;

export const contactRequestSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
    companyName: z
      .string()
      .trim()
      .max(120, "Company name is too long."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    phone: z.string().trim().max(40, "Phone number is too long.").optional(),
    contactPreference: z.enum(contactPreferenceOptions),
    message: z
      .string()
      .trim()
      .min(1, "Message is required.")
      .max(3000, "Message is too long."),
    turnstileToken: z
      .string()
      .trim()
      .min(1, "Complete verification before submitting."),
    honeypot: z.string().trim().max(200, "Invalid submission.").optional(),
  })
  .superRefine((value, ctx) => {
    if (value.contactPreference === "phone" && !value.phone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone is required when phone contact is selected.",
        path: ["phone"],
      });
    }
  });

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: "VALIDATION_ERROR";
      fieldErrors?: Record<string, string>;
    }
  | { ok: false; code: "CAPTCHA_FAILED" }
  | { ok: false; code: "DELIVERY_FAILED" };

export function mapZodFieldErrors(
  issues: z.ZodIssue[],
): Record<string, string> | undefined {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const pathKey = issue.path[0];

    if (typeof pathKey !== "string" || fieldErrors[pathKey]) {
      continue;
    }

    fieldErrors[pathKey] = issue.message;
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}
