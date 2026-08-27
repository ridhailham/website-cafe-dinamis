"use client";

import { useState } from "react";
import type { MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS, formatHarga } from "@/lib/constants";

const kategoriWarna: Record<string, string> = {
  Minuman: "bg-amber-100 text-amber-800",
  Makanan: "bg-emerald-100 text-emerald-800",
};

type Props = { items: MenuItem[] };

export function MenuSection({ items }: Props) {
  const [kategori, setKategori] = useState<(typeof KATEGORI_OPTIONS)[number]>("Minuman");

  const filtered = items.filter((item) => item.kategori === kategori);

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
                  onClick={() => setKategori(kat)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                    kategori === kat
                      ? "bg-amber-600 text-white"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.gambarUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop"}
                    alt={`Foto ${item.nama}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span
                      className={`mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${kategoriWarna[item.kategori] ?? "bg-stone-100 text-stone-700"}`}
                    >
                      {item.kategori}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {item.nama}
                    </h3>
                    {item.deskripsi && (
                      <p className="mt-1 flex-1 text-sm leading-relaxed text-stone-600">
                        {item.deskripsi}
                      </p>
                    )}
                    <p className="mt-4 text-lg font-bold text-amber-700">
                      {formatHarga(item.harga)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-stone-500">
                Belum ada menu {kategori.toLowerCase()}.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
