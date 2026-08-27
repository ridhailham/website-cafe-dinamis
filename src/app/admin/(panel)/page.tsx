import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { DeleteButton } from "../delete-button";
import { formatHarga } from "@/lib/constants";

export const metadata = {
  title: "Kelola Menu — Admin Kopi Senja",
};

export default async function AdminDashboard() {
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.urutan), asc(menuItems.id));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Kelola Menu</h1>
          <p className="mt-1 text-sm text-stone-500">
            {items.length} item terdaftar. Perubahan langsung tampil di website.
          </p>
        </div>
        <Link
          href="/admin/baru"
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Menu
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Menu</th>
              <th className="px-5 py-3 font-semibold">Kategori</th>
              <th className="px-5 py-3 font-semibold">Harga</th>
              <th className="px-5 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-stone-900">{item.nama}</p>
                  {item.deskripsi && (
                    <p className="mt-0.5 max-w-xs truncate text-xs text-stone-500">
                      {item.deskripsi}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {item.kategori}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium text-stone-800">
                  {formatHarga(item.harga)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/edit/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </a>
                    <DeleteButton id={item.id} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-stone-500">
                  Belum ada menu. Klik &ldquo;Tambah Menu&rdquo; untuk mulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
