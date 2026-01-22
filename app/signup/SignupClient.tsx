// app/signup/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/client";

function isValidUsername(u: string) {
  return /^[a-zA-Z0-9._-]+$/.test(u);
}

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  // Create a browser client instance for this page
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!displayName.trim()) return false;
    if (!username.trim() || !isValidUsername(username.trim())) return false;
    if (!email.trim()) return false;
    if (!password.trim() || password.trim().length < 8) return false;
    return true;
  }, [displayName, username, email, password]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const dn = displayName.trim();
    const un = username.trim();
    const em = email.trim().toLowerCase();
    const pw = password;

    if (!dn || !un || !em || !pw) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidUsername(un)) {
      setError(
        "Username can only contain letters, numbers, dots, dashes, and underscores."
      );
      return;
    }
    if (pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      // After user clicks email, Supabase will send them here:
      // /auth/callback?code=...&next=/dashboard
      const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
        redirect
      )}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: em,
        password: pw,
        options: {
          emailRedirectTo,
          // These go into auth.users.raw_user_meta_data
          // Your DB trigger can copy them into public.profiles automatically
          data: {
            display_name: dn,
            username: un,
          },
        },
      });

      if (signUpError) throw signUpError;

      // If email confirm is ON, session is usually null until they click the email.
      // We do NOT insert into profiles here (trigger handles it, avoids RLS issues).
      if (data.session) {
        router.replace(redirect);
        return;
      }

      setInfo(
        "Account created. Check your email to confirm — then you’ll be sent to your dashboard automatically."
      );
    } catch (err: any) {
      setError(err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>
        <h1 className="mt-2 text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-slate-300">
          This creates your long-term NUMA login.
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tyler"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="numafounder"
              autoComplete="username"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Letters, numbers, dots, underscores, dashes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              autoComplete="new-password"
              type="password"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Minimum 8 characters.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-700/70 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {info && (
            <div className="rounded-2xl border border-sky-700/40 bg-sky-950/30 px-3 py-2 text-xs text-slate-200">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="mt-2 w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/20 transition-colors"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          <div className="text-sm text-slate-300 pt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
              }
              className="text-sky-300 hover:text-sky-200 underline"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
