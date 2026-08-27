import { asc } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems, menuItems } from "@/db/schema";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { Gallery } from "@/components/gallery";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.urutan), asc(menuItems.id));

  const galeri = await db
    .select()
    .from(galleryItems)
    .orderBy(asc(galleryItems.urutan), asc(galleryItems.id));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection items={items} />
        <Gallery items={galeri} />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
