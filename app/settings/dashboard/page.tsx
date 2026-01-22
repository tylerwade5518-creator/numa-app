"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayoutSettingsPage() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/nebula-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark veil */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/80" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Settings
            </p>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              Dashboard Layout
            </h1>
            <p className="text-xs text-slate-300">
              Choose which widgets you use and how they’re arranged on your
              band’s main screen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800/90"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Widget toggles */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Widgets
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Turn sections on or off. Later we can let you reorder and upgrade
            them.
          </p>

          <div className="mt-4 space-y-2 text-xs">
            {[
              {
                name: "Daily Horoscope",
                description: "Core reading at the top of your Numa dashboard.",
                defaultOn: true,
              },
              {
                name: "Tap Share",
                description: "Quick access to arm your band for sharing.",
                defaultOn: true,
              },
              {
                name: "Stardust Action",
                description: "One main action the sky is asking for today.",
                defaultOn: true,
              },
              {
                name: "Daily Meters",
                description: "Luck, Energy, and Social comet tracks.",
                defaultOn: true,
              },
              {
                name: "Future Widgets",
                description: "Room for premium or experimental features.",
                defaultOn: false,
              },
            ].map((w, i) => (
              <label
                key={w.name}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5 hover:bg-slate-800/80"
              >
                <div>
                  <p className="text-xs font-medium text-slate-100">
                    {w.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {w.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <div
                    className={
                      "flex h-4 w-7 items-center rounded-full border px-0.5 " +
                      (w.defaultOn
                        ? "border-sky-300 bg-sky-500/70 justify-end"
                        : "border-slate-600 bg-slate-800/80 justify-start")
                    }
                  >
                    <div className="h-3 w-3 rounded-full bg-slate-950" />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Layout mode (simple placeholder) */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Layout Mode
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Later we’ll let you drag and drop widgets. For now, you can choose a
            simple layout style.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            {["Classic", "Compact", "Focus"].map((mode, idx) => (
              <button
                key={mode}
                className={
                  "rounded-2xl border px-3 py-2 text-left " +
                  (idx === 0
                    ? "border-yellow-300 bg-slate-900/95 text-yellow-50"
                    : "border-slate-600 bg-slate-900/80 text-slate-200")
                }
              >
                <p className="text-xs font-medium">{mode}</p>
                <p className="text-[11px] text-slate-400">
                  {mode === "Classic" &&
                    "Horoscope first, then Tap Share, then meters."}
                  {mode === "Compact" &&
                    "Tighter spacing, more info above the fold."}
                  {mode === "Focus" &&
                    "Horoscope + one other widget only."}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Save (placeholder) */}
        <section className="pb-6">
          <button className="w-full rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110">
            Save layout (visual only for now)
          </button>
        </section>
      </main>
    </div>
  );
}
