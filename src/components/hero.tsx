import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { heroImage, kedai } from "@/data/kedai";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden">
      <Image
        src={heroImage}
        alt="Suasana Kopi Senja"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
          Kedai Kopi Bandung
        </p>
        <h1 className="font-serif text-5xl font-bold text-white sm:text-6xl">
          {kedai.nama}
        </h1>
        <p className="mt-4 font-serif text-2xl italic text-stone-200 sm:text-3xl">
          &ldquo;{kedai.tagline}&rdquo;
        </p>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-stone-300">
          {kedai.deskripsi}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#menu"
            className="w-full rounded-full bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 sm:w-auto"
          >
            Lihat Menu
          </a>
          <a
            href={kedai.wa.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat WhatsApp
          </a>
        </div>
      </div>

      <a
        href="#menu"
        aria-label="Lihat Menu"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-white/70 transition-opacity hover:opacity-80"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
