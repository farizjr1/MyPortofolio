# Deploy Frontend ke Vercel

Panduan deploy `artifacts/myportofolio` (React + Vite) ke Vercel sebagai static frontend.

> **Arsitektur:** Frontend di Vercel, API di Railway. Keduanya terpisah.
> Lihat [DeployToRailway.md](./DeployToRailway.md) untuk deploy API.

---

## Prerequisites

- Akun Vercel (free tier cukup)
- Repository sudah di GitHub ([DeployToGithub.md](./DeployToGithub.md))
- API sudah di-deploy ke Railway dan Railway URL sudah diketahui

---

## Database Setup (MongoDB Atlas)

Jika belum ada MongoDB Atlas cluster:

1. Buka [cloud.mongodb.com](https://cloud.mongodb.com)
2. Buat cluster baru (M0 Free tier cukup)
3. **Database Access** → Buat user baru dengan password kuat
4. **Network Access** → Add IP Address → `0.0.0.0/0`
5. **Connect** → Drivers → Copy connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

> MongoDB digunakan oleh API server (Railway), bukan frontend. Konfigurasi ini dilakukan di Railway Variables.

---

## Deploy Frontend di Vercel

### 1. Import Project

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import dari GitHub → pilih repo `fariz-portfolio`
3. **Configure Project:**
   - **Project Name:** `farizjr`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `artifacts/myportofolio`
   - **Build Command:** `pnpm run build` *(otomatis dari vercel.json)*
   - **Output Directory:** `dist/public` *(otomatis dari vercel.json)*
   - **Install Command:** `pnpm install` *(otomatis dari vercel.json)*

### 2. Environment Variables

| Key | Value | Environment |
|---|---|---|
| `VITE_API_URL` | `https://fariz-portfolio-production.up.railway.app` | Production |

> Ganti URL dengan Railway URL yang sebenarnya dari deployment API kamu.

### 3. Deploy

Klik **Deploy**. Frontend tersedia di `https://farizjr.vercel.app`.

---

## Update Sitemap setelah Dapat Railway URL

Setelah Railway URL diketahui, update satu baris di `artifacts/myportofolio/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "https://RAILWAY_URL.up.railway.app/sitemap.xml"
    },
    ...
  ]
}
```

Ganti `RAILWAY_URL` dengan URL Railway yang sebenarnya, commit, push → Vercel redeploy otomatis.

---

## Bagaimana Frontend Terhubung ke API

`VITE_API_URL` di-embed ke dalam bundle JavaScript saat build:

```typescript
// artifacts/myportofolio/src/main.tsx
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) setBaseUrl(apiUrl); // semua API calls pakai URL ini
```

Jadi setiap `fetch('/api/profile')` di dev → di production berubah menjadi `fetch('https://...railway.app/api/profile')`.

---

## Auto-Deploy

Setiap push ke branch `main` → Vercel otomatis rebuild dan redeploy frontend.

Untuk preview branch lain, buat Pull Request → Vercel deploy ke preview URL otomatis.

---

## Custom Domain (Opsional)

1. Vercel Dashboard → Project `farizjr` → **Settings** → **Domains**
2. Add domain: `farizjr.com`
3. Update DNS sesuai instruksi Vercel
4. Update `CORS_ORIGIN` dan `FRONTEND_URL` di Railway Variables ke domain baru
5. Redeploy Railway agar CORS env var aktif

---

## Post-Deploy Checklist

- [ ] Frontend bisa diakses di Vercel URL
- [ ] `VITE_API_URL` sudah di-set dan frontend sudah di-redeploy
- [ ] API health check dari browser: `https://RAILWAY_URL.up.railway.app/healthz` → `{"status":"ok"}`
- [ ] Register user pertama di `/register` → otomatis jadi admin
- [ ] Login di `/login` → admin panel muncul di `/admin`
- [ ] Halaman publik tampil konten (home, about, portfolio, blog)
- [ ] Sitemap dapat diakses: `https://farizjr.vercel.app/sitemap.xml`

---

## Troubleshooting

**Frontend deploy berhasil tapi layar hitam / konten tidak tampil**
- Pastikan `VITE_API_URL` sudah di-set di Vercel env vars
- Pastikan frontend sudah di-**redeploy** setelah set env var (perlu redeploy agar VITE_ ter-embed ke bundle)
- Cek browser DevTools → Console untuk error

**`CORS policy` error di browser**
- Pastikan `CORS_ORIGIN` di Railway = URL Vercel frontend yang digunakan (termasuk custom domain jika ada)
- Tidak boleh ada trailing slash: `https://farizjr.vercel.app` ✅, `https://farizjr.vercel.app/` ❌

**404 pada route `/blog/slug` atau `/admin` saat refresh**
- Sudah ditangani oleh rewrite `/(.*) → /index.html` di `vercel.json`

**Sitemap `/sitemap.xml` return 404**
- Update destination di `vercel.json` ke Railway URL yang benar
- Push dan tunggu Vercel redeploy
