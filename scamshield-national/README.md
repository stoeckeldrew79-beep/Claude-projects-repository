# ScamShield National

A national scam intelligence database and subscription platform. See
`../content/docs` in this repo — or the original technical specification —
for the full architecture, schema, and API design this scaffold implements.

## Status

Implemented:
- PostgreSQL schema (9 migrations) — scams, categories, users, alerts, articles, subscriptions
- Backend REST API: scams, categories (incl. `/categories/trends`), users, articles, alerts, subscriptions
- Real email+password auth (bcrypt) with JWT sessions and role/tier-gated routes
- Real Stripe checkout/portal/webhook flow, syncing subscription tier from live events
- Twilio SMS + SendGrid email alert broadcast, tier-gated (Family+ for SMS, Pro+ for real-time email)
- Articles blog, including a "Notorious Scams & Scammers" historical collection (`/notorious`)
- SEO (per-page meta tags, build-time sitemap.xml, robots.txt) and a real Admin data-entry UI
- Login/register UI, account nav, sign-out
- Trend Watch — real report-volume-by-category chart on `/database`, sourced from the DB
- A from-scratch security review found and fixed 4 vulnerabilities (SQL injection, mass-assignment
  billing bypass, a full authentication bypass, and stored HTML injection in alert emails) — see
  git history on this branch for details

Still stubbed / needs live credentials to fully exercise:
- Stripe checkout/portal *session creation* and live Twilio/SendGrid sends need real provider API keys
- Auth0/Supabase (spec 5.4) — currently real bcrypt password auth, not yet SSO
- Actual Google Search Console verification (manual, post-deployment)

## Local development

```bash
# 1. Start Postgres + Redis
docker compose up -d

# 2. Backend
cd backend
cp ../.env.example .env   # fill in JWT_SECRET at minimum; ADMIN_EMAILS to reach the admin panel
npm install
npm run migrate
npm run seed                # seeds the "Notorious Scams & Scammers" articles
npm run dev                 # http://localhost:3000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Project layout

```
scamshield-national/
├── frontend/     # React + TypeScript + Tailwind
├── backend/      # Node.js + Express + TypeScript
├── admin/        # notes on the admin panel (currently a frontend route)
└── docker-compose.yml
```
