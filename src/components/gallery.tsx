import Image from "next/image";
import { galeri } from "@/data/kedai";

export function Gallery() {
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
          {galeri.map((foto) => (
            <div
              key={foto.src}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
