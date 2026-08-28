import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { DeleteGalleryButton } from "../../delete-gallery-button";
import { AdminToast, pesanOk } from "../../alert";

export const metadata = {
  title: "Kelola Galeri — Admin Kopi Senja",
};

export default async function AdminGaleri({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const sukses = pesanOk(ok);
  const items = await db
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.urutan), asc(galleryItems.id));

  return (
    <div>
      {sukses && <AdminToast type="success" pesan={sukses} />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Kelola Galeri</h1>
          <p className="mt-1 text-sm text-stone-500">
            {items.length} foto tampil di halaman galeri.
          </p>
        </div>
        <Link
          href="/admin/galeri/baru"
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Foto
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-500 shadow-sm">
          Belum ada foto galeri. Klik &ldquo;Tambah Foto&rdquo; untuk mulai.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.gambarUrl}
                alt={item.alt || "Foto galeri"}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <p className="truncate text-sm font-medium text-stone-900">
                  {item.alt || "(tanpa keterangan)"}
                </p>
                <p className="text-xs text-stone-400">Urutan: {item.urutan}</p>
                <div className="flex items-center gap-1 pt-2">
                  <Link
                    href={`/admin/galeri/${item.id}/edit`}
                    aria-label="Edit foto"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50 hover:text-amber-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <div className="ml-auto">
                    <DeleteGalleryButton id={item.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
