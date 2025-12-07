"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bandId = searchParams.get("band") || "UNKNOWN";

  const [handle, setHandle] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Very simple sun sign calc placeholder
  const sunSign = birthday ? getSunSign(birthday) : null;

  const canSubmit = handle.trim().length >= 3 && !!birthday && !isSubmitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    // TODO: send handle + birthday to your backend here.
    // For now, just simulate and jump to dashboard for this band.
    setTimeout(() => {
      router.replace(`/dashboard?band=${encodeURIComponent(bandId)}`);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden flex items-center justify-center px-4">
      {/* Background gradient + faint stars */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-800/10 blur-3xl" />
        <div className="absolute top-0 right-[-8rem] h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-35 stars-layer" />
      </div>

      <div className="w-full max-w-md">
        {/* Header logo bar matches app header, but simple */}
        <header className="mb-5 flex items-center gap-3">
          <div className="h-10 w-10 relative">
            {/* This uses your existing logo in /public/numa-logo.svg */}
            <div className="absolute inset-0 rounded-full overflow-hidden drop-shadow-[0_0_24px_rgba(181,139,63,0.5)]">
              {/* Static img tag here keeps this component simple without next/image */}
              {/* You can switch to next/image if you prefer like on the dashboard */}
              <img
                src="/numa-logo.svg"
                alt="Numa logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.25em] uppercase">
              Numa Bands
            </div>
            <div className="text-xs text-slate-400 tracking-widest">
              Discover Your Stardust
            </div>
          </div>
        </header>

        {/* Main setup card */}
        <div className="rounded-3xl border border-amber-400/40 bg-slate-950/70 backdrop-blur-xl shadow-[0_0_40px_rgba(181,139,63,0.4)] p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.35em] text-amber-300/80">
              New Numa Band Detected
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Band ID: {bandId}
            </div>
            <h1 className="mt-2 text-lg sm:text-xl font-serif font-bold text-slate-50">
              Create Your Numa Profile
            </h1>
            <p className="text-xs text-slate-400">
              We&apos;ll use this as your stardust base to power daily alignment,
              future matches, and what appears when you tap.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 mt-2">
            {/* Handle */}
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-200">
                Choose your NUMA handle
              </label>
              <div className="flex items-center rounded-xl border border-slate-800 bg-black/40 px-3 py-2 text-xs focus-within:border-amber-400/80 focus-within:bg-black/60 transition">
                <span className="text-slate-500 mr-1">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace(/\s+/g, ""))}
                  placeholder="stardustyou"
                  className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-600"
                  maxLength={24}
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500">
                This is how you&apos;ll appear when connections and features go
                live. Pick something you&apos;ll want to keep.
              </p>
            </div>

            {/* Birthday */}
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-200">
                Your birthday
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400/80 focus:bg-black/60 transition"
                required
              />
              {sunSign && (
                <p className="text-[11px] text-amber-200/90">
                  We&apos;ve got your sun sign:{" "}
                  <span className="font-semibold text-amber-300">{sunSign}</span>.
                  We&apos;ll use this to shape your daily alignment.
                </p>
              )}
            </div>

            {/* Later extras (commented for now) */}
            {/* 
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-200">
                Name this band (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-800 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400/80 focus:bg-black/60 transition"
                placeholder="Stardust Origin"
              />
            </div>
            */}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full rounded-full py-2.5 text-[11px] tracking-[0.3em] font-semibold uppercase transition ${
                canSubmit
                  ? "bg-[#B58B3F] text-black hover:opacity-90"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "WAKING YOUR DASHBOARD..." : "SAVE AND OPEN MY DASHBOARD"}
            </button>

            <p className="text-[11px] text-slate-500">
              You&apos;ll be able to adjust band details and add email later in
              Band Settings. Your @handle is your core identity inside NUMA.
            </p>
          </form>
        </div>
      </div>

      {/* Starfield animation */}
      <style jsx>{`
        .stars-layer {
          background-image: radial-gradient(
              circle at 10% 20%,
              rgba(255, 255, 255, 0.28) 1px,
              transparent 1px
            ),
            radial-gradient(
              circle at 80% 30%,
              rgba(255, 255, 255, 0.22) 1px,
              transparent 1px
            ),
            radial-gradient(
              circle at 50% 80%,
              rgba(255, 255, 255, 0.18) 1px,
              transparent 1px
            );
          background-size: 260px 260px, 340px 340px, 300px 300px;
          animation: driftStars 100s linear infinite;
        }

        @keyframes driftStars {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-100px, -60px, 0);
          }
        }
      `}</style>
    </main>
  );
}

// Very rough placeholder ranges; you'll replace with real astro logic later.
function getSunSign(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate();

  // Simple Western zodiac ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}
