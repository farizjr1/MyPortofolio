# ENV Management

Panduan lengkap pengelolaan environment variables untuk project Fariz Portfolio CMS.

## Overview

Project menggunakan dua artifact terpisah dengan env vars masing-masing:

| Artifact | Path | Env vars yang digunakan |
|---|---|---|
| `api-server` | `artifacts/api-server/` | `MONGODB_URI`, `JWT_SECRET`, `SMTP_*`, `CORS_ORIGIN`, `PORT`, `NODE_ENV`, `FRONTEND_URL` |
| `myportofolio` | `artifacts/myportofolio/` | `VITE_API_URL`, `PORT` |

---

## Variabel API Server

### Wajib di Production

| Variabel | Keterangan | Contoh |
|---|---|---|
| `MONGODB_URI` | Connection string MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET` | Secret panjang acak untuk signing JWT | `openssl rand -hex 64` |
| `FRONTEND_URL` | URL frontend untuk CORS dan link email | `https://farizjr.vercel.app` |

### Email (Opsional tapi Direkomendasikan)

| Variabel | Keterangan | Contoh |
|---|---|---|
| `SMTP_EMAIL` | Akun Gmail pengirim | `admin@gmail.com` |
| `SMTP_APP_PASSWORD` | App Password Gmail (bukan password biasa) | `abcd efgh ijkl mnop` |

> **Catatan:** Gmail App Password dibuat di [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Aktifkan 2FA terlebih dahulu.
>
> Email dikirim **from**: `Flutce <admin@flutce.app>`, **to**: `farizjrpend@gmail.com` (hardcoded, tidak perlu env var).

### Opsional

| Variabel | Default | Keterangan |
|---|---|---|
| `CORS_ORIGIN` | `*` (semua) | Origin yang diizinkan, pisahkan dengan koma: `https://farizjr.vercel.app,https://www.farizjr.com` |
| `PORT` | `8080` | Port server Express |
| `NODE_ENV` | `development` | Set ke `production` di deployment |

### Perilaku Default (Development)

- `MONGODB_URI` tidak di-set → **mongodb-memory-server** otomatis digunakan; data akan hilang saat restart
- `JWT_SECRET` tidak di-set → random secret ephemeral digunakan; semua session logout saat restart
- `SMTP_*` tidak di-set → email tidak terkirim, error akan di-log tapi tidak crash

---

## Variabel Frontend (Vite)

| Variabel | Default | Keterangan |
|---|---|---|
| `VITE_API_URL` | `""` (relative) | Override URL API. Gunakan URL penuh hanya jika API dan frontend di-deploy ke domain berbeda. |
| `PORT` | `23236` | Port dev server Vite |

> **Catatan Vite:** Hanya variabel yang diawali `VITE_` yang tersedia di browser. Variabel lain di `.env` tidak akan terekspos ke client.

---

## Setup di Replit

Semua secret dikelola via **Replit Secrets** (bukan file `.env`):

1. Buka tab **Secrets** di sidebar Replit
2. Tambahkan key-value sesuai tabel di atas
3. Secret otomatis tersedia sebagai `process.env.NAMA_VAR`

**Jangan pernah:**
- Commit secret ke git
- Hardcode credential di kode
- Simpan secret di file `.env` yang di-commit

---

## Setup di Vercel

Lihat [DeployToVercel.md](./DeployToVercel.md) untuk instruksi lengkap pengaturan env vars di Vercel dashboard.

---

## Setup di GitHub Actions / CI

Tambahkan di **Settings → Secrets and variables → Actions**:

```
MONGODB_URI
JWT_SECRET
SMTP_EMAIL
SMTP_APP_PASSWORD
FRONTEND_URL
```

Referensi di workflow file:
```yaml
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## Generate JWT Secret

```bash
# Linux/Mac
openssl rand -hex 64

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Gunakan output sebagai nilai `JWT_SECRET`.
