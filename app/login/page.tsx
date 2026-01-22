// app/login/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const redirectTo = sp.get("redirect") || "/dashboard";
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      router.replace(redirectTo);
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            NUMA Bands
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Log in</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your email and password to access your dashboard.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-slate-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/25 transition-colors"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-300">
          Don’t have an account?{" "}
          <button
            className="text-sky-300 hover:text-sky-200 underline"
            onClick={() =>
              router.push(`/signup?redirect=${encodeURIComponent(redirectTo)}`)
            }
          >
            Create one
          </button>
        </div>
      </div>
    </main>
  );
}
