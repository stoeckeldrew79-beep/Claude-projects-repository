# ScamShield National

A national scam intelligence database and subscription platform. See
`../content/docs` in this repo — or the original technical specification —
for the full architecture, schema, and API design this scaffold implements.

## Status

Implemented:
- PostgreSQL schema (9 migrations) — scams, categories, users, alerts, articles, subscriptions
- Scam database seed data: 12 categories (FTC/IC3-style taxonomy), 24 well-documented, real
  current scam-pattern entries, and 6 real, fact-checked historical frauds spanning 1720–1963
  (South Sea Bubble, the Poyais Scheme, the Great Diamond Hoax, the Tichborne Claimant, Cassie
  Chadwick's Carnegie fraud, the Great Salad Oil Swindle) — `npm run seed`
- Database page (`/database`): search, category/country filters, sort by urgency/A–Z/newest/
  chronological, a Current/Historical/All-eras toggle, and "Load more" pagination
- Backend REST API: scams, categories (incl. `/categories/trends`), users, articles, alerts,
  subscriptions, and `/stats` (live counts, no fabricated numbers)
- Real email+password auth (bcrypt) with JWT sessions and role/tier-gated routes
- Real Stripe checkout/portal/webhook flow, syncing subscription tier from live events
- Twilio SMS + SendGrid email alert broadcast, tier-gated (Family+ for SMS, Pro+ for real-time email)
- Articles blog, including a "Notorious Scams & Scammers" historical collection (`/notorious`)
- SEO (per-page meta tags, build-time sitemap.xml, robots.txt) and a real Admin data-entry UI
- Login/register UI, account nav, sign-out
- Trend Watch — real report-volume-by-category chart on `/database`, sourced from the DB
- "Report a Scam" public intake (`/report`) with a full admin review pipeline (promote to a
  real public scam entry / dismiss)
- "File this for you": a reporter can consent (at submission time, with contact info) to have
  ScamShield National file their report with the appropriate real agency on their behalf. The
  system suggests real agencies based on the report's actual country/category/contact method
  (FTC for general U.S. fraud, IdentityTheft.gov for identity theft, FBI IC3 when email/a
  website was involved, or the matching entry from Global Sources for other countries) —
  nothing is auto-submitted to any government site; a staff member files it manually through
  the agency's own portal and records the confirmation via `/admin`. Reporters check status,
  including per-agency filing status, at `/report-status` using the reference code they're
  given on submission. The status copy is deliberately honest that most agencies don't give
  case-by-case investigation updates back to filers — this shows what we did, not a promise of
  government follow-through
- AI-drafted articles: `npm run draft-articles` detects real patterns in report intake
  (recurring scammer contact info, category spikes) and drafts articles with Claude — every
  draft lands unpublished in the admin review queue (`/admin`, or `GET /articles/drafts`);
  nothing is ever auto-published
- Global Scam Intelligence (`/global-sources`): a directory of the major national fraud-reporting
  agencies worldwide across 7 countries (FTC, FBI IC3, ACCC/Scamwatch, Canadian Anti-Fraud Centre,
  Action Fraud, CERT NZ, Ireland's CCPC, Singapore's ScamShield/SPF).
  There is no live global "all scams" API anywhere, so figures are added by an admin only after
  verifying them against the agency's own report — never auto-ingested — and kept in a separate
  table from our own report data so third-party stats are never blended with what we collected
- A from-scratch security review found and fixed 4 vulnerabilities (SQL injection, mass-assignment
  billing bypass, a full authentication bypass, and stored HTML injection in alert emails) — see
  git history on this branch for details

Still stubbed / needs live credentials to fully exercise:
- Stripe checkout/portal *session creation* and live Twilio/SendGrid sends need real provider API keys
- `npm run draft-articles` needs a real `ANTHROPIC_API_KEY` — the pattern-detection queries are
  verified live against the DB, but the actual drafting call needs a live key to exercise
- Auth0/Supabase (spec 5.4) — currently real bcrypt password auth, not yet SSO
- Actual Google Search Console verification (manual, post-deployment)
- `VITE_PUBLIC_PHONE` — unset by default; the site shows no phone number until you configure
  one (see "Public phone number" below). A full international rebrand remains an explicit,
  separate business decision, not built here — see git history for the reasoning

## Local development

Requires Docker Desktop running and Node.js installed. From the `scamshield-national/` folder:

```bash
npm install    # installs the root tooling (concurrently) used by npm run dev
npm run setup  # starts Postgres+Redis, creates backend/.env with a generated
               # JWT_SECRET if missing, installs both apps, runs migrations + seed
npm run dev    # runs backend (http://localhost:3000) and frontend
               # (http://localhost:5173) together in one terminal
```

Open `http://localhost:5173`. Set `ADMIN_EMAILS` in `backend/.env` to your own
email if you want to reach `/admin`; Stripe/Twilio/SendGrid/Anthropic keys are
optional unless you're exercising those specific integrations.

`npm run setup` is safe to re-run — it won't overwrite an existing `backend/.env`.

<details>
<summary>Manual setup (equivalent, run separately)</summary>

```bash
# 1. Start Postgres + Redis
docker compose up -d

# 2. Backend
cd backend
cp ../.env.example .env   # fill in JWT_SECRET at minimum; ADMIN_EMAILS to reach the admin panel; ANTHROPIC_API_KEY for draft-articles
npm install
npm run migrate
npm run seed                # seeds the "Notorious Scams & Scammers" articles
npm run dev                 # http://localhost:3000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```
</details>

## Scheduling AI-drafted articles

`npm run draft-articles` is a one-shot script, not a long-running process — schedule it with
your platform's job scheduler (system cron, or your hosting provider's scheduled-task feature).
It's idempotent (tag-based dedupe against already-drafted patterns), so running it more than
once a day is harmless. Example crontab entry for a daily 6am run:

```
0 6 * * * cd /path/to/backend && npm run draft-articles >> /var/log/scamshield-drafts.log 2>&1
```

## Public phone number

`VITE_PUBLIC_PHONE` (frontend `.env`) controls the "Call us" link shown in the header and
footer. It's unset by default — no number is shown until you configure one. Never point this
at a number that isn't real and actually answered.

**Recommended: a free Google Voice number that forwards to your real phone**, so the number
published on the site never has to change even if your personal number does:

1. Go to [voice.google.com](https://voice.google.com) and sign in with a Google account.
2. Choose a number (search by area code).
3. Under Settings → "Linked numbers," add your real cell number and turn on call forwarding —
   calls to the Google Voice number will ring your phone.
4. Put the Google Voice number in `VITE_PUBLIC_PHONE` (e.g. `+14075550123`).

You can change which phone it forwards to at any time in Google Voice settings, with zero
changes needed on the site. A paid Twilio number works the same way and is a natural upgrade
path later, since Twilio is already wired up for SMS alerts (`TWILIO_*` in the backend `.env`).

Note the site deliberately never claims 24/7 phone coverage — only the web form
(`/report`) is described that way, since it doesn't depend on someone being available to
answer a call.

## Project layout

```
scamshield-national/
├── frontend/     # React + TypeScript + Tailwind
├── backend/      # Node.js + Express + TypeScript
├── admin/        # notes on the admin panel (currently a frontend route)
└── docker-compose.yml
```
