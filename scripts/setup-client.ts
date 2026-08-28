import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  adminCredentials,
  bisnis,
  galleryItems,
  jamBuka,
  menuItems,
} from "@/db/schema";
import { ubahKeEmbedMaps } from "@/lib/maps";
import { acakHex, buatPasswordAwal, hashSecret } from "@/lib/kripto";

config({ path: ".env.local" });
config();

const MENU_AWAL = [
  { nama: "Espresso", deskripsi: "Double shot single origin Gayo", harga: 18000, kategori: "Minuman" },
  { nama: "Americano", deskripsi: "Espresso dengan air panas, ringan & bersih", harga: 22000, kategori: "Minuman" },
  { nama: "Cappuccino", deskripsi: "Perpaduan espresso dan susu berbusa lembut", harga: 28000, kategori: "Minuman" },
  { nama: "Kopi Susu", deskripsi: "Signature: espresso, susu segar, gula aren", harga: 25000, kategori: "Minuman" },
  { nama: "V60 Manual Brew", deskripsi: "Diseduh perlahan, cita rasa fruity", harga: 30000, kategori: "Minuman" },
  { nama: "Cafe Latte", deskripsi: "Espresso dengan susu steamed, creamy & smooth", harga: 28000, kategori: "Minuman" },
  { nama: "Es Kopi Susu", deskripsi: "Kopi dingin, susu segar, gula aren, es batu", harga: 25000, kategori: "Minuman" },
  { nama: "Matcha Latte", deskripsi: "Matcha premium dengan susu segar", harga: 30000, kategori: "Minuman" },
  { nama: "Es Teh Manis", deskripsi: "Teh manis dingin, segar & klasik", harga: 10000, kategori: "Minuman" },
  { nama: "Butter Croissant", deskripsi: "Panggang renyah, cocok teman kopi", harga: 22000, kategori: "Makanan" },
  { nama: "Nasi Goreng", deskripsi: "Nasi goreng dengan telur mata sapi & kerupuk", harga: 28000, kategori: "Makanan" },
  { nama: "Roti Bakar Cokelat", deskripsi: "Roti gandum panggang, selai cokelat, keju parut", harga: 20000, kategori: "Makanan" },
  { nama: "Pisang Goreng Keju", deskripsi: "Pisang goreng renyah, taburan keju & condensed milk", harga: 18000, kategori: "Makanan" },
  { nama: "Kentang Goreng", deskripsi: "Kentang goreng renyah dengan saus sambal", harga: 18000, kategori: "Makanan" },
  { nama: "Ayam Geprek", deskripsi: "Ayam goreng crispy dengan sambal geprek pedas", harga: 28000, kategori: "Makanan" },
];

const GALERI_AWAL = [
  "Suasana interior kedai",
  "Barista menuang latte art",
  "Cangkir kopi di atas meja kayu",
  "Pelanggan menikmati kopi",
  "Proses seduh manual brew",
  "Croissant dan kopi",
];

function flag(nama: string): string | undefined {
  const a = process.argv.find((x) => x.startsWith(`--${nama}=`));
  return a?.split("=").slice(1).join("=");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tidak ditemukan di environment.");
    process.exit(1);
  }
  const db = drizzle(neon(process.env.DATABASE_URL));

  const nama = flag("nama") || process.env.CLIENT_NAMA?.trim() || "Kopi Senja";
  const tagline =
    flag("tagline") || process.env.CLIENT_TAGLINE?.trim() || "Secangkir hangat di akhir hari";
  const waNomor = (flag("wa") || process.env.CLIENT_WA?.trim() || "").replace(/\D/g, "");
  const alamat = flag("alamat") || process.env.CLIENT_ALAMAT?.trim() || "";
  const mapsRaw = flag("maps") || process.env.CLIENT_MAPS?.trim() || "";

  const email =
    flag("email") || process.env.ADMIN_EMAIL?.trim() || "";
  if (!email) {
    console.error("Tidak ada email admin. Set ADMIN_EMAIL atau berikan --email=...");
    process.exit(1);
  }

  // Tulis identitas (nama/tagline) ke placeholder produksi hanya sebagai referensi;
  // data publik membaca dari tabel `bisnis` & fallback kedai.ts — di sini kita simpan
  // ke tabel `bisnis`, karena itulah sumber data untuk landing page.
  const mapsEmbed = await ubahKeEmbedMaps(mapsRaw);
  if (mapsEmbed === null) {
    console.error("URL Google Maps tidak valid / tidak bisa dikonversi.");
    process.exit(1);
  }

  // 1. Data bisnis
  const [bisnisAda] = await db.select().from(bisnis).limit(1);
  if (bisnisAda) {
    await db
      .update(bisnis)
      .set({ waNomor, waTeks: "", mapsEmbed, alamat, updatedAt: new Date() })
      .where(eq(bisnis.id, bisnisAda.id));
    console.log("[setup] data bisnis diperbarui.");
  } else {
    await db
      .insert(bisnis)
      .values({ waNomor, waTeks: "", mapsEmbed, alamat });
    console.log("[setup] data bisnis dibuat.");
  }

  // 2. Jam buka
  await db.delete(jamBuka);
  const jamList = [
    { hari: "Senin – Jumat", jam: "08.00 – 22.00", urutan: 0 },
    { hari: "Sabtu – Minggu", jam: "07.00 – 23.00", urutan: 1 },
  ];
  await db.insert(jamBuka).values(jamList);
  console.log("[setup] jam buka di-set.");

  // 3. Menu (hanya jika kosong — tidak menimpa data yang sudah ada)
  const menuAda = await db.select({ id: menuItems.id }).from(menuItems).limit(1);
  if (menuAda.length === 0) {
    await db
      .insert(menuItems)
      .values(
        MENU_AWAL.map((m, i) => ({ ...m, urutan: i + 1, gambarUrl: null }))
      );
    console.log(`[setup] ${MENU_AWAL.length} item menu awal di-seed (tanpa foto).`);
  } else {
    console.log("[setup] menu sudah berisi data — tidak menimpa.");
  }

  // 4. Galeri (placeholder tanpa gambar nyata — diisi via admin)
  const galeriAda = await db.select({ id: galleryItems.id }).from(galleryItems).limit(1);
  if (galeriAda.length === 0) {
    // placeholder: gambar dikosongkan; string alt saja sebagai petunjuk
    await db.insert(galleryItems).values(
      GALERI_AWAL.map((alt, i) => ({ alt, urutan: i + 1, gambarUrl: "" }))
    );
    console.log("[setup] galeri awal di-seed (alt saja, foto diisi via admin).");
  } else {
    console.log("[setup] galeri sudah berisi data — tidak menimpa.");
  }

  // 5. Akun admin
  const password = process.env.ADMIN_INITIAL_PASSWORD || buatPasswordAwal();
  const recoveryKey = `kopi-${acakHex(10)}-${acakHex(6)}`;
  const passwordHash = await hashSecret(password);
  const resetKeyHash = await hashSecret(recoveryKey);

  const rows = await db.select().from(adminCredentials).limit(1);
  if (rows.length > 0) {
    await db
      .update(adminCredentials)
      .set({ email, passwordHash, resetKeyHash, updatedAt: new Date() })
      .where(eq(adminCredentials.id, rows[0].id));
    console.log("[setup] akun admin diperbarui.");
  } else {
    await db
      .insert(adminCredentials)
      .values({ email, passwordHash, resetKeyHash });
    console.log("[setup] akun admin dibuat.");
  }

  console.log("\n========================================");
  console.log(" SETUP CLIENT SELESAI");
  console.log(` Nama        : ${nama}`);
  console.log(` Tagline     : ${tagline}`);
  console.log(` WhatsApp    : ${waNomor || "(kosong)"}`);
  console.log(` Alamat      : ${alamat || "(kosong)"}`);
  console.log("----------------------------------------");
  console.log(" KREDENSIAL ADMIN — SIMPAN & SERAHKAN (tampil sekali)");
  console.log(` URL Admin   : /admin`);
  console.log(` Email       : ${email}`);
  console.log(` Password    : ${password}`);
  console.log(` Recovery Key: ${recoveryKey}`);
  console.log("========================================");
  console.log("\nCatatan:");
  console.log(" - Foto menu/galeri belum di-set (di-seed tanpa gambar).");
  console.log("   Unggah foto milik klien lewat panel admin.");
  console.log(" - Nilai ini hanya ditampilkan SEKALI. Simpan di tempat aman.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Setup client gagal:", err);
    process.exit(1);
  });
