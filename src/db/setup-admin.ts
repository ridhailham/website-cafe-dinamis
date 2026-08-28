import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { adminCredentials } from "./schema";
import { acakHex, buatPasswordAwal, hashSecret } from "@/lib/kripto";

config({ path: ".env.local" });
config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tidak ditemukan di environment.");
    process.exit(1);
  }

  const emailArg =
    process.argv.find((a) => a.startsWith("--email="))?.split("=")[1] ?? "";
  const email = emailArg || process.env.ADMIN_EMAIL || "";
  if (!email) {
    console.error(
      "Tidak ada email. Set env ADMIN_EMAIL atau berikan argumen --email=..."
    );
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL));

  const password =
    process.env.ADMIN_INITIAL_PASSWORD || buatPasswordAwal();
  const recoveryKey = `kopi-${acakHex(10)}-${acakHex(6)}`;

  const passwordHash = await hashSecret(password);
  const resetKeyHash = await hashSecret(recoveryKey);

  const rows = await db.select().from(adminCredentials).limit(1);
  if (rows.length > 0) {
    const id = rows[0].id;
    await db
      .update(adminCredentials)
      .set({ email, passwordHash, resetKeyHash, updatedAt: new Date() })
      .where(eq(adminCredentials.id, id));
    console.log("[setup] admin_credentials diperbarui (id " + id + ").");
  } else {
    await db
      .insert(adminCredentials)
      .values({ email, passwordHash, resetKeyHash });
    console.log("[setup] admin_credentials dibuat.");
  }

  console.log("\n========================================");
  console.log(" KREDENSIAL ADMIN — SIMPAN & SERAHKAN");
  console.log("========================================");
  console.log(` URL Admin  : /admin`);
  console.log(` Email      : ${email}`);
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
