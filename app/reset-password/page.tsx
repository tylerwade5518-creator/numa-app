"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Opening secure reset session...");

  useEffect(() => {
    async function prepareRecoverySession() {
      try {
        if (typeof window === "undefined") return;

        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setMessage(error.message);
            return;
          }

          window.history.replaceState(null, "", "/reset-password");
          setMessage("");
          return;
        }

        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setMessage("");
          return;
        }

        setMessage("Auth session missing. Please request a fresh reset email and open the newest link.");
      } catch (err: any) {
        setMessage(err?.message || "Could not open reset session.");
      }
    }

    prepareRecoverySession();
  }, [supabase]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setMessage("Auth session missing. Please request a fresh reset email and open the newest link.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated. Redirecting to login...");
    setTimeout(() => router.replace("/login"), 1200);
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>

        <h1 className="mt-2 text-2xl font-semibold">Choose new password</h1>

        {message && <div className="mt-4 text-xs text-slate-300">{message}</div>}

        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}