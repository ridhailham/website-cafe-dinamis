import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { DeleteButton } from "../delete-button";
import { AdminToast } from "../alert";
import { pesanOk } from "../messages";
import { formatHarga } from "@/lib/constants";

export const metadata = {
  title: "Kelola Menu — Admin Kopi Senja",
};

const PAGE_SIZE = 10;
const TABS = [
  { label: "Semua", href: "/admin" },
  { label: "Minuman", href: "/admin?kategori=Minuman" },
  { label: "Makanan", href: "/admin?kategori=Makanan" },
] as const;

function paginationHref(kategori: string | undefined, page: number) {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin${qs ? `?${qs}` : ""}`;
}

// Jendela halaman yang ditampilkan di pagination: maks ~5 angka + ellipsis.
function rentangHalaman(page: number, totalPages: number): (number | "…")[] {
  const n = totalPages;
  const p = page;
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);

  if (p <= 4) return [1, 2, 3, 4, 5, "…", n];
  if (p >= n - 3) return [1, "…", n - 4, n - 3, n - 2, n - 1, n];

  return [1, "…", p - 1, p, p + 1, "…", n];
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; page?: string; ok?: string }>;
}) {
  const { kategori: rawKat, page: rawPage, ok } = await searchParams;
  const kategori =
    rawKat === "Minuman" || rawKat === "Makanan" ? rawKat : undefined;
  const sukses = pesanOk(ok);

  const where = kategori ? eq(menuItems.kategori, kategori) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(menuItems)
    .where(where);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.max(1, Math.min(Number(rawPage) || 1, totalPages));

  const items = await db
    .select()
    .from(menuItems)
    .where(where)
    .orderBy(asc(menuItems.urutan), asc(menuItems.id))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return (
    <div>
      {sukses && <AdminToast type="success" pesan={sukses} />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Kelola Menu</h1>
          <p className="mt-1 text-sm text-stone-500">
            {total} item terdaftar. Perubahan langsung tampil di website.
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

      <div className="mb-4 flex gap-2">
        {TABS.map((tab) => {
          const active =
            tab.label === "Semua" ? !kategori : kategori === tab.label;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-amber-600 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
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
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-stone-500"
                >
                  Belum ada menu. Klik &ldquo;Tambah Menu&rdquo; untuk mulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            Menampilkan {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} dari {total} item
          </p>

          <div className="flex items-center justify-center gap-1 text-sm">
            <Link
              href={paginationHref(kategori, page - 1)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                page <= 1
                  ? "pointer-events-none text-stone-300"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              &lsaquo; Prev
            </Link>
            {rentangHalaman(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span
                  key={`e${i}`}
                  className="px-1 text-stone-400"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={paginationHref(kategori, p)}
                  className={`min-w-[2rem] rounded-full px-3 py-1.5 text-center font-medium transition-colors ${
                    p === page
                      ? "bg-amber-600 text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {p}
                </Link>
              )
            )}
            <Link
              href={paginationHref(kategori, page + 1)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                page >= totalPages
                  ? "pointer-events-none text-stone-300"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              Next &rsaquo;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
