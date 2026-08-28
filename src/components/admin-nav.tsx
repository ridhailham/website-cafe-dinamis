"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Kelola Menu" },
  { href: "/admin/galeri", label: "Kelola Galeri" },
  { href: "/admin/bisnis", label: "Kelola Bisnis" },
  { href: "/admin/pengaturan", label: "Pengaturan" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/baru") ||
        pathname.startsWith("/admin/edit")
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex items-center gap-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm transition-colors ${
            isActive(l.href)
              ? "font-semibold text-amber-700"
              : "text-stone-600 hover:text-amber-700"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}