# Fariz Portfolio CMS

Personal portfolio website with CMS, blog, analytics, and CV generator for Fariz Jelang Ramadhan.

## Run & Operate

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks + Zod schemas from OpenAPI spec
- `pnpm run typecheck` — full typecheck across all packages
- Frontend dev: `pnpm --filter @workspace/myportofolio run dev`
- API dev: `pnpm --filter @workspace/api-server run dev`

**Required env vars (production):** `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
**Optional:** `SMTP_EMAIL`, `SMTP_APP_PASSWORD` (Gmail SMTP for emails), `CORS_ORIGIN`

## Stack

- **Frontend:** React + Vite, Tailwind v4, shadcn/ui, wouter, framer-motion, recharts
- **Backend:** Express 5, MongoDB (mongoose), JWT auth, nodemailer
- **Codegen:** Orval (OpenAPI → React Query hooks + Zod schemas)
- **Runtime:** Node.js 24, pnpm workspaces, esbuild

## Where Things Live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts (25+ operations)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validators
- `artifacts/myportofolio/src/` — React frontend (pages, components, hooks)
- `artifacts/api-server/src/` — Express backend (models, routes, middlewares)

## Architecture Decisions

- **In-memory MongoDB in dev:** `mongodb-memory-server` auto-starts if `MONGODB_URI` is unset; seeded with profile + portfolio templates.
- **First-user-admin pattern:** First registered user becomes `admin`; subsequent registrations default to `viewer`.
- **JWT ephemeral secret in dev:** Random secret generated at startup if `JWT_SECRET` unset; throws in production.
- **No CORS wildcard:** `CORS_ORIGIN` env controls allowed origins; credentials disabled when unset.
- **Codegen post-fix:** `lib/api-spec/package.json` codegen script overwrites `api-zod/src/index.ts` after orval runs (orval regenerates stale exports).

## Product

- **Public:** Home (typewriter hero), About (timeline + skill bars), Portfolio, Blog (markdown posts), CV download, Contact form
- **Auth:** Login di `/login`, register, forgot/reset password (email), verify email
- **Admin panel** (`/admin/*`): Dashboard with analytics mini-chart, Blog CRUD (markdown editor + preview), Portfolio CRUD, Content CMS, Profile editor, CV generator, Analytics page
- **Analytics:** Page view tracking (sessionId-based), 30-day chart, top pages bar chart, top referrers, 90-day TTL auto-cleanup
- **Email:** Verification + password reset via Gmail SMTP (from: admin@flutce.app, to: farizjrpend@gmail.com)

## User Preferences

- SMTP from hardcoded as `admin@flutce.app`, contact-to as `farizjrpend@gmail.com` (personal use, not team)
- Dark/gold theme (`#FDE68A` primary), Poppins font
- Indonesian language preferred for UI text

## Gotchas

- After codegen, `lib/api-zod/src/index.ts` is overwritten by the script — do NOT manually edit it
- `.migration-backup/` workflows failing is expected — those are backup copies only
- `Blog/{slug}` GET increments view counter; use `GET /blog/admin` for admin list (no view increment)
- Analytics track endpoint is public (no auth); summary requires admin JWT
