"use client";

import { useRef, useState } from "react";
import { tambahGaleri, ubahGaleri } from "./actions";
import { type GalleryItem } from "@/db/schema";
import { ConfirmDialog } from "./confirm-dialog";

type Props = { item?: GalleryItem };

const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const inputClass =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20";

function cekRasio4x3(url: string, cb: (ok: boolean) => void) {
  const img = new Image();
  img.onload = () => {
    const rasio = img.width / img.height;
    cb(Math.abs(rasio - 4 / 3) <= 4 / 3 * 0.1);
  };
  img.onerror = () => cb(true);
  img.src = url;
}

export function GaleriForm({ item }: Props) {
  const sedangEdit = Boolean(item);
  const [preview, setPreview] = useState<string | null>(null);
  const [peringatan, setPeringatan] = useState(false);
  const [mintaSimpan, setMintaSimpan] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const terkonfirmasi = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFoto = () => {
    const file = fileRef.current?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      cekRasio4x3(url, setPeringatan);
      setPreview((prev) => {
        if (prev && prev !== url) URL.revokeObjectURL(prev);
        return url;
      });
    }
  };

  return (
    <form
      ref={formRef}
      action={sedangEdit ? ubahGaleri : tambahGaleri}
      onSubmit={(e) => {
        if (terkonfirmasi.current) {
          terkonfirmasi.current = false;
          return;
        }
        e.preventDefault();
        setMintaSimpan(true);
      }}
      className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label htmlFor="foto" className={labelClass}>
          Foto {!sedangEdit && "*"}
        </label>
        <input
          id="foto"
          name="foto"
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!sedangEdit}
          onChange={handleFoto}
          className="w-full rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
        />
        <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800">
          JPG/PNG/WebP, maksimal 5 MB. Foto harus rasio{" "}
          <span className="font-bold underline decoration-2 underline-offset-2">
            4:3
          </span>{" "}
          dan berorientasi lanskap agar tampilan foto utuh.
        </p>

        {preview && (
          <div className="mt-3">
            <div className="overflow-hidden rounded-xl border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Pratinjau foto yang dipilih"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {peringatan ? (
              <p className="mt-1 text-xs font-medium text-amber-700">
                Foto ini bukan berorientasi 4:3 — tampilannya akan dirapikan
                (dipotong sisi-nya). Pilih foto 4:3 agar tampil utuh.
              </p>
            ) : (
              <p className="mt-1 text-xs text-stone-400">
                Pratinjau menampilkan tampilan akhir (rasio 4:3).
              </p>
            )}
          </div>
        )}

        {!preview && item?.gambarUrl && (
          <div className="mt-3">
            <div className="overflow-hidden rounded-xl border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.gambarUrl}
                alt={item.alt || "Foto galeri"}
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

      <div>
        <label htmlFor="alt" className={labelClass}>
          Keterangan
        </label>
        <input
          id="alt"
          name="alt"
          maxLength={80}
          defaultValue={item?.alt}
          placeholder="cth. Suasana interior kedai"
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
        <p className="mt-1 text-xs text-stone-400">
          Nilai lebih kecil tampil lebih awal.
        </p>
      </div>

      <div className="flex items-center justify-end border-t border-stone-100 pt-5">
        <button
          type="submit"
          className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          {sedangEdit ? "Simpan Perubahan" : "Simpan Foto"}
        </button>
      </div>

      <ConfirmDialog
        open={mintaSimpan}
        judul={sedangEdit ? "Simpan perubahan foto?" : "Tambah foto baru?"}
        pesan={
          sedangEdit
            ? "Pastikan foto dan keterangan sudah benar. Foto galeri akan diperbarui."
            : "Pastikan foto sudah benar. Foto galeri baru akan ditambahkan."
        }
        labelKonfirmasi={sedangEdit ? "Ya, Simpan" : "Ya, Tambah"}
        onCancel={() => setMintaSimpan(false)}
        onConfirm={() => {
          setMintaSimpan(false);
          terkonfirmasi.current = true;
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
