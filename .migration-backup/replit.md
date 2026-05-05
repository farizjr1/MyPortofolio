# Portfolio CMS & ATS CV Generator

## Overview

Full-stack professional portfolio application with Accounting CMS and ATS CV Generator.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9

### Frontend (artifacts/myportofolio)
- React 19 + Vite + TypeScript
- Tailwind CSS + Shadcn/UI + Framer Motion
- TanStack Query (React Query)
- Wouter (routing)
- @react-pdf/renderer (ATS CV PDF generation)

### Backend (artifacts/api-server)
- Node.js + Express 5 + TypeScript
- MongoDB + Mongoose (with in-memory fallback for dev)
- JWT authentication + Bcrypt password hashing
- Helmet + CORS security
- Role-Based Access Control (RBAC)
- Pino logging

### API Contract
- OpenAPI spec at `lib/api-spec/openapi.yaml`
- Generated React Query hooks in `lib/api-client-react/`
- Generated Zod validation schemas in `lib/api-zod/`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## API Endpoints

### Auth
- `POST /api/auth/register` — Register admin user
- `POST /api/auth/login` — Login
- `POST /api/auth/verify-email` — Verify email token
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password with token
- `GET /api/auth/me` — Get current user (protected)
- `POST /api/auth/logout` — Logout (protected)

### Profile
- `GET /api/profile` — Get public profile/about data
- `PUT /api/profile` — Update profile (admin only)

### Portfolio
- `GET /api/portfolio` — List all projects (public)
- `POST /api/portfolio` — Create project (admin only)
- `GET /api/portfolio/:id` — Get project (public)
- `PUT /api/portfolio/:id` — Update project (admin only)
- `DELETE /api/portfolio/:id` — Delete project (admin only)
- `GET /api/portfolio/stats` — Portfolio statistics (public)

### Content CMS
- `GET /api/content` — List content items
- `POST /api/content` — Create content (admin only)
- `PUT /api/content/:id` — Update content (admin only)
- `DELETE /api/content/:id` — Delete content (admin only)

### CV Data
- `GET /api/cv` — List CVs (auth required)
- `POST /api/cv` — Create CV (auth required)
- `GET /api/cv/:id` — Get CV (auth required)
- `PUT /api/cv/:id` — Update CV (auth required)
- `DELETE /api/cv/:id` — Delete CV (auth required)

## MongoDB

- **Development**: In-memory MongoDB starts automatically when `MONGODB_URI` is not set
- **Production**: Set `MONGODB_URI` environment variable to a MongoDB Atlas connection string

## Auth System

- JWT tokens (7-day expiry), stored in localStorage on client
- Bcrypt password hashing (salt rounds: 12)
- Email verification token (24h expiry)
- Password reset token (1h expiry)
- RBAC: `admin` role for CMS, `viewer` role for read-only

## Key Files

- `artifacts/api-server/src/app.ts` — Express app setup
- `artifacts/api-server/src/middlewares/auth.ts` — JWT middleware + RBAC
- `artifacts/api-server/src/models/` — Mongoose schemas
- `artifacts/api-server/src/routes/` — Route handlers
- `artifacts/myportofolio/src/` — React frontend
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks
- `.env.example` — Environment variable template
- `GIT_WORKFLOW.md` — Git Flow branching guide
- `ENV_MANAGEMENT.md` — Environment & secrets management guide
- `.github/workflows/deploy.yml` — CI/CD GitHub Actions config

## Security

- Helmet middleware for HTTP security headers
- CORS configured per environment
- JWT secret via environment variable
- Password hashing with Bcrypt (12 rounds)
- Rate limiting recommended before production deployment

## Deployment Architecture

- **Frontend**: Vercel (via GitHub Actions `.github/workflows/deploy.yml`)
- **Backend API**: Render or Railway (set env vars in platform dashboard)
- **Database**: MongoDB Atlas (free M0 tier for starters)
