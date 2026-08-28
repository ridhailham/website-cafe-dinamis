import { put, del } from "@vercel/blob";
import { redirect } from "next/navigation";

export const MAX_FOTO_BYTES = 5 * 1024 * 1024;

// Simpan foto ke Vercel Blob. Mengembalikan URL, atau null jika tidak ada file.
// Gagal validasi melempar redirect ke tujuanForm dengan query error.
// `pathPrefix` menentukan folder tujuan (mis. "menu" atau "galeri/suasana");
// `nama` (opsional, hanya untuk path "menu") menjadi slug nama file.
export async function simpanFoto(
  formData: FormData,
  pathPrefix: string,
  tujuanForm: string,
  nama?: string
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

  const bersih = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const slug = nama ? bersih(nama) || "menu" : "suasana";
  const ekstensi =
    (file.name.split(".").pop() ?? "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";
  const uniqueId = crypto.randomUUID().slice(0, 8);

  try {
    const blob = await put(
      `${pathPrefix}/${slug}-${uniqueId}.${ekstensi}`,
      file,
      { access: "public" }
    );
    return blob.url;
  } catch (err) {
    console.warn("[blob] Gagal meng-upload foto:", err);
    redirect(`${tujuanForm}?error=upload`);
  }
}

export async function hapusFotoLama(gambarUrl: string | null) {
  if (!gambarUrl) return;
  try {
    await del(gambarUrl);
  } catch (err) {
    console.warn("[blob] Gagal menghapus foto lama:", err);
  }
}
