import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { Gallery } from "@/components/gallery";
import { Testimonials } from "@/components/testimonials";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";
import { FloatingWA } from "@/components/floating-wa";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.tersedia, true))
    .orderBy(asc(menuItems.urutan), asc(menuItems.id));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection items={items} />
        <Gallery />
        <Testimonials />
        <LocationSection />
      </main>
      <Footer />
      <FloatingWA />
    </>
  );
}
