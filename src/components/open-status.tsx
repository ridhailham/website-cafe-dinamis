"use client";

import { useEffect, useState } from "react";
import { kedai } from "@/data/kedai";

const HARI = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"] as const;

export function OpenStatus() {
  const [status, setStatus] = useState<"buka" | "tutup" | "memuat">("memuat");

  useEffect(() => {
    const hitung = () => {
      const now = new Date();
      const hari = HARI[now.getDay()];
      const jam = now.getHours() + now.getMinutes() / 60;
      const jadwal = kedai.jamOperasional[hari];
      setStatus(jam >= jadwal.buka && jam < jadwal.tutup ? "buka" : "tutup");
    };

    hitung();
    const id = setInterval(hitung, 60_000);
    return () => clearInterval(id);
  }, []);

  if (status === "memuat") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-1.5 text-sm font-semibold text-stone-600 shadow-sm backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-stone-300" />
        Memuat status…
      </span>
    );
  }

  const buka = status === "buka";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm ${
        buka
          ? "border-emerald-200 bg-emerald-50/90 text-emerald-700"
          : "border-red-200 bg-red-50/90 text-red-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${buka ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
      />
      {buka ? "Buka sekarang" : "Sedang tutup"}
    </span>
  );
}
