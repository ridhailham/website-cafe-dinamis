import { asc } from "drizzle-orm";
import { db } from "@/db";
import { bisnis, jamBuka } from "@/db/schema";
import { BisnisForm } from "../../bisnis-form";
import { PesanError } from "../../menu-form";

export const metadata = {
  title: "Kelola Bisnis — Admin Kopi Senja",
};

export default async function KelolaBisnisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; berhasil?: string }>;
}) {
  const { error, berhasil } = await searchParams;

  const [data] = await db.select().from(bisnis).limit(1);
  const jam = await db.select().from(jamBuka).orderBy(asc(jamBuka.urutan));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">Kelola Bisnis</h1>
        <p className="mt-1 text-sm text-stone-500">
          Atur nomor WhatsApp, peta Google Maps, dan jam buka yang tampil di
          website. Perubahan langsung tampil di halaman depan.
        </p>
      </div>

      {berhasil === "1" && (
        <p className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Data bisnis berhasil disimpan.
        </p>
      )}

      <PesanError kode={error} />
      <BisnisForm bisnis={data} jamBuka={jam} />
    </div>
  );
}
