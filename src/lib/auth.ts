import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "kopi_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET belum diset. Tambahkan di Vercel Environment Variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function verifySessionFromToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { email: string };
  } catch {
    return null;
  }
}
