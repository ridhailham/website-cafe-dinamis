"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { updateBisnis } from "./actions";
import type { Bisnis, JamBuka } from "@/db/schema";

type Props = {
  bisnis?: Bisnis;
  jamBuka?: JamBuka[];
};

const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20";

let idBaris = 0;

export function BisnisForm({ bisnis, jamBuka = [] }: Props) {
  const [daftarJam, setDaftarJam] = useState<{ id: number; hari: string; jam: string }[]>(
    () =>
      jamBuka.length > 0
        ? jamBuka.map((j) => ({ id: idBaris++, hari: j.hari, jam: j.jam }))
        : [{ id: idBaris++, hari: "", jam: "" }]
  );

  const tambahJam = () =>
    setDaftarJam((prev) => [...prev, { id: idBaris++, hari: "", jam: "" }]);
  const hapusJam = (id: number) =>
    setDaftarJam((prev) => prev.filter((r) => r.id !== id));

  return (
    <form
      action={updateBisnis}
      className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="waNomor" className={labelClass}>
            Nomor WhatsApp *
          </label>
          <input
            id="waNomor"
            name="waNomor"
            type="text"
            required
            inputMode="tel"
            defaultValue={bisnis?.waNomor}
            placeholder="cth. 6281234567890"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-stone-400">
            Format internasional tanpa tanda +. Contoh: 6281234567890.
          </p>
        </div>

        <div>
          <label htmlFor="waTeks" className={labelClass}>
            Teks Pesan WA
          </label>
          <input
            id="waTeks"
            name="waTeks"
            type="text"
            maxLength={200}
            defaultValue={bisnis?.waTeks}
            placeholder="cth. Halo Kopi Senja! Saya mau tanya-tanya."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="mapsEmbed" className={labelClass}>
          Link Peta Google Maps
        </label>
        <input
          id="mapsEmbed"
          name="mapsEmbed"
          type="text"
          defaultValue={bisnis?.mapsEmbed}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-stone-400">
          Tempel link embed (berisi /maps/embed?pb=...). Kosongkan untuk
          menyembunyikan peta.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Hari &amp; Jam Buka</p>
        <div className="space-y-2">
          {daftarJam.map((baris) => (
            <div key={baris.id} className="flex items-center gap-2">
              <input
                name="jam_hari"
                type="text"
                defaultValue={baris.hari}
                placeholder="cth. Senin – Jumat"
                className={`${inputClass} flex-1`}
              />
              <input
                name="jam_jam"
                type="text"
                defaultValue={baris.jam}
                placeholder="cth. 08.00 – 22.00"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => hapusJam(baris.id)}
                disabled={daftarJam.length === 1}
                aria-label="Hapus baris jam"
                className="shrink-0 rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={tambahJam}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
        >
          <Plus className="h-4 w-4" />
          Tambah Baris
        </button>
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
  );
}
