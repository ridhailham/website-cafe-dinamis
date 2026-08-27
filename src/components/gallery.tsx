import Image from "next/image";
import type { GalleryItem } from "@/db/schema";

type Props = { items: GalleryItem[] };

export function Gallery({ items }: Props) {
  return (
    <section id="galeri" className="scroll-mt-16 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
            Galeri
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Suasana di Kopi Senja
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.length > 0 ? (
            items.map((foto) => (
              <div
                key={foto.id}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={foto.gambarUrl}
                  alt={foto.alt || "Foto galeri Kopi Senja"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-stone-500">
              Galeri belum diisi — tambahkan foto dari panel admin.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
