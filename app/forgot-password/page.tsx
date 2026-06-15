"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage("Enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://numa-app-kyoi.vercel.app";

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
      }
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setMessage(
      "a reset link has been sent. Please check your inbox and spam or junk folder ."
    );
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>

        <h1 className="mt-2 text-2xl font-semibold">Reset password</h1>

        <p className="mt-2 text-sm text-slate-300">
          Enter your email and we’ll send you a secure reset link.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading || sent}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || sent}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {loading ? "Sending..." : sent ? "Reset email sent" : "Send reset email"}
          </button>

          {message && <div className="text-xs text-slate-300">{message}</div>}

          <div className="pt-2 text-center text-xs text-slate-400">
            Remember your password?{" "}
            <Link href="/login" className="text-sky-400 hover:text-sky-300">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}