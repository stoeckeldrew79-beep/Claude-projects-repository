# ScamShield National

A national scam intelligence database and subscription platform. See
`../content/docs` in this repo — or the original technical specification —
for the full architecture, schema, and API design this scaffold implements.

## Status: Phase 1 — Foundation

Implemented:
- PostgreSQL schema (all 7 tables) with migrations
- Backend REST API for scams, categories, users, and dev-mode auth
- React frontend shell with routing for all 8 pages
- Local docker-compose for Postgres + Redis

Stubbed (Phase 2/3, per the build plan):
- Real Stripe billing (services/stripe.ts has the shape, needs live keys)
- Twilio SMS alert broadcast (services/twilio.ts + services/alerts.ts)
- SendGrid transactional/marketing email
- Auth0/Supabase login (currently a local JWT dev stub — see
  `backend/src/controllers/auth.ts`)

## Local development

```bash
# 1. Start Postgres + Redis
docker compose up -d

# 2. Backend
cd backend
cp ../.env.example .env   # fill in JWT_SECRET at minimum
npm install
npm run migrate
npm run dev                # http://localhost:3000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev                # http://localhost:5173
```

## Project layout

```
scamshield-national/
├── frontend/     # React + TypeScript + Tailwind
├── backend/      # Node.js + Express + TypeScript
├── admin/        # notes on the admin panel (currently a frontend route)
└── docker-compose.yml
```
