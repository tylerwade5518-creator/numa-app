// app/signup/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/client";

const PENDING_BAND_STORAGE_KEY = "numa:pendingBandCode";

function isValidUsername(u: string) {
  return /^[a-zA-Z0-9._-]+$/.test(u);
}

function appendBandParam(path: string, band: string) {
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(path, base);
    if (!u.searchParams.get("band")) u.searchParams.set("band", band);
    return u.pathname + (u.search ? u.search : "") + (u.hash ? u.hash : "");
  } catch {
    const hasQ = path.includes("?");
    return path + (hasQ ? "&" : "?") + `band=${encodeURIComponent(band)}`;
  }
}

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectRaw = searchParams.get("redirect") || "/setup";
  const bandFromUrl = (searchParams.get("band") || "").trim();
  const redirect = bandFromUrl ? appendBandParam(redirectRaw, bandFromUrl) : redirectRaw;

  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!bandFromUrl) return;
    try {
      localStorage.setItem(PENDING_BAND_STORAGE_KEY, bandFromUrl);
    } catch {}
  }, [bandFromUrl]);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedConfirmEmail = confirmEmail.trim().toLowerCase();

  const canSubmit = useMemo(() => {
    if (!displayName.trim()) return false;
    if (!username.trim() || !isValidUsername(username.trim())) return false;
    if (!normalizedEmail) return false;
    if (!normalizedConfirmEmail) return false;
    if (normalizedEmail !== normalizedConfirmEmail) return false;
    if (!password || password.length < 8) return false;
    if (!confirmPassword || password !== confirmPassword) return false;
    return true;
  }, [
    displayName,
    username,
    normalizedEmail,
    normalizedConfirmEmail,
    password,
    confirmPassword,
  ]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const dn = displayName.trim();
    const un = username.trim();
    const em = normalizedEmail;
    const em2 = normalizedConfirmEmail;
    const pw = password;
    const pw2 = confirmPassword;

    if (!dn || !un || !em || !em2 || !pw || !pw2) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidUsername(un)) {
      setError("Username can only contain letters, numbers, dots, dashes, and underscores.");
      return;
    }

    if (em !== em2) {
      setError("Email addresses do not match.");
      return;
    }

    if (pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (pw !== pw2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
        redirect
      )}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: em,
        password: pw,
        options: {
          emailRedirectTo,
          data: {
            display_name: dn,
            username: un,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        router.replace(redirect);
        return;
      }

      setInfo(
        `Account created. Check ${em} to confirm your email, then you’ll continue setup automatically. If you do not see it, check Spam or Promotions.`
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
          This email becomes your NUMA login and recovery email.
        </p>

        {bandFromUrl && (
          <p className="mt-3 text-[11px] text-slate-400">
            Band detected:{" "}
            <span className="font-semibold text-slate-200">{bandFromUrl}</span>
          </p>
        )}

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
              Confirm email
            </label>
            <input
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
            />

            {confirmEmail && normalizedEmail !== normalizedConfirmEmail && (
              <p className="mt-1 text-[11px] text-red-300">
                Email addresses do not match.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-3 py-2 text-[11px] text-yellow-100">
            Double-check this email. You’ll need it to log in, recover your account, and access your NUMA Band.
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Confirm password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              autoComplete="new-password"
              type="password"
            />

            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-[11px] text-red-300">
                Passwords do not match.
              </p>
            )}
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
              onClick={() => {
                const qs = new URLSearchParams();
                qs.set("redirect", redirect);
                if (bandFromUrl) qs.set("band", bandFromUrl);
                router.push(`/login?${qs.toString()}`);
              }}
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