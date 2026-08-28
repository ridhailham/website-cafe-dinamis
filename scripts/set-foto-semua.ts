import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { put } from "@vercel/blob";
import { menuItems } from "../src/db/schema";

config({ path: ".env.local" });
config();

const PATH_FOTO = "/Users/ridhailhamadisetyawan/Screenshoot/menu-kopi-senja.png";
const NAMA_BLOB = "menu/kopi-senja.png";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN belum ada di .env.local. " +
        "Tambahkan token asli dari dashboard Vercel " +
        "(Project → Settings → Environment Variables → BLOB_READ_WRITE_TOKEN), " +
        "bukan '[SENSITIVE]'."
    );
  }

  const db = drizzle(neon(process.env.DATABASE_URL!));

  const buffer = readFileSync(PATH_FOTO);
  console.log(
    `Membaca ${PATH_FOTO} (${Math.round(buffer.length / 1024)} kB)`
  );

  console.log("Meng-upload ke Vercel Blob...");
  const blob = await put(NAMA_BLOB, buffer, {
    access: "public",
    contentType: "image/png",
    allowOverwrite: true,
  });
  console.log(`URL Blob: ${blob.url}`);

  // Set gambar_url untuk SEMUA menu. Seluruh foto saat ini adalah placeholder
  // (null atau Unsplash), bukan foto asli — jadi aman menimpa semuanya agar
  // setiap kartu menampilkan foto yang diunggah.
  const hasil = await db.update(menuItems).set({ gambarUrl: blob.url });

  const list = await db.select().from(menuItems);
  const pakai = list.filter((m) => m.gambarUrl === blob.url).length;
  const belumAda = list.filter((m) => !m.gambarUrl).length;
  console.log(
    `Total menu: ${list.length} | memakai URL ini: ${pakai} | masih kosong: ${belumAda}`
  );
  void hasil;
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Set foto gagal:", err);
    process.exit(1);
  });
