import { asc } from "drizzle-orm";
import { db } from "@/db";
import { bisnis, galleryItems, jamBuka, menuItems } from "@/db/schema";
import { kedai } from "@/data/kedai";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { Gallery } from "@/components/gallery";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

function buatWaUrl(nomor: string, teks: string) {
  const n = (nomor || "").replace(/\D/g, "");
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(teks || "")}`;
}

export default async function Home() {
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.urutan), asc(menuItems.id));

  const galeri = await db
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.urutan), asc(galleryItems.id));

  const [data] = await db.select().from(bisnis).limit(1);
  const jam = await db.select().from(jamBuka).orderBy(asc(jamBuka.urutan));

  const waUrl =
    buatWaUrl(data?.waNomor ?? "", data?.waTeks ?? "") || kedai.wa.url;
  const jamBukaData =
    jam.length > 0 ? jam.map((j) => ({ hari: j.hari, jam: j.jam })) : undefined;
  const mapsEmbed = data?.mapsEmbed || undefined;

  return (
    <>
      <Navbar waUrl={waUrl} />
      <main className="flex-1">
        <Hero waUrl={waUrl} />
        <MenuSection items={items} />
        <Gallery items={galeri} />
        <LocationSection
          waUrl={waUrl}
          jamBuka={jamBukaData}
          mapsEmbed={mapsEmbed}
        />
      </main>
      <Footer waUrl={waUrl} />
    </>
  );
}
