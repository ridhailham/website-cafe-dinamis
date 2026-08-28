import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// Hash secret (password / recovery key) dengan scrypt + salt acak.
// Format: scrypt$N$r$p$saltHex$hashHex
export async function hashSecret(value: string): Promise<string> {
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

export async function verifikasiSecret(
  value: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, , , , saltHex, hashHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(value, salt, expected.length)) as Buffer;
  return (
    expected.length === derived.length && timingSafeEqual(expected, derived)
  );
}

export function acakHex(panjang: number): string {
  return randomBytes(panjang).toString("hex");
}

const KATA = [
  "kopi",
  "senja",
  "hangat",
  "pagi",
  "malam",
  "alam",
  "teman",
  "cerita",
];

// Kata acak yang mudah dibaca manusia untuk password awal.
export function acakBaca(): string {
  return KATA[Math.floor(Math.random() * KATA.length)];
}

// Password awal: gabungan 2 kata acak + 4 karakter hex.
export function buatPasswordAwal(): string {
  return `${acakBaca()}-${acakBaca()}-${acakHex(2)}`;
}
