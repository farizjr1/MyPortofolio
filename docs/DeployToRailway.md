# Deploy API ke Railway

Panduan deploy `artifacts/api-server` (Express + MongoDB) ke Railway sebagai backend API.

## Kenapa Railway?

| | Railway | Vercel (Serverless) |
|---|---|---|
| Long-running process | ✅ | ❌ |
| WebSocket support | ✅ | ❌ |
| Persistent DB connections | ✅ | ❌ (cold start) |
| MongoDB connection pooling | ✅ | ❌ |
| Free tier | ✅ $5/bulan credit | ✅ |

Express + MongoDB berjalan jauh lebih baik di Railway (always-on container) dibanding Vercel Serverless Functions.

---

## Prerequisites

- Akun Railway ([railway.app](https://railway.app))
- Repository sudah di GitHub ([DeployToGithub.md](./DeployToGithub.md))
- MongoDB Atlas cluster siap ([DeployToVercel.md](./DeployToVercel.md#database-setup))

---

## Setup Railway

### 1. Buat Project Baru

1. Buka [railway.app/new](https://railway.app/new)
2. Pilih **Deploy from GitHub repo**
3. Authorize Railway → pilih repo `fariz-portfolio`
4. Railway otomatis mendeteksi `railway.json` di root repo

### 2. Konfigurasi Environment Variables

Di tab **Variables**, tambahkan semua variabel berikut:

| Key | Value | Keterangan |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://...` | Connection string MongoDB Atlas |
| `JWT_SECRET` | `<64 char hex random>` | Secret JWT — generate dengan perintah di bawah |
| `FRONTEND_URL` | `https://farizjr.vercel.app` | URL frontend Vercel |
| `CORS_ORIGIN` | `https://farizjr.vercel.app` | Izinkan request dari frontend |
| `SMTP_EMAIL` | `admin@gmail.com` | Gmail pengirim |
| `SMTP_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` | Gmail App Password |
| `NODE_ENV` | `production` | Wajib untuk mode production |

> **PORT** tidak perlu di-set — Railway menyediakan `$PORT` otomatis.

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Deploy

Klik **Deploy** — Railway akan:
1. Clone repo dari GitHub
2. Jalankan `pnpm install --frozen-lockfile`
3. Build: `pnpm --filter @workspace/api-server run build`
4. Start: `node --enable-source-maps ./artifacts/api-server/dist/index.mjs`

### 4. Catat Railway URL

Setelah deploy selesai, Railway memberi URL seperti:
```
https://fariz-portfolio-production.up.railway.app
```

Catat URL ini — dibutuhkan untuk konfigurasi Vercel frontend.

---

## Hubungkan ke Vercel Frontend

### 1. Set `VITE_API_URL` di Vercel

1. Buka Vercel → Project `farizjr` → **Settings** → **Environment Variables**
2. Tambahkan:
   ```
   Key: VITE_API_URL
   Value: https://fariz-portfolio-production.up.railway.app
   Environment: Production
   ```
3. Klik **Save**
4. **Redeploy** frontend agar perubahan env var aktif

### 2. Update Sitemap di `vercel.json`

Buka `artifacts/myportofolio/vercel.json`, ganti placeholder:
```json
"destination": "https://RAILWAY_URL.up.railway.app/sitemap.xml"
```
dengan Railway URL yang sebenarnya:
```json
"destination": "https://fariz-portfolio-production.up.railway.app/sitemap.xml"
```

Commit dan push — Vercel otomatis redeploy.

---

## Verifikasi

```bash
# Health check API
curl https://fariz-portfolio-production.up.railway.app/healthz
# Expected: {"status":"ok"}

# Test CORS (dari browser devtools)
fetch("https://fariz-portfolio-production.up.railway.app/api/profile")
  .then(r => r.json()).then(console.log)
```

---

## Auto-Deploy

Railway otomatis deploy ulang setiap kali ada push ke branch `main` di GitHub.

Untuk menonaktifkan:
- **Settings** → **Source** → matikan **Auto Deploy**

---

## Monitoring & Logs

- **Logs** — klik tab **Logs** di Railway dashboard untuk real-time logs
- **Metrics** — CPU, memory, dan network usage tersedia di tab **Metrics**
- **Restart** — klik **Restart** untuk restart server tanpa redeploy

---

## Custom Domain (Opsional)

1. Railway → Service → **Settings** → **Networking** → **Custom Domain**
2. Tambahkan domain: `api.farizjr.com`
3. Update DNS: tambahkan CNAME record ke Railway domain
4. Update `CORS_ORIGIN` dan `FRONTEND_URL` di Railway env vars
5. Update `VITE_API_URL` di Vercel ke domain baru

---

## Troubleshooting

**Error: `pnpm: command not found`**
- Pastikan `railway.json` ada di root repo
- Build command sudah menggunakan `pnpm install && pnpm --filter ...`

**Error: `Cannot connect to MongoDB`**
- Cek `MONGODB_URI` di Railway Variables
- Pastikan MongoDB Atlas Network Access mengizinkan `0.0.0.0/0`

**Error: `CORS policy`**
- Cek `CORS_ORIGIN` di Railway Variables — harus sama persis dengan URL Vercel frontend (tanpa trailing slash)

**Build berhasil tapi API tidak respond**
- Cek Railway logs untuk error
- Pastikan `NODE_ENV=production` sudah di-set
- Cek apakah `PORT` env var dikonsumsi dengan benar (Railway set otomatis)

**Frontend tidak bisa akses API**
- Pastikan `VITE_API_URL` sudah di-set di Vercel dan frontend sudah di-redeploy
- Test langsung di browser: `https://RAILWAY_URL.up.railway.app/healthz`
