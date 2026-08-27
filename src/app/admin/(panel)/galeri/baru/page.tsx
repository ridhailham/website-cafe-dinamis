import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { tambahGaleri } from "../../../actions";
import { PesanError } from "../../../menu-form";

export const metadata = {
  title: "Tambah Foto Galeri — Admin Kopi Senja",
};

export default async function TambahGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/galeri"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar galeri
      </Link>

      <h1 className="mb-6 text-xl font-bold text-stone-900">
        Tambah Foto Galeri
      </h1>

      <PesanError kode={error} />

      <form
        action={tambahGaleri}
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="foto" className="mb-1 block text-sm font-medium text-stone-700">
            Foto *{" "}
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
          />
          <p className="mt-1 text-xs text-stone-400">
            JPG/PNG/WebP, maksimal 5 MB.
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
            defaultValue={0}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
          />
        </div>

        <div className="flex items-center justify-end border-t border-stone-100 pt-5">
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Simpan Foto
          </button>
        </div>
      </form>
    </div>
  );
}
