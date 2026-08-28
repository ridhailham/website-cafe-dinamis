import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { MenuForm } from "../../../menu-form";
import { AdminToast } from "../../../alert";
import { pesanError } from "../../../messages";

export const metadata = {
  title: "Edit Menu — Admin Kopi Senja",
};

export default async function EditMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const itemId = Number(id);
  const pesan = pesanError(error);

  if (!Number.isInteger(itemId)) notFound();

  const [item] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.id, itemId))
    .limit(1);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      {pesan && <AdminToast type="error" pesan={pesan} />}

      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar menu
      </Link>

      <h1 className="mb-6 text-xl font-bold text-stone-900">
        Edit: {item.nama}
      </h1>

      <MenuForm item={item} />
    </div>
  );
}
