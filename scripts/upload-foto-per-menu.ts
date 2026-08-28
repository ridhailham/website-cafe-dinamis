import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { menuItems } from "../src/db/schema";

const PATH_FOTO = "/Users/ridhailhamadisetyawan/Screenshoot/menu-kopi-senja.png";

const bersih = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN belum ada di .env.local");
  }
  const db = drizzle(neon(process.env.DATABASE_URL!));
  const buffer = readFileSync(PATH_FOTO);
  const menu = await db.select().from(menuItems);
  console.log(`Memproses ${menu.length} menu, file ${Math.round(buffer.length / 1024)} kB`);

  let sukses = 0;
  let gagal = 0;
  for (const m of menu) {
    const slug = bersih(m.nama) || "menu";
    const pathname = `menu/${slug}-${m.id}.png`;
    try {
      const blob = await put(pathname, buffer, {
        access: "public",
        contentType: "image/png",
        allowOverwrite: true,
      });
      await db
        .update(menuItems)
        .set({ gambarUrl: blob.url })
        .where(eq(menuItems.id, m.id));
      sukses++;
    } catch (err) {
      gagal++;
      console.warn(`Gagal ${m.id} (${m.nama}):`, (err as Error).message);
    }
  }

  const rows = await db.select().from(menuItems);
  const unik = new Set(rows.map((r) => r.gambarUrl).filter(Boolean)).size;
  const kosong = rows.filter((r) => !r.gambarUrl).length;
  console.log(`Selesai: sukses=${sukses}, gagal=${gagal}`);
  console.log(`Total menu=${rows.length}, URL unik=${unik}, masih kosong=${kosong}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Gagal:", err);
    process.exit(1);
  });
