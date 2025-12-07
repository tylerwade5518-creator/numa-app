"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProfileSettingsPage() {
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
              Profile & Tap Share
            </h1>
            <p className="text-xs text-slate-300">
              Update who you are, how people see you, and what your band is
              allowed to share.
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

        {/* Identity & avatar */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Identity
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            This is how you appear on Tap Share and public views.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="relative h-14 w-14 rounded-full bg-slate-800/80 ring-2 ring-yellow-200/70">
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-yellow-100">
                T
              </span>
            </div>

            <div className="flex-1 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-300">
                  Display name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
                  defaultValue="Tyler"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-slate-300">
                  Username / handle
                </label>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-900/80 px-2 py-1 text-[11px] text-slate-400">
                    @
                  </span>
                  <input
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
                    defaultValue="numa_ty"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact channels */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Contact Channels
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            These are the raw details your Tap Share profiles can pull from.
          </p>

          <div className="mt-4 space-y-3 text-xs">
            {[
              { label: "Phone", placeholder: "+1 (555) 123-4567" },
              { label: "Email", placeholder: "you@example.com" },
              { label: "Website", placeholder: "https://your-site.com" },
              { label: "Instagram", placeholder: "@your_ig" },
              { label: "TikTok", placeholder: "@your_tiktok" },
              { label: "LinkedIn", placeholder: "Profile URL" },
            ].map((field) => (
              <div key={field.label} className="space-y-1">
                <label className="block text-[11px] text-slate-300">
                  {field.label}
                </label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Tap Share profiles */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Tap Share Profiles
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Define what “Social” and “Business” actually share when you choose
            them.
          </p>

          {/* Default profile */}
          <div className="mt-4 space-y-2 text-[11px]">
            <p className="text-slate-300">Default Tap Share profile</p>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
                None
              </button>
              <button className="rounded-full border border-yellow-300 bg-yellow-300/90 px-3 py-1 text-[11px] font-medium text-slate-950">
                Social
              </button>
              <button className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
                Business
              </button>
            </div>
          </div>

          {/* Social */}
          <div className="mt-4 rounded-2xl border border-sky-200/50 bg-slate-950/90 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200">
                  Social Profile
                </p>
                <p className="text-[11px] text-slate-400">
                  Used when you pick “Social” in Tap Share.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Instagram", "TikTok", "Website", "Phone"].map((item, i) => {
                const active = i < 2; // Instagram/TikTok on by default visually
                return (
                  <button
                    key={item}
                    className={
                      "rounded-2xl border px-3 py-2 text-[11px] text-left " +
                      (active
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50"
                        : "border-slate-600/80 bg-slate-900/80 text-slate-200")
                    }
                  >
                    {active ? "✓ " : ""} {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business */}
          <div className="mt-3 rounded-2xl border border-slate-500/70 bg-slate-950/90 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">
                  Business Profile
                </p>
                <p className="text-[11px] text-slate-400">
                  Used when you pick “Business” in Tap Share.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Email", "Website", "Phone", "Instagram"].map((item, i) => {
                const active = i < 2; // Email/Website on by default visually
                return (
                  <button
                    key={item}
                    className={
                      "rounded-2xl border px-3 py-2 text-[11px] text-left " +
                      (active
                        ? "border-yellow-300/90 bg-slate-900/95 text-yellow-50"
                        : "border-slate-600/80 bg-slate-900/80 text-slate-200")
                    }
                  >
                    {active ? "✓ " : ""} {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Safety & account */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)] space-y-4">
          {/* Safety */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Safety & Defaults
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              How Tap Share behaves when you arm it or when strangers tap your
              band.
            </p>

            <div className="mt-3 space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-300">
                  Armed Tap Share timeout
                </p>
                <select className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300">
                  <option>60 seconds</option>
                  <option>30 seconds</option>
                  <option>90 seconds</option>
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-300">When not armed</p>
                <div className="space-y-1 text-[11px]">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="radio"
                      name="publicMode"
                      defaultChecked
                      className="h-3 w-3 rounded-full border-slate-500 bg-slate-900"
                    />
                    Show nothing (recommended)
                  </label>
                  <label className="flex items-center gap-2 text-slate-400">
                    <input
                      type="radio"
                      name="publicMode"
                      className="h-3 w-3 rounded-full border-slate-500 bg-slate-900"
                    />
                    Show public landing page only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="border-t border-slate-700/70 pt-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Account
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Your login and security details.
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-300">Email</p>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
                    defaultValue="you@example.com"
                  />
                  <button className="rounded-xl border border-slate-600 bg-slate-900/80 px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800/90">
                    Update
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button className="rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800/90">
                  Change password
                </button>
                <button className="rounded-2xl border border-red-400/80 bg-red-500/10 px-3 py-1.5 text-[11px] text-red-200 hover:bg-red-500/20">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
