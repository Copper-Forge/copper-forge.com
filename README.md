# Copper Forge Website

Single-page marketing site built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Resend (contact email delivery)
- hCaptcha (bot protection)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `HCAPTCHA_SECRET`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `CONTACT_FROM_EMAIL` (optional)

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
