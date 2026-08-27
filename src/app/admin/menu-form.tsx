import { createItem, updateItem } from "./actions";
import { type MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS } from "@/lib/constants";

type Props = { item?: MenuItem };

const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20";

export function PesanError({ kode }: { kode?: string }) {
  if (!kode) return null;

  const pesan: Record<string, string> = {
    tipe: "File harus berupa gambar (JPG, PNG, atau WebP).",
    ukuran: "Ukuran foto maksimal 5 MB.",
    token:
      "Fitur foto belum aktif karena penyimpanan Vercel Blob belum terhubung. Menu tetap tersimpan tanpa foto — foto akan bisa diunggah setelah website di-deploy.",
    validasi: "Nama dan harga wajib diisi dengan benar.",
    foto: "Menu baru wajib memiliki foto.",
    upload: "Gagal meng-upload foto. Periksa koneksi dan coba lagi.",
  };

  return (
    <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {pesan[kode] ?? "Terjadi kesalahan. Coba lagi."}
    </p>
  );
}

export function MenuForm({ item }: Props) {
  const sedangEdit = Boolean(item);

  return (
    <form
      action={sedangEdit ? updateItem : createItem}
      className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label htmlFor="nama" className={labelClass}>
          Nama Menu *
        </label>
        <input
          id="nama"
          name="nama"
          required
          maxLength={80}
          defaultValue={item?.nama}
          placeholder="cth. Kopi Susu Senja"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="kategori" className={labelClass}>
            Kategori
          </label>
          <select
            id="kategori"
            name="kategori"
            defaultValue={item?.kategori ?? "Minuman"}
            className={inputClass}
          >
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="harga" className={labelClass}>
            Harga (Rp) *
          </label>
          <input
            id="harga"
            name="harga"
            type="number"
            required
            min={0}
            step={500}
            defaultValue={item?.harga}
            placeholder="25000"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="urutan" className={labelClass}>
            Urutan Tampil
          </label>
          <input
            id="urutan"
            name="urutan"
            type="number"
            min={0}
            defaultValue={item?.urutan ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="deskripsi" className={labelClass}>
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={2}
          maxLength={160}
          defaultValue={item?.deskripsi}
          placeholder="Deskripsi singkat menu..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="foto" className={labelClass}>
          Foto Menu {!sedangEdit && "*"}
        </label>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!sedangEdit}
          className="w-full rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
        />
        <p className="mt-1 text-xs text-stone-400">
          JPG/PNG/WebP, maksimal 5 MB.
        </p>

        {item?.gambarUrl && (
          <div className="mt-3">
            <div className="overflow-hidden rounded-xl border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.gambarUrl}
                alt={`Foto ${item.nama}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Foto saat ini. Biarkan kolom di atas kosong bila tidak ingin
              mengganti.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-stone-100 pt-5">
        <button
          type="submit"
          className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          {sedangEdit ? "Simpan Perubahan" : "Tambah Menu"}
        </button>
      </div>
    </form>
  );
}
