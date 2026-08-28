"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { hapusGaleri } from "./actions";
import { ConfirmDialog } from "./confirm-dialog";

export function DeleteGalleryButton({ id }: { id: number }) {
  const [buka, setBuka] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={hapusGaleri}>
        <input type="hidden" name="id" value={id} />
      </form>
      <button
        type="button"
        onClick={() => setBuka(true)}
        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Hapus
      </button>
      <ConfirmDialog
        open={buka}
        bahaya
        judul="Hapus foto ini?"
        pesan="Foto akan dihapus dari galeri. Aksi ini tidak bisa dibatalkan."
        labelKonfirmasi="Ya, Hapus"
        onCancel={() => setBuka(false)}
        onConfirm={() => {
          setBuka(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
