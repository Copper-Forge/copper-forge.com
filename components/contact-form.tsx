"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useMemo, useRef, useState } from "react";

import {
  type ContactRequest,
  type ContactResponse,
  contactRequestSchema,
  mapZodFieldErrors,
} from "@/lib/contact";

type ContactFormProps = {
  submitLabel: string;
  successMessage: string;
};

type FormValues = Omit<ContactRequest, "captchaToken">;

const initialValues: FormValues = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  contactPreference: "email",
  message: "",
};

export function ContactForm({
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const captchaRef = useRef<HCaptcha | null>(null);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [captchaToken, setCaptchaToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [formMessage, setFormMessage] = useState<string>("");

  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";
  const captchaEnabled = useMemo(() => siteKey.trim().length > 0, [siteKey]);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setValues(initialValues);
    setCaptchaToken("");
    setFieldErrors({});
    captchaRef.current?.resetCaptcha();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("idle");
    setFormMessage("");

    const payload: ContactRequest = {
      ...values,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      captchaToken,
    };

    const parsed = contactRequestSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(mapZodFieldErrors(parsed.error.issues) ?? {});
      setStatus("error");
      setFormMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ContactResponse;

      if (!result.ok) {
        if (result.code === "VALIDATION_ERROR") {
          setFieldErrors(result.fieldErrors ?? {});
          setFormMessage("Please correct the highlighted fields and try again.");
        } else if (result.code === "CAPTCHA_FAILED") {
          setFieldErrors((current) => ({
            ...current,
            captchaToken: "Verification failed. Please try again.",
          }));
          setFormMessage("Verification failed. Please retry the captcha challenge.");
        } else {
          setFormMessage(
            "We could not deliver your message right now. Please try again shortly.",
          );
        }

        setStatus("error");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setFormMessage(
          "We could not deliver your message right now. Please try again shortly.",
        );
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      setStatus("success");
      setFormMessage(successMessage);
      resetForm();
    } catch {
      setStatus("error");
      setFormMessage(
        "A network error occurred while sending your message. Please retry.",
      );
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Name"
          value={values.name}
          error={fieldErrors.name}
          onChange={(value) => updateField("name", value)}
        />
        <TextField
          id="companyName"
          label="Company Name"
          value={values.companyName}
          error={fieldErrors.companyName}
          onChange={(value) => updateField("companyName", value)}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={fieldErrors.email}
          onChange={(value) => updateField("email", value)}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={values.phone ?? ""}
          error={fieldErrors.phone}
          onChange={(value) => updateField("phone", value)}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold uppercase tracking-wider text-steel-300">
          Preferred Contact Method
        </legend>
        <div className="flex flex-wrap gap-3">
          <ContactPreferenceButton
            label="Email"
            active={values.contactPreference === "email"}
            onClick={() => updateField("contactPreference", "email")}
          />
          <ContactPreferenceButton
            label="Phone"
            active={values.contactPreference === "phone"}
            onClick={() => updateField("contactPreference", "phone")}
          />
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold uppercase tracking-wider text-steel-300"
        >
          Project Idea or Question
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full rounded-2xl border border-charcoal-700 bg-charcoal-800/70 px-4 py-3 text-ivory-100 placeholder:text-steel-500 focus:border-copper-500 focus:outline-none"
          placeholder="Share context, current constraints, and the outcome you need."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="message-error" className="mt-2 text-sm text-copper-accent-400">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-charcoal-700 bg-charcoal-900/70 p-4">
        {captchaEnabled ? (
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            theme="dark"
            onVerify={(token) => {
              setCaptchaToken(token);
              setFieldErrors((current) => {
                if (!current.captchaToken) {
                  return current;
                }

                const next = { ...current };
                delete next.captchaToken;
                return next;
              });
            }}
            onExpire={() => setCaptchaToken("")}
            onError={() => setCaptchaToken("")}
          />
        ) : (
          <p className="text-sm text-copper-accent-400">
            Captcha is not configured. Set NEXT_PUBLIC_HCAPTCHA_SITE_KEY to enable
            submissions.
          </p>
        )}
        {fieldErrors.captchaToken ? (
          <p className="mt-2 text-sm text-copper-accent-400">
            {fieldErrors.captchaToken}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting" || !captchaEnabled}
          className="inline-flex items-center justify-center rounded-full bg-copper-500 px-7 py-3 font-heading text-base uppercase tracking-wider text-charcoal-950 transition hover:bg-copper-accent-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : submitLabel}
        </button>
        <p className="text-sm text-steel-300">
          {status === "success" ? "Submitted" : "Response time: within 1 business day"}
        </p>
      </div>

      {formMessage ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-copper-700/50 bg-copper-700/20 text-copper-100"
              : "border-copper-accent-500/50 bg-copper-accent-500/10 text-copper-accent-300"
          }`}
        >
          {formMessage}
        </p>
      ) : null}
    </form>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
};

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold uppercase tracking-wider text-steel-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-charcoal-700 bg-charcoal-800/70 px-4 py-3 text-ivory-100 placeholder:text-steel-500 focus:border-copper-500 focus:outline-none"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-copper-accent-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ContactPreferenceButtonProps = {
  label: "Email" | "Phone";
  active: boolean;
  onClick: () => void;
};

function ContactPreferenceButton({
  label,
  active,
  onClick,
}: ContactPreferenceButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wider transition ${
        active
          ? "border-copper-500 bg-copper-500/20 text-copper-100"
          : "border-charcoal-600 bg-charcoal-800 text-steel-300 hover:border-copper-700"
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
