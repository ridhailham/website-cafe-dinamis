import { createItem, updateItem } from "./actions";
import { type MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS } from "@/lib/constants";

type Props = { item?: MenuItem };

const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20";

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
            defaultValue={item?.kategori ?? "Kopi"}
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

      <div className="flex items-center justify-between border-t border-stone-100 pt-5">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            name="tersedia"
            defaultChecked={item ? item.tersedia : true}
            className="h-4 w-4 accent-amber-600"
          />
          Tampilkan di website
        </label>

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
