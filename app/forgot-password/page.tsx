"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowser } from "../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
redirectTo: `${origin}/reset-password`,
      }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>

        <h1 className="mt-2 text-2xl font-semibold">
          Reset password
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {loading ? "Sending..." : "Send reset email"}
          </button>

          {message && (
            <div className="text-xs text-slate-300">
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}