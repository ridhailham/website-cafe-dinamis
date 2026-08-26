import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MenuForm, PesanError } from "../../menu-form";

export const metadata = {
  title: "Tambah Menu — Admin Kopi Senja",
};

export default async function TambahMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar menu
      </Link>

      <h1 className="mb-6 text-xl font-bold text-stone-900">Tambah Menu Baru</h1>

      <PesanError kode={error} />
      <MenuForm />
    </div>
  );
}
