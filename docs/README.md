# Fariz Jelang Ramadhan — Portfolio CMS

Personal portfolio website dengan CMS, blog, analytics, dan CV generator.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite 7, Tailwind CSS v4, shadcn/ui, wouter, framer-motion |
| Backend | Express 5, MongoDB (Mongoose), JWT, nodemailer |
| State | TanStack Query v5 |
| Codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Build | esbuild (API), Vite (frontend) |
| Runtime | Node.js 24, pnpm workspaces |

## Struktur Monorepo

```
/
├── artifacts/
│   ├── myportofolio/        # Frontend React + Vite  (preview: /)
│   └── api-server/          # Express API            (preview: /api)
├── lib/
│   ├── api-spec/            # OpenAPI spec + codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod validators
├── docs/                    # Dokumentasi ini
└── replit.md                # Project overview & user preferences
```

## Fitur

**Public**
- Home — hero dengan typewriter, stats, expertise cards, featured projects, latest blog
- About — bio, timeline pengalaman & pendidikan, skill bars, tools & expertise
- Portfolio — grid project dengan filter kategori, featured badge
- Services — konten CMS yang dipublikasikan (section: services, testimonials, custom)
- Blog — daftar artikel + detail dengan reading progress bar, markdown renderer
- CV — download CV dalam format PDF
- Contact — form kontak dengan email via Gmail SMTP

**Auth**
- Login/Register di `/login` dan `/register`
- Verifikasi email setelah register
- Forgot password + reset password via email

**Admin Panel** (`/admin`)
- Dashboard — stat cards + mini analytics chart + recent projects + recent blog
- Analytics — area chart 30 hari, top pages, top referrers, stat cards
- Blog Manager — CRUD artikel dengan markdown editor + live preview
- Portfolio Manager — CRUD proyek dengan kategori, featured, gambar
- Content CMS — CRUD content blocks per section (home, about, services, dll)
- Profile Editor — edit bio, skills, experience, education, social links
- CV Manager + Generator — buat dan export CV ke PDF

## Quick Start (Development)

```bash
# Install semua dependencies
pnpm install

# Jalankan API server (port dari $PORT, default 8080)
pnpm --filter @workspace/api-server run dev

# Jalankan frontend (port dari $PORT)
pnpm --filter @workspace/myportofolio run dev

# Regenerate API client dari OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Typecheck semua packages
pnpm run typecheck
```

## Dokumentasi Lanjutan

- [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) — variabel lingkungan dan secrets
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) — alur kerja git dan branching
- [DeployToVercel.md](./DeployToVercel.md) — deploy ke Vercel
- [DeployToGithub.md](./DeployToGithub.md) — push ke GitHub

## Catatan Penting

- **In-memory MongoDB** otomatis digunakan di dev jika `MONGODB_URI` tidak di-set
- **JWT secret** ephemeral di dev (random tiap restart) — set `JWT_SECRET` di production
- **User pertama** yang register otomatis menjadi `admin`; berikutnya `viewer`
- **Email** dikirim via Gmail SMTP (`SMTP_EMAIL` + `SMTP_APP_PASSWORD`)
