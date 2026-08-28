import { asc } from "drizzle-orm";
import { db } from "@/db";
import { bisnis, jamBuka } from "@/db/schema";
import { BisnisForm } from "../../bisnis-form";
import { AdminToast, pesanError, pesanOk } from "../../alert";

export const metadata = {
  title: "Kelola Bisnis — Admin Kopi Senja",
};

export default async function KelolaBisnisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const pesanError2 = pesanError(error);
  const sukses = pesanOk(ok);

  const [data] = await db.select().from(bisnis).limit(1);
  const jam = await db.select().from(jamBuka).orderBy(asc(jamBuka.urutan));

  return (
    <div>
      {sukses && <AdminToast type="success" pesan={sukses} />}
      {pesanError2 && <AdminToast type="error" pesan={pesanError2} />}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">Kelola Bisnis</h1>
        <p className="mt-1 text-sm text-stone-500">
          Atur nomor WhatsApp, peta Google Maps, dan jam buka yang tampil di
          website. Perubahan langsung tampil di halaman depan.
        </p>
      </div>

      <BisnisForm bisnis={data} jamBuka={jam} />
    </div>
  );
}
