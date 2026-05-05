# Panduan Git Workflow — MyPortofolio

Dokumen ini menjelaskan secara lengkap strategi branching, alur kerja harian, proses release, dan pengelolaan versi untuk project MyPortofolio.

---

## Daftar Isi

- [Strategi Branching](#strategi-branching)
- [Setup Awal Repository](#setup-awal-repository)
- [Konvensi Commit Message](#konvensi-commit-message)
- [Alur Kerja Harian — Fitur Baru](#alur-kerja-harian--fitur-baru)
- [Alur Testing](#alur-testing)
- [Alur Release ke Production](#alur-release-ke-production)
- [Alur Hotfix — Bug Kritis di Production](#alur-hotfix--bug-kritis-di-production)
- [Pengelolaan Versi & Tag](#pengelolaan-versi--tag)
- [Branch Protection Rules di GitHub](#branch-protection-rules-di-github)
- [Diagram Alur Lengkap](#diagram-alur-lengkap)
- [Perintah Git Penting](#perintah-git-penting)
- [FAQ](#faq)

---

## Strategi Branching

Project ini menggunakan **Git Flow** yang disederhanakan dengan 3 branch utama:

| Branch | Tujuan | Deploy ke | Siapa yang push |
|---|---|---|---|
| `main` | Kode production stabil | Vercel / Replit Production | Merge dari `develop` saja |
| `develop` | Integrasi fitur sebelum release | Staging / Replit Testing | Merge dari `feature/*` |
| `testing` | QA dan pengujian | Replit Testing | Merge dari `feature/*` untuk diuji |

Branch tambahan (temporary):

| Branch | Pola Nama | Contoh |
|---|---|---|
| Fitur baru | `feature/nama-fitur` | `feature/cv-generator` |
| Perbaikan bug | `fix/nama-bug` | `fix/auth-token-expire` |
| Perbaikan kritis | `hotfix/nama-bug` | `hotfix/cors-production` |
| Rilis | `release/versi` | `release/v1.2.0` |
| Dokumentasi | `docs/nama` | `docs/update-readme` |

---

## Setup Awal Repository

Lakukan ini **satu kali** saat pertama kali setup project di laptop baru atau untuk kontributor baru.

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/farizjr1/MyPortofolio.git
cd MyPortofolio
```

### Langkah 2 — Konfigurasi Git Identity

```bash
git config user.name "Fariz Jelang Ramadhan"
git config user.email "fariz@example.com"
```

### Langkah 3 — Buat Branch develop dan testing (jika belum ada)

```bash
# Cek branch yang sudah ada di remote
git branch -a

# Jika develop belum ada, buat dan push
git checkout -b develop
git push -u origin develop

# Jika testing belum ada, buat dan push
git checkout -b testing
git push -u origin testing

# Kembali ke main
git checkout main
```

### Langkah 4 — Setup Tracking Branch Lokal

```bash
# Track semua branch remote
git fetch --all

# Setup tracking untuk develop
git checkout -b develop origin/develop

# Setup tracking untuk testing
git checkout -b testing origin/testing

# Kembali ke main untuk mulai kerja
git checkout main
```

### Langkah 5 — Verifikasi Setup

```bash
# Lihat semua branch lokal dan remote
git branch -a

# Output yang diharapkan:
# * main
#   develop
#   testing
#   remotes/origin/main
#   remotes/origin/develop
#   remotes/origin/testing
```

---

## Konvensi Commit Message

Project ini menggunakan **Conventional Commits** — format standar yang membuat history Git mudah dibaca dan mendukung auto-generate changelog.

### Format

```
<type>(<scope>): <deskripsi singkat>

[body opsional — penjelasan lebih detail]

[footer opsional — breaking changes, issue references]
```

### Tipe Commit

| Tipe | Kapan Dipakai | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat(portfolio): add category filter` |
| `fix` | Perbaikan bug | `fix(auth): JWT token not refreshing` |
| `docs` | Perubahan dokumentasi | `docs(readme): add deployment guide` |
| `style` | Perubahan tampilan/CSS | `style(navbar): add glass effect` |
| `refactor` | Refactoring kode (tanpa bug fix/fitur) | `refactor(api): extract seed to separate file` |
| `perf` | Optimasi performa | `perf(portfolio): lazy load images` |
| `test` | Tambah/ubah test | `test(auth): add login unit tests` |
| `chore` | Update dependency, config | `chore: upgrade vite to v7` |
| `ci` | Perubahan CI/CD | `ci: add Railway deployment workflow` |
| `revert` | Revert commit sebelumnya | `revert: feat(cv): remove pdf export` |

### Scope yang Umum Dipakai

`frontend`, `backend`, `api`, `auth`, `portfolio`, `profile`, `cv`, `content`, `navbar`, `footer`, `seed`, `deploy`, `ci`, `docs`

### Contoh Commit Message Lengkap

```bash
# Commit singkat (untuk perubahan kecil)
git commit -m "feat(navbar): add glass morphism effect"

# Commit dengan body (untuk perubahan besar)
git commit -m "feat(cv): implement ATS PDF generator

Menambahkan fitur generate CV dalam format PDF menggunakan
@react-pdf/renderer. Mendukung multi-section: personal info,
pengalaman kerja, pendidikan, dan skills.

Closes #12"

# Commit dengan breaking change
git commit -m "refactor(api): change auth endpoint from /login to /auth/login

BREAKING CHANGE: Semua client yang menggunakan /api/login
harus update ke /api/auth/login"
```

---

## Alur Kerja Harian — Fitur Baru

Ikuti langkah-langkah ini setiap kali mengerjakan fitur baru.

### Langkah 1 — Pastikan develop Up-to-date

```bash
git checkout develop
git pull origin develop
```

Selalu lakukan ini sebelum mulai fitur baru — untuk menghindari konflik.

### Langkah 2 — Buat Branch Fitur

```bash
# Format: feature/nama-fitur-singkat-pakai-dash
git checkout -b feature/nama-fitur

# Contoh nyata:
git checkout -b feature/portfolio-filter-category
git checkout -b feature/cv-pdf-generator
git checkout -b feature/admin-profile-editor
git checkout -b fix/navbar-mobile-menu-bug
```

### Langkah 3 — Kerjakan Fitur

Edit kode, tambah file, dll. Commit secara berkala — jangan tunggu selesai semua baru commit.

```bash
# Tambahkan file yang berubah
git add artifacts/myportofolio/src/pages/Portfolio.tsx
git add artifacts/myportofolio/src/components/FilterBar.tsx

# Atau tambahkan semua perubahan sekaligus
git add .

# Commit dengan pesan yang deskriptif
git commit -m "feat(portfolio): add category filter bar component"

# Lanjut kerja...
git add .
git commit -m "feat(portfolio): connect filter to API query params"
```

### Langkah 4 — Push Branch ke GitHub

```bash
git push -u origin feature/nama-fitur

# Untuk push berikutnya (sudah ada tracking)
git push
```

### Langkah 5 — Update Branch jika develop Berubah

Jika ada orang lain yang merge ke develop sementara kamu masih kerja:

```bash
# Ambil perubahan terbaru dari develop
git fetch origin

# Rebase branch kamu di atas develop terbaru
git rebase origin/develop

# Jika ada konflik, selesaikan lalu:
git add .
git rebase --continue
```

---

## Alur Testing

Setelah fitur selesai, lakukan testing sebelum merge ke develop.

### Langkah 1 — Merge ke Branch testing

```bash
git checkout testing
git pull origin testing

# Merge branch fitur ke testing
git merge feature/nama-fitur

# Push ke remote agar bisa ditest di Replit
git push origin testing
```

### Langkah 2 — Test di Replit

1. Di Replit, pastikan workflow menggunakan branch `testing`
2. Atau checkout branch testing di Replit Shell:
   ```bash
   git fetch origin
   git checkout testing
   ```
3. Restart workflow API Server dan Frontend
4. Lakukan pengujian manual:
   - [ ] Fitur baru berjalan sesuai ekspektasi
   - [ ] Fitur lama tidak rusak (regression test)
   - [ ] Tampilan responsif di mobile dan desktop
   - [ ] Tidak ada error di browser console
   - [ ] API merespons dengan benar

### Langkah 3 — Jika Testing Lulus

Lanjut ke merge ke develop:

```bash
git checkout develop
git merge feature/nama-fitur
git push origin develop

# Hapus branch fitur yang sudah selesai
git branch -d feature/nama-fitur
git push origin --delete feature/nama-fitur
```

### Langkah 4 — Jika Testing Gagal (ada bug)

```bash
# Kembali ke branch fitur
git checkout feature/nama-fitur

# Fix bug
git add .
git commit -m "fix(portfolio): filter not working on mobile viewport"

# Push ulang
git push

# Ulangi merge ke testing dan test lagi
git checkout testing
git merge feature/nama-fitur
git push origin testing
```

---

## Alur Release ke Production

Setelah beberapa fitur terkumpul di develop dan sudah ditest, lakukan release ke production.

### Langkah 1 — Buat Release Branch

```bash
git checkout develop
git pull origin develop

# Buat branch release dengan nomor versi
git checkout -b release/v1.2.0
```

### Langkah 2 — Persiapan Release

Di branch release, lakukan hanya:
- Update nomor versi
- Perbaikan bug kecil terakhir
- Update CHANGELOG (jika ada)
- Update README jika perlu

```bash
# Update versi di package.json frontend
# Edit artifacts/myportofolio/package.json: "version": "1.2.0"

git add artifacts/myportofolio/package.json
git commit -m "chore: bump version to 1.2.0"
```

### Langkah 3 — Merge ke main

```bash
git checkout main
git pull origin main

# Merge release branch ke main
git merge release/v1.2.0 --no-ff -m "release: v1.2.0"

# Push ke main — ini akan trigger CI/CD otomatis
git push origin main
```

### Langkah 4 — Buat Tag Versi

```bash
# Buat annotated tag
git tag -a v1.2.0 -m "Release v1.2.0 — Portfolio filter, CV Generator improvements"

# Push tag ke GitHub
git push origin v1.2.0

# Atau push semua tag sekaligus
git push origin --tags
```

### Langkah 5 — Merge Balik ke develop

```bash
git checkout develop
git merge release/v1.2.0
git push origin develop
```

### Langkah 6 — Hapus Release Branch

```bash
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Langkah 7 — Buat GitHub Release

1. Buka https://github.com/farizjr1/MyPortofolio/releases
2. Klik **"Draft a new release"**
3. Pilih tag `v1.2.0`
4. Judul: `v1.2.0 — Portfolio Filter & CV Generator`
5. Isi deskripsi perubahan (changelog)
6. Klik **"Publish release"**

---

## Alur Hotfix — Bug Kritis di Production

Untuk bug yang ditemukan di production dan harus diperbaiki segera.

### Langkah 1 — Buat Hotfix Branch dari main

```bash
git checkout main
git pull origin main

# Buat branch hotfix
git checkout -b hotfix/deskripsi-bug

# Contoh:
git checkout -b hotfix/cors-blocking-api-calls
git checkout -b hotfix/login-redirect-broken
```

### Langkah 2 — Fix Bug

```bash
# Kerjakan perbaikan
# ...

git add .
git commit -m "fix(auth): correct CORS origin blocking API requests in production"
```

### Langkah 3 — Merge ke main

```bash
git checkout main
git merge hotfix/deskripsi-bug --no-ff
git push origin main
```

### Langkah 4 — Buat Tag Patch

```bash
# Increment patch version (misal dari v1.2.0 → v1.2.1)
git tag -a v1.2.1 -m "Hotfix v1.2.1 — fix CORS production issue"
git push origin v1.2.1
```

### Langkah 5 — Backport ke develop

Penting agar perbaikan tidak hilang di release berikutnya:

```bash
git checkout develop
git merge hotfix/deskripsi-bug
git push origin develop
```

### Langkah 6 — Hapus Hotfix Branch

```bash
git branch -d hotfix/deskripsi-bug
git push origin --delete hotfix/deskripsi-bug
```

---

## Pengelolaan Versi & Tag

Project ini menggunakan **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

| Komponen | Kapan Naik | Contoh |
|---|---|---|
| `MAJOR` | Breaking change / redesign besar | `1.0.0` → `2.0.0` |
| `MINOR` | Fitur baru yang backward-compatible | `1.0.0` → `1.1.0` |
| `PATCH` | Bug fix, hotfix | `1.0.0` → `1.0.1` |

### Contoh Versi

```
v1.0.0  — Initial release
v1.0.1  — Hotfix: perbaikan CORS
v1.1.0  — Tambah fitur CV Generator
v1.2.0  — Tambah fitur Portfolio filter
v2.0.0  — Redesign UI major
```

### Perintah Tag

```bash
# Lihat semua tag
git tag

# Lihat detail tag tertentu
git show v1.2.0

# Hapus tag lokal (jika salah)
git tag -d v1.2.0

# Hapus tag di remote (hati-hati!)
git push origin --delete v1.2.0

# Buat tag dari commit lama (bukan HEAD)
git tag -a v1.0.0 abc1234 -m "Tagging old release"
```

---

## Branch Protection Rules di GitHub

Konfigurasi ini mencegah push langsung ke branch penting tanpa review.

### Setup untuk Branch `main`

1. Buka GitHub → repository → **Settings** → **Branches**
2. Klik **"Add branch protection rule"**
3. **Branch name pattern:** `main`
4. Centang opsi berikut:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: `1`
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - Search dan tambahkan: `build-and-deploy` (nama job di GitHub Actions)
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Do not allow bypassing the above settings**
   - ✅ **Restrict who can push to matching branches** (opsional)
5. Klik **"Save changes"**

### Setup untuk Branch `develop`

1. Klik **"Add branch protection rule"** lagi
2. **Branch name pattern:** `develop`
3. Centang:
   - ✅ **Require a pull request before merging** (opsional — jika tim kecil bisa skip)
   - ✅ **Require status checks to pass before merging**
4. Klik **"Save changes"**

---

## Diagram Alur Lengkap

```
═══════════════════════════════════════════════════════════════
                    ALUR KERJA GIT FLOW
═══════════════════════════════════════════════════════════════

  feature/xyz ──────┐
                    ↓ merge
  feature/abc ──► develop ──────────────────────► testing (QA)
                    │                                  │
                    │ (setelah beberapa fitur)          │ (jika ada bug)
                    ↓                                  ↓
              release/v1.x ◄──────── (fix minor) ──────┘
                    │
                    ↓ merge --no-ff
  hotfix/bug ──►  main ◄────────────────────────────────────
                    │
                    ↓ tag v1.x.x
              [PRODUCTION DEPLOY]
                (GitHub Actions → Vercel)

═══════════════════════════════════════════════════════════════
```

---

## Perintah Git Penting

### Sehari-hari

```bash
# Cek status file yang berubah
git status

# Lihat perubahan yang belum di-staging
git diff

# Lihat perubahan yang sudah di-staging
git diff --staged

# Lihat history commit (ringkas)
git log --oneline --graph --all

# Batalkan perubahan di file (belum di-staging)
git checkout -- nama-file.ts

# Unstage file
git restore --staged nama-file.ts

# Amend commit terakhir (belum di-push)
git commit --amend -m "pesan baru"
```

### Branch Management

```bash
# Lihat semua branch
git branch -a

# Pindah branch
git checkout nama-branch

# Buat dan langsung pindah
git checkout -b nama-branch-baru

# Hapus branch lokal (sudah merged)
git branch -d nama-branch

# Hapus branch lokal (belum merged, paksa)
git branch -D nama-branch

# Hapus branch di remote
git push origin --delete nama-branch

# Sinkronisasi daftar branch (hapus referensi branch remote yang sudah dihapus)
git fetch --prune
```

### Sync dengan Remote

```bash
# Ambil perubahan terbaru dari semua branch
git fetch --all

# Pull + merge (fetch + merge)
git pull origin nama-branch

# Pull + rebase (lebih bersih, hindari merge commit)
git pull --rebase origin nama-branch

# Push branch pertama kali
git push -u origin nama-branch

# Push biasa (sudah ada tracking)
git push
```

### Stash (Simpan Sementara)

Berguna saat harus pindah branch tapi perubahan belum siap di-commit:

```bash
# Simpan perubahan ke stash
git stash

# Pindah branch, kerjakan hal lain...

# Kembali ke branch asal dan ambil stash
git stash pop

# Lihat daftar stash
git stash list

# Hapus semua stash
git stash clear
```

---

## FAQ

### Q: Bolehkah push langsung ke main?
**A:** Tidak, kecuali hotfix kritis. Semua perubahan ke `main` harus lewat Pull Request dari branch `develop` atau `release/*`.

### Q: Kapan pakai `merge` vs `rebase`?
**A:**
- **`rebase`** — untuk update branch fitur dengan perubahan terbaru dari develop (sebelum PR). History lebih bersih.
- **`merge --no-ff`** — untuk merge branch ke develop/main. Membuat merge commit yang jelas kapan fitur digabungkan.
- **Jangan rebase branch yang sudah di-push ke remote** — bisa menimbulkan konflik bagi orang lain.

### Q: Commit message saya salah tapi sudah di-push, bagaimana?
**A:** Jika sudah di-push ke branch sendiri (bukan main/develop), bisa force push:
```bash
git commit --amend -m "pesan yang benar"
git push --force-with-lease
```
Jangan lakukan ini di branch `main` atau `develop`.

### Q: Bagaimana cara undo commit yang sudah di-push ke develop?
**A:** Gunakan `git revert` (bukan `git reset`) — ini membuat commit baru yang membatalkan commit sebelumnya tanpa mengubah history:
```bash
git revert abc1234
git push origin develop
```

### Q: Apa bedanya `git fetch` dan `git pull`?
**A:** `fetch` hanya mengambil perubahan dari remote ke lokal tanpa menggabungkannya. `pull` = `fetch` + `merge`. Gunakan `fetch` dulu untuk lihat apa yang berubah sebelum menggabungkan.

### Q: Bagaimana cara lihat siapa yang mengubah baris kode tertentu?
```bash
git blame nama-file.ts
```
