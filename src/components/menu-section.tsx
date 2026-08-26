import type { MenuItem } from "@/db/schema";
import { formatHarga } from "@/lib/constants";

const kategoriWarna: Record<string, string> = {
  Kopi: "bg-amber-100 text-amber-800",
  "Non-Kopi": "bg-emerald-100 text-emerald-800",
  Snack: "bg-rose-100 text-rose-800",
};

type Props = { items: MenuItem[] };

export function MenuSection({ items }: Props) {
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
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
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
