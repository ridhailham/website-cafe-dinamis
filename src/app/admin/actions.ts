"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { createSession, destroySession, verifySessionFromToken } from "@/lib/auth";

const COOKIE_NAME = "kopi_session";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: "Email atau password salah." };
  }

  await createSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

async function assertAdmin() {
  const store = await cookies();
  const session = await verifySessionFromToken(
    store.get(COOKIE_NAME)?.value
  );
  if (!session) redirect("/admin/login");
}

function ambilData(formData: FormData) {
  return {
    nama: String(formData.get("nama") ?? "").trim(),
    deskripsi: String(formData.get("deskripsi") ?? "").trim(),
    harga: Math.round(Number(formData.get("harga"))),
    kategori: String(formData.get("kategori") ?? "Kopi"),
    tersedia: formData.get("tersedia") === "on",
    urutan: Math.round(Number(formData.get("urutan")) || 0),
  };
}

function segarkanCache() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createItem(formData: FormData) {
  await assertAdmin();
  const data = ambilData(formData);

  if (!data.nama || !Number.isFinite(data.harga)) redirect("/admin/baru");

  await db.insert(menuItems).values(data);
  segarkanCache();
  redirect("/admin");
}

export async function updateItem(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const data = ambilData(formData);

  if (!Number.isInteger(id) || !data.nama || !Number.isFinite(data.harga)) {
    redirect(`/admin/edit/${formData.get("id")}`);
  }

  await db
    .update(menuItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(menuItems.id, id));
  segarkanCache();
  redirect("/admin");
}

export async function deleteItem(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));

  if (Number.isInteger(id)) {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    segarkanCache();
  }

  redirect("/admin");
}
