import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { galleryItems } from "../src/db/schema";

const PATH_FOTO = "/Users/ridhailhamadisetyawan/Screenshoot/fotosuasanacafe.jpeg";
const ALT = "Suasana di Kopi Senja";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN belum ada di .env.local");
  }
  const db = drizzle(neon(process.env.DATABASE_URL!));
  const buffer = readFileSync(PATH_FOTO);
  const galeri = await db.select().from(galleryItems);
  console.log(`Proses ${galeri.length} foto galeri, file ${Math.round(buffer.length / 1024)} kB`);

  if (galeri.length === 0) {
    console.log("Tidak ada foto galeri untuk diganti.");
    return;
  }

  let sukses = 0;
  for (const g of galeri) {
    const pathname = `galeri/suasana-${g.id}.jpeg`;
    try {
      const blob = await put(pathname, buffer, {
        access: "public",
        contentType: "image/jpeg",
        allowOverwrite: true,
      });
      await db
        .update(galleryItems)
        .set({ gambarUrl: blob.url, alt: ALT })
        .where(eq(galleryItems.id, g.id));
      sukses++;
    } catch (err) {
      console.warn(`Gagal id ${g.id}:`, (err as Error).message);
    }
  }

  const rows = await db.select().from(galleryItems);
  const unsplashLeft = rows.filter((r) => r.gambarUrl.includes("unsplash")).length;
  const blob = rows.filter((r) => r.gambarUrl.includes("blob.vercel-storage.com")).length;
  console.log(`Selesai: sukses=${sukses} | total=${rows.length} | masih unsplash=${unsplashLeft} | pakai blob=${blob}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Gagal:", err);
    process.exit(1);
  });
