# Panduan Manajemen Environment Variables & Secrets

Dokumen ini menjelaskan secara menyeluruh cara mengelola environment variables dan secrets di semua environment: development (lokal), testing (Replit), dan production (server).

---

## Daftar Isi

- [Apa Itu Environment Variable?](#apa-itu-environment-variable)
- [Daftar Lengkap Semua Variables](#daftar-lengkap-semua-variables)
- [1. Development — File .env Lokal](#1-development--file-env-lokal)
- [2. Testing — Replit Secrets](#2-testing--replit-secrets)
- [3. Production — Platform Deployment](#3-production--platform-deployment)
- [4. CI/CD — GitHub Actions Secrets](#4-cicd--github-actions-secrets)
- [Cara Mendapatkan Setiap Variable](#cara-mendapatkan-setiap-variable)
- [Praktik Keamanan Terbaik](#praktik-keamanan-terbaik)
- [Perbedaan Nilai per Environment](#perbedaan-nilai-per-environment)
- [Troubleshooting](#troubleshooting)

---

## Apa Itu Environment Variable?

Environment variable adalah nilai konfigurasi yang dipisahkan dari kode program. Tujuannya:

- **Keamanan** — API key, password, dan token tidak ikut di-commit ke Git
- **Fleksibilitas** — App berjalan berbeda di development dan production tanpa ubah kode
- **Portabilitas** — Siapapun yang clone repo bisa set nilainya sendiri

**Aturan utama:**
> ❌ **JANGAN PERNAH** tulis nilai secret (API key, password, token) langsung di dalam kode atau commit ke GitHub.
> ✅ Selalu simpan di file `.env` (lokal), Replit Secrets (testing), atau dashboard platform (production).

---

## Daftar Lengkap Semua Variables

### Backend (`artifacts/api-server`)

| Variable | Wajib | Default | Deskripsi |
|---|---|---|---|
| `PORT` | ✅ | `8080` | Port server Express berjalan |
| `NODE_ENV` | ✅ | `development` | Mode app: `development` atau `production` |
| `MONGODB_URI` | ❌ | *(kosong = in-memory)* | URI koneksi MongoDB Atlas |
| `JWT_SECRET` | ✅ | — | Kunci rahasia 64 karakter untuk sign JWT token |
| `CORS_ORIGIN` | ✅ | `*` | Domain frontend yang diizinkan akses API |
| `SMTP_HOST` | ❌ | — | Server SMTP untuk kirim email |
| `SMTP_PORT` | ❌ | `587` | Port SMTP (587 untuk TLS, 465 untuk SSL) |
| `SMTP_USER` | ❌ | — | Username/email akun SMTP |
| `SMTP_PASS` | ❌ | — | App Password SMTP (bukan password login biasa) |
| `EMAIL_FROM` | ❌ | — | Alamat pengirim email |
| `SESSION_SECRET` | ❌ | — | Secret untuk session (jika dipakai) |

### Frontend (`artifacts/myportofolio`)

| Variable | Wajib | Default | Deskripsi |
|---|---|---|---|
| `PORT` | ✅ | `5173` | Port Vite dev server |
| `BASE_PATH` | ✅ | `/` | Base URL path aplikasi |
| `VITE_API_URL` | ❌ | *(relatif)* | URL penuh backend API (hanya untuk production build) |
| `NODE_ENV` | ❌ | `development` | Mode build Vite |

> **Catatan:** Variable dengan prefix `VITE_` di frontend akan di-embed ke dalam bundle JavaScript saat build. **Jangan taruh secret apapun** di variable VITE_ karena akan terlihat publik di browser.

### GitHub Actions (CI/CD)

| Secret | Deskripsi |
|---|---|
| `VERCEL_TOKEN` | Token autentikasi Vercel untuk deploy |
| `VERCEL_ORG_ID` | ID organisasi/team di Vercel |
| `VERCEL_PROJECT_ID` | ID project spesifik di Vercel |
| `VITE_API_URL` | URL backend production untuk dipakai saat build |

---

## 1. Development — File .env Lokal

Untuk development di laptop, environment variables disimpan di file `.env` di dalam folder backend.

### Lokasi File

```
artifacts/api-server/.env        ← file utama (jangan di-commit!)
.env.example                     ← template (aman untuk di-commit)
```

### Langkah-langkah Setup

**Langkah 1 — Salin template:**
```bash
cp .env.example artifacts/api-server/.env
```

**Langkah 2 — Buka file dan isi nilainya:**
```bash
# Edit dengan editor favorit kamu
code artifacts/api-server/.env
# atau
nano artifacts/api-server/.env
```

**Langkah 3 — Isi semua variable:**

```env
# ════════════════════════════════════════════════════
# SERVER
# ════════════════════════════════════════════════════
PORT=8080
NODE_ENV=development

# ════════════════════════════════════════════════════
# DATABASE
# Kosongkan untuk pakai in-memory MongoDB (data hilang saat restart)
# Isi URI Atlas untuk data yang tersimpan permanen
# ════════════════════════════════════════════════════
MONGODB_URI=

# ════════════════════════════════════════════════════
# AUTHENTICATION
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# ════════════════════════════════════════════════════
JWT_SECRET=ganti-dengan-string-acak-64-karakter-hasil-generate

# ════════════════════════════════════════════════════
# CORS — Domain frontend yang boleh akses API
# ════════════════════════════════════════════════════
CORS_ORIGIN=http://localhost:5173

# ════════════════════════════════════════════════════
# EMAIL (opsional untuk development)
# Kosongkan jika tidak butuh fitur verifikasi email
# ════════════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email-kamu@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM=email-kamu@gmail.com
```

**Langkah 4 — Setup .env frontend (opsional untuk development lokal):**

Buat file `artifacts/myportofolio/.env.local`:
```env
PORT=5173
BASE_PATH=/
```
> Saat development lokal, `VITE_API_URL` tidak perlu diset karena frontend menggunakan URL relatif yang otomatis mengarah ke `localhost:8080`.

**Langkah 5 — Verifikasi:**
```bash
# Pastikan file .env ada dan tidak kosong
cat artifacts/api-server/.env

# Pastikan file tidak ter-commit (harusnya ada di .gitignore)
git status | grep .env
# Output: tidak ada — berarti aman
```

### Aturan File .env Lokal

- ✅ File `.env` otomatis diabaikan oleh Git (sudah ada di `.gitignore`)
- ✅ File `.env.example` boleh di-commit (tidak berisi nilai sensitif)
- ❌ Jangan rename `.env` menjadi `.env.production` atau nama lain yang mungkin ter-commit
- ❌ Jangan share file `.env` lewat chat/email — bagikan nilainya secara aman (misal: 1Password, Bitwarden)

---

## 2. Testing — Replit Secrets

Di Replit, environment variables disimpan di **Secrets** — panel khusus yang terenkripsi dan tidak bisa dilihat dari kode yang di-push ke GitHub.

### Cara Akses Secrets di Replit

1. Buka Replit workspace project ini
2. Di sidebar kiri, klik **ikon gembok 🔒** (Secrets)
3. Klik **"+ New Secret"** untuk menambah secret baru
4. Isi **Key** (nama variable) dan **Value** (nilainya)
5. Klik **"Add Secret"**

### Daftar Secrets yang Perlu Diset di Replit

Tambahkan satu per satu:

| Key | Value yang Harus Diisi |
|---|---|
| `JWT_SECRET` | Hasil generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `SESSION_SECRET` | Hasil generate dengan perintah yang sama (nilai berbeda) |
| `CORS_ORIGIN` | URL preview Replit kamu, misal: `https://abc123.replit.dev` |
| `MONGODB_URI` | *(Opsional)* URI MongoDB Atlas — kosongkan untuk in-memory |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Email Gmail kamu |
| `SMTP_PASS` | App Password Gmail 16-digit |
| `EMAIL_FROM` | Email Gmail kamu |

> **Tips menemukan URL Replit kamu:** Buka preview pane → klik "Open in new tab" → salin URL dari address bar browser.

### Setelah Menambah Secrets

Setiap kali menambah atau mengubah secret di Replit, **restart semua workflow** agar perubahan terbaca:

1. Buka tab **"Workflows"** di Replit
2. Klik ▶ Restart di **API Server**
3. Klik ▶ Restart di **MyPortofolio web**
4. Tunggu keduanya berstatus **Running**

### Perbedaan Secrets vs Environment Variables di Replit

| Jenis | Terenkripsi | Tampil di kode | Berlaku di |
|---|---|---|---|
| **Secrets** | ✅ Ya | ❌ Tidak | Development & Production Replit |
| **Env vars biasa** | ❌ Tidak | ✅ Bisa | Sesuai konfigurasi |

---

## 3. Production — Platform Deployment

### Opsi A: Railway (Backend)

**Cara set environment variables di Railway:**

1. Buka https://railway.app → login → buka project kamu
2. Klik service **api-server**
3. Klik tab **"Variables"**
4. Klik **"New Variable"** untuk setiap variable berikut:

```
PORT           = 8080
NODE_ENV       = production
MONGODB_URI    = mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET     = [64-char hex string — BERBEDA dari development]
CORS_ORIGIN    = https://myportofolio.flutce.app
SMTP_HOST      = smtp.gmail.com
SMTP_PORT      = 587
SMTP_USER      = email@gmail.com
SMTP_PASS      = [16-digit App Password]
EMAIL_FROM     = email@gmail.com
```

5. Railway otomatis restart service setelah variable disimpan
6. Tunggu status **"Success"** di deployment log

**Cara update variable yang sudah ada:**
1. Klik nama variable yang ingin diubah
2. Edit nilainya
3. Tekan Enter → Railway otomatis redeploy

### Opsi B: Render (Backend)

**Cara set environment variables di Render:**

1. Buka https://render.com → login → buka service kamu
2. Klik tab **"Environment"**
3. Di bagian **"Environment Variables"**, klik **"Add Environment Variable"**
4. Tambahkan semua variable yang sama seperti Railway di atas
5. Klik **"Save Changes"**
6. Render akan otomatis redeploy service

### Opsi C: Vercel (Frontend)

**Cara set environment variables di Vercel:**

1. Buka https://vercel.com → login → buka project kamu
2. Klik tab **"Settings"** → **"Environment Variables"**
3. Untuk setiap variable, isi:
   - **Name**: nama variable
   - **Value**: nilainya
   - **Environment**: centang **Production**, **Preview**, dan/atau **Development** sesuai kebutuhan
4. Klik **"Save"**

Variable yang perlu diset di Vercel:

```
VITE_API_URL  = https://myportofolio-api.railway.app/api
PORT          = 3000
BASE_PATH     = /
NODE_ENV      = production
```

5. Klik **"Redeploy"** di tab Deployments agar perubahan berlaku

### Opsi D: Replit Deploy (All-in-one)

Jika deploy via Replit Publish, semua Secrets yang sudah diset otomatis tersedia di production. Tidak perlu konfigurasi tambahan — Replit mengelola semuanya.

Pastikan semua Secrets sudah benar (terutama `MONGODB_URI` dan `CORS_ORIGIN` dengan URL production) sebelum klik Publish.

---

## 4. CI/CD — GitHub Actions Secrets

GitHub Actions membutuhkan secrets tersendiri untuk bisa deploy otomatis ke Vercel setiap kali ada push ke branch `main`.

### Cara Menambah GitHub Actions Secrets

1. Buka repository GitHub: https://github.com/farizjr1/MyPortofolio
2. Klik tab **"Settings"**
3. Di sidebar kiri, klik **"Secrets and variables"** → **"Actions"**
4. Klik **"New repository secret"**
5. Isi **Name** dan **Secret**, lalu klik **"Add secret"**

Ulangi untuk setiap secret berikut:

### Secret yang Diperlukan

**1. VERCEL_TOKEN**
- Cara dapat: Buka https://vercel.com → klik avatar → **Settings** → **Tokens** → **Create**
- Name: `GitHub Actions` | Scope: `Full Account` | Expiration: No Expiration
- Salin token yang muncul (hanya tampil sekali!)
- Isi sebagai value secret `VERCEL_TOKEN`

**2. VERCEL_ORG_ID**
- Cara dapat: Buka Vercel → **Settings** → **General** → lihat bagian **"Your ID"**
- Atau jalankan `vercel link` di terminal lokal → lihat `.vercel/project.json` → ambil nilai `orgId`

**3. VERCEL_PROJECT_ID**
- Cara dapat: Buka Vercel → pilih project → **Settings** → **General** → lihat **"Project ID"**
- Atau dari `.vercel/project.json` → ambil nilai `projectId`

**4. VITE_API_URL**
- Value: URL Railway/Render backend kamu + `/api`
- Contoh: `https://myportofolio-api.railway.app/api`

### Verifikasi CI/CD Berjalan

Setelah semua secret ditambahkan:
1. Lakukan push apapun ke branch `main`
2. Buka GitHub → tab **"Actions"**
3. Lihat workflow **"Deploy Frontend"** berjalan
4. Jika hijau ✅ — deploy berhasil
5. Jika merah ❌ — klik untuk lihat log error

---

## Cara Mendapatkan Setiap Variable

### JWT_SECRET dan SESSION_SECRET

Generate string acak yang kuat:

```bash
# Jalankan di terminal (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Atau menggunakan OpenSSL
openssl rand -hex 64
```

Hasilnya seperti:
```
a3f9c2e1b7d4...panjang 128 karakter...
```

> **Aturan penting:**
> - Gunakan nilai **berbeda** untuk setiap environment (dev, testing, production)
> - Minimal 64 karakter
> - Jangan gunakan kata yang mudah ditebak

### MONGODB_URI

1. Buka https://cloud.mongodb.com → buat akun gratis
2. Klik **"Build a Database"** → pilih **M0 Free** → pilih region **Singapore**
3. Buat Database User:
   - Klik **"Database Access"** → **"Add New Database User"**
   - Username: `fariz-admin`
   - Password: klik **"Autogenerate Secure Password"** → **salin passwordnya**
   - Built-in Role: `Atlas admin`
   - Klik **"Add User"**
4. Whitelist IP:
   - Klik **"Network Access"** → **"Add IP Address"**
   - Klik **"Allow Access From Anywhere"** (isi `0.0.0.0/0`)
   - Klik **"Confirm"**
5. Dapatkan URI:
   - Klik **"Database"** → **"Connect"** → **"Drivers"**
   - Pilih Driver: `Node.js` | Version: `5.5 or later`
   - Salin URI yang muncul
   - Ganti `<password>` dengan password dari langkah 3
6. URI final formatnya:
   ```
   mongodb+srv://fariz-admin:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### SMTP_PASS (Gmail App Password)

1. Pastikan akun Google kamu sudah aktifkan **2-Step Verification**:
   - Buka https://myaccount.google.com/security
   - Klik **"2-Step Verification"** → aktifkan
2. Buka https://myaccount.google.com/apppasswords
3. Di dropdown **"Select app"**, pilih **"Mail"**
4. Di dropdown **"Select device"**, pilih **"Other (Custom name)"**
5. Ketik nama bebas, misal: `MyPortofolio Server`
6. Klik **"Generate"**
7. Salin 16-digit password yang muncul (format: `xxxx xxxx xxxx xxxx`)
8. Gunakan sebagai nilai `SMTP_PASS` — hapus spasi jika perlu

> **Penting:** App Password hanya tampil sekali. Simpan di tempat aman sebelum menutup halaman.

### CORS_ORIGIN

Isi dengan URL **lengkap** frontend kamu, tanpa trailing slash:

| Environment | Nilai |
|---|---|
| Development lokal | `http://localhost:5173` |
| Testing di Replit | `https://[nama-repl].replit.dev` |
| Production Vercel | `https://myportofolio.vercel.app` |
| Custom domain | `https://myportofolio.flutce.app` |

---

## Praktik Keamanan Terbaik

### 1. Pisahkan Secret per Environment
Gunakan nilai berbeda untuk JWT_SECRET dan SESSION_SECRET di setiap environment. Jika secret production bocor, secret development tidak ikut terdampak.

### 2. Rotasi Secret Berkala
- Ganti `JWT_SECRET` setiap 6-12 bulan
- Perhatian: mengganti JWT_SECRET akan **invalidasi semua token login aktif** — semua user harus login ulang
- Ganti App Password Gmail jika ada indikasi kebocoran

### 3. Gunakan Password Manager
Simpan semua secret di aplikasi password manager yang terenkripsi:
- [Bitwarden](https://bitwarden.com) — gratis, open source
- [1Password](https://1password.com) — berbayar, fitur lengkap
- Jangan simpan di chat WhatsApp, Google Docs, atau sticky notes

### 4. Batasi Akses MongoDB Atlas
Di production, jangan gunakan `0.0.0.0/0` jika tidak perlu. Whitelist hanya IP server Railway/Render:
1. Buka Railway → project → service → **Settings** → lihat **Static IP** (Railway Pro) atau gunakan `0.0.0.0/0` jika Railway tidak punya static IP

### 5. Monitor Penggunaan Token GitHub
- Audit GitHub Personal Access Tokens secara berkala di: https://github.com/settings/tokens
- Hapus token yang tidak lagi digunakan
- Set expiration date untuk setiap token

### 6. Jangan Log Secret
Pastikan tidak ada `console.log` yang mencetak environment variables di kode production. Pino logger di project ini sudah dikonfigurasi untuk tidak log sensitive data.

---

## Perbedaan Nilai per Environment

| Variable | Development (Lokal) | Testing (Replit) | Production |
|---|---|---|---|
| `PORT` | `8080` | `8080` | `8080` |
| `NODE_ENV` | `development` | `development` | `production` |
| `MONGODB_URI` | *(kosong — in-memory)* | *(kosong atau Atlas)* | Atlas URI wajib |
| `JWT_SECRET` | String acak (bisa pendek) | String acak 64 char | String acak 64 char **berbeda** |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://[repl].replit.dev` | `https://myportofolio.flutce.app` |
| `SMTP_*` | Opsional / kosong | Opsional | Wajib diisi |
| `VITE_API_URL` | Tidak perlu diset | Tidak perlu diset | URL Railway/Render |

---

## Troubleshooting

### Error: `JWT_SECRET is not defined`
**Penyebab:** File `.env` belum dibuat atau tidak terbaca.
**Solusi:**
```bash
# Cek file ada
ls artifacts/api-server/.env

# Cek isinya
cat artifacts/api-server/.env | grep JWT_SECRET
```

### Error: `MongoServerSelectionError`
**Penyebab:** `MONGODB_URI` salah atau IP belum di-whitelist.
**Solusi:**
1. Buka MongoDB Atlas → **Network Access** → pastikan `0.0.0.0/0` ada
2. Cek URI: pastikan password tidak mengandung karakter `@`, `:`, `/` tanpa URL encode
3. Coba kosongkan `MONGODB_URI` untuk pakai in-memory sementara

### Error: CORS blocked di browser
**Penyebab:** `CORS_ORIGIN` tidak cocok dengan URL frontend.
**Solusi:**
```bash
# Cek nilai CORS_ORIGIN di server
echo $CORS_ORIGIN

# Pastikan sama persis dengan URL di browser (termasuk https/http, tanpa trailing slash)
```

### Gmail SMTP gagal kirim email
**Penyebab:** `SMTP_PASS` bukan App Password, atau 2FA belum aktif.
**Solusi:**
1. Pastikan 2FA aktif di akun Google
2. Buka https://myaccount.google.com/apppasswords
3. Generate App Password baru
4. Update `SMTP_PASS` dengan 16-digit baru (tanpa spasi)

### Secret di Replit tidak terbaca
**Penyebab:** Workflow belum di-restart setelah secret ditambahkan.
**Solusi:** Restart semua workflow di Replit (API Server + Frontend).
