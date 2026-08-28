import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { count, eq } from "drizzle-orm";
import { menuItems } from "../src/db/schema";

config({ path: ".env.local" });
config();

// Target jumlah item per kategori (sesuai permintaan: 100 makanan + 100 minuman).
const TARGET_PER_KATEGORI = 100;

// Kumpulan data contoh untuk minuman (dipilih bertahap agar tidak duplikat saat dijalankan ulang).
const DATA_MINUMAN: { nama: string; deskripsi: string; harga: number }[] = [
  { nama: "Espresso", deskripsi: "Double shot single origin Gayo", harga: 18000 },
  { nama: "Americano", deskripsi: "Espresso dengan air panas, ringan & bersih", harga: 22000 },
  { nama: "Cappuccino", deskripsi: "Perpaduan espresso dan susu berbusa lembut", harga: 28000 },
  { nama: "Kopi Susu Senja", deskripsi: "Signature: espresso, susu segar, gula aren", harga: 25000 },
  { nama: "V60 Manual Brew", deskripsi: "Diseduh perlahan, cita rasa fruity", harga: 30000 },
  { nama: "Cafe Latte", deskripsi: "Espresso dengan susu steamed, creamy & smooth", harga: 28000 },
  { nama: "Mocha", deskripsi: "Espresso, cokelat, dan susu — manis & nikmat", harga: 30000 },
  { nama: "Es Kopi Susu", deskripsi: "Kopi dingin, susu segar, gula aren, es batu", harga: 25000 },
  { nama: "Avocado Coffee", deskripsi: "Alpukat creamy, espresso, susu, gula aren", harga: 32000 },
  { nama: "Matcha Latte", deskripsi: "Matcha premium dengan susu segar", harga: 30000 },
  { nama: "Chocolate Senja", deskripsi: "Cokelat pekat dengan marshmallow", harga: 28000 },
  { nama: "Teh Tarik", deskripsi: "Teh susu khas Malaysia, ditarik hingga berbusa", harga: 20000 },
  { nama: "Kopi Jahe", deskripsi: "Espresso, jahe hangat, gula aren, susu", harga: 27000 },
  { nama: "Es Jeruk Segar", deskripsi: "Jeruk peras segar, manis alami, es batu", harga: 18000 },
  { nama: "Fresh Lemon Tea", deskripsi: "Teh hijau dengan perasan lemon segar", harga: 20000 },
  { nama: "Flat White", deskripsi: "Espresso double dengan susu steamed, velvety", harga: 30000 },
  { nama: "Affogato", deskripsi: "Espresso dituang di atas vanilla ice cream", harga: 28000 },
  { nama: "Macchiato", deskripsi: "Espresso dengan sedikit busa susu", harga: 26000 },
  { nama: "Thai Tea", deskripsi: "Teh Thailand dengan susu dan es batu", harga: 22000 },
  { nama: "Susu Jahe", deskripsi: "Susu hangat dengan jahe segar & gula aren", harga: 22000 },
  { nama: "Caramel Macchiato", deskripsi: "Espresso, susu, dan sirup karamel", harga: 30000 },
  { nama: "Es Teh Manis", deskripsi: "Teh manis dingin, segar & klasik", harga: 10000 },
  { nama: "Kopi Tubruk", deskripsi: "Kopi tradisional, kental & pekat", harga: 15000 },
  { nama: "Berry Smoothie", deskripsi: "Campuran berries segar, yogurt, & madu", harga: 32000 },
  { nama: "Mango Smoothie", deskripsi: "Mangga segar, yogurt, dan es batu", harga: 28000 },
  { nama: "Strawberry Milk", deskripsi: "Susu segar dengan strawberry crush", harga: 26000 },
  { nama: "Banana Latte", deskripsi: "Espresso, susu, dan pure pisang", harga: 30000 },
  { nama: "Hazelnut Latte", deskripsi: "Espresso dengan sirup hazelnut & susu", harga: 32000 },
  { nama: "Vanilla Latte", deskripsi: "Espresso dengan sirup vanilla & susu steamed", harga: 30000 },
  { nama: "Double Espresso", deskripsi: "Dua shot espresso pekat single origin", harga: 24000 },
  { nama: "Long Black", deskripsi: "Espresso dengan tambahan air panas", harga: 22000 },
  { nama: "Cortado", deskripsi: "Espresso dengan susu hangat seimbang", harga: 26000 },
  { nama: "Picolo Latte", deskripsi: "Espresso kecil dengan banyak susu steamed", harga: 24000 },
  { nama: "Ristretto", deskripsi: "Shot espresso pendek dan kental", harga: 20000 },
  { nama: "Cold Brew", deskripsi: "Kopi seduh dingin 18 jam, halus & rendah asam", harga: 28000 },
  { nama: "Nitro Cold Brew", deskripsi: "Cold brew dengan nitro creamy & halus", harga: 32000 },
  { nama: "Iced Americano", deskripsi: "Americano dingin dengan es batu", harga: 24000 },
  { nama: "Iced Matcha", deskripsi: "Matcha dingin dengan susu segar", harga: 30000 },
  { nama: "Iced Chocolate", deskripsi: "Cokelat dingin dengan whipped cream", harga: 28000 },
  { nama: "Iced Mocha", deskripsi: "Mocha dingin dengan es & whipped cream", harga: 32000 },
  { nama: "Vietnam Drip", deskripsi: "Kopi Vietnam drip dengan susu kental manis", harga: 22000 },
  { nama: "Milk Tea", deskripsi: "Teh susu klasik dengan gula aren", harga: 20000 },
  { nama: "Oolong Tea", deskripsi: "Teh oolong premium, hangat & menyegarkan", harga: 18000 },
  { nama: "Jasmine Tea", deskripsi: "Teh melati harum yang menenangkan", harga: 18000 },
  { nama: "Green Tea", deskripsi: "Teh hijau segar, hangat", harga: 16000 },
  { nama: "Chamomile Tea", deskripsi: "Teh chamomile herbal menenangkan", harga: 20000 },
  { nama: "Peach Tea", deskripsi: "Teh persik dingin dengan es batu", harga: 24000 },
  { nama: "Lychee Tea", deskripsi: "Teh leci manis dingin", harga: 26000 },
  { nama: "Mango Tea", deskripsi: "Teh mangga tropis dingin", harga: 26000 },
  { nama: "Blue Lagoon", deskripsi: "Minuman soda biru segar dengan jeruk", harga: 22000 },
  { nama: "Soda Gembira", deskripsi: "Soda susu lezat tempo dulu", harga: 20000 },
  { nama: "Es Kopyor", deskripsi: "Kelapa kopyor dengan sirup gula aren", harga: 24000 },
  { nama: "Es Campur", deskripsi: "Aneka buah segar dengan es serut & sirup", harga: 22000 },
  { nama: "Es Doger", deskripsi: "Es serut khas dengan santan & buah", harga: 20000 },
  { nama: "Es Teler", deskripsi: "Alpukat, kelapa muda, nangka, es & susu", harga: 24000 },
  { nama: "Es Degan", deskripsi: "Kelapa muda segar dengan es batu", harga: 18000 },
  { nama: "Jus Alpukat", deskripsi: "Alpukat segar dengan susu kental manis", harga: 22000 },
  { nama: "Jus Mangga", deskripsi: "Mangga harum manis segar peras", harga: 20000 },
  { nama: "Jus Jambu", deskripsi: "Jambu merah segar tanpa gula tambahan", harga: 18000 },
  { nama: "Jus Sirsak", deskripsi: "Sirsak segar dengan sentuhan susu", harga: 24000 },
  { nama: "Jus Naga", deskripsi: "Buah naga merah segar & menyegarkan", harga: 20000 },
  { nama: "Jus Nanas", deskripsi: "Nanas segar manis asam", harga: 18000 },
  { nama: "Jus Wortel", deskripsi: "Wortel segar menyehatkan", harga: 16000 },
  { nama: "Jus Tomat", deskripsi: "Tomat segar dengan sedikit perasan jeruk", harga: 16000 },
  { nama: "Cincau Dingin", deskripsi: "Cincau hitam dengan susu & sirup gula", harga: 18000 },
  { nama: "Black Forest Latte", deskripsi: "Espresso, susu, sirup cokelat & cherry", harga: 32000 },
  { nama: "Pandan Latte", deskripsi: "Espresso dengan aroma pandan & susu", harga: 30000 },
  { nama: "Gula Aren Latte", deskripsi: "Espresso dengan gula aren & susu", harga: 30000 },
  { nama: "Salted Caramel Latte", deskripsi: "Espresso, susu, caramel asin", harga: 32000 },
  { nama: "White Mocha", deskripsi: "Espresso, cokelat putih & susu", harga: 32000 },
  { nama: "Cafe Ole", deskripsi: "Kopi ala Meksiko dengan rempah", harga: 26000 },
  { nama: "Kopi Rempah", deskripsi: "Kopi dengan campuran rempah hangat", harga: 28000 },
  { nama: "Kopi Aren", deskripsi: "Kopi dengan gula aren alami", harga: 25000 },
  { nama: "Kopi Kelapa", deskripsi: "Kopi dengan es kelapa muda", harga: 28000 },
  { nama: "Kopi Jeruk", deskripsi: "Espresso dengan perasan jeruk segar", harga: 26000 },
  { nama: "Kopi Soda", deskripsi: "Espresso dengan soda dan es", harga: 26000 },
  { nama: "Kopi Tonic", deskripsi: "Espresso dengan air tonic & jeruk nipis", harga: 28000 },
  { nama: "Raspberry Smoothie", deskripsi: "Raspberry segar dengan yogurt", harga: 32000 },
  { nama: "Kiwi Smoothie", deskripsi: "Kiwi segar dengan madu", harga: 30000 },
  { nama: "Papaya Smoothie", deskripsi: "Pepaya segar dengan yogurt", harga: 28000 },
  { nama: "Green Detox Smoothie", deskripsi: "Bayam, apel, jeruk & chia", harga: 32000 },
  { nama: "Peanut Smoothie", deskripsi: "Selai kacang, pisang & susu", harga: 30000 },
  { nama: "Choco Peanut Smoothie", deskripsi: "Cokelat & selai kacang creamy", harga: 32000 },
  { nama: "Vanilla Milkshake", deskripsi: "Milkshake vanilla lembut", harga: 26000 },
  { nama: "Strawberry Milkshake", deskripsi: "Milkshake strawberry manis", harga: 28000 },
  { nama: "Chocolate Milkshake", deskripsi: "Milkshake cokelat pekat", harga: 28000 },
  { nama: "Cookies & Cream Shake", deskripsi: "Milkshake dengan biskuit oreo", harga: 30000 },
  { nama: "Matcha Milkshake", deskripsi: "Milkshake matcha dengan es krim", harga: 30000 },
  { nama: "Lemon Squash", deskripsi: "Lemon segar dengan soda & es", harga: 22000 },
  { nama: "Orange Squash", deskripsi: "Jeruk segar dengan soda", harga: 22000 },
  { nama: "Lychee Squash", deskripsi: "Leci segar dengan soda", harga: 24000 },
  { nama: "Mango Squash", deskripsi: "Mangga segar dengan soda", harga: 24000 },
  { nama: "Honey Lemon", deskripsi: "Madu & lemon hangat menyehatkan", harga: 20000 },
  { nama: "Ginger Tea", deskripsi: "Teh jahe hangat", harga: 18000 },
  { nama: "Bandrek", deskripsi: "Minuman hangat jahe & gula merah", harga: 16000 },
  { nama: "Bajigur", deskripsi: "Minuman hangat kelapa & gula aren", harga: 16000 },
  { nama: "Wedang Ronde", deskripsi: "Minuman hangat dengan bola ketan", harga: 18000 },
  { nama: "Sekoteng", deskripsi: "Minuman hangat jahe dengan isian", harga: 18000 },
  { nama: "Es Kelapa Muda", deskripsi: "Kelapa muda segar, gula & es", harga: 20000 },
  { nama: "Es Jeruk Nipis", deskripsi: "Jeruk nipis segar dingin", harga: 16000 },
  { nama: "Es Sirsak Susu", deskripsi: "Sirsak segar dengan susu", harga: 22000 },
];

const DATA_MAKANAN: { nama: string; deskripsi: string; harga: number }[] = [
  { nama: "Butter Croissant", deskripsi: "Panggang renyah, cocok teman kopi", harga: 22000 },
  { nama: "Nasi Goreng Kampung", deskripsi: "Nasi goreng kampung dengan telur mata sapi & kerupuk", harga: 28000 },
  { nama: "Mie Ayam Jamur", deskripsi: "Mie ayam dengan jamur, pangsit, dan bakso", harga: 25000 },
  { nama: "Roti Bakar Cokelat", deskripsi: "Roti gandum panggang, selai cokelat, keju parut", harga: 20000 },
  { nama: "Pisang Goreng Keju", deskripsi: "Pisang goreng renyah, taburan keju & condensed milk", harga: 18000 },
  { nama: "Kentang Goreng", deskripsi: "Kentang goreng renyah dengan saus sambal", harga: 18000 },
  { nama: "Risol Mayo", deskripsi: "Risol goreng renyah, isian mayo & smoked beef", harga: 5000 },
  { nama: "Sandwich Telur", deskripsi: "Roti gandum, telur, selada, tomat, mayo", harga: 22000 },
  { nama: "Ayam Geprek", deskripsi: "Ayam goreng crispy dengan sambal geprek pedas", harga: 28000 },
  { nama: "Chicken Katsu", deskripsi: "Chicken katsu tepung renyah dengan saus tonkatsu", harga: 30000 },
  { nama: "Spaghetti Carbonara", deskripsi: "Spaghetti dengan saus carbonara creamy & smoked beef", harga: 32000 },
  { nama: "Nasi Padang", deskripsi: "Nasi dengan rendang, sayur nangka, dan sambal", harga: 30000 },
  { nama: "Gado-Gado", deskripsi: "Sayur rebus dengan bumbu kacang segar", harga: 22000 },
  { nama: "Martabak Manis", deskripsi: "Martabak manis dengan meses & keju", harga: 18000 },
  { nama: "Kue Cubit", deskripsi: "Kue cubit mini dengan meses & keju parut", harga: 12000 },
  { nama: "Tahu Gejrot", deskripsi: "Tahu goreng dengan bumbu kuah pedas manis", harga: 15000 },
  { nama: "Sosis Bakar", deskripsi: "Sosis panggang dengan saus BBQ & mustard", harga: 18000 },
  { nama: "Bakmie Ayam", deskripsi: "Mie ayam dengan pangsit goreng & bakso", harga: 25000 },
  { nama: "Toast Alpukat", deskripsi: "Roti panggang dengan alpukat, telur & chili flake", harga: 28000 },
  { nama: "Onigiri", deskripsi: "Nasi Jepang dengan isian salmon & nori", harga: 18000 },
  { nama: "French Toast", deskripsi: "Roti goreng mentega dengan madu & pisang", harga: 22000 },
  { nama: "Tteokbokki", deskripsi: "Kue beras Korea dengan saus gochujang pedas", harga: 22000 },
  { nama: "Cireng Bumbu Rujak", deskripsi: "Cireng goreng tepung dengan bumbu rujak pedas", harga: 12000 },
  { nama: "Pudding Cokelat", deskripsi: "Pudding cokelat Belgian dengan whipped cream", harga: 18000 },
  { nama: "Cheesecake Slice", deskripsi: "New York style cheesecake dengan berry compote", harga: 25000 },
  { nama: "Nasi Ayam Geprek", deskripsi: "Nasi dengan ayam geprek sambal bawang", harga: 28000 },
  { nama: "Nasi Goreng Spesial", deskripsi: "Nasi goreng dengan udang, sosis & telur", harga: 32000 },
  { nama: "Nasi Goreng Merah", deskripsi: "Nasi goreng merah khas Medan", harga: 30000 },
  { nama: "Nasi Goreng Gila", deskripsi: "Nasi goreng dengan aneka topping pedas", harga: 33000 },
  { nama: "Nasi Goreng Jawa", deskripsi: "Nasi goreng Jawa dengan sambal terasi", harga: 28000 },
  { nama: "Nasi Goreng Ikan Asin", deskripsi: "Nasi goreng dengan ikan asin jambal", harga: 30000 },
  { nama: "Kwetiau Goreng", deskripsi: "Kwetiau goreng dengan telur & sayur", harga: 30000 },
  { nama: "Bihun Goreng", deskripsi: "Bihun goreng dengan sayur segar", harga: 25000 },
  { nama: "Mie Goreng Jawa", deskripsi: "Mie goreng Jawa dengan bumbu khas", harga: 25000 },
  { nama: "Indomie Goreng Telur", deskripsi: "Mie goreng instan dengan telur", harga: 18000 },
  { nama: "Sate Ayam", deskripsi: "Sate ayam dengan bumbu kacang", harga: 28000 },
  { nama: "Sate Usus", deskripsi: "Sate usus ayam pedas mercon", harga: 20000 },
  { nama: "Rendang Daging", deskripsi: "Rendang daging empuk khas Padang", harga: 35000 },
  { nama: "Ayam Bakar", deskripsi: "Ayam bakar bumbu kecap manis", harga: 30000 },
  { nama: "Ayam Pop", deskripsi: "Ayam pop goreng renyah khas Minang", harga: 28000 },
  { nama: "Ayam Penyet", deskripsi: "Ayam penyet dengan sambal super pedas", harga: 28000 },
  { nama: "Ikan Goreng", deskripsi: "Ikan goreng segar dengan sambal", harga: 32000 },
  { nama: "Ikan Bakar", deskripsi: "Ikan bakar bumbu kuning", harga: 35000 },
  { nama: "Gurame Bakar", deskripsi: "Gurame bakar dengan sambal kecap", harga: 40000 },
  { nama: "Udang Goreng", deskripsi: "Udang goreng tepung renyah", harga: 35000 },
  { nama: "Cumi Goreng Tepung", deskripsi: "Cumi tepung crispy dengan saus mayo", harga: 32000 },
  { nama: "Tempe Goreng", deskripsi: "Tempe goreng gurih", harga: 10000 },
  { nama: "Tahu Goreng", deskripsi: "Tahu goreng crispy", harga: 10000 },
  { nama: "Pecel Lele", deskripsi: "Lele goreng dengan sambal & lalapan", harga: 22000 },
  { nama: "Lalapan Ayam", deskripsi: "Ayam goreng dengan lalapan & sambal", harga: 25000 },
  { nama: "Karedok", deskripsi: "Sayuran mentah dengan bumbu kacang", harga: 20000 },
  { nama: "Urap Sayur", deskripsi: "Sayuran rebus dengan kelapa parut berbumbu", harga: 18000 },
  { nama: "Capcay", deskripsi: "Sayuran tumis campur ala Chinese", harga: 25000 },
  { nama: "Sup Ayam", deskripsi: "Sup ayam hangat dengan sayur", harga: 24000 },
  { nama: "Soto Ayam", deskripsi: "Soto ayam dengan tauco & kerupuk", harga: 25000 },
  { nama: "Soto Betawi", deskripsi: "Soto betawi berkuah santan", harga: 28000 },
  { nama: "Bakso Sapi", deskripsi: "Bakso sapi dengan kuah kaldu hangat", harga: 22000 },
  { nama: "Mie Bakso", deskripsi: "Mie dengan bakso sapi & kuah", harga: 25000 },
  { nama: "Bakso Urat", deskripsi: "Bakso urat kenyal spesial", harga: 25000 },
  { nama: "Bakso Mercon", deskripsi: "Bakso dengan sambal mercon pedas", harga: 26000 },
  { nama: "Siu Mie", deskripsi: "Siu mie ayam dengan kuah kental", harga: 28000 },
  { nama: "Yoshinoya Beef Bowl", deskripsi: "Beef bowl ala Jepang dengan saus teriyaki", harga: 34000 },
  { nama: "Chicken Teriyaki Bowl", deskripsi: "Ayam teriyaki dengan nasi hangat", harga: 32000 },
  { nama: "Salmon Teriyaki Bowl", deskripsi: "Salmon teriyaki dengan nasi & sayur", harga: 40000 },
  { nama: "Katsu Curry Rice", deskripsi: "Chicken katsu dengan saus kari Jepang", harga: 35000 },
  { nama: "Omelette Rice", deskripsi: "Nasi dengan omelet saus khas Jepang", harga: 30000 },
  { nama: "Gyudon", deskripsi: "Nasi dengan daging sapi saus manis", harga: 34000 },
  { nama: "Yaki Soba", deskripsi: "Mie goreng Jepang dengan sayur & daging", harga: 32000 },
  { nama: "Takoyaki", deskripsi: "Bola gurita Jepang dengan saus & mayo", harga: 22000 },
  { nama: "Okonomiyaki", deskripsi: "Panekuk Jepang dengan isian seafood", harga: 30000 },
  { nama: "Gyoza", deskripsi: "Pangsit Jepang goreng isi ayam", harga: 24000 },
  { nama: "Tempura", deskripsi: "Udang & sayur goreng tepung Jepang", harga: 30000 },
  { nama: "Tuna Sandwich", deskripsi: "Roti segar dengan isian tuna salad", harga: 26000 },
  { nama: "Chicken Sandwich", deskripsi: "Sandwich ayam dengan selada & mayo", harga: 26000 },
  { nama: "Club Sandwich", deskripsi: "Sandwich lapis ayam, telur, tomat", harga: 28000 },
  { nama: "Tuna Melt Toast", deskripsi: "Roti panggang leleh dengan tuna & keju", harga: 28000 },
  { nama: "Cheese Toast", deskripsi: "Roti panggang dengan keju leleh", harga: 20000 },
  { nama: "Beef Burger", deskripsi: "Burger sapi dengan keju & saus", harga: 30000 },
  { nama: "Chicken Burger", deskripsi: "Burger ayam crispy dengan selada", harga: 28000 },
  { nama: "Fish Burger", deskripsi: "Burger ikan goreng dengan tartar sauce", harga: 28000 },
  { nama: "Mushroom Burger", deskripsi: "Burger vegetarian dengan jamur panggang", harga: 28000 },
  { nama: "Fruit Salad", deskripsi: "Salad buah segar dengan yogurt", harga: 24000 },
  { nama: "Caesar Salad", deskripsi: "Selada romaine dengan saus caesar & ayam", harga: 28000 },
  { nama: "Chicken Salad", deskripsi: "Salad ayam dengan dressing lemon", harga: 26000 },
  { nama: "Garden Salad", deskripsi: "Salad sayur segar dengan balsamic", harga: 22000 },
  { nama: "Dumpling Ayam", deskripsi: "Dumpling ayam kukus/goreng", harga: 22000 },
  { nama: "Popcorn Chicken", deskripsi: "Ayam goreng kecil crispy", harga: 20000 },
  { nama: "Chicken Wings", deskripsi: "Sayap ayam dengan saus pedas manis", harga: 28000 },
  { nama: "Nugget Ayam", deskripsi: "Nugget ayam goreng dengan saus", harga: 18000 },
  { nama: "Siomay", deskripsi: "Siomay ayam dengan bumbu kacang", harga: 18000 },
  { nama: "Batagor", deskripsi: "Bakso tahu goreng dengan bumbu kacang", harga: 18000 },
  { nama: "Otak-Otak Bakar", deskripsi: "Otak-otak panggang dengan sambal", harga: 20000 },
  { nama: "Cimol", deskripsi: "Cimol goreng kenyal dengan bumbu", harga: 10000 },
  { nama: "Donat Kentang", deskripsi: "Donat lembut kentang dengan gula halus", harga: 15000 },
  { nama: "Donat Glaze", deskripsi: "Donat klasik dengan glaze manis", harga: 15000 },
  { nama: "Cinnamon Roll", deskripsi: "Roti gulung kayu manis dengan icing", harga: 24000 },
  { nama: "Pancake Madu", deskripsi: "Pancake lembut dengan madu & mentega", harga: 26000 },
  { nama: "Waffle Cokelat", deskripsi: "Waffle dengan saus cokelat & es krim", harga: 28000 },
  { nama: "Banana Pancake", deskripsi: "Pancake pisang dengan sirup maple", harga: 26000 },
  { nama: "Lumpia Semarang", deskripsi: "Lumpia goreng isi rebung & ayam", harga: 20000 },
  { nama: "Pastel Goreng", deskripsi: "Pastel goreng isi sayur & daging", harga: 18000 },
  { nama: "Pisang Bakar", deskripsi: "Pisang bakar dengan meses & keju", harga: 20000 },
  { nama: "Tempe Mendoan", deskripsi: "Tempe mendoan renyah tipis", harga: 12000 },
  { nama: "Kentang Wedges", deskripsi: "Kentang potong panggang dengan saus", harga: 18000 },
  { nama: "Onion Rings", deskripsi: "Cincin bawang goreng renyah", harga: 18000 },
  { nama: "Cheese Stick", deskripsi: "Stik keju goreng renyah", harga: 18000 },
  { nama: "Puding Caramel", deskripsi: "Puding caramel lembut dengan saus", harga: 18000 },
  { nama: "Mango Sticky Rice", deskripsi: "Ketan mangga Thailand dengan santan", harga: 28000 },
  { nama: "Es Krim Vanilla", deskripsi: "Es krim vanilla dengan topping", harga: 16000 },
  { nama: "Es Krim Cokelat", deskripsi: "Es krim cokelat dengan topping", harga: 16000 },
  { nama: "Brownies Fudge", deskripsi: "Brownies fudge cokelat pekat", harga: 20000 },
  { nama: "Tiramisu", deskripsi: "Tiramisu klasik dengan mascarpone", harga: 28000 },
  { nama: "Red Velvet Cake", deskripsi: "Red velvet cake dengan cream cheese", harga: 28000 },
  { nama: "Banana Bread", deskripsi: "Roti pisang lembut dengan walnut", harga: 22000 },
];

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!));

  const ambilCount = async (kategori: string) =>
    (
      await db
        .select({ tot: count() })
        .from(menuItems)
        .where(eq(menuItems.kategori, kategori))
    )[0].tot;

  const minumanNow = await ambilCount("Minuman");
  const makananNow = await ambilCount("Makanan");

  console.log(
    `Sebelum: Minuman=${minumanNow}, Makanan=${makananNow} (target ${TARGET_PER_KATEGORI} tiap kategori)`
  );

  const urutanAwal = await (async () => {
    const semua = await db.select().from(menuItems);
    if (semua.length === 0) return 1;
    return Math.max(...semua.map((s) => s.urutan)) + 1;
  })();

  const tambah = async (
    kategori: "Minuman" | "Makanan",
    data: { nama: string; deskripsi: string; harga: number }[],
    sekarang: number
  ) => {
    const butuh = TARGET_PER_KATEGORI - sekarang;
    if (butuh <= 0) {
      console.log(`${kategori}: sudah ${sekarang}, tidak perlu tambah.`);
      return;
    }
    const batch = data.slice(sekarang, sekarang + butuh);
    const rows = batch.map((d, i) => ({
      ...d,
      kategori,
      urutan: urutanAwal + i,
      gambarUrl: null,
    }));
    await db.insert(menuItems).values(rows);
    console.log(`${kategori}: menambah ${rows.length} item (total jadi ${sekarang + rows.length}).`);
  };

  await tambah("Minuman", DATA_MINUMAN, minumanNow);
  await tambah("Makanan", DATA_MAKANAN, makananNow);

  const minumanAfter = await ambilCount("Minuman");
  const makananAfter = await ambilCount("Makanan");
  console.log(
    `Sesudah: Minuman=${minumanAfter}, Makanan=${makananAfter}, Total=${minumanAfter + makananAfter}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed menu gagal:", err);
    process.exit(1);
  });
