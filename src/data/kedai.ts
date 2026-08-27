export const kedai = {
  nama: "Kopi Senja",
  tagline: "Secangkir hangat di akhir hari",
  deskripsi:
    "Kedai kopi lokal dengan biji pilihan dari petani Indonesia. Tempat berkumpulnya cerita, tawa, dan aroma kopi yang diseduh dengan sepenuh hati.",
  wa: {
    nomor: "6281234567890",
    teks: "Halo Kopi Senja! Saya mau tanya-tanya dulu.",
    get url() {
      return `https://wa.me/${this.nomor}?text=${encodeURIComponent(this.teks)}`;
    },
  },
  instagram: "@kopisenja",
  alamat: "Jl. Raya Contoh No. 123, Dago, Bandung, Jawa Barat 40135",
  jamBuka: [
    { hari: "Senin – Jumat", jam: "08.00 – 22.00" },
    { hari: "Sabtu – Minggu", jam: "07.00 – 23.00" },
  ],
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.153!2d107.6191!3d-6.8675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUyJzAzLjAiUyAxMDfCsDM3JzA4LjciRQ!5e0!3m2!1sid!2sid!4v1700000000000",
};

export const galeri = [
  {
    src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop",
    alt: "Suasana interior kedai",
  },
  {
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
    alt: "Barista menuang latte art",
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    alt: "Cangkir kopi di atas meja kayu",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
    alt: "Pelanggan menikmati kopi",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    alt: "Proses seduh manual brew",
  },
  {
    src: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop",
    alt: "Croissant dan kopi",
  },
];

export const heroImage =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop";
