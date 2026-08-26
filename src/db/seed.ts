import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DATA_AWAL = [
  { nama: "Espresso", deskripsi: "Double shot single origin Gayo", harga: 18000, kategori: "Kopi", urutan: 1 },
  { nama: "Americano", deskripsi: "Espresso dengan air panas, ringan & bersih", harga: 22000, kategori: "Kopi", urutan: 2 },
  { nama: "Cappuccino", deskripsi: "Perpaduan espresso dan susu berbusa lembut", harga: 28000, kategori: "Kopi", urutan: 3 },
  { nama: "Kopi Susu Senja", deskripsi: "Signature: espresso, susu segar, gula aren", harga: 25000, kategori: "Kopi", urutan: 4 },
  { nama: "V60 Manual Brew", deskripsi: "Diseduh perlahan, cita rasa fruity", harga: 30000, kategori: "Kopi", urutan: 5 },
  { nama: "Matcha Latte", deskripsi: "Matcha premium dengan susu segar", harga: 30000, kategori: "Non-Kopi", urutan: 6 },
  { nama: "Chocolate Senja", deskripsi: "Cokelat pekat dengan marshmallow", harga: 28000, kategori: "Non-Kopi", urutan: 7 },
  { nama: "Butter Croissant", deskripsi: "Panggang renyah, cocok teman kopi", harga: 22000, kategori: "Snack", urutan: 8 },
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
