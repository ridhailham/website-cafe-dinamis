# Template Website Kafe — Kopi Senja

Template website landing page untuk kafe/kedai kopi, dirancang agar **mudah dipakai ulang per klien**. Isi (menu, galeri, info bisnis, foto) dikelola lewat panel admin tanpa perlu menyentuh kode; identitas dan gaya bisa disesuaikan per kebutuhan klien.

## Fitur

- **Landing page statis+dinamis**: hero, menu, galeri, lokasi (maps + jam buka + WhatsApp), footer.
- **Panel admin (`/admin`)**: kelola menu, galeri, info bisnis, dan sesi login.
- **Upload foto otomatis ke Vercel Blob** lewat panel admin.
- **Database Postgres (Neon)** via Drizzle ORM.
- Styling **Tailwind CSS v4**.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Database | Neon Postgres + Drizzle ORM |
| Penyimpanan file | Vercel Blob Storage |
| Auth (admin) | Session JWT (`jose`), password scrypt |
| Styling | Tailwind CSS v4 |

## Struktur proyek

```
src/
  app/
    page.tsx          # Landing page publik
    admin/            # Halaman + server actions admin
  components/         # Komponen UI (Navbar, Hero, MenuSection, Gallery, dst.)
  data/kedai.ts       # Fallback identitas & gambar hero (placeholder)
  db/
    schema.ts         # Definisi tabel Drizzle
    seed.ts           # Seed data (mengandung placeholder Unsplash)
    setup-admin.ts    # Membuat akun admin
scripts/              # Utilitas data (foto menu/galeri, seed bulk, uji)
next.config.ts         # Konfigurasi Next (remotePatterns gambar)
drizzle.config.ts      # Konfigurasi Drizzle Kit
```

> Data sebenarnya (menu, galeri, bisnis) disimpan di database dan dikelola lewat admin. `src/data/kedai.ts` hanya berisi **fallback** bila data belum ada di DB, dan mudah diedit langsung jika perlu.

## Prasyarat

- Node.js 18.17+ (disarankan versi LTS).
- Akun [Vercel](https://vercel.com) + project dengan **Blob Store** diaktifkan.
- Database [Neon Postgres](https://neon.tech).

## Setup environment

Salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Lalu isi variabelnya:

| Variabel | Keterangan |
| --- | --- |
| `DATABASE_URL` | Connection string Neon Postgres (pooled). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Kredensial admin. **WAJIB ganti sebelum serah terima ke klien!** |
| `AUTH_SECRET` | Kunci JWT. **JANGAN dibagikan/di-commit.** Generate: `openssl rand -base64 32`. |
| `BLOB_READ_WRITE_TOKEN` | Token Blob. Otomatis tersedia di Vercel; untuk lokal ambil dari Vercel → Stores. |

> `.env.local` **tidak** di-commit (sudah di `.gitignore`). Jangan pernah commit rahasia — `AUTH_SECRET`, `ADMIN_PASSWORD`, dan `BLOB_READ_WRITE_TOKEN`.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Panel admin di `http://localhost:3000/admin`.

### Perintah data (npm scripts)

```bash
npm run db:push                # Sinkronkan schema ke database
npm run db:setup-admin         # Buat akun admin
npm run db:seed                # Seed data awal (berisi placeholder Unsplash)
npm run db:seed:bulk           # Seed menu dalam jumlah besar
npm run db:set-foto            # Set foto menu dari folder lokal (Blob)
npm run db:upload-foto-per-menu
npm run db:ganti-galeri        # Ganti foto galeri dari folder lokal (Blob)
npm run db:uji                 # Uji kapasitas/audit data
```

> Script-script ini memuat `.env.local` sendiri, jadi cukup dijalankan via npm serta memastikan `.env.local` sudah terisi.

## Menyiapkan data untuk satu klien

1. **Setup akun admin** — `npm run db:setup-admin`, lalu login di `/admin`.
2. **Identitas bisnis** — di menu **Bisnis** (`/admin/bisnis`): nama, tagline, deskripsi, nomor WhatsApp, alamat, link maps embed, dan jam buka.
3. **Menu** — tambah/edit/hapus menu; unggah foto per item (otomatis ke Blob).
4. **Galeri** — tambah/edit/hapus foto suasana kafe.
5. **Verifikasi** — buka halaman publik, pastikan data & foto tampil benar.

## Menyesuaikan identitas & gaya per klien

- **Identitas umum / hero** — edit `src/data/kedai.ts`:
  - `nama`, `tagline`, `deskripsi`, `wa`, `instagram`, `alamat`, `jamBuka`, `mapsEmbed`.
  - `heroImage`: URL gambar hero — untuk produksi gunakan **foto milik klien** yang diunggah ke Blob (bukan Unsplash).
- **Gaya / warna** — Tailwind v4; lihat `globals.css` dan komponen di `src/components`.

## Catatan penting untuk produksi klien

- **Ganti `ADMIN_EMAIL` dan `ADMIN_PASSWORD`** di env Vercel sebelum serah terima.
- Foto **Unsplash di `seed.ts` dan `kedai.ts` adalah placeholder** sementara. Untuk produksi, semua foto menu/galeri/hero harus milik klien (unggah lewat admin → Blob). Setelah tidak ada foto Unsplash lagi, hapus `images.unsplash.com` dari `remotePatterns` di `next.config.ts`.
- `AUTH_SECRET` **wajib** diset — tidak ada fallback.

## Deploy untuk klien baru di Vercel

1. Impor repository ke Vercel sebagai project baru.
2. Aktifkan **Blob Store** pada project tersebut.
3. Set environment variables di **Settings → Environment Variables** (sama seperti `.env.local`, termasuk `AUTH_SECRET`).
4. Deploy. Kerjaan backend data (Neon + Blob + env) sudah tersambung otomatis.
5. Buat akun admin & isi data via `/admin` seperti di atas.

## Script referensi

Lihat `package.json` untuk daftar lengkap npm scripts, dan folder `scripts/` untuk utilitas data.
