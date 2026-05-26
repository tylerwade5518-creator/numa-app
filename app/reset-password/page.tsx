"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (!token) {
      setMessage("Invalid reset link.");
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

    try {
      setLoading(true);

      const res = await fetch("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setMessage("Password updated successfully. Redirecting...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setMessage("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          NUMA BANDS
        </div>

        <h1 className="mt-2 text-2xl font-semibold">
          Reset your password
        </h1>

        {message && (
          <div className="mt-4 text-sm text-slate-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}