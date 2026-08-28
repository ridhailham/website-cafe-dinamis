// Modul pesan (tanpa "use client") — aman dipanggil dari server page XML.
export const PESAN_ERROR: Record<string, string> = {
  tipe: "File harus berupa gambar (JPG, PNG, atau WebP).",
  ukuran: "Ukuran foto maksimal 5 MB.",
  wa: "Nomor WhatsApp wajib diisi dengan benar.",
  token:
    "Fitur foto belum aktif karena penyimpanan Vercel Blob belum terhubung. Data tetap tersimpan tanpa foto — foto bisa diunggah setelah website di-deploy.",
  validasi: "Nama dan harga wajib diisi dengan benar.",
  foto: "Menu baru wajib memiliki foto.",
  upload: "Gagal meng-upload foto. Periksa koneksi dan coba lagi.",
  maps: "Link peta tidak valid. Tempel link Google Maps biasa atau link 'Bagikan' (maps.app.goo.gl) — akan dikonversi otomatis.",
};

export const PESAN_OK: Record<string, string> = {
  menu_tambah: "Menu berhasil ditambahkan.",
  menu_ubah: "Menu berhasil diperbarui.",
  menu_hapus: "Menu berhasil dihapus.",
  galeri_tambah: "Foto berhasil ditambahkan.",
  galeri_ubah: "Foto berhasil diperbarui.",
  galeri_hapus: "Foto berhasil dihapus.",
  bisnis: "Data bisnis berhasil disimpan.",
  logout_all: "Anda telah keluar dari semua perangkat lain.",
};

export function pesanError(kode?: string): string | null {
  if (!kode) return null;
  return PESAN_ERROR[kode] ?? "Terjadi kesalahan. Coba lagi.";
}

export function pesanOk(kode?: string): string | null {
  if (!kode) return null;
  return PESAN_OK[kode] ?? "Aksi berhasil.";
}
