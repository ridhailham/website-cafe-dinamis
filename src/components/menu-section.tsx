"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS, formatHarga } from "@/lib/constants";

type Props = { items: MenuItem[] };

const AWAL_MUNCUL = 6;
const GAMBAR_DEFAULT =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop";

export function MenuSection({ items }: Props) {
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_OPTIONS)[number]>("Minuman");
  const [tampilSemua, setTampilSemua] = useState(false);

  const jumlahPerKategori = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.kategori] = (map[item.kategori] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const gantiKategori = (kat: (typeof KATEGORI_OPTIONS)[number]) => {
    setKategori(kat);
    setTampilSemua(false);
  };

  const katItems = items.filter((item) => item.kategori === kategori);
  const totalKat = jumlahPerKategori[kategori] ?? katItems.length;
  const tampil = tampilSemua ? katItems : katItems.slice(0, AWAL_MUNCUL);

  return (
    <section id="menu" className="scroll-mt-16 bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
            Menu Kami
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Menu &amp; Harga
          </h2>
          <p className="mt-3 text-stone-600">
            Diseduh dari biji pilihan petani lokal Indonesia.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-stone-500">
            Menu akan segera hadir. Nantikan!
          </p>
        ) : (
          <>
            <div className="mb-8 flex justify-center gap-2">
              {KATEGORI_OPTIONS.map((kat) => (
                <button
                  key={kat}
                  onClick={() => gantiKategori(kat)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                    kategori === kat
                      ? "bg-amber-600 text-white"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {kat} ({jumlahPerKategori[kat] ?? 0})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tampil.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.gambarUrl || GAMBAR_DEFAULT}
                    alt={`Foto ${item.nama}`}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 min-h-[3rem] font-serif text-xl font-bold text-stone-900">
                      {item.nama}
                    </h3>
                    <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-stone-600">
                      {item.deskripsi}
                    </p>
                    <p className="mt-auto text-xl font-bold text-amber-700">
                      {formatHarga(item.harga)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {katItems.length > AWAL_MUNCUL && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setTampilSemua((v) => !v)}
                  className="rounded-full bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  {tampilSemua
                    ? "Lihat Lebih Sedikit"
                    : `Lihat Semua ${totalKat} Menu`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
