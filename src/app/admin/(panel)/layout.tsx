import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  logoutAction,
} from "../actions";
import { verifySessionFromToken } from "@/lib/auth";

const COOKIE_NAME = "kopi_session";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const session = await verifySessionFromToken(
    store.get(COOKIE_NAME)?.value
  );
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <p className="font-serif font-bold text-stone-900">
              Kopi <span className="text-amber-700">Senja</span>
              <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 align-middle text-[10px] font-sans font-semibold uppercase tracking-wide text-stone-500">
                Admin
              </span>
            </p>
            <Link
              href="/admin"
              className="text-sm text-stone-600 hover:text-amber-700"
            >
              Kelola Menu
            </Link>
            <Link
              href="/admin/galeri"
              className="text-sm text-stone-600 hover:text-amber-700"
            >
              Kelola Galeri
            </Link>
            <Link
              href="/admin/bisnis"
              className="text-sm text-stone-600 hover:text-amber-700"
            >
              Kelola Bisnis
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700"
            >
              Lihat Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full bg-stone-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
