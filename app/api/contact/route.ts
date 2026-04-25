import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

import {
  type ContactRequest,
  type ContactResponse,
  contactRequestSchema,
  mapZodFieldErrors,
} from "@/lib/contact";

type HCaptchaResponse = {
  success: boolean;
};

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

  const captchaSecret = process.env.HCAPTCHA_SECRET;

  if (!captchaSecret) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "CAPTCHA_FAILED" },
      { status: 500 },
    );
  }

  const captchaPass = await verifyHCaptcha({
    secret: captchaSecret,
    token: parsed.data.captchaToken,
    remoteIp: request.headers.get("x-forwarded-for") ?? undefined,
  });

  if (!captchaPass) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "CAPTCHA_FAILED" },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!resendApiKey || !toEmail) {
    return NextResponse.json<ContactResponse>(
      { ok: false, code: "DELIVERY_FAILED" },
      { status: 500 },
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ?? "Copper Forge <onboarding@resend.dev>";

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
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

async function verifyHCaptcha({
  secret,
  token,
  remoteIp,
}: {
  secret: string;
  token: string;
  remoteIp?: string;
}) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.append("remoteip", remoteIp.split(",")[0]?.trim() ?? remoteIp);
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
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

    const result = (await response.json()) as HCaptchaResponse;
    return Boolean(result.success);
  } catch {
    return false;
  }
}

function formatTextEmail(payload: Omit<ContactRequest, "captchaToken">) {
  return [
    "New inquiry from copper-forge.com",
    "",
    `Name: ${payload.name}`,
    `Company: ${payload.companyName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Preferred contact: ${payload.contactPreference}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}
