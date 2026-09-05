# ScamShield National

A national scam intelligence database and subscription platform. See
`../docs` in this repo — or the original technical specification —
for the full architecture, schema, and API design this scaffold implements.

## Status

Implemented:
- PostgreSQL schema (9 migrations) — scams, categories, users, alerts, articles, subscriptions
- Scam database seed data: 20 categories (FTC/IC3-style taxonomy plus sextortion, account
  takeover, insurance/healthcare/tax fraud, AI & deepfake scams, debt relief, and mortgage/
  foreclosure scams), 136 well-documented, real current scam-pattern entries, and 12 real,
  fact-checked historical frauds spanning 1720–1971 across the US, UK, France, and Sweden
  (South Sea Bubble, the Mississippi Bubble, the Poyais Scheme, the Great Diamond Hoax, the
  Tichborne Claimant, the Whiskey Ring, Cassie Chadwick's Carnegie fraud, John R. Brinkley's
  "goat gland" fraud, Ivar Kreuger's Match King fraud, the Panama Canal lottery bond scandal,
  the Great Salad Oil Swindle, Robert Vesco's IOS fraud) — `npm run seed`
- Database page (`/database`): search, category/country filters, sort by urgency/A–Z/newest/
  chronological, a Current/Historical/All-eras toggle, and "Load more" pagination
- Backend REST API: scams, categories (incl. `/categories/trends`), users, articles, alerts,
  subscriptions, and `/stats` (live counts, no fabricated numbers)
- Real email+password auth (bcrypt) with JWT sessions and role/tier-gated routes
- Real Stripe checkout/portal/webhook flow, syncing subscription tier from live events
- Twilio SMS + SendGrid email alert broadcast, tier-gated (Family+ for SMS, Pro+ for real-time email)
- Articles blog, including a "Notorious Scams & Scammers" collection (`/notorious`) — 17 real,
  publicly documented cases (convictions, ongoing trials, and unresolved allegations, each
  clearly labeled as such), each with custom abstract cover art (gradient + vignette, no photos
  or likenesses of real people) rendered client-side as SVG. An admin can optionally attach a
  real photo per profile (`/admin` → "Notorious profile cover photos") — deliberately a
  paste-a-URL field, not an upload, so using a specific already-rights-cleared source (official
  .gov booking/press photos are the safe case) stays a conscious per-photo decision rather than
  something easy to do by accident. Falls back to the abstract art until a photo is set.
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
- Early-warning member alerts: `npm run detect-alerts` runs the same pattern detection as
  AI-drafted articles (recurring scammer contact info, category spikes) and turns each into a
  short SMS/email-length alert candidate — template-built from the verified counts/contacts
  directly, no AI call. Every candidate lands in the admin review queue (`/admin`, or
  `GET /alert-candidates`) with status `pending`; approving one (`POST
  /alert-candidates/:id/approve`) creates a real row in `alerts` and fires the existing
  SMS/email `broadcastAlert` fan-out to matching subscribers immediately, dismissing marks it
  resolved with no send. Nothing ever reaches a real subscriber without a human approving it
  first. Detection currently aggregates nationwide (`is_nationwide: true` on every candidate) —
  state-scoped alerts would need `scam_reports` to reliably carry a state on submission first.
- "Today's Scams" (`/todays-scams`): `npm run scan-daily-news` scans real, live US news
  coverage (via Google News' public RSS search — no API key required) for scam-related
  headlines and publishes them immediately — unlike the AI-drafted articles above, this feed
  is fully automatic by design, with no review queue. Deduped by source URL (safe to run more
  than once a day) and pruned after 30 days so it stays a rolling window of recent headlines.
  Every item links to the original story at its real source; the page itself says plainly that
  nothing on it is written or verified by hand
- Global Scam Intelligence (`/global-sources`): a directory of the major national fraud-reporting
  agencies worldwide across 11 countries (FTC, FBI IC3, ACCC/Scamwatch, Canadian Anti-Fraud
  Centre, Action Fraud, CERT NZ, Ireland's CCPC, Singapore's ScamShield/SPF, Germany's BSI,
  Japan's NCAC, the Netherlands' Fraudehelpdesk, India's NCRP).
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

Setup needs Docker running before it can start Postgres and Redis. If Docker
Desktop isn't up, setup says so and stops rather than failing partway through.
Already running Postgres and Redis yourself? Point `DATABASE_URL` and
`REDIS_URL` in `backend/.env` at them and skip the Docker step:

```bash
npm run setup -- --no-docker
```

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

## Scheduling the daily scam news scan

`npm run scan-daily-news` is also a one-shot script — schedule it the same way. It's
idempotent (deduped by source URL), so running it more than once a day, or hourly for a
fresher feed, is harmless. Example crontab entry for a daily 6am run:

```
0 6 * * * cd /path/to/backend && npm run scan-daily-news >> /var/log/scamshield-daily-news.log 2>&1
```

Unlike `draft-articles`, this one is fully automatic — headlines it finds go live immediately,
with no admin review step.

## Scheduling the state Attorney General scan

`npm run scan-state-ag-news` covers all 51 US jurisdictions and populates the `state`
column on `daily_scam_news`, which powers per-state filtering (`GET /v1/daily-news?state=TX`)
and the state-level data behind the Global Map.

Coverage comes from two tiers, because AG offices are inconsistent about publishing feeds.
All 51 were probed directly: **18 expose a working RSS/Atom feed** and are read first-party
(`source_kind = 'ag'`); the remaining states are covered by a news query naming the office
(`source_kind = 'news'`). AG feeds carry every press release, so items are filtered by
headline for scam relevance — matching the body text as well was measured at 31% false
positives.

It is idempotent (deduped by source URL) and prunes state rows older than 30 days, so run it
as often as you like. Schedule it alongside the daily news scan:

```
0 6 * * * cd /path/to/backend && npm run scan-daily-news >> /var/log/scamshield-daily-news.log 2>&1
15 6 * * * cd /path/to/backend && npm run scan-state-ag-news >> /var/log/scamshield-state-ag.log 2>&1
```

## Scheduling early-warning alert detection

`npm run detect-alerts` is also a one-shot script — schedule it the same way, ideally alongside
(or right after) `draft-articles` since they share the same detection queries. Idempotent
(tag-based dedupe, same as `draft-articles`), so running it more than once a day is harmless.
Example crontab entry for a daily 6am run:

```
0 6 * * * cd /path/to/backend && npm run detect-alerts >> /var/log/scamshield-alert-candidates.log 2>&1
```

Like `draft-articles`, nothing here reaches a real subscriber automatically — every candidate
sits in the admin review queue until approved.

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
