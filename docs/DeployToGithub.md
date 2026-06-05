# Deploy to GitHub

Panduan push project Fariz Portfolio CMS dari Replit ke GitHub.

## Prerequisites

- Akun GitHub
- Repository sudah dibuat (public atau private)
- Git tersedia di Replit (sudah tersedia by default)

---

## Setup Pertama Kali

### 1. Buat Repository di GitHub

1. Buka [github.com/new](https://github.com/new)
2. Isi nama repo: `fariz-portfolio` (atau sesuai preferensi)
3. Pilih **Private** (direkomendasikan, karena berisi kode CMS personal)
4. **Jangan** centang "Initialize with README" — repo sudah ada isinya
5. Klik **Create repository**

### 2. Set Remote di Replit

Buka shell di Replit dan jalankan:

```bash
# Cek remote yang sudah ada
git remote -v

# Tambah remote GitHub (ganti username dan repo name)
git remote add origin https://github.com/USERNAME/fariz-portfolio.git

# Atau jika sudah ada remote lain, ubah URL-nya
git remote set-url origin https://github.com/USERNAME/fariz-portfolio.git
```

### 3. Push ke GitHub

```bash
# Push branch main
git push -u origin main
```

Jika diminta username/password, gunakan **Personal Access Token** (bukan password GitHub biasa).

---

## Personal Access Token (PAT)

GitHub tidak lagi menerima password untuk push via HTTPS. Gunakan PAT:

1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. Klik **Generate new token (classic)**
3. Beri nama: `Replit Portfolio`
4. Expiration: sesuai kebutuhan (90 hari direkomendasikan)
5. Centang scope: `repo` (full control of private repositories)
6. Klik **Generate token** — **copy segera**, tidak bisa dilihat lagi

Simpan PAT sebagai Replit Secret dengan nama `GITHUB_TOKEN`:
```
Key: GITHUB_TOKEN
Value: ghp_xxxxxxxxxxxxxxxxxxxx
```

Konfigurasi git untuk menggunakan token:
```bash
git config --global credential.helper store
# Saat diminta password, masukkan PAT (bukan password GitHub)
```

---

## Push Rutin (Setelah Setup)

```bash
# Cek status
git status

# Stage semua perubahan
git add .

# Commit
git commit -m "feat: deskripsi perubahan"

# Push
git push origin main
```

---

## Yang Di-push dan Tidak

### Di-push ✅
```
artifacts/api-server/src/        # source code backend
artifacts/myportofolio/src/       # source code frontend
lib/api-spec/openapi.yaml         # OpenAPI spec
lib/api-spec/orval.config.ts      # codegen config
docs/                             # dokumentasi
package.json                      # workspace config
pnpm-workspace.yaml
tsconfig.json
replit.md
```

### Tidak Di-push ❌
```
node_modules/                     # dependencies (install ulang via pnpm install)
artifacts/api-server/dist/        # build output
.env                              # secrets
*.log
lib/api-client-react/src/generated/   # auto-generated, recreate via codegen
lib/api-zod/src/generated/            # auto-generated
```

Pastikan `.gitignore` di root sudah mencakup semua item di atas.

---

## Verifikasi di GitHub

Setelah push, cek di GitHub:
- File struktur monorepo tampil dengan benar
- File secret (`*.env`, `JWT_SECRET`, dll) tidak ikut ter-push
- Branch `main` adalah branch default

---

## Lanjutan: Deploy ke Vercel

Setelah repo ada di GitHub, deploy ke Vercel bisa dilakukan via GitHub integration. Lihat [DeployToVercel.md](./DeployToVercel.md).

---

## Troubleshooting

**Error: `remote: Repository not found`**
```bash
# Cek apakah URL remote sudah benar
git remote -v
# Pastikan username dan repo name benar
```

**Error: `failed to push — non-fast-forward`**
```bash
# Pull dulu perubahan dari remote
git pull origin main --rebase
git push origin main
```

**Error: `Authentication failed`**
- Pastikan menggunakan PAT, bukan password GitHub
- Cek apakah PAT belum expired
- Pastikan scope PAT mencakup `repo`
