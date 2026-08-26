"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

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
        disabled={pending}
        className="w-full rounded-full bg-amber-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
