import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login Admin — Kopi Senja",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-bold text-stone-900">
            Kopi <span className="text-amber-700">Senja</span>
          </p>
          <p className="mt-1 text-sm text-stone-500">Panel Admin</p>
        </div>

        <LoginForm />

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-stone-400 hover:text-stone-600"
        >
          ← Kembali ke website
        </Link>
      </div>
    </main>
  );
}
