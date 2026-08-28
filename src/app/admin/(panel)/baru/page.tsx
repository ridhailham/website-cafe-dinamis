import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MenuForm } from "../../menu-form";
import {
  AdminToast,
  pesanError,
} from "../../alert";

export const metadata = {
  title: "Tambah Menu — Admin Kopi Senja",
};

export default async function TambahMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const pesan = pesanError(error);

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

      <h1 className="mb-6 text-xl font-bold text-stone-900">Tambah Menu Baru</h1>

      <MenuForm />
    </div>
  );
}
