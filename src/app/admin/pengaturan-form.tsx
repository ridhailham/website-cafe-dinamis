"use client";

import { useActionState } from "react";
import {
  ubahSandiAction,
  regenerateRecoveryAction,
  logoutSemuaPerangkatAction,
  type SandiState,
  type RecoveryState,
} from "./actions";

export function SettingsForm() {
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
        <h2 className="text-lg font-bold text-stone-900">Ubah Sandi</h2>
        <p className="mt-1 text-sm text-stone-500">
          Ganti password login admin Anda.
        </p>

        {sandiState.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {sandiState.error}
          </p>
        )}
        {sandiState.ok && (
          <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
            Password berhasil diubah.
          </p>
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
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {recState.error}
          </p>
        )}
        {recState.key && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-900">
              Recovery Key baru (simpan baik-baik):
            </p>
            <p className="mt-2 break-all rounded bg-white px-3 py-2 font-mono text-sm text-stone-800">
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
