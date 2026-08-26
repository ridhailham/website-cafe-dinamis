"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { createSession, destroySession, verifySessionFromToken } from "@/lib/auth";

const COOKIE_NAME = "kopi_session";
const MAX_FOTO_BYTES = 5 * 1024 * 1024;

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

// Simpan foto ke Vercel Blob. Mengembalikan URL, atau null jika tidak ada
// file / fitur belum terhubung (tanpa token). Gagal validasi melempar redirect.
async function simpanFoto(
  formData: FormData,
  namaMenu: string,
  tujuanForm: string
): Promise<string | null> {
  const file = formData.get("foto");

  if (!(file instanceof File) || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    redirect(`${tujuanForm}?error=tipe`);
  }
  if (file.size > MAX_FOTO_BYTES) {
    redirect(`${tujuanForm}?error=ukuran`);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(
      "[blob] BLOB_READ_WRITE_TOKEN belum tersedia — menu disimpan tanpa foto."
    );
    redirect(`${tujuanForm}?error=token`);
  }

  const bersih = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = bersih(namaMenu) || "menu";
  const ekstensi =
    (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";

  const blob = await put(`menu/${slug}-${Date.now()}.${ekstensi}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

async function hapusFotoLama(gambarUrl: string | null) {
  if (!gambarUrl) return;
  try {
    await del(gambarUrl);
  } catch (err) {
    console.warn("[blob] Gagal menghapus foto lama:", err);
  }
}

export async function createItem(formData: FormData) {
  await assertAdmin();
  const data = ambilData(formData);

  if (!data.nama || !Number.isFinite(data.harga)) redirect("/admin/baru");

  const gambarUrl = await simpanFoto(formData, data.nama, "/admin/baru");

  await db.insert(menuItems).values({
    ...data,
    ...(gambarUrl && { gambarUrl }),
  });

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

  const [lama] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.id, id))
    .limit(1);

  const gambarUrl = await simpanFoto(
    formData,
    data.nama,
    `/admin/edit/${id}`
  );

  if (gambarUrl) await hapusFotoLama(lama?.gambarUrl ?? null);

  await db
    .update(menuItems)
    .set({
      ...data,
      updatedAt: new Date(),
      ...(gambarUrl && { gambarUrl }),
    })
    .where(eq(menuItems.id, id));

  segarkanCache();
  redirect("/admin");
}

export async function deleteItem(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));

  if (Number.isInteger(id)) {
    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);

    await hapusFotoLama(item?.gambarUrl ?? null);
    await db.delete(menuItems).where(eq(menuItems.id, id));
    segarkanCache();
  }

  redirect("/admin");
}
