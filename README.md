# Copper Forge Website

Single-page marketing site built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- SMTP (contact email delivery; works with Purelymail)
- Google reCAPTCHA Enterprise (bot protection)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` or `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO_EMAIL`
- `RECAPTCHA_PROJECT_ID`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `CONTACT_FROM_EMAIL` (optional, defaults to `SMTP_USER`)

reCAPTCHA Enterprise authentication uses Google Application Default Credentials.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs these checks on pushes to `preview` and `main`, and on pull requests.

## Deployment (Netlify)

- Connect repo in Netlify.
- Configure production branch as `main`.
- Netlify automatically creates deploy previews for `preview` branch updates and PRs.
- Add required environment variables in Netlify site settings for both deploy previews and production.
