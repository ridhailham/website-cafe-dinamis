"use client";

import { useRef, useState } from "react";
import type { MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS, formatHarga } from "@/lib/constants";
import { kedai } from "@/data/kedai";

const kategoriWarna: Record<string, string> = {
  Minuman: "bg-amber-100 text-amber-800",
  Makanan: "bg-emerald-100 text-emerald-800",
};

type Props = { items: MenuItem[] };

export function MenuSection({ items }: Props) {
  const [kategori, setKategori] = useState<(typeof KATEGORI_OPTIONS)[number]>("Minuman");
  const scrollRefs = useRef<Record<string, HTMLDivElement>>({});

  const handleScroll = (dir: "left" | "right") => {
    const c = scrollRefs.current[kategori];
    c?.scrollBy({ left: dir === "left" ? -504 : 504, behavior: "smooth" });
  };

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

            <div className="relative px-14">
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-600 shadow-md backdrop-blur-sm transition-colors hover:bg-amber-50 hover:text-amber-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {KATEGORI_OPTIONS.map((kat) => {
                const katItems = items.filter((item) => item.kategori === kat);
                return (
                  <div
                    key={kat}
                    className={kategori === kat ? "" : "hidden"}
                  >
                    <div
                      ref={(el) => { if (el) scrollRefs.current[kat] = el; }}
                      className="flex items-start gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden scrollbar-none"
                    >
                      {Array.from({ length: Math.ceil(katItems.length / 2) }, (_, col) => {
                        const item1 = katItems[col * 2];
                        const item2 = katItems[col * 2 + 1];
                        return (
                          <div key={col} className="flex w-[14.5rem] shrink-0 snap-start flex-col gap-5">
                            {[item1, item2].filter(Boolean).map((item) => (
                              <article
                                key={item.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.gambarUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop"}
                                  alt={`Foto ${item.nama}`}
                                  loading="lazy"
                                  className="aspect-[3/2] w-full shrink-0 object-cover"
                                />
                                <div className="flex flex-1 flex-col p-5">
                                  <span
                                    className={`mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${kategoriWarna[item.kategori] ?? "bg-stone-100 text-stone-700"}`}
                                  >
                                    {item.kategori}
                                  </span>
                                  <h3 className="line-clamp-2 min-h-[3.5rem] font-serif text-xl font-bold text-stone-900">
                                    {item.nama}
                                  </h3>
                                  <p className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-stone-600">
                                    {item.deskripsi}
                                  </p>
                                  <p className="mt-auto text-xl font-bold text-amber-700">
                                    {formatHarga(item.harga)}
                                  </p>
                                  <a
                                    href={`https://wa.me/${kedai.wa.nomor}?text=${encodeURIComponent(
                                      `Halo Kopi Senja! Saya mau pesan *${item.nama}* (${formatHarga(item.harga)}).`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>
                                    Pesan via WhatsApp
                                  </a>
                                </div>
                              </article>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-600 shadow-md backdrop-blur-sm transition-colors hover:bg-amber-50 hover:text-amber-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
