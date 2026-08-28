"use client";

import { useEffect, useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

type Jenis = "error" | "success" | "info" | "warning";

const WARNA: Record<
  Jenis,
  { kotak: string; ikon: string; role: "polite" | "assertive" }
> = {
  success: {
    kotak: "border-green-200 bg-white text-stone-800",
    ikon: "text-green-600",
    role: "polite",
  },
  error: {
    kotak: "border-red-200 bg-white text-stone-800",
    ikon: "text-red-600",
    role: "assertive",
  },
  info: {
    kotak: "border-amber-200 bg-white text-stone-800",
    ikon: "text-amber-600",
    role: "polite",
  },
  warning: {
    kotak: "border-amber-200 bg-white text-stone-800",
    ikon: "text-amber-600",
    role: "assertive",
  },
};

function Ikon({ jenis }: { jenis: Jenis }) {
  if (jenis === "success") return <CircleCheck className="h-5 w-5 shrink-0" />;
  if (jenis === "error") return <CircleAlert className="h-5 w-5 shrink-0" />;
  if (jenis === "warning")
    return <TriangleAlert className="h-5 w-5 shrink-0" />;
  return <Info className="h-5 w-5 shrink-0" />;
}

// Toast yang muncul di pojok kanan atas. Auto-hilang 5 detik.
export function AdminToast({
  type,
  pesan,
}: {
  type: Jenis;
  pesan: string;
}) {
  const [aktif, setAktif] = useState(true);
  const [menutup, setMenutup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => tutup(), 5000);
    return () => clearTimeout(timer);
  }, []);

  function tutup() {
    setMenutup(true);
    setTimeout(() => setAktif(false), 180);
  }

  if (!aktif || !pesan) return null;
  const w = WARNA[type];

  return (
    <div
      role="alert"
      aria-live={w.role}
      className={`fixed right-4 top-20 z-[60] flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${w.kotak} ${
        menutup ? "toast-out" : "toast-in"
      }`}
    >
      <span className={w.ikon}>
        <Ikon jenis={type} />
      </span>
      <p className="flex-1 text-sm font-medium leading-snug">{pesan}</p>
      <button
        type="button"
        onClick={tutup}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded p-0.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Banner versi inline (dipakai di dalam kartu, mis. halaman login).
export function AdminBanner({
  type,
  pesan,
  className = "",
}: {
  type: Jenis;
  pesan: string;
  className?: string;
}) {
  const [aktif, setAktif] = useState(true);
  const [menutup, setMenutup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => tutup(), 5000);
    return () => clearTimeout(timer);
  }, []);

  function tutup() {
    setMenutup(true);
    setTimeout(() => setAktif(false), 180);
  }

  if (!aktif || !pesan) return null;
  const w = WARNA[type];

  return (
    <div
      role="alert"
      aria-live={w.role}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${w.kotak} ${className} ${
        menutup ? "toast-out" : "toast-in"
      }`}
    >
      <span className={w.ikon}>
        <Ikon jenis={type} />
      </span>
      <p className="flex-1 font-medium leading-snug">{pesan}</p>
      <button
        type="button"
        onClick={tutup}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded p-0.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
