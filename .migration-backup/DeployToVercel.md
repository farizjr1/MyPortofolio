# Deploy ke Vercel + Custom Domain `flutce.app`

Panduan lengkap men-deploy portfolio ke Vercel dengan custom domain `flutce.app`.
Karena project ini memiliki **frontend** (React/Vite) dan **backend** (Express/Node.js),
keduanya di-deploy ke platform berbeda:

| Bagian | Platform | Domain |
|---|---|---|
| Frontend | Vercel | `portfolio.flutce.app` |
| Backend API | Railway | `api.flutce.app` |
| Database | MongoDB Atlas | *(cloud, tanpa domain)* |

---

## Prasyarat

- Akun [Vercel](https://vercel.com) (gratis)
- Akun [Railway](https://railway.app) (gratis)
- Akun [MongoDB Atlas](https://cloud.mongodb.com) (gratis)
- Repository GitHub sudah ada: `farizjr1/MyPortofolio`
- Akses ke DNS panel domain `flutce.app` (Cloudflare, Niagahoster, dsb.)

---

## BAGIAN 1 — Database: MongoDB Atlas

Lakukan ini **pertama** sebelum deploy backend atau frontend.

1. Buka https://cloud.mongodb.com → login atau buat akun
2. Klik **"Build a Database"** → pilih **M0 Free**
3. Pilih region: **Singapore** (latency rendah dari Indonesia)
4. Buat **Database User**:
   - Username: `fariz-admin`
   - Password: generate password kuat → **simpan di tempat aman**
5. Di **Network Access** → **Add IP Address** → ketik `0.0.0.0/0` → **Confirm**
   *(ini agar Railway bisa konek ke Atlas)*
6. Klik **"Connect"** → **"Drivers"** → salin URI, ganti `<password>` dengan password tadi
7. URI formatnya:
   ```
   mongodb+srv://fariz-admin:PASSWORDMU@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
8. **Simpan URI ini** — dipakai di Bagian 2 (Railway)

---

## BAGIAN 2 — Backend: Railway

### Deploy

1. Buka https://railway.app → **Login with GitHub**
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository **farizjr1/MyPortofolio**
4. Railway mendeteksi monorepo. Set konfigurasi berikut:
   - **Root Directory:** `artifacts/api-server`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `node dist/index.js`
5. Klik tab **"Variables"** → **Add Variable** satu per satu:

   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | URI Atlas dari Bagian 1 |
   | `JWT_SECRET` | *(generate: lihat di bawah)* |
   | `SESSION_SECRET` | *(generate: lihat di bawah)* |
   | `CORS_ORIGIN` | `https://portfolio.flutce.app` |
   | `SMTP_EMAIL` | alamat Gmail kamu |
   | `SMTP_APP_PASSWORD` | Gmail App Password 16-karakter |
   | `CONTACT_TO_EMAIL` | email penerima pesan kontak |

   **Cara generate JWT_SECRET / SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. Klik **"Deploy"** → tunggu status **"Success"**
7. Di tab **"Settings"** → **"Networking"** → klik **"Generate Domain"**
   Railway memberi URL sementara, misal: `https://myportofolio-api.railway.app`

### Setup Custom Domain `api.flutce.app`

1. Masih di Railway → **Settings** → **Networking** → **Custom Domain**
2. Ketik: `api.flutce.app` → klik **"Add Domain"**
3. Railway tampilkan DNS record yang harus ditambahkan:
   ```
   Type : CNAME
   Name : api
   Value: xxxxxxxx.railway.app
   ```
4. Buka panel DNS domain `flutce.app` kamu (Cloudflare/Niagahoster/dll)
5. Tambahkan record CNAME tersebut
6. Tunggu propagasi (biasanya 1-10 menit di Cloudflare, bisa sampai 24 jam di provider lain)
7. Railway otomatis issue SSL certificate
8. Verifikasi backend berjalan:
   ```bash
   curl https://api.flutce.app/api/healthz
   ```
   Harus mengembalikan: `{"status":"ok","timestamp":"..."}`

---

## BAGIAN 3 — Frontend: Vercel

### Deploy

1. Buka https://vercel.com → **Login with GitHub**
2. Klik **"Add New..."** → **"Project"**
3. Klik **"Import"** di sebelah repository **farizjr1/MyPortofolio**
4. Konfigurasi project:

   > **Ada dua cara deploy — pilih salah satu:**

   **Cara A — Deploy dari Root Directory (direkomendasikan)**

   Biarkan Root Directory tetap `/` (root repo). File `vercel.json` di root sudah
   mengonfigurasi semua secara otomatis — tidak perlu mengubah apapun di Vercel.

   | Setting | Value |
   |---|---|
   | **Framework Preset** | `Other` |
   | **Root Directory** | *(biarkan kosong / root)* |
   | **Build Command** | *(otomatis dari `vercel.json`)* |
   | **Output Directory** | *(otomatis dari `vercel.json`)* |
   | **Install Command** | *(otomatis dari `vercel.json`)* |

   **Cara B — Deploy dengan Root Directory di-set ke folder frontend**

   Klik **Edit** pada Root Directory, isi `artifacts/myportofolio`.
   File `artifacts/myportofolio/vercel.json` akan digunakan secara otomatis.

   | Setting | Value |
   |---|---|
   | **Framework Preset** | `Other` |
   | **Root Directory** | `artifacts/myportofolio` |
   | **Build Command** | *(otomatis dari `vercel.json`)* |
   | **Output Directory** | *(otomatis dari `vercel.json`)* |

5. Di bagian **"Environment Variables"** — semua sudah ada di `vercel.json`,
   tidak perlu tambah manual. Cukup klik **"Deploy"** → tunggu 2-5 menit
7. Vercel memberi URL sementara, misal: `https://myportofolio-xyz.vercel.app`

### Setup Custom Domain `portfolio.flutce.app`

1. Di Vercel dashboard → project kamu → tab **"Settings"** → **"Domains"**
2. Ketik: `portfolio.flutce.app` → klik **"Add"**
3. Vercel tampilkan DNS record:
   ```
   Type : CNAME
   Name : portfolio
   Value: cname.vercel-dns.com
   ```
4. Buka panel DNS domain `flutce.app` kamu
5. Tambahkan record CNAME tersebut
6. Kembali ke Vercel → klik **"Refresh"** → tunggu status menjadi ✅ **Valid**
7. Verifikasi:
   ```
   https://portfolio.flutce.app
   ```

---

## BAGIAN 4 — Setup CI/CD Otomatis (GitHub Actions)

Agar setiap push ke branch `main` otomatis deploy frontend ke Vercel.

### Langkah 1 — Ambil kredensial Vercel

1. Buka Vercel → **Settings** (akun) → **Tokens** → **"Create"**
   - Name: `GitHub Actions`
   - Scope: `Full Account`
   - Salin token → simpan sementara

2. Buka Vercel → project → **Settings** → **General**
   - Catat **Project ID**
   - Catat **Team ID** (jika ada, biasanya di akun pro)

### Langkah 2 — Tambahkan secrets di GitHub

1. Buka https://github.com/farizjr1/MyPortofolio
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Tambahkan secrets berikut:

   | Secret Name | Value |
   |---|---|
   | `VERCEL_TOKEN` | Token dari langkah 1 |
   | `VERCEL_PROJECT_ID` | Project ID dari Vercel |
   | `VERCEL_ORG_ID` | Team/Org ID dari Vercel |

### Langkah 3 — Buat file workflow GitHub Actions

Buat file `.github/workflows/deploy.yml` di repository:

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'artifacts/myportofolio/**'
      - 'lib/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: artifacts/myportofolio
          vercel-args: '--prod'
```

---

## BAGIAN 5 — Verifikasi Production Lengkap

Setelah semua deploy, jalankan checklist berikut:

```bash
# 1. Backend API merespons
curl https://api.flutce.app/api/healthz

# 2. Data profil bisa diambil
curl https://api.flutce.app/api/profile

# 3. Frontend bisa diakses
curl -I https://portfolio.flutce.app
```

Di browser, buka dan cek:
- [ ] https://portfolio.flutce.app — tampil halaman Home
- [ ] https://portfolio.flutce.app/about — tampil halaman About
- [ ] https://portfolio.flutce.app/portfolio — tampil daftar proyek
- [ ] https://portfolio.flutce.app/contact — form kontak bisa diisi & dikirim
- [ ] https://portfolio.flutce.app/flutceadmin — halaman login admin
- [ ] https://portfolio.flutce.app/cv — CV Generator berfungsi & PDF bisa didownload

---

## Troubleshooting

### API tidak merespons setelah deploy
- Cek Railway logs: dashboard → project → **"Deployments"** → klik deployment terbaru → lihat logs
- Pastikan `MONGODB_URI` sudah diset dan Atlas IP whitelist `0.0.0.0/0` sudah aktif

### Domain belum aktif / SSL pending
- Cek di panel DNS apakah record CNAME sudah tersimpan dengan benar
- Tunggu hingga 24 jam (propagasi DNS)
- Di Cloudflare: pastikan mode proxy (ikon awan) **Off (DNS only)** untuk record yang ke Railway/Vercel

### CORS error
- Pastikan `CORS_ORIGIN` di Railway variabel adalah `https://portfolio.flutce.app` — **tanpa trailing slash**
- Setelah ubah variable, Railway otomatis restart

### Data kosong di production
- Seed data otomatis berjalan saat server pertama kali start dan database kosong
- Jika tidak ada data, cek log Railway untuk error koneksi MongoDB

---

*Dibuat untuk project MyPortofolio — Fariz Jelang Ramadhan*
