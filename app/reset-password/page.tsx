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
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState("Opening secure reset session...");

  useEffect(() => {
    async function prepareRecoverySession() {
      try {
        if (typeof window === "undefined") return;

        const url = new URL(window.location.href);

        const errorDescription = url.searchParams.get("error_description");

        if (errorDescription) {
          setMessage(errorDescription);
          return;
        }

        const code = url.searchParams.get("code");

        if (code) {
          setMessage(
            "This reset link used the PKCE flow and cannot be opened here. Please request a brand-new reset email after the latest deployment finishes."
          );
          return;
        }

        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;

        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (!accessToken || !refreshToken) {
          setMessage(
            "Invalid or expired reset link. Please request a new reset email."
          );
          return;
        }

        if (type && type !== "recovery") {
          setMessage("This link is not a password recovery link.");
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        window.history.replaceState(null, "", "/reset-password");

        setSessionReady(true);
        setMessage("");
      } catch (err: any) {
        setMessage(err?.message || "Could not open reset session.");
      }
    }

    prepareRecoverySession();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");

    if (!sessionReady) {
      setMessage(
        "Auth session missing. Please request a fresh reset email and open the newest link."
      );
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>

        <h1 className="mt-2 text-2xl font-semibold">Choose new password</h1>

        {message && (
          <div className="mt-4 text-xs text-slate-300">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            disabled={loading || !sessionReady}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            disabled={loading || !sessionReady}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}