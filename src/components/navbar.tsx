"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { kedai } from "@/data/kedai";
import { WhatsAppIcon } from "./whatsapp-icon";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#galeri", label: "Galeri" },
  { href: "#lokasi", label: "Lokasi" },
];

export function Navbar({ waUrl }: { waUrl?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-stone-50/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#" className="font-serif text-xl font-bold text-stone-900">
          Kopi <span className="text-amber-700">Senja</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-700"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={waUrl || kedai.wa.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Pesan Sekarang
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-200 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="space-y-1 border-t border-stone-200 bg-stone-50 px-4 py-3 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
