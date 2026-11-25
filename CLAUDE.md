@AGENTS.md

# GNS Commercial Equipment website

Rebuild of the GNS Framer site (https://gnscommercialequipment.framer.website/) as a Next.js + Sanity site hosted on Netlify.

## Stack
- Next.js (App Router, TypeScript, Tailwind CSS v4) – check `node_modules/next/dist/docs/` before using Next.js APIs (see AGENTS.md)
- Sanity CMS, Studio embedded at `/studio` (`sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`)
- Sanity code lives in `sanity/` – `env.ts`, `lib/client.ts`, `lib/image.ts`, `schemaTypes/`
- Hosting: Netlify (free plan). Contact form: Resend + Cloudflare Turnstile.

## Commands
- `npm run dev` – local site at http://localhost:3000, Studio at http://localhost:3000/studio
- `npm run build` – production build (run before every commit)
- `npm run lint`

## Rules
- Never commit secrets. Keys go in `.env.local` (local) or Netlify environment variables. Add new variable names to `.env.example` with no values.
- The public site reads Sanity with the read-only client in `sanity/lib/client.ts` – never put a write token in code that runs in the browser.
- Keep the existing URLs from the Framer site (see `data/framer/redirects.json`); any renamed URL needs a 301 redirect in `next.config.ts`.
- All content (products, services, case studies, contact details) comes from Sanity – don't hardcode phone numbers, addresses or product data in components.
- Mobile-first: design for phone width first, then desktop.
- Validate all form input on the server.
- The import scripts in `scripts/` were a one-time move from Framer. Re-running them overwrites edits made in Sanity Studio – don't run them again unless the user asks and understands that.
- Company facts: founded 2019; contact-form enquiries go to `CONTACT_TO_EMAIL`.
