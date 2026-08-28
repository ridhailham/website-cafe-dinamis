"use client";

import { useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { hapusGaleri } from "./actions";

export function DeleteGalleryButton({ id }: { id: number }) {
  const [minta, setMinta] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!minta) return;
    const timer = setTimeout(() => setMinta(false), 3000);
    return () => clearTimeout(timer);
  }, [minta]);

  return (
    <form
      ref={formRef}
      action={hapusGaleri}
      onSubmit={(e) => {
        if (!minta) {
          e.preventDefault();
          setMinta(true);
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          minta
            ? "bg-red-600 text-white hover:bg-red-700"
            : "text-red-600 hover:bg-red-50"
        }`}
      >
        {minta && <TriangleAlert className="h-3.5 w-3.5" />}
        {minta ? "Konfirmasi?" : "Hapus"}
      </button>
    </form>
  );
}
