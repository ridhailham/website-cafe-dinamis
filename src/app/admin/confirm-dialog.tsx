"use client";

import { useEffect, useRef } from "react";
import { Info, TriangleAlert, X } from "lucide-react";

type Props = {
  open: boolean;
  judul: string;
  pesan: string;
  labelKonfirmasi: string;
  bahaya?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Dialog konfirmasi reusable untuk aksi create/update/delete di panel admin.
export function ConfirmDialog({
  open,
  judul,
  pesan,
  labelKonfirmasi,
  bahaya = false,
  onConfirm,
  onCancel,
}: Props) {
  const tombolRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    tombolRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-judul"
      aria-describedby="confirm-pesan"
    >
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl toast-in">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Tutup dialog"
          className="absolute right-3 top-3 rounded p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 shrink-0 rounded-full p-2 ${
              bahaya ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {bahaya ? (
              <TriangleAlert className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </span>
          <div>
            <h2
              id="confirm-judul"
              className="text-base font-bold text-stone-900"
            >
              {judul}
            </h2>
            <p
              id="confirm-pesan"
              className="mt-1 text-sm leading-snug text-stone-600"
            >
              {pesan}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            Batal
          </button>
          <button
            ref={tombolRef}
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
              bahaya
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {labelKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  );
}
