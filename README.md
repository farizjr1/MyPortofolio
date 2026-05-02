# Fariz Jelang Ramadhan — Portfolio & CMS

Aplikasi portfolio profesional berbasis web yang berfungsi sebagai **Accounting CMS** dan **ATS CV Generator**. Dibangun dengan stack modern: React 19 + Vite di frontend dan Express 5 + MongoDB di backend.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Instalasi & Setup Lokal](#instalasi--setup-lokal)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Panduan Penggunaan](#panduan-penggunaan)
  - [Site Publik](#1-site-publik)
  - [Login & Register](#2-login--register)
  - [Admin Dashboard](#3-admin-dashboard)
  - [ATS CV Generator](#4-ats-cv-generator)
- [API Reference](#api-reference)
- [Deploy ke Produksi](#deploy-ke-produksi)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🌐 **Portfolio Publik** | Halaman Home, About, Portfolio, dan Contact yang dinamis |
| 🔐 **Auth System** | Register, Login, Verifikasi Email, Forgot/Reset Password |
| 🛡️ **RBAC** | Role-based access control (Admin / Viewer) via JWT |
| 📋 **Admin Dashboard** | CRUD lengkap untuk Portfolio, Content CMS, Profile |
| 📄 **ATS CV Generator** | Buat dan download CV dalam format PDF yang ATS-friendly |
| 🗄️ **MongoDB** | In-memory saat dev, MongoDB Atlas di produksi |
| 📧 **Email Notifikasi** | Verifikasi email & reset password via SMTP/Gmail |
| 🎨 **Dark Aesthetic** | Tema gelap (#121212) dengan aksen amber (#FDE68A) |
| ✨ **Animasi** | Framer Motion untuk transisi dan micro-interaction halus |

---

## Tech Stack

### Frontend (`artifacts/portfolio`)
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** + **Shadcn/UI** — komponen UI
- **Framer Motion** — animasi
- **@react-pdf/renderer** — generate PDF CV langsung di browser
- **TanStack Query** — data fetching & caching
- **React Router v7** — routing SPA

### Backend (`artifacts/api-server`)
- **Express 5** + **TypeScript**
- **MongoDB** + **Mongoose** — database & ODM
- **JWT** + **Bcrypt** — autentikasi & hashing password
- **Nodemailer** — email (verifikasi & reset password)
- **Helmet** + **CORS** — security headers
- **Pino** — structured logging
- **mongodb-memory-server** — in-memory MongoDB untuk development

### Shared Libraries
- `lib/api-spec` — OpenAPI 3.0 spec (contract-first)
- `lib/api-zod` — Zod schemas di-generate otomatis dari OpenAPI
- `lib/api-client-react` — React Query hooks di-generate otomatis

---

## Struktur Proyek

```
MyPortofolio/
├── artifacts/
│   ├── api-server/          # Backend Express API
│   │   └── src/
│   │       ├── models/      # Mongoose schemas (User, Profile, Portfolio, Content, CvData)
│   │       ├── routes/      # Route handlers (auth, profile, portfolio, content, cv)
│   │       ├── middlewares/ # JWT auth, RBAC
│   │       └── lib/         # MongoDB connection (in-memory fallback)
│   └── portfolio/           # Frontend React + Vite
│       └── src/
│           ├── pages/       # Home, About, Portfolio, Contact, Auth, Admin
│           ├── components/  # Layout, UI components
│           └── hooks/       # Custom hooks
├── lib/
│   ├── api-spec/            # openapi.yaml (sumber kebenaran API)
│   ├── api-zod/             # Zod schemas (auto-generated)
│   └── api-client-react/   # React Query hooks (auto-generated)
├── .env.example             # Template environment variables
├── ENV_MANAGEMENT.md        # Panduan lengkap manajemen env & secrets
├── GIT_WORKFLOW.md          # Panduan Git Flow
└── .github/workflows/
    └── deploy.yml           # CI/CD ke Vercel via GitHub Actions
```

---

## Prasyarat

Pastikan sudah terinstall:

- **Node.js** v20 atau lebih baru
- **pnpm** v9 atau lebih baru (`npm install -g pnpm`)
- **MongoDB** (opsional — app otomatis pakai in-memory MongoDB saat development)

---

## Instalasi & Setup Lokal

### 1. Clone repository

```bash
git clone https://github.com/farizjr1/MyPortofolio.git
cd MyPortofolio
```

### 2. Install semua dependencies

```bash
pnpm install
```

### 3. Salin file environment

```bash
cp .env.example artifacts/api-server/.env
```

Lalu edit file `artifacts/api-server/.env` sesuai kebutuhan (lihat bagian [Konfigurasi Environment](#konfigurasi-environment)).

### 4. Generate kode dari OpenAPI spec

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Konfigurasi Environment

Buat file `.env` di dalam `artifacts/api-server/` berdasarkan `.env.example`:

```env
# ─── Server ───────────────────────────────────────────────────────
PORT=8080
NODE_ENV=development

# ─── MongoDB ──────────────────────────────────────────────────────
# Biarkan kosong untuk pakai in-memory MongoDB (development)
# Isi dengan URI Atlas untuk production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

# ─── JWT ──────────────────────────────────────────────────────────
# Generate dengan: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=ganti-dengan-string-acak-yang-panjang

# ─── CORS ─────────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173

# ─── Email (Gmail) ────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email-kamu@gmail.com
SMTP_PASS=app-password-gmail-kamu   # Bukan password Gmail biasa!
EMAIL_FROM=email-kamu@gmail.com

# ─── Frontend ─────────────────────────────────────────────────────
VITE_API_URL=http://localhost:8080/api
```

> **Catatan Gmail App Password:**
> Karena Gmail membutuhkan App Password (bukan password akun biasa):
> 1. Aktifkan 2FA di akun Google kamu
> 2. Buka: https://myaccount.google.com/apppasswords
> 3. Pilih "Mail" → "Other" → Generate
> 4. Gunakan 16-digit password yang dihasilkan sebagai `SMTP_PASS`

---

## Menjalankan Aplikasi

### Development (jalankan keduanya secara bersamaan)

**Terminal 1 — Backend API:**
```bash
pnpm --filter @workspace/api-server run dev
```
API berjalan di: `http://localhost:8080/api`

**Terminal 2 — Frontend:**
```bash
pnpm --filter @workspace/portfolio run dev
```
Frontend berjalan di: `http://localhost:5173`

> **Tip:** Saat `MONGODB_URI` tidak diset, backend otomatis menyalakan in-memory MongoDB — tidak perlu install MongoDB lokal untuk development.

---

## Panduan Penggunaan

### 1. Site Publik

Akses `http://localhost:5173` untuk melihat site publik:

| Halaman | URL | Deskripsi |
|---|---|---|
| **Home** | `/` | Hero section dengan nama, tagline, dan CTA |
| **About** | `/about` | Deskripsi diri, timeline pengalaman & pendidikan |
| **Portfolio** | `/portfolio` | Grid proyek dengan filter kategori |
| **Contact** | `/contact` | Form kontak + info sosial media |

Semua konten halaman publik diambil secara dinamis dari API dan bisa dikelola melalui Admin Dashboard.

---

### 2. Login & Register

#### Daftar Akun Baru
1. Buka `/register`
2. Isi nama, email, dan password
3. Cek email untuk link verifikasi (jika SMTP dikonfigurasi)
4. Klik link verifikasi → akun aktif

#### Login
1. Buka `/login`
2. Masukkan email dan password
3. Setelah login, pengguna dengan role **admin** otomatis diarahkan ke dashboard

#### Lupa Password
1. Buka `/forgot-password`
2. Masukkan email terdaftar
3. Cek email → klik link reset
4. Masukkan password baru di `/reset-password?token=...`

> **Buat akun admin pertama:** Setelah register, update role di database MongoDB secara langsung, atau gunakan endpoint API: `PATCH /api/auth/users/:id/role` dengan body `{"role": "admin"}` menggunakan token admin yang sudah ada.

---

### 3. Admin Dashboard

Akses `/admin` setelah login dengan akun berole **admin**.

#### a. Dashboard Overview (`/admin`)
- Statistik ringkasan: jumlah proyek, konten, pesan masuk
- Navigasi cepat ke semua modul

#### b. Portfolio Manager (`/admin/portfolio`)
Kelola daftar proyek yang tampil di halaman Portfolio publik:

1. Klik **"Tambah Proyek"** untuk menambah proyek baru
2. Isi form:
   - **Judul** — nama proyek
   - **Deskripsi** — penjelasan singkat proyek
   - **Kategori** — (misal: Web App, Data Analysis, Accounting)
   - **Tags** — teknologi yang digunakan
   - **URL Demo** — link live demo (opsional)
   - **URL GitHub** — link source code (opsional)
   - **Gambar** — URL thumbnail proyek
   - **Status** — Published / Draft
3. Klik **Simpan** — proyek langsung tampil di halaman Portfolio

Untuk **edit** atau **hapus**, klik ikon pensil/tempat sampah di baris proyek.

#### c. Content CMS (`/admin/content`)
Kelola konten teks untuk semua halaman publik (About, Home tagline, dll):

1. Pilih halaman/section yang ingin diedit
2. Edit teks langsung di editor
3. Klik **Simpan** — perubahan langsung live di site publik

#### d. Profile Editor (`/admin/profile`)
Edit informasi profil yang tampil di site:

- Nama lengkap, tagline, bio
- Foto profil (URL)
- Link GitHub, LinkedIn, email
- Skills & keahlian

#### e. CV Manager (`/admin/cv`)
Kelola data yang digunakan untuk generate CV (lihat bagian [ATS CV Generator](#4-ats-cv-generator)).

---

### 4. ATS CV Generator

Akses `/admin/cv` untuk membuat CV dalam format PDF yang ATS-friendly.

#### Cara Generate CV:

**Langkah 1 — Isi Data Personal**
- Nama lengkap, email, nomor telepon
- Kota/lokasi, LinkedIn URL, GitHub URL
- Ringkasan profil (professional summary)

**Langkah 2 — Pengalaman Kerja**
- Klik **"Tambah Pengalaman"**
- Isi: nama perusahaan, posisi, periode, deskripsi tugas
- Tambahkan sebanyak yang diperlukan

**Langkah 3 — Pendidikan**
- Klik **"Tambah Pendidikan"**
- Isi: nama institusi, jurusan, gelar, tahun lulus, IPK (opsional)

**Langkah 4 — Skills**
- Tambahkan skill teknis dan soft skill
- Skills ditampilkan dalam format yang mudah di-parse ATS

**Langkah 5 — Sertifikasi & Penghargaan** (opsional)
- Tambahkan sertifikasi profesional
- Tambahkan penghargaan atau pencapaian

**Langkah 6 — Preview & Download**
- Klik **"Preview CV"** untuk melihat tampilan sebelum download
- Klik **"Download PDF"** untuk mengunduh CV
- File PDF di-generate langsung di browser (tidak perlu server) menggunakan `@react-pdf/renderer`

> **Tips ATS:** Gunakan kata kunci yang relevan dengan posisi yang dilamar. CV ini menggunakan format hitam-putih yang bersih dan satu kolom agar mudah dibaca oleh sistem ATS perusahaan.

---

## API Reference

Base URL: `http://localhost:8080/api`

### Autentikasi
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Daftar akun baru | — |
| `POST` | `/auth/login` | Login, mendapat JWT | — |
| `GET` | `/auth/me` | Info user yang sedang login | ✅ |
| `POST` | `/auth/logout` | Logout | ✅ |
| `POST` | `/auth/forgot-password` | Kirim email reset password | — |
| `POST` | `/auth/reset-password` | Reset password dengan token | — |
| `GET` | `/auth/verify-email` | Verifikasi email | — |

### Profile
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/profile` | Ambil data profil publik | — |
| `PUT` | `/profile` | Update profil | ✅ Admin |

### Portfolio
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/portfolio` | Daftar semua proyek (publik: hanya published) | — |
| `POST` | `/portfolio` | Tambah proyek baru | ✅ Admin |
| `GET` | `/portfolio/:id` | Detail satu proyek | — |
| `PUT` | `/portfolio/:id` | Update proyek | ✅ Admin |
| `DELETE` | `/portfolio/:id` | Hapus proyek | ✅ Admin |

### Content CMS
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/content` | Semua konten halaman | — |
| `GET` | `/content/:section` | Konten per section | — |
| `PUT` | `/content/:section` | Update konten section | ✅ Admin |

### CV Data
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/cv` | Ambil data CV tersimpan | ✅ |
| `PUT` | `/cv` | Simpan/update data CV | ✅ |

### Health Check
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/healthz` | Status server |

---

## Deploy ke Produksi

### Opsi 1: Replit (Paling Mudah)
Proyek ini sudah berjalan di Replit. Klik tombol **Publish** di Replit untuk deploy ke domain `.replit.app`.

Sebelum publish, set environment variables berikut di Replit Secrets:
- `MONGODB_URI` — URI MongoDB Atlas
- `JWT_SECRET` — string acak panjang
- `SMTP_USER`, `SMTP_PASS` — kredensial Gmail
- `SESSION_SECRET` — string acak untuk session

### Opsi 2: Vercel + Railway/Render (via GitHub Actions)

File `.github/workflows/deploy.yml` sudah menyiapkan CI/CD otomatis. Setup:

**Backend (Railway atau Render):**
1. Buat akun di [Railway](https://railway.app) atau [Render](https://render.com)
2. Connect repository GitHub
3. Set environment variables (sama seperti `.env.example`)
4. Deploy `artifacts/api-server`

**Frontend (Vercel):**
1. Buat akun di [Vercel](https://vercel.com)
2. Import repository GitHub
3. Set Root Directory: `artifacts/portfolio`
4. Set environment variable: `VITE_API_URL=https://your-api-url.railway.app/api`
5. Deploy

**GitHub Secrets yang diperlukan** (untuk Actions):
```
VERCEL_TOKEN         # Token dari dashboard Vercel
VERCEL_ORG_ID        # ID organisasi Vercel
VERCEL_PROJECT_ID    # ID project Vercel
```

Panduan lengkap ada di [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md).

---

## Git Workflow

Proyek ini menggunakan Git Flow. Panduan lengkap ada di [GIT_WORKFLOW.md](./GIT_WORKFLOW.md).

**Ringkasan singkat:**

```bash
# Buat fitur baru
git checkout -b feature/nama-fitur develop

# Setelah selesai, merge ke develop
git checkout develop
git merge feature/nama-fitur

# Release ke production
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

**Branch utama:**
- `main` — production-ready, auto-deploy ke Vercel
- `develop` — staging/integration
- `feature/*` — fitur baru
- `hotfix/*` — perbaikan bug critical di production

---

## Troubleshooting

### Backend tidak bisa start
```
Error: listen EADDRINUSE: address already in use :::8080
```
Port 8080 sudah dipakai proses lain. Matikan proses lama:
```bash
lsof -ti:8080 | xargs kill -9
```

### MongoDB connection error
Jika `MONGODB_URI` diset tapi koneksi gagal:
- Pastikan IP address kamu sudah di-whitelist di MongoDB Atlas (Network Access → Add IP Address)
- Cek apakah username/password di URI sudah benar
- Biarkan `MONGODB_URI` kosong untuk pakai in-memory MongoDB saat development

### Push ke GitHub gagal (403)
- Pastikan Personal Access Token (Classic) memiliki scope: `repo` dan `workflow`
- Buat token baru di: https://github.com/settings/tokens/new

### Email verifikasi tidak terkirim
- Pastikan `SMTP_USER` dan `SMTP_PASS` sudah benar
- `SMTP_PASS` harus berupa **App Password** Google, bukan password akun biasa
- Aktifkan "Less secure app access" atau gunakan App Password di: https://myaccount.google.com/apppasswords

### PDF tidak bisa di-download
- Pastikan browser tidak memblokir popup/download
- Coba di browser lain (Chrome/Firefox terbaru)
- Pastikan semua field wajib di form CV sudah terisi

### Halaman admin tidak bisa diakses
- Pastikan sudah login dengan akun yang memiliki role `admin`
- Cek token JWT di browser: DevTools → Application → Local Storage
- Jika token expired, login ulang

---

## Lisensi

MIT License — bebas digunakan dan dimodifikasi untuk keperluan pribadi maupun komersial.

---

<div align="center">
  Dibuat dengan ❤️ oleh <strong>Fariz Jelang Ramadhan</strong>
</div>
