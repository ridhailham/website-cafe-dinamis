"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { db } from "@/db";
import { galleryItems, menuItems } from "@/db/schema";
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
  const uniqueId = crypto.randomUUID().slice(0, 8);

  try {
    const blob = await put(`menu/${slug}-${uniqueId}.${ekstensi}`, file, {
      access: "public",
    });
    return blob.url;
  } catch (err) {
    console.warn("[blob] Gagal meng-upload foto:", err);
    redirect(`${tujuanForm}?error=upload`);
  }
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

  if (!data.nama || !Number.isFinite(data.harga)) {
    redirect("/admin/baru?error=validasi");
  }

  const gambarUrl = await simpanFoto(formData, data.nama, "/admin/baru");
  if (!gambarUrl) redirect("/admin/baru?error=foto");

  await db.insert(menuItems).values({
    ...data,
    gambarUrl,
  });

  segarkanCache();
  redirect("/admin");
}

export async function updateItem(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const data = ambilData(formData);

  if (!Number.isInteger(id) || !data.nama || !Number.isFinite(data.harga)) {
    redirect(`/admin/edit/${formData.get("id")}?error=validasi`);
  }

  const [lama] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.id, id))
    .limit(1);

  if (!lama) notFound();

  const gambarUrl = await simpanFoto(
    formData,
    data.nama,
    `/admin/edit/${id}`
  );

  // Catatan: upload → update DB → delete lama. Jika crash setelah DB update
  // tapi sebelum delete, foto lama orphan. Acceptable untuk scale project ini.
  await db
    .update(menuItems)
    .set({
      ...data,
      updatedAt: new Date(),
      ...(gambarUrl && { gambarUrl }),
    })
    .where(eq(menuItems.id, id));

  if (gambarUrl) await hapusFotoLama(lama?.gambarUrl ?? null);

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

    await db.delete(menuItems).where(eq(menuItems.id, id));
    await hapusFotoLama(item?.gambarUrl ?? null);
    segarkanCache();
  }

  redirect("/admin");
}

async function simpanFotoGaleri(
  formData: FormData,
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
    redirect(`${tujuanForm}?error=token`);
  }

  const ekstensi =
    (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const uniqueId = crypto.randomUUID().slice(0, 8);

  try {
    const blob = await put(`galeri/suasana-${uniqueId}.${ekstensi}`, file, {
      access: "public",
    });
    return blob.url;
  } catch (err) {
    console.warn("[blob] Gagal meng-upload foto galeri:", err);
    redirect(`${tujuanForm}?error=upload`);
  }
}

export async function tambahGaleri(formData: FormData) {
  await assertAdmin();

  const gambarUrl = await simpanFotoGaleri(formData, "/admin/galeri/baru");
  if (!gambarUrl) redirect("/admin/galeri/baru?error=foto");

  const urutan = Math.round(Number(formData.get("urutan")) || 0);
  const alt = String(formData.get("alt") ?? "").trim();

  await db.insert(galleryItems).values({ gambarUrl, alt, urutan });

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}

export async function hapusGaleri(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));

  if (Number.isInteger(id)) {
    const [item] = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, id))
      .limit(1);

    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    await hapusFotoLama(item?.gambarUrl ?? null);
    revalidatePath("/");
    revalidatePath("/admin/galeri");
  }

  redirect("/admin/galeri");
}

export async function ubahGaleri(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 80);
  const urutan = Math.round(Number(formData.get("urutan")) || 0);

  if (!Number.isInteger(id)) {
    redirect(`/admin/galeri/${formData.get("id")}/edit?error=validasi`);
  }

  const [lama] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1);
  if (!lama) notFound();

  const gambarUrl = await simpanFotoGaleri(formData, `/admin/galeri/${id}/edit`);

  await db
    .update(galleryItems)
    .set({ alt, urutan, ...(gambarUrl && { gambarUrl }) })
    .where(eq(galleryItems.id, id));

  if (gambarUrl) await hapusFotoLama(lama.gambarUrl);

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}
