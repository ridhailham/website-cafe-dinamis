"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { eq, and, gt } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { db } from "@/db";
import {
  adminCredentials,
  bisnis,
  galleryItems,
  jamBuka,
  loginAttempts,
  menuItems,
  sessions,
} from "@/db/schema";
import {
  createSession,
  destroySession,
  getActiveSession,
  hashSecret,
  verifikasiSecret,
  revokeAllSessionsExceptCurrent,
} from "@/lib/auth";
import { KATEGORI_OPTIONS, type Kategori } from "@/lib/constants";

const MAX_FOTO_BYTES = 5 * 1024 * 1024;

export type LoginState = { error?: string };

async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const realIp = h.get("x-real-ip");
  return realIp ?? "unknown";
}

// Rate limit: maks 5 percobaan gagal per 15 menit per email+IP.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

async function blokirRateLimit(email: string, ip: string): Promise<boolean> {
  const sejak = new Date(Date.now() - WINDOW_MS);
  const count = await db
    .select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.ip, ip),
        gt(loginAttempts.failedAt, sejak)
      )
    );
  return count.length >= MAX_ATTEMPTS;
}

async function catatPercobaanGagal(email: string, ip: string) {
  await db.insert(loginAttempts).values({ email, ip });
}

async function bersihkanPercobaan(email: string, ip: string) {
  await db
    .delete(loginAttempts)
    .where(and(eq(loginAttempts.email, email), eq(loginAttempts.ip, ip)));
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ip = await getClientIp();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (await blokirRateLimit(email, ip)) {
    return {
      error:
        "Terlalu banyak percobaan gagal. Silakan coba lagi dalam 15 menit.",
    };
  }

  const creds = await db.select().from(adminCredentials).limit(1);
  const cred = creds[0];

  if (!cred) {
    return {
      error:
        "Akun admin belum diinisialisasi. Jalankan skrip setup terlebih dahulu.",
    };
  }

  const emailBenar =
    cred.email && email.toLowerCase() === cred.email.toLowerCase();
  const passwordBenar = await verifikasiSecret(password, cred.passwordHash);

  if (!emailBenar || !passwordBenar) {
    await catatPercobaanGagal(email, ip);
    return { error: "Email atau password salah." };
  }

  await bersihkanPercobaan(email, ip);
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

async function assertAdmin() {
  const ok = await getActiveSession();
  if (!ok) redirect("/admin/login");
}

export type ResetState = { error?: string; ok?: boolean; key?: string };

export async function resetViaRecoveryAction(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const recoveryKey = String(formData.get("recoveryKey") ?? "").trim();
  const passwordBaru = String(formData.get("password") ?? "");
  const konfirmasi = String(formData.get("konfirmasi") ?? "");

  if (!recoveryKey || !passwordBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }
  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }
  if (passwordBaru !== konfirmasi) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const creds = await db.select().from(adminCredentials).limit(1);
  const cred = creds[0];
  if (!cred) {
    return { error: "Akun admin belum diinisialisasi." };
  }

  const cocok = await verifikasiSecret(recoveryKey, cred.resetKeyHash);
  if (!cocok) {
    return { error: "Recovery key salah." };
  }

  const passwordHash = await hashSecret(passwordBaru);
  const resetKeyBaru = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  const resetKeyHashBaru = await hashSecret(resetKeyBaru);

  await db
    .update(adminCredentials)
    .set({
      passwordHash,
      resetKeyHash: resetKeyHashBaru,
      updatedAt: new Date(),
    })
    .where(eq(adminCredentials.id, cred.id));

  // Recovery key lama sudah terpakai — cabut semua session lama.
  await db.delete(sessions);

  return { ok: true, key: resetKeyBaru };
}

export type SandiState = { error?: string; ok?: boolean };

export async function ubahSandiAction(
  _prev: SandiState,
  formData: FormData
): Promise<SandiState> {
  await assertAdmin();

  const sandiLama = String(formData.get("sandiLama") ?? "");
  const sandiBaru = String(formData.get("sandiBaru") ?? "");
  const konfirmasi = String(formData.get("konfirmasi") ?? "");

  if (!sandiLama || !sandiBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }
  if (sandiBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }
  if (sandiBaru !== konfirmasi) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const creds = await db.select().from(adminCredentials).limit(1);
  const cred = creds[0];
  if (!cred) {
    return { error: "Akun admin belum diinisialisasi." };
  }

  const cocok = await verifikasiSecret(sandiLama, cred.passwordHash);
  if (!cocok) {
    return { error: "Password lama salah." };
  }

  const passwordHash = await hashSecret(sandiBaru);
  await db
    .update(adminCredentials)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(adminCredentials.id, cred.id));

  return { ok: true };
}

export type EmailState = { error?: string; ok?: boolean };

export async function ubahEmailAction(
  _prev: EmailState,
  formData: FormData
): Promise<EmailState> {
  await assertAdmin();

  const emailBaru = String(formData.get("emailBaru") ?? "").trim();
  const sandi = String(formData.get("sandi") ?? "");

  if (!emailBaru || !sandi) {
    return { error: "Email dan sandi wajib diisi." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBaru)) {
    return { error: "Format email tidak valid." };
  }

  const creds = await db.select().from(adminCredentials).limit(1);
  const cred = creds[0];
  if (!cred) {
    return { error: "Akun admin belum diinisialisasi." };
  }

  const cocok = await verifikasiSecret(sandi, cred.passwordHash);
  if (!cocok) {
    return { error: "Sandi salah." };
  }

  await db
    .update(adminCredentials)
    .set({ email: emailBaru, updatedAt: new Date() })
    .where(eq(adminCredentials.id, cred.id));

  return { ok: true };
}

export type RecoveryState = { error?: string; key?: string };

export async function regenerateRecoveryAction(
  _prev: RecoveryState,
  _formData: FormData
): Promise<RecoveryState> {
  void _prev;
  void _formData;
  await assertAdmin();

  const creds = await db.select().from(adminCredentials).limit(1);
  const cred = creds[0];
  if (!cred) {
    return { error: "Akun admin belum diinisialisasi." };
  }

  const resetKeyBaru = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  const resetKeyHashBaru = await hashSecret(resetKeyBaru);

  await db
    .update(adminCredentials)
    .set({ resetKeyHash: resetKeyHashBaru, updatedAt: new Date() })
    .where(eq(adminCredentials.id, cred.id));

  return { key: resetKeyBaru };
}

export async function logoutSemuaPerangkatAction() {
  await assertAdmin();
  await revokeAllSessionsExceptCurrent();
  redirect("/admin/pengaturan?ok=logout_all");
}

function ambilData(formData: FormData) {
  const kategoriRaw = String(formData.get("kategori") ?? "Minuman").trim();
  const kategori: Kategori = KATEGORI_OPTIONS.includes(kategoriRaw as Kategori)
    ? (kategoriRaw as Kategori)
    : "Minuman";

  return {
    nama: String(formData.get("nama") ?? "").trim().slice(0, 80),
    deskripsi: String(formData.get("deskripsi") ?? "").trim().slice(0, 160),
    harga: Math.round(Number(formData.get("harga"))),
    kategori,
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

  if (
    !data.nama ||
    !Number.isFinite(data.harga) ||
    data.harga < 0 ||
    data.harga > 100_000_000
  ) {
    redirect("/admin/baru?error=validasi");
  }

  const gambarUrl = await simpanFoto(formData, data.nama, "/admin/baru");
  if (!gambarUrl) redirect("/admin/baru?error=foto");

  await db.insert(menuItems).values({
    ...data,
    gambarUrl,
  });

  segarkanCache();
  redirect("/admin?ok=menu_tambah");
}

export async function updateItem(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const data = ambilData(formData);

  if (
    !Number.isInteger(id) ||
    !data.nama ||
    !Number.isFinite(data.harga) ||
    data.harga < 0 ||
    data.harga > 100_000_000
  ) {
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
  redirect("/admin?ok=menu_ubah");
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

  redirect("/admin?ok=menu_hapus");
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
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 80);

  await db.insert(galleryItems).values({ gambarUrl, alt, urutan });

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri?ok=galeri_tambah");
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

  redirect("/admin/galeri?ok=galeri_hapus");
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
  redirect("/admin/galeri?ok=galeri_ubah");
}

function ekstrakKoordinat(url: string): string | null {
  const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return `${m[1]},${m[2]}`;
  const ll = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (ll) return `${ll[1]},${ll[2]}`;
  return null;
}

// Mengubah berbagai bentuk URL Google Maps menjadi URL yang bisa di-render
// di dalam <iframe>. Mengembalikan null jika tidak bisa dikonversi.
async function ubahKeEmbedMaps(url: string): Promise<string | null> {
  const bersih = url.trim();
  if (!bersih) return "";

  // Sudah berupa link embed — pakai apa adanya.
  if (
    bersih.includes("/maps/embed?") ||
    bersih.includes("output=embed")
  ) {
    return bersih;
  }

  // Bukan URL Google Maps — tolak.
  if (!/^(https?:\/\/)([a-z0-9-]+\.)?google\.(com|co\.id)\//i.test(bersih)) {
    return null;
  }

  let target = bersih;

  // Resolve short-link maps.app.goo.gl ke URL final.
  if (/maps\.app\.goo\.gl\//i.test(target)) {
    try {
      const res = await fetch(target, {
        method: "HEAD",
        redirect: "follow",
      });
      target = res.url || target;
    } catch {
      return null;
    }
  }

  if (target.includes("/maps/embed?") || target.includes("output=embed")) {
    return target;
  }

  // Ambil koordinat lalu bangun embed via ?q=LAT,LNG&output=embed.
  const koordinat = ekstrakKoordinat(target);
  if (koordinat) {
    return `https://www.google.com/maps?q=${koordinat}&output=embed`;
  }

  // Ambil query ?q=... lalu tambahkan output=embed.
  const q = target.match(/[?&]q=([^&]+)/);
  if (q) {
    return `https://www.google.com/maps?q=${q[1]}&output=embed`;
  }

  return null;
}

export async function updateBisnis(formData: FormData) {
  await assertAdmin();

  const waNomor = String(formData.get("waNomor") ?? "")
    .trim()
    .replace(/\D/g, "");
  const waTeks = String(formData.get("waTeks") ?? "").trim().slice(0, 200);
  const mapsRaw = String(formData.get("mapsEmbed") ?? "").trim();
  const alamat = String(formData.get("alamat") ?? "").trim().slice(0, 200);

  if (!waNomor) {
    redirect("/admin/bisnis?error=wa");
  }

  const mapsEmbed = await ubahKeEmbedMaps(mapsRaw);
  if (mapsEmbed === null) {
    redirect("/admin/bisnis?error=maps");
  }

  const hariArr = formData.getAll("jam_hari");
  const jamArr = formData.getAll("jam_jam");
  const jamList: { hari: string; jam: string }[] = hariArr
    .map((_, i) => ({
      hari: String(hariArr[i] ?? "").trim().slice(0, 40),
      jam: String(jamArr[i] ?? "").trim().slice(0, 40),
    }))
    .filter((j) => j.hari || j.jam);

  const [ada] = await db.select().from(bisnis).limit(1);

  if (ada) {
    await db
      .update(bisnis)
      .set({ waNomor, waTeks, mapsEmbed, alamat, updatedAt: new Date() })
      .where(eq(bisnis.id, ada.id));
  } else {
    await db.insert(bisnis).values({ waNomor, waTeks, mapsEmbed, alamat });
  }

  await db.delete(jamBuka);

  if (jamList.length > 0) {
    await db
      .insert(jamBuka)
      .values(jamList.map((j, i) => ({ ...j, urutan: i })));
  }

  revalidatePath("/");
  revalidatePath("/admin/bisnis");
  redirect("/admin/bisnis?ok=bisnis");
}
