# Copper Forge Website

Single-page marketing site built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- SMTP (contact email delivery; works with Purelymail)
- Cloudflare Turnstile + honeypot field (bot protection)

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
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `CONTACT_FROM_EMAIL` (optional, defaults to `SMTP_USER`)

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs these checks on pushes to `preview` and `main`, and on pull requests.
CI runs these checks on pushes to `main` and on pull requests.

## SDLC Exception

This repository has a documented project-level SDLC exception for Netlify hosting:

- [docs/sdlc-exceptions.md](./docs/sdlc-exceptions.md)

## Deployment (Netlify)

- Connect repo in Netlify.
- Configure production branch as `main`.
- Netlify automatically creates deploy previews for PRs.
- Add required environment variables in Netlify site settings for both deploy previews and production.
