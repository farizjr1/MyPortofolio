# Git Workflow

Panduan alur kerja git untuk project Fariz Portfolio CMS.

## Branch Strategy

```
main
├── develop          # Branch integrasi utama
├── feature/*        # Fitur baru
├── fix/*            # Bug fixes
└── hotfix/*         # Perbaikan darurat di production
```

| Branch | Tujuan | Deploy ke |
|---|---|---|
| `main` | Production-ready code | Vercel production |
| `develop` | Integrasi fitur | Vercel preview |
| `feature/*` | Pengembangan fitur | — |
| `fix/*` | Perbaikan bug | — |
| `hotfix/*` | Fix darurat | Merge langsung ke `main` |

---

## Alur Kerja Standar

### 1. Mulai Fitur Baru

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur
```

Contoh nama branch:
- `feature/blog-comments`
- `feature/dark-mode-toggle`
- `fix/mobile-navbar`
- `hotfix/jwt-expiry`

### 2. Kerjakan & Commit

```bash
# Cek status
git status

# Stage file
git add .
# atau selective:
git add artifacts/myportofolio/src/pages/Blog.tsx

# Commit dengan pesan deskriptif
git commit -m "feat: add blog comment system with CRUD"
```

### 3. Push dan Pull Request

```bash
git push origin feature/nama-fitur
```

Buka Pull Request di GitHub ke branch `develop`. Setelah review dan test, merge ke `develop`.

### 4. Deploy ke Production

```bash
git checkout main
git merge develop
git push origin main
```

---

## Konvensi Commit Message

Format: `<type>(<scope>): <deskripsi singkat>`

| Type | Kapan digunakan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `refactor` | Refaktor kode tanpa perubahan fungsi |
| `style` | Perubahan UI/CSS/formatting |
| `docs` | Update dokumentasi |
| `chore` | Update dependencies, config, build |
| `perf` | Peningkatan performa |
| `test` | Tambah atau perbaiki test |

Contoh:
```
feat(blog): add markdown preview in blog manager
fix(navbar): hamburger menu not showing on mobile
refactor(analytics): use $nin instead of duplicate $ne
docs: update ENV_MANAGEMENT with Gmail App Password steps
chore: upgrade recharts to 2.15.2
```

---

## Struktur Monorepo & Git

Project ini adalah **pnpm workspace monorepo**. Semua packages ada dalam satu repo:

```
artifacts/api-server/     → backend
artifacts/myportofolio/   → frontend
lib/api-spec/             → OpenAPI spec
lib/api-client-react/     → generated (jangan edit manual)
lib/api-zod/              → generated (jangan edit manual)
```

> **Penting:** File di `lib/api-client-react/src/generated/` dan `lib/api-zod/src/generated/` adalah **auto-generated**. Jangan edit manual — jalankan `pnpm --filter @workspace/api-spec run codegen` untuk regenerasi.

---

## .gitignore Penting

File berikut **tidak** di-commit:
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

Pastikan secret tidak masuk ke git dengan cek:
```bash
git diff --staged | grep -i "secret\|password\|token\|key"
```

---

## Undo & Recovery

```bash
# Undo commit terakhir (keep changes)
git reset --soft HEAD~1

# Discard semua unstaged changes
git checkout -- .

# Revert commit spesifik (safe, buat commit baru)
git revert <commit-hash>

# Lihat history dengan detail
git log --oneline --graph --decorate
```

---

## Sinkronisasi dengan Replit

Jika kamu mengembangkan di Replit dan ingin push ke GitHub:

```bash
# Set remote (pertama kali)
git remote add origin https://github.com/username/fariz-portfolio.git

# Push
git push -u origin main
```

Lihat [DeployToGithub.md](./DeployToGithub.md) untuk setup lengkap.
