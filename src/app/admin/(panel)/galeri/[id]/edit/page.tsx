import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { ubahGaleri } from "../../../../actions";
import { PesanError } from "../../../../menu-form";

export const metadata = {
  title: "Edit Foto Galeri — Admin Kopi Senja",
};

export default async function EditGaleriPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const itemId = Number(id);

  if (!Number.isInteger(itemId)) notFound();

  const [item] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, itemId))
    .limit(1);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/galeri"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar galeri
      </Link>

      <h1 className="mb-6 text-xl font-bold text-stone-900">Edit Foto Galeri</h1>

      <PesanError kode={error} />

      <form
        action={ubahGaleri}
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={item.id} />

        <div className="overflow-hidden rounded-xl border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.gambarUrl}
            alt={item.alt || "Foto galeri"}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div>
          <label htmlFor="foto" className="mb-1 block text-sm font-medium text-stone-700">
            Ganti Foto (opsional)
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
          />
          <p className="mt-1 text-xs text-stone-400">
            Kosongkan jika tidak ingin mengganti. Maksimal 5 MB.
          </p>
        </div>

        <div>
          <label htmlFor="alt" className="mb-1 block text-sm font-medium text-stone-700">
            Keterangan
          </label>
          <input
            id="alt"
            name="alt"
            maxLength={80}
            defaultValue={item.alt}
            placeholder="cth. Suasana interior kedai"
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
          />
        </div>

        <div>
          <label htmlFor="urutan" className="mb-1 block text-sm font-medium text-stone-700">
            Urutan Tampil
          </label>
          <input
            id="urutan"
            name="urutan"
            type="number"
            min={0}
            defaultValue={item.urutan}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
          />
          <p className="mt-1 text-xs text-stone-400">
            Nilai lebih kecil tampil lebih awal. Anda juga bisa mengatur urutan
            dari daftar galeri.
          </p>
        </div>

        <div className="flex items-center justify-end border-t border-stone-100 pt-5">
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
