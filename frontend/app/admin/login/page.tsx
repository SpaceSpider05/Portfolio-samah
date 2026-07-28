"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BRAND } from "@/constants/brand";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("admin@samah.studio");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    // Full navigation so middleware sees the httpOnly Laravel session cookie
    window.location.assign(next);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="type-caption mb-1.5 block text-vanilla-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-silver-400/25 bg-tobago-700 px-4 py-3 text-sm text-fantasy-100 outline-none focus:border-rose-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="type-caption mb-1.5 block text-vanilla-200">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-silver-400/25 bg-tobago-700 px-4 py-3 text-sm text-fantasy-100 outline-none focus:border-rose-400"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-rose-400 px-4 py-3 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-silver-400">
        Authenticated by Laravel Sanctum · admin@samah.studio / admin123
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-tobago-900 px-4">
      <div className="w-full max-w-md rounded-[1.75rem] border border-silver-400/20 bg-tobago-800 p-8 shadow-2xl">
        <p className="type-overline">Admin login</p>
        <h1 className="type-h2 mt-2 text-fantasy-100">{BRAND.name} Console</h1>
        <p className="type-caption mt-2">
          Sign in with your Laravel admin account.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
