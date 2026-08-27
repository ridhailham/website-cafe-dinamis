import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DATA_AWAL = [
  // Minuman (25 item)
  { nama: "Espresso", deskripsi: "Double shot single origin Gayo", harga: 18000, kategori: "Minuman", urutan: 1, gambarUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=600&h=450&fit=crop" },
  { nama: "Americano", deskripsi: "Espresso dengan air panas, ringan & bersih", harga: 22000, kategori: "Minuman", urutan: 2, gambarUrl: "https://images.unsplash.com/photo-1521302200778-33500795e128?q=80&w=600&h=450&fit=crop" },
  { nama: "Cappuccino", deskripsi: "Perpaduan espresso dan susu berbusa lembut", harga: 28000, kategori: "Minuman", urutan: 3, gambarUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&h=450&fit=crop" },
  { nama: "Kopi Susu Senja", deskripsi: "Signature: espresso, susu segar, gula aren", harga: 25000, kategori: "Minuman", urutan: 4, gambarUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&h=450&fit=crop" },
  { nama: "V60 Manual Brew", deskripsi: "Diseduh perlahan, cita rasa fruity", harga: 30000, kategori: "Minuman", urutan: 5, gambarUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop" },
  { nama: "Cafe Latte", deskripsi: "Espresso dengan susu steamed, creamy & smooth", harga: 28000, kategori: "Minuman", urutan: 6, gambarUrl: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?q=80&w=600&h=450&fit=crop" },
  { nama: "Mocha", deskripsi: "Espresso, cokelat, dan susu — manis & nikmat", harga: 30000, kategori: "Minuman", urutan: 7, gambarUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&h=450&fit=crop" },
  { nama: "Es Kopi Susu", deskripsi: "Kopi dingin, susu segar, gula aren, es batu", harga: 25000, kategori: "Minuman", urutan: 8, gambarUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&h=450&fit=crop" },
  { nama: "Avocado Coffee", deskripsi: "Alpukat creamy, espresso, susu, gula aren", harga: 32000, kategori: "Minuman", urutan: 9, gambarUrl: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Matcha Latte", deskripsi: "Matcha premium dengan susu segar", harga: 30000, kategori: "Minuman", urutan: 10, gambarUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&h=450&fit=crop" },
  { nama: "Chocolate Senja", deskripsi: "Cokelat pekat dengan marshmallow", harga: 28000, kategori: "Minuman", urutan: 11, gambarUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=600&h=450&fit=crop" },
  { nama: "Teh Tarik", deskripsi: "Teh susu khas Malaysia, ditarik hingga berbusa", harga: 20000, kategori: "Minuman", urutan: 12, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  { nama: "Kopi Jahe", deskripsi: "Espresso, jahe hangat, gula aren, susu", harga: 27000, kategori: "Minuman", urutan: 13, gambarUrl: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=600&h=450&fit=crop" },
  { nama: "Es Jeruk Segar", deskripsi: "Jeruk peras segar, manis alami, es batu", harga: 18000, kategori: "Minuman", urutan: 14, gambarUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600&h=450&fit=crop" },
  { nama: "Fresh Lemon Tea", deskripsi: "Teh hijau dengan perasan lemon segar", harga: 20000, kategori: "Minuman", urutan: 15, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  { nama: "Flat White", deskripsi: "Espresso double dengan susu steamed, velvety", harga: 30000, kategori: "Minuman", urutan: 16, gambarUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&h=450&fit=crop" },
  { nama: "Affogato", deskripsi: "Espresso dituang di atas vanilla ice cream", harga: 28000, kategori: "Minuman", urutan: 17, gambarUrl: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Macchiato", deskripsi: "Espresso dengan sedikit busa susu", harga: 26000, kategori: "Minuman", urutan: 18, gambarUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&h=450&fit=crop" },
  { nama: "Thai Tea", deskripsi: "Teh Thailand dengan susu dan es batu", harga: 22000, kategori: "Minuman", urutan: 19, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  { nama: "Susu Jahe", deskripsi: "Susu hangat dengan jahe segar & gula aren", harga: 22000, kategori: "Minuman", urutan: 20, gambarUrl: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=600&h=450&fit=crop" },
  { nama: "Caramel Macchiato", deskripsi: "Espresso, susu, dan sirup karamel", harga: 30000, kategori: "Minuman", urutan: 21, gambarUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&h=450&fit=crop" },
  { nama: "Es Teh Manis", deskripsi: "Teh manis dingin, segar & klasik", harga: 10000, kategori: "Minuman", urutan: 22, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  { nama: "Kopi Tubruk", deskripsi: "Kopi tradisional, kental & pekat", harga: 15000, kategori: "Minuman", urutan: 23, gambarUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=600&h=450&fit=crop" },
  { nama: "Berry Smoothie", deskripsi: "Campuran berries segar, yogurt, & madu", harga: 32000, kategori: "Minuman", urutan: 24, gambarUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&h=450&fit=crop" },
  { nama: "Dona", deskripsi: "Minuman premium spesial", harga: 100000, kategori: "Minuman", urutan: 25, gambarUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&h=450&fit=crop" },
  // Makanan (25 item)
  { nama: "Butter Croissant", deskripsi: "Panggang renyah, cocok teman kopi", harga: 22000, kategori: "Makanan", urutan: 26, gambarUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?q=80&w=600&h=450&fit=crop" },
  { nama: "Nasi Goreng Kampung", deskripsi: "Nasi goreng kampung dengan telur mata sapi & kerupuk", harga: 28000, kategori: "Makanan", urutan: 27, gambarUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&h=450&fit=crop" },
  { nama: "Mie Ayam Jamur", deskripsi: "Mie ayam dengan jamur, pangsit, dan bakso", harga: 25000, kategori: "Makanan", urutan: 28, gambarUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&h=450&fit=crop" },
  { nama: "Roti Bakar Cokelat", deskripsi: "Roti gandum panggang, selai cokelat, keju parut", harga: 20000, kategori: "Makanan", urutan: 29, gambarUrl: "https://images.unsplash.com/photo-1481070555726-e2fe8357b3e3?q=80&w=600&h=450&fit=crop" },
  { nama: "Pisang Goreng Keju", deskripsi: "Pisang goreng renyah, taburan keju & condensed milk", harga: 18000, kategori: "Makanan", urutan: 30, gambarUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600&h=450&fit=crop" },
  { nama: "Kentang Goreng", deskripsi: "Kentang goreng renyah dengan saus sambal", harga: 18000, kategori: "Makanan", urutan: 31, gambarUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=600&h=450&fit=crop" },
  { nama: "Risol Mayo", deskripsi: "Risol goreng renyah, isian mayo & smoked beef", harga: 5000, kategori: "Makanan", urutan: 32, gambarUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Sandwich Telur", deskripsi: "Roti gandum, telur, selada, tomat, mayo", harga: 22000, kategori: "Makanan", urutan: 33, gambarUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&h=450&fit=crop" },
  { nama: "Ayam Geprek", deskripsi: "Ayam goreng crispy dengan sambal geprek pedas", harga: 28000, kategori: "Makanan", urutan: 34, gambarUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&h=450&fit=crop" },
  { nama: "Chicken Katsu", deskripsi: "Chicken katsu tepung renyah dengan saus tonkatsu", harga: 30000, kategori: "Makanan", urutan: 35, gambarUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&h=450&fit=crop" },
  { nama: "Spaghetti Carbonara", deskripsi: "Spaghetti dengan saus carbonara creamy & smoked beef", harga: 32000, kategori: "Makanan", urutan: 36, gambarUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&h=450&fit=crop" },
  { nama: "Nasi Padang", deskripsi: "Nasi dengan rendang, sayur nangka, dan sambal", harga: 30000, kategori: "Makanan", urutan: 37, gambarUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600&h=450&fit=crop" },
  { nama: "Gado-Gado", deskripsi: "Sayur rebus dengan bumbu kacang segar", harga: 22000, kategori: "Makanan", urutan: 38, gambarUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Martabak Manis", deskripsi: "Martabak manis dengan meses & keju", harga: 18000, kategori: "Makanan", urutan: 39, gambarUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&h=450&fit=crop" },
  { nama: "Kue Cubit", deskripsi: "Kue cubit mini dengan meses & keju parut", harga: 12000, kategori: "Makanan", urutan: 40, gambarUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600&h=450&fit=crop" },
  { nama: "Tahu Gejrot", deskripsi: "Tahu goreng dengan bumbu kuah pedas manis", harga: 15000, kategori: "Makanan", urutan: 41, gambarUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Sosis Bakar", deskripsi: "Sosis panggang dengan saus BBQ & mustard", harga: 18000, kategori: "Makanan", urutan: 42, gambarUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&h=450&fit=crop" },
  { nama: "Bakmie Ayam", deskripsi: "Mie ayam dengan pangsit goreng & bakso", harga: 25000, kategori: "Makanan", urutan: 43, gambarUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&h=450&fit=crop" },
  { nama: "Toast Alpukat", deskripsi: "Roti panggang dengan alpukat, telur & chili flake", harga: 28000, kategori: "Makanan", urutan: 44, gambarUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&h=450&fit=crop" },
  { nama: "Onigiri", deskripsi: "Nasi Jepang dengan isian salmon & nori", harga: 18000, kategori: "Makanan", urutan: 45, gambarUrl: "https://images.unsplash.com/photo-1530259142044-9e7e0f3a0c21?q=80&w=600&h=450&fit=crop" },
  { nama: "French Toast", deskripsi: "Roti goreng mentega dengan madu & pisang", harga: 22000, kategori: "Makanan", urutan: 46, gambarUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&h=450&fit=crop" },
  { nama: "Tteokbokki", deskripsi: "Kue beras Korea dengan saus gochujang pedas", harga: 22000, kategori: "Makanan", urutan: 47, gambarUrl: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?q=80&w=600&h=450&fit=crop" },
  { nama: "Cireng Bumbu Rujak", deskripsi: "Cireng goreng tepung dengan bumbu rujak pedas", harga: 12000, kategori: "Makanan", urutan: 48, gambarUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Pudding Cokelat", deskripsi: "Pudding cokelat Belgian dengan whipped cream", harga: 18000, kategori: "Makanan", urutan: 49, gambarUrl: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=600&h=450&fit=crop" },
  { nama: "Cheesecake Slice", deskripsi: "New York style cheesecake dengan berry compote", harga: 25000, kategori: "Makanan", urutan: 50, gambarUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&h=450&fit=crop" },
];

const DATA_GALERI = [
  { gambarUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop", alt: "Suasana interior kedai" },
  { gambarUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop", alt: "Barista menuang latte art" },
  { gambarUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop", alt: "Cangkir kopi di atas meja kayu" },
  { gambarUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop", alt: "Pelanggan menikmati kopi" },
  { gambarUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop", alt: "Proses seduh manual brew" },
  { gambarUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop", alt: "Croissant dan kopi" },
];

async function main() {
  const [{ db }, { galleryItems, menuItems }] = await Promise.all([
    import("./index"),
    import("./schema"),
  ]);

  const existing = await db.select().from(menuItems);

  if (existing.length > 0) {
    console.log(`Tabel sudah berisi ${existing.length} item — seed dilewati.`);
  } else {
    await db.insert(menuItems).values(DATA_AWAL);
    console.log(`Berhasil mengisi ${DATA_AWAL.length} item menu awal.`);
  }

  const existingGaleri = await db.select().from(galleryItems);
  if (existingGaleri.length > 0) {
    console.log(
      `Galeri sudah berisi ${existingGaleri.length} foto — seed galeri dilewati.`
    );
  } else {
    await db
      .insert(galleryItems)
      .values(DATA_GALERI.map((g, i) => ({ ...g, urutan: i + 1 })));
    console.log(`Berhasil mengisi ${DATA_GALERI.length} foto galeri awal.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed gagal:", err);
    process.exit(1);
  });
