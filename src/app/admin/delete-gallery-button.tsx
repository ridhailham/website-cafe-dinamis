"use client";

import { useRef } from "react";
import { hapusGaleri } from "./actions";

export function DeleteGalleryButton({ id }: { id: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={hapusGaleri}
      onSubmit={(e) => {
        if (!confirm("Yakin ingin menghapus foto galeri ini?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        Hapus
      </button>
    </form>
  );
}
