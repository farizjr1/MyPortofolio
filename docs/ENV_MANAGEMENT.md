# ENV Management

Panduan lengkap pengelolaan environment variables untuk project Fariz Portfolio CMS.

## Overview

Project menggunakan dua service terpisah dengan env vars masing-masing:

| Service | Platform | Env vars |
|---|---|---|
| `api-server` | Railway | `MONGODB_URI`, `JWT_SECRET`, `SMTP_*`, `CORS_ORIGIN`, `FRONTEND_URL`, `NODE_ENV` |
| `myportofolio` | Vercel | `VITE_API_URL` |

---

## Variabel API Server (Railway)

### Wajib di Production

| Variabel | Keterangan | Contoh |
|---|---|---|
| `MONGODB_URI` | Connection string MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET` | Secret panjang acak untuk signing JWT | `openssl rand -hex 64` |
| `FRONTEND_URL` | URL frontend Vercel | `https://farizjr.vercel.app` |
| `CORS_ORIGIN` | Origin yang diizinkan (harus sama dengan `FRONTEND_URL`) | `https://farizjr.vercel.app` |
| `NODE_ENV` | Mode runtime | `production` |

### Email (Opsional tapi Direkomendasikan)

| Variabel | Keterangan | Contoh |
|---|---|---|
| `SMTP_EMAIL` | Akun Gmail pengirim | `admin@gmail.com` |
| `SMTP_APP_PASSWORD` | App Password Gmail (bukan password biasa) | `abcd efgh ijkl mnop` |

> **Catatan Gmail App Password:** Buat di [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Aktifkan 2FA terlebih dahulu.
>
> Email dikirim **from**: `Flutce <admin@flutce.app>`, **to**: `farizjrpend@gmail.com`.

### Variabel yang Di-set Otomatis oleh Railway

| Variabel | Nilai | Keterangan |
|---|---|---|
| `PORT` | (random) | Railway assign otomatis — **jangan di-set manual** |

### Perilaku Default (Development / Tanpa Env)

| Kondisi | Perilaku |
|---|---|
| `MONGODB_URI` tidak di-set | **mongodb-memory-server** — data hilang saat restart |
| `JWT_SECRET` tidak di-set | Random ephemeral — semua sesi logout saat restart |
| `SMTP_*` tidak di-set | Email tidak terkirim — error di-log tapi tidak crash |
| `CORS_ORIGIN` tidak di-set | Semua origin diizinkan (`*`) |

---

## Variabel Frontend (Vercel)

| Variabel | Required | Keterangan |
|---|---|---|
| `VITE_API_URL` | **Wajib di production** | URL Railway API server. Contoh: `https://fariz-portfolio-production.up.railway.app` |

> **Catatan Vite:** Hanya variabel `VITE_*` yang tersedia di browser. Variabel lain tidak terekspos ke client.

> **Tanpa `VITE_API_URL`:** API calls gagal — frontend tidak bisa menampilkan konten.

---

## Setup di Replit (Development)

Semua secret dikelola via **Replit Secrets** (bukan file `.env`):

1. Buka tab **Secrets** di sidebar Replit
2. Tambahkan key-value sesuai tabel API Server di atas
3. Secret otomatis tersedia sebagai `process.env.NAMA_VAR`

**Tidak perlu** `VITE_API_URL` di Replit — dev server Vite menggunakan proxy Replit yang sudah terkonfigurasi.

---

## Setup di Railway (Production API)

1. Railway dashboard → Project → Service → tab **Variables**
2. Klik **+ New Variable** untuk setiap variabel
3. Klik **Deploy** setelah semua variable di-set

Lihat [DeployToRailway.md](./DeployToRailway.md) untuk panduan lengkap.

---

## Setup di Vercel (Production Frontend)

1. Vercel dashboard → Project `farizjr` → **Settings** → **Environment Variables**
2. Tambahkan `VITE_API_URL` dengan URL Railway API
3. Set Environment: **Production** (dan optionally **Preview**)
4. Klik **Save**, lalu **Redeploy** project

Lihat [DeployToVercel.md](./DeployToVercel.md) untuk panduan lengkap.

---

## Generate JWT Secret

```bash
# Linux/Mac
openssl rand -hex 64

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Alur Koneksi Frontend → Backend

```
Browser
  │
  │  https://farizjr.vercel.app
  ↓
Vercel (Frontend)
  │
  │  VITE_API_URL = https://fariz-portfolio-production.up.railway.app
  │  (baked into bundle saat build time)
  ↓
Railway (API Server)
  │
  │  MONGODB_URI = mongodb+srv://...
  ↓
MongoDB Atlas
```

---

## Checklist Sebelum Go Live

- [ ] `MONGODB_URI` di Railway → connect ke MongoDB Atlas production cluster
- [ ] `JWT_SECRET` di Railway → string acak 64 karakter
- [ ] `FRONTEND_URL` dan `CORS_ORIGIN` di Railway → URL Vercel frontend
- [ ] `SMTP_EMAIL` + `SMTP_APP_PASSWORD` di Railway → Gmail App Password
- [ ] `NODE_ENV=production` di Railway
- [ ] `VITE_API_URL` di Vercel → URL Railway API
- [ ] Redeploy frontend Vercel setelah set `VITE_API_URL`
- [ ] Update `RAILWAY_URL` placeholder di `artifacts/myportofolio/vercel.json` untuk sitemap
