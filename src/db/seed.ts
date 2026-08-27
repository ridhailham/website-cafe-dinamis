import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DATA_AWAL = [
  // Minuman - Kopi
  { nama: "Espresso", deskripsi: "Double shot single origin Gayo", harga: 18000, kategori: "Minuman", urutan: 1, gambarUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=600&h=450&fit=crop" },
  { nama: "Americano", deskripsi: "Espresso dengan air panas, ringan & bersih", harga: 22000, kategori: "Minuman", urutan: 2, gambarUrl: "https://images.unsplash.com/photo-1521302200778-33500795e128?q=80&w=600&h=450&fit=crop" },
  { nama: "Cappuccino", deskripsi: "Perpaduan espresso dan susu berbusa lembut", harga: 28000, kategori: "Minuman", urutan: 3, gambarUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&h=450&fit=crop" },
  { nama: "Kopi Susu Senja", deskripsi: "Signature: espresso, susu segar, gula aren", harga: 25000, kategori: "Minuman", urutan: 4, gambarUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&h=450&fit=crop" },
  { nama: "V60 Manual Brew", deskripsi: "Diseduh perlahan, cita rasa fruity", harga: 30000, kategori: "Minuman", urutan: 5, gambarUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&fit=crop" },
  { nama: "Cafe Latte", deskripsi: "Espresso dengan susu steamed, creamy & smooth", harga: 28000, kategori: "Minuman", urutan: 6, gambarUrl: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?q=80&w=600&h=450&fit=crop" },
  { nama: "Mocha", deskripsi: "Espresso, cokelat, dan susu — manis & nikmat", harga: 30000, kategori: "Minuman", urutan: 7, gambarUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&h=450&fit=crop" },
  { nama: "Es Kopi Susu", deskripsi: "Kopi dingin, susu segar, gula aren, es batu", harga: 25000, kategori: "Minuman", urutan: 8, gambarUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&h=450&fit=crop" },
  { nama: "Avocado Coffee", deskripsi: "Alpukat creamy, espresso, susu, gula aren", harga: 32000, kategori: "Minuman", urutan: 9, gambarUrl: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=600&h=450&fit=crop" },
  // Minuman - Non-Kopi
  { nama: "Matcha Latte", deskripsi: "Matcha premium dengan susu segar", harga: 30000, kategori: "Minuman", urutan: 10, gambarUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&h=450&fit=crop" },
  { nama: "Chocolate Senja", deskripsi: "Cokelat pekat dengan marshmallow", harga: 28000, kategori: "Minuman", urutan: 11, gambarUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=600&h=450&fit=crop" },
  { nama: "Teh Tarik", deskripsi: "Teh susu khas Malaysia, ditarik hingga berbusa", harga: 20000, kategori: "Minuman", urutan: 12, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  { nama: "Kopi Jahe", deskripsi: "Espresso, jahe hangat, gula aren, susu", harga: 27000, kategori: "Minuman", urutan: 13, gambarUrl: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=600&h=450&fit=crop" },
  { nama: "Es Jeruk Segar", deskripsi: "Jeruk peras segar, manis alami, es batu", harga: 18000, kategori: "Minuman", urutan: 14, gambarUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600&h=450&fit=crop" },
  { nama: "Fresh Lemon Tea", deskripsi: "Teh hijau dengan perasan lemon segar", harga: 20000, kategori: "Minuman", urutan: 15, gambarUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&h=450&fit=crop" },
  // Makanan
  { nama: "Butter Croissant", deskripsi: "Panggang renyah, cocok teman kopi", harga: 22000, kategori: "Makanan", urutan: 16, gambarUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?q=80&w=600&h=450&fit=crop" },
  { nama: "Nasi Goreng Kampung", deskripsi: "Nasi goreng kampung dengan telur mata sapi & kerupuk", harga: 28000, kategori: "Makanan", urutan: 17, gambarUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&h=450&fit=crop" },
  { nama: "Mie Ayam Jamur", deskripsi: "Mie ayam dengan jamur, pangsit, dan bakso", harga: 25000, kategori: "Makanan", urutan: 18, gambarUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&h=450&fit=crop" },
  { nama: "Roti Bakar Cokelat", deskripsi: "Roti gandum panggang, selai cokelat, keju parut", harga: 20000, kategori: "Makanan", urutan: 19, gambarUrl: "https://images.unsplash.com/photo-1481070555726-e2fe8357b3e3?q=80&w=600&h=450&fit=crop" },
  { nama: "Pisang Goreng Keju", deskripsi: "Pisang goreng renyah, taburan keju & condensed milk", harga: 18000, kategori: "Makanan", urutan: 20, gambarUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600&h=450&fit=crop" },
  { nama: "Kentang Goreng", deskripsi: "Kentang goreng renyah dengan saus sambal", harga: 18000, kategori: "Makanan", urutan: 21, gambarUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=600&h=450&fit=crop" },
  { nama: "Risol Mayo", deskripsi: "Risol goreng renyah, isian mayo & smoked beef", harga: 5000, kategori: "Makanan", urutan: 22, gambarUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&h=450&fit=crop" },
  { nama: "Sandwich Telur", deskripsi: "Roti gandum, telur, selada, tomat, mayo", harga: 22000, kategori: "Makanan", urutan: 23, gambarUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&h=450&fit=crop" },
];

async function main() {
  const [{ db }, { menuItems }] = await Promise.all([
    import("./index"),
    import("./schema"),
  ]);

  const existing = await db.select().from(menuItems);

  if (existing.length > 0) {
    console.log(`Tabel sudah berisi ${existing.length} item — seed dilewati.`);
    return;
  }

  await db.insert(menuItems).values(DATA_AWAL);
  console.log(`Berhasil mengisi ${DATA_AWAL.length} item menu awal.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed gagal:", err);
    process.exit(1);
  });
