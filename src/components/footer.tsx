import { kedai } from "@/data/kedai";
import { WhatsAppIcon } from "./whatsapp-icon";
import { InstagramIcon } from "./instagram-icon";

export function Footer() {
  return (
    <footer className="bg-stone-900 py-12 text-stone-300">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-serif text-2xl font-bold text-white">
              Kopi <span className="text-amber-500">Senja</span>
            </p>
            <p className="mt-1 text-sm">{kedai.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={kedai.wa.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-stone-800 p-3 transition-colors hover:bg-stone-700"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://instagram.com/${kedai.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-stone-800 p-3 transition-colors hover:bg-stone-700"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {kedai.nama}. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
