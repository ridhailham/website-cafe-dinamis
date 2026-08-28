"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  loginAction,
  resetViaRecoveryAction,
  type LoginState,
  type ResetState,
} from "../actions";
import { AdminBanner } from "../alert";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "recovery">("login");

  const [loginState, loginFormAction, loginPending] = useActionState<
    LoginState,
    FormData
  >(loginAction, {});

  const [resetState, resetFormAction, resetPending] = useActionState<
    ResetState,
    FormData
  >(resetViaRecoveryAction, {});

  return (
    <div className="space-y-4">
      {mode === "login" ? (
        <>
          {loginState.error && <AdminBanner type="error" pesan={loginState.error} />}

          <form action={loginFormAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                placeholder="admin@kopisenja.id"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginPending}
              className="w-full rounded-full bg-amber-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
            >
              {loginPending ? "Memeriksa..." : "Masuk"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode("recovery");
            }}
            className="block w-full text-center text-xs text-stone-400 hover:text-stone-600"
          >
            Lupa password? Reset pakai Recovery Key
          </button>
        </>
      ) : (
        <>
          {resetState.error && <AdminBanner type="error" pesan={resetState.error} />}

          {resetState.ok ? (
            <div className="space-y-3">
              <AdminBanner
                type="success"
                pesan="Password berhasil direset. Silakan masuk dengan password baru."
              />
              {resetState.key && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
                  <p className="text-sm font-medium text-amber-900">
                    Recovery Key baru (simpan baik-baik):
                  </p>
                  <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-sm text-stone-800 shadow-sm">
                    {resetState.key}
                  </p>
                  <p className="mt-2 text-xs text-amber-800">
                    Recovery key lama sudah tidak berlaku.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full rounded-full bg-stone-800 py-3 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <form action={resetFormAction} className="space-y-4">
              <div>
                <label
                  htmlFor="recoveryKey"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Recovery Key
                </label>
                <input
                  id="recoveryKey"
                  name="recoveryKey"
                  type="text"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 font-mono text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                  placeholder="Recovery key Anda"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Password Baru
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                  placeholder="Minimal 8 karakter"
                />
              </div>

              <div>
                <label
                  htmlFor="konfirmasi"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Konfirmasi Password
                </label>
                <input
                  id="konfirmasi"
                  name="konfirmasi"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                  placeholder="Ulangi password baru"
                />
              </div>

              <button
                type="submit"
                disabled={resetPending}
                className="w-full rounded-full bg-amber-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
              >
                {resetPending ? "Memproses..." : "Reset Password"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => setMode("login")}
            className="block w-full text-center text-xs text-stone-400 hover:text-stone-600"
          >
            ← Kembali ke login
          </button>
        </>
      )}
    </div>
  );
}
