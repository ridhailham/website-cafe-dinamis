"use client";

import { useActionState } from "react";
import {
  ubahSandiAction,
  ubahEmailAction,
  regenerateRecoveryAction,
  logoutSemuaPerangkatAction,
  type SandiState,
  type EmailState,
  type RecoveryState,
} from "./actions";
import { AdminBanner } from "./alert";

export function SettingsForm() {
  const [emailState, emailAction, emailPending] = useActionState<
    EmailState,
    FormData
  >(ubahEmailAction, {});

  const [sandiState, sandiAction, sandiPending] = useActionState<
    SandiState,
    FormData
  >(ubahSandiAction, {});

  const [recState, recAction, recPending] = useActionState<
    RecoveryState,
    FormData
  >(regenerateRecoveryAction, {});

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-900">Email Admin</h2>
        <p className="mt-1 text-sm text-stone-500">
          Ganti email yang dipakai untuk login. Perlu verifikasi sandi.
        </p>

        {emailState.error && (
          <div className="mt-4">
            <AdminBanner type="error" pesan={emailState.error} />
          </div>
        )}
        {emailState.ok && (
          <div className="mt-4">
            <AdminBanner type="success" pesan="Email admin berhasil diubah." />
          </div>
        )}

        <form action={emailAction} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="emailBaru"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Email Baru
            </label>
            <input
              id="emailBaru"
              name="emailBaru"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              placeholder="admin@kopisenja.id"
            />
          </div>
          <div>
            <label
              htmlFor="sandi"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Sandi (untuk verifikasi)
            </label>
            <input
              id="sandi"
              name="sandi"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>
          <button
            type="submit"
            disabled={emailPending}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {emailPending ? "Menyimpan..." : "Simpan Email"}
          </button>
        </form>
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-900">Ubah Sandi</h2>
        <p className="mt-1 text-sm text-stone-500">
          Ganti password login admin Anda.
        </p>

        {sandiState.error && (
          <div className="mt-4">
            <AdminBanner type="error" pesan={sandiState.error} />
          </div>
        )}
        {sandiState.ok && (
          <div className="mt-4">
            <AdminBanner type="success" pesan="Password berhasil diubah." />
          </div>
        )}

        <form action={sandiAction} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="sandiLama"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Sandi Lama
            </label>
            <input
              id="sandiLama"
              name="sandiLama"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>
          <div>
            <label
              htmlFor="sandiBaru"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Sandi Baru
            </label>
            <input
              id="sandiBaru"
              name="sandiBaru"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label
              htmlFor="konfirmasi"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Konfirmasi Sandi
            </label>
            <input
              id="konfirmasi"
              name="konfirmasi"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>
          <button
            type="submit"
            disabled={sandiPending}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {sandiPending ? "Menyimpan..." : "Simpan Sandi"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-900">Recovery Key</h2>
        <p className="mt-1 text-sm text-stone-500">
          Recovery key dipakai untuk mereset password jika Anda lupa (lewat
          halaman login). Simpan di tempat aman. Generate ulang untuk membuat
          kunci baru (yang lama langsung nonaktif).
        </p>

        {recState.error && (
          <div className="mt-4">
            <AdminBanner type="error" pesan={recState.error} />
          </div>
        )}
        {recState.key && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              Recovery Key baru (simpan baik-baik):
            </p>
            <p className="mt-2 rounded-lg bg-white px-3 py-2 break-all font-mono text-sm text-stone-800 shadow-sm">
              {recState.key}
            </p>
            <p className="mt-2 text-xs text-amber-800">
              Recovery key lama sudah tidak berlaku.
            </p>
          </div>
        )}

        <form action={recAction} className="mt-4">
          <button
            type="submit"
            disabled={recPending}
            className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60"
          >
            {recPending ? "Membuat..." : "Generate Recovery Key"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-900">
          Keamanan Perangkat
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Keluar dari semua perangkat lain (misalnya jika handphone atau laptop
          hilang / dicurigai diretas).
        </p>
        <form action={logoutSemuaPerangkatAction} className="mt-4">
          <button
            type="submit"
            className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Keluar dari Semua Perangkat
          </button>
        </form>
      </section>
    </div>
  );
}
