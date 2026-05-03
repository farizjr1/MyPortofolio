# Panduan Git & GitHub — MyPortofolio

Panduan lengkap untuk mengelola kode dengan Git dan GitHub,
mulai dari setup awal, push harian, branching strategy, hingga proteksi branch.

---

## Setup Awal (Sekali Saja)

### 1. Konfigurasi Identitas Git

Jalankan di terminal (laptop lokal):

```bash
git config --global user.name "Fariz Jelang Ramadhan"
git config --global user.email "emailkamu@gmail.com"
```

### 2. Clone Repository

```bash
git clone https://github.com/farizjr1/MyPortofolio.git
cd MyPortofolio
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Buat file `.env` lokal

```bash
cp .env.example artifacts/api-server/.env
# Edit file tersebut, isi nilai-nilainya
```

---

## Alur Kerja Harian

### Sebelum mulai kerja — selalu pull dulu

```bash
git pull origin main
```

### Cek status perubahan

```bash
git status
```

### Lihat perubahan detail

```bash
git diff
```

---

## Git Flow — Branching Strategy

Proyek ini menggunakan pola **Git Flow sederhana** dengan 3 jenis branch:

```
main          ← production-ready, selalu stabil
└── develop   ← staging, gabungan semua fitur sebelum ke main
    ├── feature/nama-fitur    ← pengembangan fitur baru
    └── hotfix/nama-bug       ← perbaikan bug di production
```

### Membuat fitur baru

```bash
# Pastikan di branch main yang terbaru
git checkout main
git pull origin main

# Buat branch baru untuk fitur
git checkout -b feature/nama-fitur
# Contoh: git checkout -b feature/dark-mode

# Kerjakan perubahan...
# Simpan perubahan
git add .
git commit -m "feat: tambah fitur dark mode"

# Push branch ke GitHub
git push origin feature/nama-fitur
```

Kemudian buat **Pull Request** di GitHub:
1. Buka https://github.com/farizjr1/MyPortofolio
2. GitHub biasanya menampilkan notif "Compare & pull request" → klik
3. Isi judul dan deskripsi
4. Klik **"Create pull request"**
5. Setelah review → **"Merge pull request"** → **"Confirm merge"**

### Perbaikan bug cepat (hotfix)

```bash
# Dari main langsung
git checkout main
git pull origin main
git checkout -b hotfix/nama-bug
# Contoh: git checkout -b hotfix/fix-cv-download

# Fix bug...
git add .
git commit -m "fix: perbaiki bug download CV di mobile"
git push origin hotfix/nama-bug
# Buat Pull Request ke main
```

---

## Commit Message Convention

Gunakan format **Conventional Commits** agar riwayat mudah dibaca:

| Prefix | Digunakan untuk |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi saja |
| `style:` | Perubahan tampilan/CSS (bukan logic) |
| `refactor:` | Refactor kode (bukan fitur baru, bukan bug fix) |
| `perf:` | Peningkatan performa |
| `chore:` | Update dependency, konfigurasi, dsb. |

**Contoh pesan yang baik:**
```bash
git commit -m "feat: tambah animasi hover di card portfolio"
git commit -m "fix: perbaiki layout CV di layar mobile"
git commit -m "docs: update panduan deploy ke Vercel"
git commit -m "chore: update dependency nodemailer ke v6.10"
```

**Hindari pesan seperti:**
```bash
git commit -m "update"          # ❌ tidak jelas
git commit -m "fix bug"         # ❌ bug apa?
git commit -m "WIP"             # ❌ jangan push WIP ke main
```

---

## Push ke GitHub

### Push branch saat ini

```bash
git push origin nama-branch
```

### Push branch pertama kali (set upstream)

```bash
git push -u origin nama-branch
# Setelah ini cukup: git push
```

### Lihat semua branch

```bash
git branch -a
```

### Hapus branch lokal setelah merge

```bash
git branch -d feature/nama-fitur
```

### Hapus branch remote setelah merge

```bash
git push origin --delete feature/nama-fitur
```

---

## Tag & Release

Tandai versi penting dengan tag untuk memudahkan rollback:

```bash
# Buat tag versi
git tag -a v1.0.0 -m "Release: Initial launch portfolio"
git tag -a v1.1.0 -m "Release: Tambah fitur CV Generator"
git tag -a v1.2.0 -m "Release: Integrasi SMTP contact form"

# Push tag ke GitHub
git push origin v1.0.0

# Push semua tag sekaligus
git push origin --tags
```

Lihat semua tag:
```bash
git tag
```

---

## Setup Proteksi Branch `main` di GitHub

Agar branch `main` tidak bisa langsung di-push tanpa Pull Request:

1. Buka https://github.com/farizjr1/MyPortofolio
2. **Settings** → **Branches**
3. Klik **"Add rule"** (atau **"Add branch protection rule"**)
4. **Branch name pattern:** `main`
5. Centang pilihan berikut:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging** *(jika pakai CI)*
   - ✅ **Do not allow bypassing the above settings**
6. Klik **"Create"**

---

## Undo & Recovery

### Batalkan perubahan file yang belum di-stage

```bash
git restore nama-file.ts
# Atau batalkan semua:
git restore .
```

### Batalkan git add (unstage)

```bash
git restore --staged nama-file.ts
```

### Edit commit terakhir (belum di-push)

```bash
git commit --amend -m "pesan commit yang diperbarui"
```

### Lihat riwayat commit

```bash
git log --oneline --graph --all
```

### Kembali ke commit sebelumnya (buat branch baru dari sana)

```bash
# Cari SHA commit dengan: git log --oneline
git checkout -b hotfix/rollback abc1234
```

---

## `.gitignore` — File yang Diabaikan

File `.gitignore` di root project sudah mengecualikan:

```
node_modules/
dist/
.env
.env.local
*.log
```

> **Penting:** Jangan pernah commit file `.env` yang berisi password atau API key.
> Selalu gunakan `.env.example` sebagai template (tanpa nilai asli).

---

## Cek Koneksi ke GitHub

```bash
# Test koneksi SSH (jika pakai SSH)
ssh -T git@github.com

# Lihat remote yang terdaftar
git remote -v

# Ganti URL remote (misal dari HTTPS ke SSH)
git remote set-url origin git@github.com:farizjr1/MyPortofolio.git
```

---

## Referensi Cepat

```bash
git status                         # Status file
git add .                          # Stage semua perubahan
git add src/pages/Contact.tsx      # Stage file tertentu
git commit -m "feat: ..."          # Commit
git push origin main               # Push ke main
git pull origin main               # Pull dari main
git log --oneline -10              # 10 commit terakhir
git diff HEAD~1                    # Perbandingan dengan commit sebelumnya
git stash                          # Simpan perubahan sementara
git stash pop                      # Ambil kembali perubahan
```

---

*Dibuat untuk project MyPortofolio — Fariz Jelang Ramadhan*
