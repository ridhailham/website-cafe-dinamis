import { Star } from "lucide-react";
import { testimoni } from "@/data/kedai";

export function Testimonials() {
  return (
    <section id="testimoni" className="scroll-mt-16 bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
            Testimoni
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Kata Pelanggan Kami
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimoni.map((t) => (
            <figure
              key={t.nama}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.bintang }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>
              <blockquote className="flex-1 leading-relaxed text-stone-700">
                &ldquo;{t.teks}&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-semibold text-stone-900">
                {t.nama}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
