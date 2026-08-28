import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  adminCredentials,
  bisnis,
  galleryItems,
  jamBuka,
  menuItems,
} from "@/db/schema";
import { KATEGORI_OPTIONS } from "@/lib/constants";

config({ path: ".env.local" });
config();

const MAX_HARGA = 100_000_000;
const MAX_TEKS = 200;

let error = 0;

function cek(kondisiBenar: boolean, pesan: string) {
  if (kondisiBenar) {
    console.log(`  ✓ ${pesan}`);
  } else {
    console.error(`  ✗ ${pesan}`);
    error++;
  }
}

function adalahBlob(url: string): boolean {
  return /blob\.vercel-storage\.com/i.test(url);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tidak ditemukan.");
    process.exit(1);
  }
  const db = drizzle(neon(process.env.DATABASE_URL));

  console.log("\n=== AUDIT MENU ===");
  const menu = await db.select().from(menuItems);
  const uniq = new Set(menu.map((m) => m.gambarUrl).filter(Boolean));
  cek(menu.length > 0, `Ada ${menu.length} item menu.`);
  cek(menu.every((m) => m.nama && m.nama.trim().length > 0), "Semua menu punya nama.");
  cek(menu.every((m) => m.nama.length <= 80), "Nama menu ≤ 80 karakter.");
  cek(menu.every((m) => m.deskripsi.length <= 160), "Deskripsi menu ≤ 160 karakter.");
  cek(menu.every((m) => Number.isInteger(m.harga) && m.harga >= 0 && m.harga <= MAX_HARGA),
    `Harga item 0..${MAX_HARGA}.`);
  cek(menu.every((m) => KATEGORI_OPTIONS.includes(m.kategori as never)),
    "Kategori valid (Minuman/Makanan).");
  cek(menu.every((m) => m.gambarUrl), "Semua menu punya gambar.");
  cek(menu.every((m) => !m.gambarUrl || /^https:\/\//i.test(m.gambarUrl)), "URL gambar https.");
  cek(menu.every((m) => !m.gambarUrl || adalahBlob(m.gambarUrl)),
    "Semua gambar menu dari Blob (tanpa Unsplash).");
  cek(uniq.size === menu.filter((m) => m.gambarUrl).length, "Tidak ada URL gambar duplikat.");
  cek(menu.every((m) => Number.isInteger(m.urutan)), "Urutan menu valid.");

  console.log("\n=== AUDIT GALERI ===");
  const galeri = await db.select().from(galleryItems);
  cek(galeri.every((g) => g.gambarUrl), "Semua galeri punya gambar.");
  cek(galeri.every((g) => g.alt && g.alt.trim().length > 0), "Semua galeri punya alt.");
  cek(galeri.every((g) => g.alt.length <= 80), "Alt galeri ≤ 80 karakter.");
  cek(galeri.every((g) => !g.gambarUrl || adalahBlob(g.gambarUrl)),
    "Semua gambar galeri dari Blob (tanpa Unsplash).");
  const uniqGaleri = new Set(galeri.map((g) => g.gambarUrl).filter(Boolean));
  cek(uniqGaleri.size === galeri.filter((g) => g.gambarUrl).length,
    "Tidak ada URL galeri duplikat.");

  console.log("\n=== AUDIT BISNIS ===");
  const [bn] = await db.select().from(bisnis).limit(1);
  if (bn) {
    cek(!!bn.waNomor, "Ada nomor WhatsApp.");
    cek(/^\d+$/.test(bn.waNomor), "Nomor WhatsApp hanya digit (format internasional).");
    cek(bn.waTeks.length <= MAX_TEKS, `WA teks ≤ ${MAX_TEKS} karakter.`);
    cek(bn.alamat.length <= 200, "Alamat ≤ 200 karakter.");
    cek(!!bn.mapsEmbed, "Ada maps embed.");
    cek(/^(https?:\/\/)([a-z0-9-]+\.)?google\.(com|co\.id)\//i.test(bn.mapsEmbed),
      "maps embed valid dari Google.");
  } else {
    cek(false, "Data bisnis belum ada.");
  }

  const jam = await db.select().from(jamBuka);
  cek(jam.length > 0, `Ada ${jam.length} baris jam buka.`);
  cek(jam.every((j) => j.hari.trim().length > 0 && j.jam.trim().length > 0),
    "Semua jam buka punya hari & jam.");

  console.log("\n=== AUDIT ADMIN ===");
  const admin = await db.select().from(adminCredentials).limit(1);
  cek(admin.length === 1, "Ada tepat 1 kredensial admin.");
  if (admin[0]) {
    cek(!admin[0].email.includes("kopi-senja.com"), "Email admin bukan placeholder spesimen.");
  }

  console.log(`\n${error === 0 ? "AUDIT LULUS ✔" : `AUDIT GAGAL — ${error} masalah ✘`}\n`);
  process.exit(error === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Audit gagal:", err);
  process.exit(1);
});
