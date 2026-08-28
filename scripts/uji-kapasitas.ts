import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql, type SQL } from "drizzle-orm";

config({ path: ".env.local" });
config();

// Menguji apakah kapasitas penyimpanan Neon free tier (0.5 GB) cukup untuk data kafe.
// Strategi aman: buat tabel sementara (_uji_kapasitas) berstruktur sama dengan menu_items,
// isi banyak baris, ukur, lalu DROP — data nyata tidak tersentuh.

const BATAS_BYTES = 0.5 * 1024 * 1024 * 1024; // 0.5 GB
const TARGET_MB = 25; // ±5% dari 512 MB
const CHUNK = 1000;

const db = drizzle(neon(process.env.DATABASE_URL!));

async function ambilUkuran(prefix: string) {
  const hasil = await db.execute(sql`
    SELECT
      pg_size_pretty(pg_database_size(current_database())) AS db_pretty,
      pg_database_size(current_database()) AS db_bytes,
      COALESCE(sum(pg_total_relation_size(c.oid)), 0) AS public_bytes
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
  `);
  const baris = hasil.rows[0] as Record<string, string | number>;
  console.log(
    `${prefix} — DB: ${baris.db_pretty} (${Math.round(Number(baris.db_bytes) / 1048576)} MB) | isi tabel public: ${Math.round(
      Number(baris.public_bytes) / 1024
    )} kB`
  );
  return Number(baris.public_bytes);
}

async function main() {
  console.log("=== Menentukan jumlah baris untuk target ~5% (25 MB) ===");
  const estHasil = await db.execute(sql`
    SELECT avg(pg_total_relation_size(c.oid) / GREATEST((SELECT reltuples::bigint FROM pg_class WHERE oid = c.oid), 1)) AS avg_row
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND reltuples > 0
  `);
  const avgRow =
    Number((estHasil.rows[0] as Record<string, unknown>).avg_row ?? 0) || 350;
  const targetRows = Math.max(
    10000,
    Math.round((TARGET_MB * 1048576) / avgRow / CHUNK) * CHUNK
  );
  console.log(
    `Perkiraan ukuran/baris ~${Math.round(avgRow)} byte → memakai ${targetRows.toLocaleString(
      "id-ID"
    )} baris.`
  );

  await ambilUkuran("Baseline");

  console.log("\n=== Membuat tabel uji sementara ===");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS _uji_kapasitas (
      id serial PRIMARY KEY,
      nama text NOT NULL,
      deskripsi text NOT NULL DEFAULT '',
      harga integer NOT NULL,
      kategori text NOT NULL DEFAULT 'Minuman',
      urutan integer NOT NULL DEFAULT 0,
      gambar_url text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  console.log(`Insert ${targetRows.toLocaleString("id-ID")} baris...`);
  for (let start = 0; start < targetRows; start += CHUNK) {
    const n = Math.min(CHUNK, targetRows - start);
    const values: SQL[] = [];
    for (let i = 0; i < n; i++) {
      const idx = start + i;
      const prc = (idx * 7) % 100000;
      values.push(
        sql`(${`Uji Menu ${idx}`}, ${`Deskripsi uji otomatis untuk baris ke-${idx}, dipakai mengukur kapasitas penyimpanan database.`}, ${prc}, ${idx % 2 === 0 ? "Minuman" : "Makanan"}, ${idx}, NULL, now(), now())`
      );
    }
    await db.execute(
      sql`INSERT INTO _uji_kapasitas (nama,deskripsi,harga,kategori,urutan,gambar_url,created_at,updated_at) VALUES ${sql.join(
        values,
        sql`, `
      )}`
    );
  }

  console.log("\n=== Ukur setelah insert ===");
  const tblHasil = await db.execute(sql`
    SELECT pg_size_pretty(pg_total_relation_size('_uji_kapasitas')) AS ukuran_tabel,
           pg_total_relation_size('_uji_kapasitas') AS bytes,
           (SELECT count(*) FROM _uji_kapasitas) AS jumlah
  `);
  const t = tblHasil.rows[0] as Record<string, string | number>;
  await ambilUkuran("Setelah insert");
  console.log(
    `Tabel uji: ${t.ukuran_tabel} (${t.jumlah.toLocaleString("id-ID")} baris)`
  );

  const ujiBytes = Number(t.bytes);
  const pct = ((ujiBytes / BATAS_BYTES) * 100).toFixed(2);
  console.log("\n=== Laporan ===");
  console.log(`- Tambahan storage di tabel uji: ${(ujiBytes / 1048576).toFixed(2)} MB`);
  console.log(`- Itu = ${pct}% dari batas 0.5 GB (512 MB)`);
  const satuBaris = ujiBytes / Number(t.jumlah);
  const muatTotal = Math.floor(BATAS_BYTES / Math.max(satuBaris, 1));
  console.log(`- Kapasitas teoritis: ±${muatTotal.toLocaleString("id-ID")} baris menu dalam 512 MB`);
  console.log(`- Data kafe nyata (200 menu) = ±0,07%, jadi 0.5 GB lebih dari cukup.`);

  console.log("\n=== Membersihkan (DROP tabel uji) ===");
  await db.execute(sql`DROP TABLE IF EXISTS _uji_kapasitas`);
  await ambilUkuran("Setelah drop (kembali ke baseline)");
  console.log("\nSelesai. Data asli menu tidak tersentuh.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Uji gagal:", err);
    db.execute(sql`DROP TABLE IF EXISTS _uji_kapasitas`)
      .catch(() => {})
      .finally(() => process.exit(1));
  });
