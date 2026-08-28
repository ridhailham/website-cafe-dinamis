import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";

const scryptAsync = promisify(scrypt);

const COOKIE_NAME = "kopi_session";
const SESSION_IDLE_MS = 60 * 60 * 24 * 30; // 30 hari tanpa pemakaian
const SESSION_MAX_MS = 60 * 60 * 24 * 90; // 90 hari maksimal sejak dibuat

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET belum diset. Tambahkan di Vercel Environment Variables."
    );
  }
  return new TextEncoder().encode(secret);
}

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

export async function createSession() {
  const sessionId = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_IDLE_MS);

  await db.insert(sessions).values({ id: sessionId, expiresAt });

  const token = await new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_MS,
    path: "/",
  });

  return sessionId;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  store.delete(COOKIE_NAME);
  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sid = payload.sid as string | undefined;
    if (sid) {
      await db.delete(sessions).where(eq(sessions.id, sid));
    }
  } catch {
    // token tak valid — abaikan, cookie sudah dihapus
  }
}

// Cek apakah session aktif di DB. Perpanjang idle expiry bila masih dipakai.
export async function getActiveSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  let sid: string | undefined;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    sid = payload.sid as string | undefined;
  } catch {
    return false;
  }
  if (!sid) return false;

  const now = new Date();
  const [rows] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sid))
    .limit(1);

  if (!rows) return false;
  if (rows.expiresAt <= now) {
    await db.delete(sessions).where(eq(sessions.id, sid));
    return false;
  }

  const sisaIdle = rows.expiresAt.getTime() - now.getTime();
  if (sisaIdle < SESSION_IDLE_MS / 2) {
    await db
      .update(sessions)
      .set({ expiresAt: new Date(now.getTime() + SESSION_IDLE_MS) })
      .where(eq(sessions.id, sid));
  }
  await db
    .update(sessions)
    .set({ lastUsedAt: now })
    .where(eq(sessions.id, sid));

  return true;
}

// Keluar dari semua perangkat kecuali session yang sedang aktif.
export async function revokeAllSessionsExceptCurrent() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  let sid: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey());
      sid = (payload.sid as string) ?? null;
    } catch {
      sid = null;
    }
  }
  if (sid) {
    await db.delete(sessions).where(ne(sessions.id, sid));
  } else {
    await db.delete(sessions);
  }
}
