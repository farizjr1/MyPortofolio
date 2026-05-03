# Fariz Jelang Ramadhan — Portfolio & CMS

Aplikasi portfolio profesional berbasis web yang berfungsi sebagai **Accounting CMS** dan **ATS CV Generator**. Dibangun dengan stack modern React 19 + Vite di sisi frontend dan Express 5 + MongoDB di sisi backend, dikelola dalam satu monorepo menggunakan pnpm workspaces.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Environment Variables](#environment-variables)
- [1. Development — Lokal di Laptop](#1-development--lokal-di-laptop)
- [2. Testing — di Replit](#2-testing--di-replit)
- [3. Production — Deploy ke Server](#3-production--deploy-ke-server)
- [Panduan Penggunaan Aplikasi](#panduan-penggunaan-aplikasi)
- [API Reference](#api-reference)
- [Arsitektur & Alur Data](#arsitektur--alur-data)
- [Troubleshooting](#troubleshooting)

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🌐 **Portfolio Publik** | Halaman Home, About, Portfolio, Contact yang dinamis |
| 🔐 **Secret Admin Login** | Login hanya via `/flutceadmin` — tidak tampil di navbar |
| 🛡️ **JWT Auth + RBAC** | Role-based access (Admin / Viewer) dengan token JWT |
| 📋 **Admin Dashboard** | CRUD lengkap untuk Portfolio, Content CMS, Profile |
| 📄 **ATS CV Generator** | Buat & download CV PDF yang ATS-friendly |
| 🗄️ **Auto Seed Data** | Template data otomatis terisi saat database masih kosong |
| 🗄️ **MongoDB Fleksibel** | In-memory saat dev, MongoDB Atlas saat production |
| 📧 **Email Notifikasi** | Verifikasi email & reset password via SMTP/Gmail |

---

## Tech Stack

### Frontend (`artifacts/myportofolio`)
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** + **Shadcn/UI** — komponen UI
- **Framer Motion** — animasi
- **@react-pdf/renderer** — generate PDF CV di browser
- **TanStack Query** — data fetching & caching
- **Wouter** — routing SPA

### Backend (`artifacts/api-server`)
- **Express 5** + **TypeScript**
- **MongoDB** + **Mongoose** — database & ODM
- **JWT** + **Bcrypt** — autentikasi & hashing password
- **Nodemailer** — email (verifikasi & reset password)
- **Helmet** + **CORS** — security headers
- **Pino** — structured logging
- **mongodb-memory-server** — in-memory MongoDB untuk development

### Shared Libraries (`lib/`)
- `lib/api-spec` — OpenAPI 3.0 spec (sumber kebenaran API)
- `lib/api-zod` — Zod schemas (di-generate otomatis dari OpenAPI)
- `lib/api-client-react` — React Query hooks (di-generate otomatis)

---

## Struktur Proyek

```
MyPortofolio/
├── artifacts/
│   ├── api-server/                  # Backend Express API
│   │   └── src/
│   │       ├── app.ts               # Setup Express, CORS, Helmet
│   │       ├── index.ts             # Entry point, bind port
│   │       ├── models/              # Mongoose schemas
│   │       │   ├── User.ts
│   │       │   ├── Profile.ts
│   │       │   ├── Portfolio.ts
│   │       │   ├── Content.ts
│   │       │   └── CvData.ts
│   │       ├── routes/              # Route handlers
│   │       │   ├── auth.ts          # Register, login, verify, reset
│   │       │   ├── profile.ts       # GET/PUT profile publik
│   │       │   ├── portfolio.ts     # CRUD proyek portfolio
│   │       │   ├── content.ts       # CMS konten halaman
│   │       │   ├── cv.ts            # CRUD data CV
│   │       │   └── health.ts        # Health check
│   │       ├── middlewares/
│   │       │   └── auth.ts          # JWT middleware + RBAC
│   │       └── lib/
│   │           ├── mongodb.ts       # Koneksi MongoDB + auto-seed
│   │           ├── seed.ts          # Template data awal
│   │           └── logger.ts        # Pino logger
│   └── myportofolio/                # Frontend React + Vite
│       └── src/
│           ├── App.tsx              # Router utama
│           ├── pages/
│           │   ├── Home.tsx
│           │   ├── About.tsx
│           │   ├── Portfolio.tsx
│           │   ├── Contact.tsx
│           │   ├── auth/
│           │   │   ├── Login.tsx    # Akses via /flutceadmin
│           │   │   ├── Register.tsx
│           │   │   ├── ForgotPassword.tsx
│           │   │   └── VerifyEmail.tsx
│           │   └── admin/
│           │       ├── Dashboard.tsx
│           │       ├── PortfolioList.tsx
│           │       ├── Content.tsx
│           │       ├── ProfileEditor.tsx
│           │       ├── CvManager.tsx
│           │       └── CvGenerator.tsx
│           ├── components/
│           │   ├── layout/
│           │   │   ├── Navbar.tsx
│           │   │   ├── PublicLayout.tsx
│           │   │   └── AdminLayout.tsx
│           │   └── ui/              # Shadcn/UI components
│           └── lib/
│               └── auth.ts          # JWT token helper
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml            # Kontrak API (sumber kebenaran)
│   ├── api-zod/
│   │   └── src/generated/          # Zod schemas (auto-generated)
│   └── api-client-react/
│       └── src/generated/          # React Query hooks (auto-generated)
├── .env.example                    # Template environment variables
├── .github/workflows/deploy.yml    # CI/CD GitHub Actions ke Vercel
├── ENV_MANAGEMENT.md               # Panduan lengkap manajemen env & secrets
├── GIT_WORKFLOW.md                 # Panduan Git Flow branching
└── pnpm-workspace.yaml             # Konfigurasi monorepo
```

---

## Prasyarat

Pastikan sudah terinstall di laptop/server kamu:

| Tool | Versi Minimum | Cara Install |
|---|---|---|
| **Node.js** | v20 | https://nodejs.org |
| **pnpm** | v9 | `npm install -g pnpm` |
| **Git** | v2 | https://git-scm.com |

MongoDB **tidak wajib** diinstall lokal — app otomatis pakai in-memory MongoDB saat development.

---

## Environment Variables

Semua environment variable yang dibutuhkan:

| Variable | Wajib | Deskripsi | Contoh Nilai |
|---|---|---|---|
| `PORT` | ✅ | Port backend berjalan | `8080` |
| `NODE_ENV` | ✅ | Mode aplikasi | `development` / `production` |
| `MONGODB_URI` | ❌ | URI MongoDB Atlas (kosong = in-memory) | `mongodb+srv://...` |
| `JWT_SECRET` | ✅ | Kunci rahasia untuk token login | String acak 64 karakter |
| `CORS_ORIGIN` | ✅ | Domain frontend yang diizinkan | `https://myportofolio.flutce.app` |
| `SMTP_HOST` | ❌ | Server SMTP untuk kirim email | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | Port SMTP | `587` |
| `SMTP_USER` | ❌ | Email pengirim | `kamu@gmail.com` |
| `SMTP_PASS` | ❌ | App Password Gmail (bukan password biasa) | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | ❌ | Nama & email pengirim | `kamu@gmail.com` |
| `SESSION_SECRET` | ❌ | Secret untuk session (jika dipakai) | String acak 32 karakter |

**Cara generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Cara buat Gmail App Password:**
1. Aktifkan 2FA di akun Google kamu
2. Buka: https://myaccount.google.com/apppasswords
3. Pilih **"Mail"** → **"Other"** → tulis nama bebas → **Generate**
4. Salin 16-digit password yang muncul — itulah `SMTP_PASS`

---

## 1. Development — Lokal di Laptop

Panduan lengkap menjalankan project di laptop/komputer lokal untuk pertama kali.

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/farizjr1/MyPortofolio.git
cd MyPortofolio
```

### Langkah 2 — Install Semua Dependencies

```bash
pnpm install
```

Perintah ini menginstall semua dependencies untuk seluruh workspace (frontend, backend, dan libraries) sekaligus. Butuh waktu 2-5 menit untuk pertama kali.

### Langkah 3 — Buat File Environment Backend

```bash
cp .env.example artifacts/api-server/.env
```

Buka file `artifacts/api-server/.env` dan isi nilai-nilainya:

```env
# ── Server ──────────────────────────────────────────────────────────
PORT=8080
NODE_ENV=development

# ── MongoDB ─────────────────────────────────────────────────────────
# Biarkan kosong untuk pakai in-memory MongoDB (data hilang saat restart)
# Isi dengan URI Atlas agar data tersimpan permanen
MONGODB_URI=

# ── JWT ─────────────────────────────────────────────────────────────
# Generate dengan: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=isi-dengan-string-acak-64-karakter

# ── CORS ────────────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173

# ── Email (opsional, untuk fitur verifikasi email) ───────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email-kamu@gmail.com
SMTP_PASS=app-password-16-digit
EMAIL_FROM=email-kamu@gmail.com
```

### Langkah 4 — Buat File Environment Frontend

Buat file `artifacts/myportofolio/.env.local`:

```bash
echo "VITE_API_URL=http://localhost:8080/api
PORT=5173
BASE_PATH=/" > artifacts/myportofolio/.env.local
```

### Langkah 5 — Jalankan Backend (Terminal 1)

Buka terminal pertama, jalankan:

```bash
pnpm --filter @workspace/api-server run dev
```

Tunggu sampai muncul pesan:
```
INFO: Server listening — port: 8080
INFO: MongoDB connected
INFO: Profile template seeded
INFO: Portfolio template seeded
```

Jika `MONGODB_URI` kosong, akan muncul juga:
```
WARN: MONGODB_URI not set — starting in-memory MongoDB for development
```
Ini **normal** — app tetap berjalan dengan database sementara di memori.

### Langkah 6 — Jalankan Frontend (Terminal 2)

Buka terminal **kedua** (jangan tutup terminal pertama), jalankan:

```bash
pnpm --filter @workspace/myportofolio run dev
```

Tunggu sampai muncul:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Langkah 7 — Buka di Browser

- **Site publik:** http://localhost:5173
- **Login admin:** http://localhost:5173/flutceadmin
- **API health check:** http://localhost:8080/api/healthz

### Langkah 8 — Buat Akun Admin Pertama

1. Buka http://localhost:5173/register
2. Daftar dengan email dan password
3. Jika SMTP belum dikonfigurasi, akun langsung aktif tanpa verifikasi email
4. Login via http://localhost:5173/flutceadmin
5. Kamu akan otomatis diarahkan ke `/admin` dashboard

> **Catatan:** User pertama yang register perlu di-upgrade menjadi admin lewat database. Jalankan perintah ini di terminal baru setelah server berjalan:
> ```bash
> # Ganti EMAIL dengan email yang kamu daftar
> curl -X POST http://localhost:8080/api/auth/login \
>   -H "Content-Type: application/json" \
>   -d '{"email":"EMAIL","password":"PASSWORD"}'
> ```
> Simpan token JWT-nya, lalu hubungi endpoint admin untuk upgrade role (atau edit langsung di MongoDB jika pakai Atlas).

### Perintah Berguna Lainnya

```bash
# Typecheck seluruh project
pnpm run typecheck

# Regenerate kode dari OpenAPI spec (jalankan jika openapi.yaml diubah)
pnpm --filter @workspace/api-spec run codegen

# Build frontend untuk production
pnpm --filter @workspace/myportofolio run build

# Build backend untuk production
pnpm --filter @workspace/api-server run build
```

---

## 2. Testing — di Replit

Panduan menggunakan Replit sebagai environment testing sebelum deploy ke production.

### Langkah 1 — Buka Project di Replit

Project sudah terhubung ke Replit. Buka Replit workspace kamu melalui link yang sudah ada.

### Langkah 2 — Set Secrets di Replit

Klik **ikon gembok (Secrets)** di sidebar kiri Replit, lalu tambahkan secrets berikut satu per satu:

| Secret Key | Nilai |
|---|---|
| `JWT_SECRET` | Generate dengan `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `SESSION_SECRET` | Generate dengan perintah yang sama |
| `MONGODB_URI` | *(Opsional)* URI MongoDB Atlas — kosongkan untuk pakai in-memory |
| `CORS_ORIGIN` | URL preview Replit kamu (misal: `https://xxx.replit.app`) |
| `SMTP_USER` | Email Gmail kamu |
| `SMTP_PASS` | App Password Gmail 16-digit |
| `EMAIL_FROM` | Email Gmail kamu |

> **Tips:** Untuk mendapat URL Replit kamu, lihat di preview pane — formatnya `https://xxx.replit.dev` atau `https://xxx.replit.app`.

### Langkah 3 — Pastikan Workflows Berjalan

Di Replit, ada 2 workflow yang harus berjalan (bisa dilihat di tab "Workflows" atau console):

**Workflow 1 — API Server:**
```
Command: pnpm --filter @workspace/api-server run dev
```

**Workflow 2 — Frontend:**
```
Command: pnpm --filter @workspace/myportofolio run dev
```

Jika salah satu berstatus **Failed** atau **Stopped**, klik tombol ▶ (Run/Restart) di sebelah workflow tersebut.

### Langkah 4 — Verifikasi API Berjalan

Buka tab baru di Replit, klik **Shell**, jalankan:

```bash
curl http://localhost:80/api/healthz
```

Hasilnya harus:
```json
{"status":"ok","timestamp":"..."}
```

### Langkah 5 — Buka Preview

Klik tombol **Open in new tab** di bagian preview pane Replit untuk membuka site di browser terpisah.

- **Site publik:** `https://[nama-replit].replit.dev/`
- **Login admin:** `https://[nama-replit].replit.dev/flutceadmin`

### Langkah 6 — Test Fitur Utama

Checklist testing sebelum deploy ke production:

- [ ] Halaman Home menampilkan nama dan profil
- [ ] Halaman About menampilkan pengalaman dan pendidikan
- [ ] Halaman Portfolio menampilkan daftar proyek
- [ ] Halaman Contact menampilkan form dan info kontak
- [ ] Login via `/flutceadmin` berhasil masuk ke dashboard
- [ ] Admin dapat tambah/edit/hapus proyek di Portfolio Manager
- [ ] Admin dapat edit profil di Profile Editor
- [ ] CV Generator dapat menghasilkan PDF yang bisa didownload
- [ ] URL `/login` menampilkan halaman 404 (bukan halaman login)
- [ ] Navbar tidak menampilkan tombol Login

### Langkah 7 — Cek Log jika Ada Error

Di Replit Shell:
```bash
# Lihat log API server
cat /tmp/logs/artifactsapi-server_API_Server_*.log | tail -50

# Lihat log frontend
cat /tmp/logs/artifactsmyportofolio_web_*.log | tail -20
```

---

## 3. Production — Deploy ke Server

Pilih salah satu dari dua opsi deployment production berikut.

---

### Opsi A: Deploy via Replit (Paling Mudah)

Ini adalah cara tercepat — semua sudah dikonfigurasi di Replit.

#### Langkah 1 — Pastikan Semua Secrets Sudah Diset

Buka **Secrets** di Replit, pastikan semua variable berikut sudah ada dan nilainya benar untuk production:

| Secret | Nilai Production |
|---|---|
| `JWT_SECRET` | String acak 64 karakter (berbeda dari development) |
| `SESSION_SECRET` | String acak 32 karakter (berbeda dari development) |
| `MONGODB_URI` | URI MongoDB Atlas (wajib untuk data permanen) |
| `CORS_ORIGIN` | URL domain production kamu (misal: `https://myportofolio.flutce.app`) |
| `SMTP_USER` | Email Gmail |
| `SMTP_PASS` | App Password Gmail |
| `EMAIL_FROM` | Email Gmail |

#### Langkah 2 — Dapatkan MONGODB_URI dari Atlas

Jika belum punya, buat database MongoDB Atlas gratis:

1. Buka https://cloud.mongodb.com dan buat akun gratis
2. Klik **"Build a Database"** → pilih **M0 Free**
3. Pilih region terdekat (misal: Singapore)
4. Klik **"Create"**
5. Buat username dan password database (ingat passwordnya!)
6. Di bagian **"Connect from Anywhere"**, klik **"Add My Current IP Address"** lalu tambahkan juga `0.0.0.0/0` agar Replit bisa terhubung
7. Klik **"Finish and Close"**
8. Klik **"Connect"** → **"Connect your application"**
9. Salin URI yang muncul, ganti `<password>` dengan password yang kamu buat
10. Paste URI tersebut sebagai nilai `MONGODB_URI` di Replit Secrets

#### Langkah 3 — Publish di Replit

1. Klik tombol **"Publish"** (atau "Deploy") di pojok kanan atas Replit
2. Pilih **"Reserved VM"** atau **"Autoscale"** sesuai kebutuhan
3. Klik **"Deploy"**
4. Tunggu proses build selesai (biasanya 2-5 menit)
5. Replit akan memberikan URL production: `https://[nama].replit.app`

#### Langkah 4 — Update CORS_ORIGIN

Setelah dapat URL production:
1. Buka Replit Secrets
2. Update `CORS_ORIGIN` dengan URL production yang baru (misal: `https://myportofolio.replit.app`)
3. Restart deployment

#### Langkah 5 — Verifikasi Production

```bash
# Test API production
curl https://[nama].replit.app/api/healthz

# Test halaman publik
curl -I https://[nama].replit.app/
```

---

### Opsi B: Deploy Manual ke Vercel (Frontend) + Railway (Backend)

Cara ini memisahkan frontend dan backend ke platform yang berbeda — lebih fleksibel untuk skala besar.

---

#### BAGIAN 1 — Setup MongoDB Atlas (Database)

Lakukan ini **sebelum** deploy backend maupun frontend.

1. Buka https://cloud.mongodb.com → buat akun
2. Klik **"Build a Database"** → pilih **M0 Free**
3. Pilih region **Singapore** (untuk latency rendah dari Indonesia)
4. Buat **Database User**:
   - Username: `fariz-admin` (atau bebas)
   - Password: generate password kuat, **simpan di tempat aman**
5. Di **Network Access** → **Add IP Address** → ketik `0.0.0.0/0` → Confirm
6. Klik **Connect** → **Connect your application** → salin URI
7. URI formatnya: `mongodb+srv://fariz-admin:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
8. **Simpan URI ini** — akan dipakai di langkah berikutnya

---

#### BAGIAN 2 — Deploy Backend ke Railway

1. Buka https://railway.app → **Sign up with GitHub**
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository **farizjr1/MyPortofolio**
4. Railway akan otomatis mendeteksi project. Jika diminta, set:
   - **Root Directory:** `artifacts/api-server`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm run start`
5. Klik tab **"Variables"** → tambahkan semua environment variables:

   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | URI Atlas dari Bagian 1 |
   | `JWT_SECRET` | String acak 64 karakter |
   | `CORS_ORIGIN` | *(isi setelah deploy frontend — update nanti)* |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | email Gmail kamu |
   | `SMTP_PASS` | App Password Gmail 16-digit |
   | `EMAIL_FROM` | email Gmail kamu |

6. Klik **"Deploy"** — tunggu hingga status **"Success"**
7. Di tab **"Settings"** → **"Networking"** → klik **"Generate Domain"**
8. **Catat URL Railway** — formatnya: `https://myportofolio-api.railway.app`
9. Verifikasi backend berjalan:
   ```bash
   curl https://myportofolio-api.railway.app/api/healthz
   ```
   Harus mengembalikan: `{"status":"ok",...}`

---

#### BAGIAN 3 — Deploy Frontend ke Vercel

1. Buka https://vercel.com → **Sign up with GitHub**
2. Klik **"Add New..."** → **"Project"**
3. Klik **"Import"** di sebelah repository **farizjr1/MyPortofolio**
4. Di halaman konfigurasi, set:
   - **Framework Preset:** `Vite`
   - **Root Directory:** klik **Edit** → ketik `artifacts/myportofolio`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist/public`
   - **Install Command:** `pnpm install`
5. Di bagian **"Environment Variables"**, tambahkan:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | URL Railway dari Bagian 2, misal: `https://myportofolio-api.railway.app/api` |
   | `PORT` | `3000` |
   | `BASE_PATH` | `/` |
   | `NODE_ENV` | `production` |

6. Klik **"Deploy"** — tunggu hingga selesai (2-5 menit)
7. Vercel akan memberikan URL: `https://myportofolio.vercel.app` (atau custom domain)
8. Salin URL ini

---

#### BAGIAN 4 — Update CORS di Backend

Setelah frontend deploy dan dapat URL Vercel:

1. Buka Railway dashboard → project kamu → tab **Variables**
2. Update nilai `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://myportofolio.vercel.app
   ```
   Atau jika pakai custom domain:
   ```
   CORS_ORIGIN=https://myportofolio.flutce.app
   ```
3. Railway otomatis restart backend setelah variable diupdate
4. Tunggu 1-2 menit

---

#### BAGIAN 5 — Setup Custom Domain (Opsional)

Jika kamu punya domain `myportofolio.flutce.app`:

**Di Vercel:**
1. Buka dashboard Vercel → project → tab **"Domains"**
2. Ketik `myportofolio.flutce.app` → klik **"Add"**
3. Vercel akan tampilkan DNS record yang perlu ditambahkan

**Di DNS provider domain kamu:**
1. Buka panel DNS (Cloudflare, Niagahoster, dll)
2. Tambahkan record sesuai instruksi Vercel:
   - Tipe: `CNAME`
   - Name: `myportofolio`
   - Value: `cname.vercel-dns.com`
3. Tunggu propagasi DNS (5 menit - 48 jam)

**Update CORS setelah custom domain aktif:**
- Di Railway, ubah `CORS_ORIGIN` menjadi `https://myportofolio.flutce.app`

---

#### BAGIAN 6 — Setup CI/CD Otomatis via GitHub Actions

Agar setiap push ke `main` otomatis deploy ke Vercel:

1. Buka Vercel dashboard → **Settings** → **Tokens** → **"Create"**
   - Name: `GitHub Actions`
   - Scope: `Full Account`
   - Salin token yang muncul

2. Buka Vercel dashboard → project → **Settings** → **General**
   - Catat **Project ID** dan **Team ID (Org ID)**

3. Buka GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   Tambahkan 3 secrets:

   | Secret Name | Nilai |
   |---|---|
   | `VERCEL_TOKEN` | Token dari langkah 1 |
   | `VERCEL_ORG_ID` | Team ID / Org ID dari Vercel |
   | `VERCEL_PROJECT_ID` | Project ID dari Vercel |
   | `VITE_API_URL` | URL Railway API: `https://myportofolio-api.railway.app/api` |

4. Sekarang setiap kamu push ke branch `main`, GitHub Actions otomatis build dan deploy frontend ke Vercel. Cek status di tab **"Actions"** di GitHub repository.

---

#### BAGIAN 7 — Verifikasi Production Lengkap

Setelah semua deploy, test checklist berikut:

```bash
# 1. API backend merespons
curl https://myportofolio-api.railway.app/api/healthz

# 2. Data profil bisa diambil (harus muncul nama Fariz)
curl https://myportofolio-api.railway.app/api/profile

# 3. Daftar portfolio
curl https://myportofolio-api.railway.app/api/portfolio
```

Di browser:
- [ ] `https://myportofolio.flutce.app` — tampil halaman Home
- [ ] `https://myportofolio.flutce.app/about` — tampil pengalaman & pendidikan
- [ ] `https://myportofolio.flutce.app/portfolio` — tampil daftar proyek
- [ ] `https://myportofolio.flutce.app/flutceadmin` — tampil form login
- [ ] `https://myportofolio.flutce.app/login` — tampil halaman 404
- [ ] Navbar tidak ada tombol Login

---

## Panduan Penggunaan Aplikasi

### Akses Admin Dashboard

1. Buka `/flutceadmin` di browser — URL ini **tidak tampil di navbar maupun footer**, hanya kamu yang tahu
2. Masukkan email dan password admin
3. Setelah login berhasil, kamu otomatis diarahkan ke `/admin` (dashboard utama)
4. Sesi login berlaku selama **7 hari** — kamu tidak perlu login ulang kecuali logout manual

---

### Fitur Admin Dashboard — Rincian Lengkap

Dashboard admin terdiri dari **5 menu utama** yang dapat diakses melalui sidebar kiri:

---

#### 1. Dashboard (`/admin`)

Halaman ringkasan statistik seluruh konten website. Tidak ada yang bisa diedit di sini — hanya tampilan data.

| Kartu Statistik | Informasi yang Ditampilkan |
|---|---|
| **Total Projects** | Jumlah total proyek portfolio yang tersimpan |
| **Featured Projects** | Jumlah proyek yang ditandai sebagai unggulan (featured) |
| **Content Items** | Jumlah total blok konten + berapa yang sudah published |
| **Categories** | Jumlah kategori unik dari semua proyek portfolio |

Selain kartu statistik, juga tersedia:
- **Recent Projects** — daftar 5 proyek portfolio terbaru
- **Projects by Category** — breakdown jumlah proyek per kategori

---

#### 2. Portfolio Manager (`/admin/portfolio`)

Kelola semua proyek yang tampil di halaman **Portfolio** publik (`/portfolio`).

**Yang bisa dilakukan:**
- ➕ **Tambah proyek baru** — klik tombol "Add Project"
- ✏️ **Edit proyek** — klik tombol "Edit" di kartu proyek
- 🗑️ **Hapus proyek** — klik tombol "Delete" (muncul konfirmasi sebelum dihapus)

**Field yang bisa diisi/diedit per proyek:**

| Field | Keterangan | Wajib |
|---|---|---|
| **Title** | Nama/judul proyek | ✅ |
| **Description** | Deskripsi singkat proyek | ✅ |
| **Category** | Kategori proyek (misal: `Accounting`, `Web App`, `Finance`) | ✅ |
| **Technologies** | Daftar teknologi yang dipakai, pisahkan dengan koma (misal: `React, Node.js, MongoDB`) | ✅ |
| **Image URL** | URL gambar thumbnail proyek — tampil sebagai cover card | ❌ |
| **Demo URL** | Link demo/live project | ❌ |
| **GitHub URL** | Link repository GitHub proyek | ❌ |
| **Featured** | Toggle — jika aktif, proyek ditandai bintang ⭐ dan diprioritaskan tampil | ❌ |

> **Tips:** Jika tidak ada Image URL, card akan tampil dengan placeholder gradien otomatis berdasarkan kategori.

---

#### 3. Content CMS (`/admin/content`)

Kelola **blok teks konten** untuk halaman-halaman publik website. Berguna untuk menambahkan teks deskriptif, pengumuman, atau konten tambahan pada halaman tertentu.

**Yang bisa dilakukan:**
- ➕ **Tambah blok konten baru** — klik tombol "Add Content"
- ✏️ **Edit konten** — klik tombol "Edit" di kartu konten
- 🗑️ **Hapus konten** — klik tombol "Delete"
- 👁️ **Publish/Draft toggle** — konten berstatus Draft tidak ditampilkan ke publik

**Field yang bisa diisi/diedit per blok konten:**

| Field | Keterangan | Wajib |
|---|---|---|
| **Title** | Judul blok konten (hanya terlihat di dashboard) | ✅ |
| **Section** | Halaman tujuan konten ini | ✅ |
| **Body** | Isi teks konten (mendukung baris baru/newline) | ✅ |
| **Published** | Toggle — jika aktif, konten tampil ke publik; jika mati, berstatus Draft | ❌ |

**Pilihan Section yang tersedia:**

| Nilai | Halaman Tujuan |
|---|---|
| `home` | Halaman Home (`/`) |
| `about` | Halaman About (`/about`) |
| `contact` | Halaman Contact (`/contact`) |
| `services` | Halaman Services (jika ada) |
| `testimonials` | Halaman Testimonials (jika ada) |
| `custom` | Section bebas/kustom |

> **Catatan:** Kartu yang berstatus Draft ditampilkan dengan efek grayscale + transparan di dashboard — mudah dibedakan dari yang sudah Published.

---

#### 4. Profile Editor (`/admin/profile`)

Kelola **semua informasi profil pribadimu** yang muncul di halaman Home, About, dan CV. Ini adalah halaman paling penting — perubahan di sini langsung memperbarui CV secara otomatis.

Halaman ini dibagi menjadi **4 tab**:

---

**Tab 1: General Info**

| Field | Tampil Di | Keterangan |
|---|---|---|
| **Name** | Home, About, CV, Navbar | Nama lengkap |
| **Title / Headline** | Home, About, CV | Jabatan/profesi singkat (misal: `Junior Accountant & System Analyst`) |
| **Bio** | About, CV (Profil Singkat) | Deskripsi diri — paragraf pertama dipakai di CV |
| **Avatar URL** | Home (foto lingkaran) | URL foto profil. Kosong = tampil ikon SVG placeholder |
| **Typewriter Titles** | Home (teks berputar) | Teks yang berputar di bawah nama di halaman Home. Pisahkan dengan koma. Contoh: `Accountant, Tech Enthusiast, Finance Enthusiast` |

**Tab 2: Contact & Social Links** (masih di dalam tab General Info)

| Field | Tampil Di | Keterangan |
|---|---|---|
| **Email** | About, CV, Footer | Alamat email kontak |
| **Phone** | About, CV | Nomor telepon |
| **Location** | About, CV, Footer | Kota/lokasi (misal: `Jakarta, Indonesia`) |
| **Website URL** | About, CV | URL website personal |
| **GitHub URL** | Home (ikon), About, CV, Footer | Link GitHub |
| **LinkedIn URL** | Home (ikon), About, CV, Footer | Link LinkedIn |

---

**Tab 2: Experience (Pengalaman Kerja)**

Tambah, edit, atau hapus riwayat pekerjaan. Tampil di halaman **About** dan **CV**.

| Field | Keterangan | Wajib |
|---|---|---|
| **Company** | Nama perusahaan/organisasi | ✅ |
| **Position** | Jabatan/posisi | ✅ |
| **Start Date** | Tanggal mulai (format bebas, misal: `Jan 2020` atau `2020-01`) | ✅ |
| **End Date** | Tanggal selesai — dinonaktifkan jika "I currently work here" dicentang | ❌ |
| **I currently work here** | Checkbox — jika dicentang, End Date otomatis tampil sebagai "Sekarang" | ❌ |
| **Description** | Deskripsi pekerjaan / tanggung jawab | ❌ |

Tombol **+ Add Experience** untuk menambah entri baru. Tombol 🗑️ untuk menghapus.

---

**Tab 3: Education (Pendidikan)**

Tambah, edit, atau hapus riwayat pendidikan. Tampil di halaman **About** dan **CV**.

| Field | Keterangan | Wajib |
|---|---|---|
| **Institution** | Nama sekolah/universitas | ✅ |
| **Degree** | Jenjang pendidikan (misal: `Sarjana`, `SMA`, `Diploma`) | ✅ |
| **Field of Study** | Jurusan/program studi (misal: `Akuntansi`, `IPA`) | ✅ |
| **Start Year** | Tahun mulai (misal: `2019`) | ✅ |
| **End Year** | Tahun lulus (misal: `2023`) | ✅ |
| **Description** | Keterangan tambahan (misal: IPK, prestasi, kegiatan) | ❌ |

---

**Tab 4: Skills & Tools**

Kelola keahlian dan teknologi yang dikuasai. Tampil di halaman **About** dan **CV**.

**Bagian Skills (dengan level proficiency):**

| Field | Keterangan |
|---|---|
| **Skill Name** | Nama keahlian (misal: `Microsoft Excel`, `SAP`, `React`) |
| **Category** | Kategori keahlian (misal: `Accounting`, `Technology`, `Soft Skills`) |
| **Level (1–100)** | Tingkat penguasaan dalam angka — ditampilkan sebagai progress bar di halaman About |

**Bagian Tools & Expertise:**

| Field | Keterangan |
|---|---|
| **Tools** | Daftar tools/software yang dikuasai, pisahkan dengan koma. Misal: `SAP, MYOB, Accurate Online, Microsoft Office, Figma, VS Code` |
| **Expertise Areas** | Area keahlian utama, pisahkan dengan koma. Misal: `Akuntansi Keuangan, Perpajakan, Audit, Web Development` |

> ⚠️ **Penting:** Setelah mengisi/mengubah apapun di Profile Editor, selalu klik tombol **"Save All Changes"** di pojok kanan atas untuk menyimpan perubahan.

---

#### 5. CV Manager (`/admin/cv`)

Kelola **riwayat versi CV** yang pernah dibuat dan disimpan melalui CV Generator.

**Yang bisa dilakukan:**
- 📄 **Lihat/buka CV tersimpan** — klik "View / PDF" untuk membuka kembali di CV Generator
- ➕ **Buat CV baru** — klik "Create New CV" untuk membuat versi CV baru dari awal
- 🗑️ **Hapus CV** — klik "Delete" untuk menghapus versi CV yang tidak diperlukan

Setiap kartu CV menampilkan:
- Label/nama versi CV
- Tanggal dibuat
- Nama lengkap di CV tersebut

> **Hubungan dengan halaman `/cv` publik:** Halaman CV publik (`/cv`) mengambil data langsung dari **Profile Editor**, bukan dari CV Manager. CV Manager digunakan untuk menyimpan versi-versi CV yang sudah dikustomisasi secara manual via CV Generator.

---

#### CV Generator (`/admin/cv/new`)

Buat CV baru dengan data yang bisa dikustomisasi manual, berbeda dari data profil. Data awal otomatis diisi dari profil.

**Tab yang tersedia:**

| Tab | Isi yang Bisa Diedit |
|---|---|
| **Personal** | Nama lengkap, email, telepon, lokasi, LinkedIn, GitHub, ringkasan profesional |
| **Experience** | Perusahaan, posisi, tanggal mulai/selesai, deskripsi pekerjaan per poin |
| **Education** | Institusi, gelar, bidang studi, tanggal |
| **Skills** | Kategori skill + daftar skill per kategori |

Tombol di bagian atas:
- **Save Data** — simpan data CV ke database (muncul di CV Manager)
- **Download PDF** — generate & download CV sebagai file PDF

Preview CV ditampilkan secara langsung di panel kanan (desktop) dan terupdate otomatis saat kamu mengetik.

---

### Alur Update CV Publik

Untuk memperbarui CV yang tampil di halaman `/cv`:

```
Profile Editor (dashboard) → Save All Changes → Buka /cv → Download PDF
```

Tidak perlu input manual — semua data diambil otomatis dari profil.

---

### URL Penting

| URL | Fungsi | Akses |
|---|---|---|
| `/` | Halaman Home | Publik |
| `/about` | Halaman About | Publik |
| `/portfolio` | Halaman Portfolio | Publik |
| `/cv` | Lihat & Download CV ATS | Publik |
| `/contact` | Halaman Contact | Publik |
| `/flutceadmin` | Halaman Login | **Rahasia — tidak di navbar** |
| `/admin` | Dashboard — Statistik overview | Setelah login |
| `/admin/portfolio` | Portfolio Manager | Setelah login |
| `/admin/content` | Content CMS | Setelah login |
| `/admin/profile` | Profile Editor | Setelah login |
| `/admin/cv` | CV Manager | Setelah login |
| `/admin/cv/new` | CV Generator | Setelah login |
| `/register` | Daftar akun baru | Tersembunyi |

---

## API Reference

Base URL:
- Development: `http://localhost:8080/api`
- Production: `https://myportofolio-api.railway.app/api`

### Auth
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Daftar akun baru | — |
| `POST` | `/auth/login` | Login, dapat JWT token | — |
| `GET` | `/auth/me` | Info user yang sedang login | ✅ JWT |
| `POST` | `/auth/logout` | Logout | ✅ JWT |
| `POST` | `/auth/forgot-password` | Kirim email reset password | — |
| `POST` | `/auth/reset-password` | Reset password dengan token | — |
| `GET` | `/auth/verify-email` | Verifikasi email | — |

### Profile
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/profile` | Data profil publik | — |
| `PUT` | `/profile` | Update profil | ✅ Admin |

### Portfolio
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/portfolio` | Daftar semua proyek | — |
| `POST` | `/portfolio` | Tambah proyek baru | ✅ Admin |
| `GET` | `/portfolio/:id` | Detail satu proyek | — |
| `PUT` | `/portfolio/:id` | Update proyek | ✅ Admin |
| `DELETE` | `/portfolio/:id` | Hapus proyek | ✅ Admin |

### Content CMS
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/content` | Semua konten halaman | — |
| `GET` | `/content/:section` | Konten per section | — |
| `PUT` | `/content/:section` | Update konten | ✅ Admin |

### CV Data
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/cv` | Data CV tersimpan | ✅ JWT |
| `PUT` | `/cv` | Simpan/update data CV | ✅ JWT |

### Health Check
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/healthz` | Status server |

---

## Arsitektur & Alur Data

```
Browser (React + Vite)
    │
    ├── Static files (HTML/CSS/JS)
    │       └── Vercel CDN / Replit
    │
    └── API Calls (/api/...)
            │
            ▼
    Express Backend (Node.js)
            │
            ├── JWT Middleware (verifikasi token)
            ├── Route Handlers
            └── MongoDB (Atlas / In-memory)
```

**Alur Login:**
```
1. User buka /flutceadmin
2. Isi email + password → POST /api/auth/login
3. Backend verifikasi → generate JWT token (7 hari)
4. Token disimpan di localStorage browser
5. Setiap request API berikutnya kirim token di header:
   Authorization: Bearer <token>
6. Backend verifikasi token → izinkan atau tolak
```

---

## Troubleshooting

### Backend gagal start — port sudah dipakai
```
Error: listen EADDRINUSE: address already in use :::8080
```
**Solusi:**
```bash
# Temukan dan matikan proses yang menggunakan port 8080
kill $(lsof -ti:8080) 2>/dev/null
# Lalu start ulang backend
```

### Koneksi MongoDB gagal
```
Error: MongoServerSelectionError: connection timed out
```
**Solusi:**
1. Pastikan IP kamu sudah di-whitelist di MongoDB Atlas → **Network Access** → **Add IP Address** → `0.0.0.0/0`
2. Pastikan username dan password di URI benar (perhatikan karakter khusus — gunakan URL encode)
3. Coba biarkan `MONGODB_URI` kosong untuk pakai in-memory saat development

### Push ke GitHub gagal — 403
**Penyebab:** Personal Access Token tidak punya scope yang cukup.
**Solusi:**
1. Buka https://github.com/settings/tokens
2. Edit token → centang scope: `repo` ✅ dan `workflow` ✅
3. Salin token baru → update di Replit Secrets

### Email verifikasi tidak terkirim
**Solusi:**
1. Pastikan `SMTP_PASS` adalah **App Password** Google (16 digit), bukan password akun Gmail biasa
2. Pastikan akun Google sudah aktifkan 2FA
3. Buat App Password baru di: https://myaccount.google.com/apppasswords

### CORS error di browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solusi:**
1. Pastikan nilai `CORS_ORIGIN` di backend **sama persis** dengan URL frontend (termasuk `https://` dan tanpa trailing slash)
2. Contoh benar: `CORS_ORIGIN=https://myportofolio.flutce.app`
3. Contoh salah: `CORS_ORIGIN=https://myportofolio.flutce.app/` (ada slash di akhir)

### Data hilang setelah restart
**Penyebab:** Menggunakan in-memory MongoDB (tanpa `MONGODB_URI`).
**Solusi:** Set `MONGODB_URI` dengan URI dari MongoDB Atlas. Data template akan diisi otomatis pertama kali.

### PDF CV tidak bisa didownload
**Solusi:**
1. Pastikan browser tidak memblokir popup atau download
2. Coba di Chrome versi terbaru
3. Pastikan semua field wajib di form CV sudah terisi (nama, email, minimal 1 pengalaman)

### Halaman `/flutceadmin` tidak bisa diakses setelah deploy
**Solusi:** Pastikan konfigurasi SPA rewrite sudah aktif di Vercel. Cek file `vercel.json` atau pastikan konfigurasi rewrite di deployment sudah mengarahkan semua request ke `index.html`.

---

## Git Workflow

Panduan lengkap ada di [GIT_WORKFLOW.md](./GIT_WORKFLOW.md). Ringkasan:

```bash
# Fitur baru
git checkout -b feature/nama-fitur
# ... kerjakan fitur ...
git add .
git commit -m "feat: deskripsi fitur"
git push origin feature/nama-fitur
# Buat Pull Request ke main di GitHub

# Hotfix production
git checkout -b hotfix/nama-bug
# ... fix bug ...
git commit -m "fix: deskripsi bug"
git push origin hotfix/nama-bug
```

---

## Lisensi

MIT License — bebas digunakan dan dimodifikasi untuk keperluan pribadi maupun komersial.

---

<div align="center">
  Dibuat oleh <strong>Fariz Jelang Ramadhan</strong>
</div>
