export const KATEGORI_OPTIONS = ["Minuman", "Makanan"] as const;
export type Kategori = (typeof KATEGORI_OPTIONS)[number];

export function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}
