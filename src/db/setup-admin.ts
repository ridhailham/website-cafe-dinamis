import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { scrypt } from "node:crypto";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { adminCredentials } from "./schema";

const scryptAsync = promisify(scrypt);

config({ path: ".env.local" });
config();

async function hash(value: string): Promise<string> {
  const salt = randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const keyLength = 64;
  const derived = (await scryptAsync(value, salt, keyLength)) as Buffer;
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${derived.toString(
    "hex"
  )}`;
}

function acakHex(panjang: number): string {
  return randomBytes(panjang).toString("hex");
}

function acakBaca(): string {
  const kata = [
    "kopi",
    "senja",
    "hangat",
    "pagi",
    "malam",
    "alam",
    "teman",
    "cerita",
  ];
  return kata[Math.floor(Math.random() * kata.length)];
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tidak ditemukan di environment.");
    process.exit(1);
  }
  if (!process.env.ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL tidak ditemukan di environment.");
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL));

  const password =
    process.env.ADMIN_INITIAL_PASSWORD ||
    `${acakBaca()}-${acakBaca()}-${acakHex(2)}`;
  const recoveryKey = `kopi-${acakHex(10)}-${acakHex(6)}`;

  const passwordHash = await hash(password);
  const resetKeyHash = await hash(recoveryKey);

  const rows = await db.select().from(adminCredentials).limit(1);
  if (rows.length > 0) {
    const id = rows[0].id;
    await db
      .update(adminCredentials)
      .set({ passwordHash, resetKeyHash, updatedAt: new Date() })
      .where(eq(adminCredentials.id, id));
    console.log("[setup] admin_credentials diperbarui (id " + id + ").");
  } else {
    await db.insert(adminCredentials).values({ passwordHash, resetKeyHash });
    console.log("[setup] admin_credentials dibuat.");
  }

  console.log("\n========================================");
  console.log(" KREDENSIAL ADMIN — SIMPAN & SERAHKAN");
  console.log("========================================");
  console.log(` URL Admin  : /admin`);
  console.log(` Email      : ${process.env.ADMIN_EMAIL}`);
  console.log(` Password   : ${password}`);
  console.log(` Recovery Key : ${recoveryKey}`);
  console.log("========================================");
  console.log(
    "\nCatatan: nilai ini hanya ditampilkan SEKALI. Simpan di tempat aman."
  );
  console.log(
    "Recovery key dipakai saat lupa password (lewat 'Lupa password?' di login)."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
