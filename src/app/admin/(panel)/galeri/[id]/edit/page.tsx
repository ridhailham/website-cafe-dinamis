import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { GaleriForm } from "../../../../galeri-form";
import { PesanError } from "../../../../menu-form";

export const metadata = {
  title: "Edit Foto Galeri — Admin Kopi Senja",
};

export default async function EditGaleriPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const itemId = Number(id);

  if (!Number.isInteger(itemId)) notFound();

  const [item] = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, itemId))
    .limit(1);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/galeri"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar galeri
      </Link>

      <h1 className="mb-6 text-xl font-bold text-stone-900">Edit Foto Galeri</h1>

      <PesanError kode={error} />
      <GaleriForm item={item} />
    </div>
  );
}
