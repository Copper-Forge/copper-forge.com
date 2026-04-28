"use client";

import Script from "next/script";
import { useMemo, useState } from "react";

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

type TurnstileApi = {
  reset: (container?: HTMLElement | string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type FormValues = Omit<ContactRequest, "turnstileToken"> & {
  honeypot: string;
};

const initialValues: FormValues = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  contactPreference: "email",
  message: "",
  honeypot: "",
};

export function ContactForm({
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [formMessage, setFormMessage] = useState<string>("");
  const [isTurnstileReady, setIsTurnstileReady] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
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
    setFieldErrors({});
  };

  const resetAfterSuccess = () => {
    resetForm();
    setStatus("idle");
    setFormMessage("");
    resetTurnstileWidget();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("idle");
    setFormMessage("");

    if (!captchaEnabled || !isTurnstileReady) {
      setStatus("error");
      setFieldErrors((current) => ({
        ...current,
        turnstileToken: "Captcha is not ready. Refresh and try again.",
      }));
      setFormMessage("Captcha is not ready. Refresh and try again.");
      return;
    }

    const turnstileToken = extractTurnstileToken(event.currentTarget);

    if (!turnstileToken) {
      setStatus("error");
      setFieldErrors((current) => ({
        ...current,
        turnstileToken: "Verification failed. Please try again.",
      }));
      setFormMessage("Verification failed. Please try again.");
      return;
    }

    const payload: ContactRequest = {
      ...values,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      turnstileToken,
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
            turnstileToken: "Verification failed. Please try again.",
          }));
          setFormMessage("Verification failed. Please retry your submission.");
          resetTurnstileWidget();
        } else {
          setFormMessage(
            "We could not deliver your message right now. Please try again shortly.",
          );
        }

        setStatus("error");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setFormMessage(
          "We could not deliver your message right now. Please try again shortly.",
        );
        return;
      }

      setStatus("success");
      setFormMessage(successMessage);
      resetForm();
      resetTurnstileWidget();
    } catch {
      setStatus("error");
      setFormMessage(
        "A network error occurred while sending your message. Please retry.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-copper-700/60 bg-copper-700/20 px-5 py-6 text-copper-100"
      >
        <p className="font-heading text-xs uppercase tracking-[0.22em] text-copper-accent-300">
          Brief sent
        </p>
        <p className="mt-2 text-base">{formMessage || successMessage}</p>
        <button
          type="button"
          onClick={resetAfterSuccess}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-copper-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-copper-100 transition hover:bg-copper-500/20"
        >
          Send another brief
        </button>
      </div>
    );
  }

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
          Project Summary or Question
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full rounded-2xl border border-charcoal-700 bg-charcoal-800/70 px-4 py-3 text-ivory-100 placeholder:text-steel-500 focus:border-copper-500 focus:outline-none"
          placeholder="Share basic information; we'll follow-up to start the conversation."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="message-error" className="mt-2 text-sm text-copper-accent-400">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(event) => updateField("honeypot", event.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting" || !captchaEnabled || !isTurnstileReady}
          className="inline-flex items-center justify-center rounded-full bg-copper-500 px-7 py-3 font-heading text-base uppercase tracking-wider text-charcoal-950 transition hover:bg-copper-accent-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : submitLabel}
        </button>
        <p className="text-sm text-steel-300">Response time: within 1 business day</p>
      </div>

      <div className="rounded-2xl border border-charcoal-700 bg-charcoal-900/70 p-4">
        {captchaEnabled ? (
          <>
            <Script
              id="cloudflare-turnstile"
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
              onReady={() => setIsTurnstileReady(true)}
              onError={() => {
                setFieldErrors((current) => ({
                  ...current,
                  turnstileToken: "Captcha failed to load. Refresh and try again.",
                }));
                setStatus("error");
                setFormMessage("Captcha failed to load. Refresh and try again.");
              }}
            />
            <div className="cf-turnstile" data-sitekey={siteKey} />
          </>
        ) : (
          <p className="text-sm text-copper-accent-400">
            Captcha is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable
            submissions.
          </p>
        )}
        {fieldErrors.turnstileToken ? (
          <p className="mt-2 text-sm text-copper-accent-400">
            {fieldErrors.turnstileToken}
          </p>
        ) : null}
              {captchaEnabled ? (
        <p className="text-sm text-steel-300">Protected by Cloudflare Turnstile.</p>
      ) : null}
      </div>



      {formMessage ? (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-copper-accent-500/50 bg-copper-accent-500/10 px-4 py-3 text-sm text-copper-accent-300"
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

function extractTurnstileToken(form: HTMLFormElement) {
  const tokenInput = form.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]',
  );
  const token = tokenInput?.value?.trim();
  return token || null;
}

function resetTurnstileWidget() {
  const widget = document.querySelector<HTMLElement>(".cf-turnstile");

  if (!widget || !window.turnstile?.reset) {
    return;
  }

  window.turnstile.reset(widget);
}
