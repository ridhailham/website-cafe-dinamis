# Deploy ke Vercel

Panduan menyiapkan deployment website Kopi Senja ke Vercel.

## Prasyarat

- Repo sudah di-push ke GitHub: `git push origin main`
- Akun [vercel.com](https://vercel.com) (login via GitHub)

## 1. Import proyek di Vercel

1. Buka https://vercel.com/new
2. Pilih **Import** repo `ridhailham/website-cafe-dinamis`
3. Framework terdeteksi otomatis: **Next.js** (build `npm run build`)
4. Klik **Deploy**

## 2. Set Environment Variables

Di **Project → Settings → Environment Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Connection string Neon Postgres **production** (pooled) |
| `ADMIN_EMAIL` | Email admin |
| `ADMIN_PASSWORD` | Password admin |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` — **wajib diset** (kode tidak punya fallback) |

## 3. Aktifkan Vercel Blob

Agar `BLOB_READ_WRITE_TOKEN` tersedia otomatis:

- Dashboard → **Storage → Create Store → Blob**, lalu hubungkan ke project.
- (Bisa juga via **Integrations → Vercel Blob** dari project.)

## 4. Sync schema & seed database production

Koneksi DB production (Neon) masih kosong setelah deploy. Dari lokal, set `DATABASE_URL` ke connection string production lalu jalankan:

```bash
# 1) push schema (buat tabel menu_items)
DATABASE_URL=<connection-string-production> npx drizzle-kit push

# 2) seed data awal (50 item menu)
DATABASE_URL=<connection-string-production> node --import tsx src/db/seed.ts
```

> Seed otomatis dilewati bila tabel sudah berisi — aman dijalankan ulang.

## Verifikasi Setelah Deploy

- `/` → hero, menu (dengan data seed), galeri, lokasi
- `/admin` → login → tab Semua/Minuman/Makanan + pagination
- Upload foto menu → tersimpan di Vercel Blob
- `/robots.txt` → menampilkan blok `/admin`
