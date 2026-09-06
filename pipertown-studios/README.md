# Pipertown Studios

Marketing website for Pipertown Studios — an Orlando, FL based studio
offering website design, logo & brand identity, AI chatbots, and AI
business automation for small and mid-sized businesses.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and
Tailwind CSS.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project structure

- `src/app` — pages: home, `/services`, `/pricing`, `/about`, `/contact`
- `src/components` — shared `Nav`, `Footer`, and `ContactForm`
- `src/lib/content.ts` — services, pricing tiers, and copy used across pages

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Notes

- The contact form currently submits via a `mailto:` link (no backend is
  wired up yet). Before launch, connect it to a real form backend
  (e.g. Formspree, Resend, or a serverless function).
- Pricing figures on `/pricing` are starting placeholders — confirm/update
  them before going live.
