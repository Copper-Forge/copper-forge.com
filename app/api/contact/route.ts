import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { NextResponse, type NextRequest } from "next/server";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import nodemailer from "nodemailer";

import {
  type ContactRequest,
  type ContactResponse,
  contactRequestSchema,
  mapZodFieldErrors,
} from "@/lib/contact";
import { RECAPTCHA_ACTION } from "@/lib/recaptcha";

export const runtime = "nodejs";

let recaptchaClient: RecaptchaEnterpriseServiceClient | null = null;
let recaptchaClientProjectId: string | null = null;
let warnedMissingCredentials = false;

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

  const recaptchaProjectId = process.env.RECAPTCHA_PROJECT_ID;
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaProjectId || !recaptchaSiteKey) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "CAPTCHA_FAILED" },
      { status: 500 },
    );
  }

  const captchaPass = await verifyReCaptcha({
    projectId: recaptchaProjectId,
    siteKey: recaptchaSiteKey,
    token: parsed.data.captchaToken,
    expectedAction: RECAPTCHA_ACTION,
    remoteIp: request.headers.get("x-forwarded-for") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
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

async function verifyReCaptcha({
  projectId,
  siteKey,
  token,
  expectedAction,
  remoteIp,
  userAgent,
}: {
  projectId: string;
  siteKey: string;
  token: string;
  expectedAction: string;
  remoteIp?: string;
  userAgent?: string;
}) {
  try {
    if (!hasDefaultGoogleCredentials()) {
      warnMissingGoogleCredentialsOnce();
      return false;
    }

    const client = getRecaptchaClient(projectId);

    const [response] = await client.createAssessment({
      parent: client.projectPath(projectId),
      assessment: {
        event: {
          token,
          siteKey,
          userIpAddress: normalizeForwardedIp(remoteIp),
          userAgent,
        },
      },
    });

    if (!response.tokenProperties?.valid) {
      return false;
    }

    return response.tokenProperties.action === expectedAction;
  } catch {
    return false;
  }
}

function hasDefaultGoogleCredentials() {
  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (configuredPath) {
    return existsSync(configuredPath);
  }

  const windowsAdcPath = process.env.APPDATA
    ? join(process.env.APPDATA, "gcloud", "application_default_credentials.json")
    : "";

  if (windowsAdcPath && existsSync(windowsAdcPath)) {
    return true;
  }

  const unixAdcPath = join(homedir(), ".config", "gcloud", "application_default_credentials.json");
  return existsSync(unixAdcPath);
}

function warnMissingGoogleCredentialsOnce() {
  if (warnedMissingCredentials) {
    return;
  }

  warnedMissingCredentials = true;
  console.warn(
    "reCAPTCHA Enterprise credentials are missing. Configure ADC with `gcloud auth application-default login` or set GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

function getRecaptchaClient(projectId: string) {
  if (!recaptchaClient || recaptchaClientProjectId !== projectId) {
    recaptchaClient = new RecaptchaEnterpriseServiceClient({ projectId });
    recaptchaClientProjectId = projectId;
  }

  return recaptchaClient;
}

function normalizeForwardedIp(remoteIp?: string) {
  if (!remoteIp) {
    return undefined;
  }

  return remoteIp.split(",")[0]?.trim() ?? remoteIp;
}

function formatTextEmail(payload: Omit<ContactRequest, "captchaToken">) {
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
