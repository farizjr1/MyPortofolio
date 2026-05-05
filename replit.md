# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Portfolio CMS & CV Generator web app for Fariz Jelang Ramadhan. Ported from Vercel to Replit.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (Tailwind v4, shadcn/ui, wouter routing, framer-motion)
- **API framework**: Express 5
- **Database**: MongoDB (in-memory via mongodb-memory-server in dev, or MONGODB_URI env var)
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Validation**: Zod (api-zod), Orval codegen
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)

## Artifacts

- `artifacts/myportofolio` — React + Vite frontend (preview path: `/`)
- `artifacts/api-server` — Express backend (preview path: `/api`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Environment Variables

- `MONGODB_URI` — MongoDB connection string (optional; falls back to in-memory in dev)
- `JWT_SECRET` — JWT signing secret (defaults to "change-me-in-production")
- `SMTP_EMAIL` / `SMTP_APP_PASSWORD` — SMTP credentials for email (optional)
- `CORS_ORIGIN` — Allowed CORS origin (defaults to `*`)
- `VITE_API_URL` — API base URL override for frontend (optional; uses relative URL by default)

## Architecture

- OpenAPI spec lives in `lib/api-spec/openapi.yaml`
- Generated React Query hooks: `lib/api-client-react/src/generated/`
- Generated Zod schemas: `lib/api-zod/src/generated/`
- MongoDB models: `artifacts/api-server/src/models/`
- Express routes: `artifacts/api-server/src/routes/`
- Admin panel at `/admin/*` — protected by JWT auth
- Public portfolio at `/` — Home, About, Portfolio, CV, Contact pages

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
