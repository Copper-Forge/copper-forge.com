import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

import {
  type ContactRequest,
  type ContactResponse,
  contactRequestSchema,
  mapZodFieldErrors,
} from "@/lib/contact";

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: NextRequest) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        fieldErrors: {
          message: "Invalid request payload.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = contactRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        fieldErrors: mapZodFieldErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot?.trim()) {
    return NextResponse.json<ContactResponse>({ ok: true });
  }

  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecretKey) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "CAPTCHA_FAILED" },
      { status: 500 },
    );
  }

  const captchaPass = await verifyTurnstile({
    secretKey: turnstileSecretKey,
    token: parsed.data.turnstileToken,
    remoteIp: request.headers.get("x-forwarded-for") ?? undefined,
  });

  if (!captchaPass) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "CAPTCHA_FAILED" },
      { status: 400 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number.parseInt(smtpPortRaw ?? "587", 10);
  const smtpSecure =
    process.env.SMTP_SECURE === "true" || (!process.env.SMTP_SECURE && smtpPort === 465);
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? smtpUser;
  const smtpPortIsValid = Number.isInteger(smtpPort) && smtpPort > 0 && smtpPort <= 65535;

  if (
    !toEmail ||
    !fromEmail ||
    !smtpHost ||
    !smtpUser ||
    !smtpPass ||
    !smtpPortIsValid
  ) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "DELIVERY_FAILED" },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: parsed.data.email,
      subject: `New Copper Forge inquiry from ${parsed.data.name}`,
      text: formatTextEmail(parsed.data),
    });

    return NextResponse.json<ContactResponse>({ ok: true });
  } catch {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "DELIVERY_FAILED" },
      { status: 502 },
    );
  }
}

async function verifyTurnstile({
  secretKey,
  token,
  remoteIp,
}: {
  secretKey: string;
  token: string;
  remoteIp?: string;
}) {
  try {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const normalizedIp = normalizeForwardedIp(remoteIp);

    if (normalizedIp) {
      body.set("remoteip", normalizedIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    return result.success === true;
  } catch {
    return false;
  }
}

function normalizeForwardedIp(remoteIp?: string) {
  if (!remoteIp) {
    return undefined;
  }

  return remoteIp.split(",")[0]?.trim() ?? remoteIp;
}

function formatTextEmail(payload: Omit<ContactRequest, "turnstileToken" | "honeypot">) {
  return [
    "New inquiry from copper-forge.com",
    "",
    `Name: ${payload.name}`,
    `Company: ${payload.companyName || "Not provided"}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Preferred contact: ${payload.contactPreference}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}
