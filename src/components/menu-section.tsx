"use client";

import { useRef, useState } from "react";
import type { MenuItem } from "@/db/schema";
import { KATEGORI_OPTIONS, formatHarga } from "@/lib/constants";

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
                      className="flex items-stretch gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden scrollbar-none"
                    >
                      {Array.from({ length: Math.ceil(katItems.length / 2) }, (_, col) => {
                        const item1 = katItems[col * 2];
                        const item2 = katItems[col * 2 + 1];
                        return (
                          <div key={col} className="flex h-full w-[14.5rem] shrink-0 snap-start flex-col gap-5">
                            {[item1, item2].filter(Boolean).map((item) => (
                              <article
                                key={item.id}
                                className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.gambarUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop"}
                                  alt={`Foto ${item.nama}`}
                                  loading="lazy"
                                  className="aspect-[3/2] w-full shrink-0 object-cover"
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
