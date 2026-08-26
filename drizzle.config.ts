import fs from "node:fs";
import { defineConfig } from "drizzle-kit";

function loadEnvFile(path: string) {
  try {
    const content = fs.readFileSync(path, "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2]?.replace(/^["']|["']$/g, "") ?? "";
      }
    }
  } catch {
    // file tidak ada — abaikan
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
