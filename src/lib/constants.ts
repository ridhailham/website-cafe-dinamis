export const KATEGORI_OPTIONS = ["Kopi", "Non-Kopi", "Snack"] as const;
export type Kategori = (typeof KATEGORI_OPTIONS)[number];

export function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}
