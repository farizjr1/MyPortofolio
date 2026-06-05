# Deploy to Vercel

Panduan deploy Fariz Portfolio CMS ke Vercel sebagai dua service terpisah.

## Arsitektur Deployment

Project ini adalah monorepo dengan dua artifact:

| Service | Root Directory | Framework | URL |
|---|---|---|---|
| Frontend | `artifacts/myportofolio` | Vite (React) | `https://farizjr.vercel.app` |
| API Backend | `artifacts/api-server` | Node.js (Express) | `https://farizjr-api.vercel.app` |

> Vercel perlu di-deploy **dua kali** — sekali untuk frontend, sekali untuk backend.

---

## Prerequisites

- Akun Vercel (free tier cukup untuk personal portfolio)
- Repository sudah di GitHub (lihat [DeployToGithub.md](./DeployToGithub.md))
- MongoDB Atlas cluster sudah siap (lihat bagian [Database Setup](#database-setup))

---

## Database Setup (MongoDB Atlas)

1. Buka [cloud.mongodb.com](https://cloud.mongodb.com)
2. Buat cluster baru (M0 Free tier cukup)
3. **Database Access** → Buat user baru dengan password kuat
4. **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere)
5. **Connect** → Drivers → Copy connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
6. Simpan connection string — akan digunakan sebagai `MONGODB_URI`

---

## Deploy API Server

### 1. Import Project di Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import dari GitHub → pilih repo `fariz-portfolio`
3. **Configure Project:**
   - **Project Name:** `farizjr-api`
   - **Framework Preset:** `Other`
   - **Root Directory:** `artifacts/api-server`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

### 2. Environment Variables

Di tab **Environment Variables**, tambahkan:

| Key | Value | Environment |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://...` | Production |
| `JWT_SECRET` | `<random 64 char hex>` | Production |
| `FRONTEND_URL` | `https://farizjr.vercel.app` | Production |
| `CORS_ORIGIN` | `https://farizjr.vercel.app` | Production |
| `SMTP_EMAIL` | `admin@gmail.com` | Production |
| `SMTP_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` | Production |
| `NODE_ENV` | `production` | Production |

> **Generate JWT Secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Vercel Config untuk Express

Buat file `artifacts/api-server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.mjs"
    }
  ]
}
```

### 4. Deploy

Klik **Deploy**. Setelah selesai, catat URL API: `https://farizjr-api.vercel.app`

---

## Deploy Frontend

### 1. Import Project Baru di Vercel

1. Buka [vercel.com/new](https://vercel.com/new) lagi
2. Import dari GitHub → pilih repo yang sama
3. **Configure Project:**
   - **Project Name:** `farizjr`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `artifacts/myportofolio`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

### 2. Environment Variables Frontend

Tidak ada env var wajib untuk frontend di Vercel. `vercel.json` sudah mengandung rewrite proxy:

```
/api/:path*  →  https://farizjr-api.vercel.app/api/:path*
```

Semua API call dari browser otomatis diteruskan ke API server tanpa perlu `VITE_API_URL`.

> **Opsional:** Jika ingin API di domain berbeda dari default (`farizjr-api.vercel.app`), set `VITE_API_URL` dan update destination di `vercel.json` accordingly.

### 3. Deploy

Klik **Deploy**. Frontend akan tersedia di `https://farizjr.vercel.app`.

---

## Konfigurasi Custom Domain (Opsional)

### Frontend
1. Vercel Dashboard → Project `farizjr` → **Settings** → **Domains**
2. Add domain: `farizjr.com` atau `portfolio.farizjr.com`
3. Update DNS sesuai instruksi Vercel (CNAME atau A record)
4. Update `FRONTEND_URL` dan `CORS_ORIGIN` di API environment variables

### API
1. Vercel Dashboard → Project `farizjr-api` → **Domains**
2. Add domain: `api.farizjr.com`
3. Update `VITE_API_URL` di frontend environment variables

---

## Auto-Deploy (CI/CD)

Setelah project terhubung ke GitHub, Vercel otomatis:
- Deploy ke **production** setiap push ke branch `main`
- Deploy ke **preview URL** setiap push ke branch lain atau pull request

Untuk menonaktifkan auto-deploy branch tertentu:
- **Settings** → **Git** → **Ignored Build Step** → tambahkan kondisi

---

## Post-Deploy Checklist

- [ ] API health check: `GET https://farizjr-api.vercel.app/api/healthz` → `{"status":"ok"}`
- [ ] Frontend bisa diakses di domain Vercel
- [ ] Register user pertama di `/register` → otomatis jadi admin
- [ ] Login di `/login` dan cek admin panel di `/admin`
- [ ] Test kontak form → email diterima di `farizjrpend@gmail.com`
- [ ] Upload foto profil dari admin → tampil di homepage
- [ ] Tambah satu blog post → muncul di `/blog`

---

## Rollback

Jika deployment bermasalah:
1. Vercel Dashboard → Project → **Deployments**
2. Pilih deployment sebelumnya yang stabil
3. Klik **...** → **Promote to Production**

---

## Troubleshooting

**Error: `Cannot find module`**
- Pastikan `Install Command` menggunakan `pnpm install` (bukan `npm install`)
- Cek apakah semua dependencies ada di `package.json` (bukan hanya devDependencies)

**Error: `MongoDB connection failed`**
- Cek apakah `MONGODB_URI` sudah di-set di Vercel env vars
- Pastikan Network Access MongoDB Atlas mengizinkan `0.0.0.0/0`
- Cek format connection string — harus diawali `mongodb+srv://`

**Error: `CORS policy`**
- Pastikan `CORS_ORIGIN` di API sama persis dengan URL frontend (tanpa trailing slash)
- Contoh benar: `https://farizjr.vercel.app`
- Contoh salah: `https://farizjr.vercel.app/`

**Email tidak terkirim**
- Pastikan `SMTP_EMAIL` dan `SMTP_APP_PASSWORD` sudah di-set
- Pastikan menggunakan **App Password** Gmail, bukan password akun biasa
- Aktifkan 2FA di akun Gmail terlebih dahulu sebelum membuat App Password
