// app/buy/page.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import AnimatedSpaceBackground from "../dashboard/AnimatedSpaceBackground";

export const dynamic = "force-dynamic";

const CHECKOUT_URL = "https://YOUR-SHOPIFY-CHECKOUT-LINK-HERE";

type Slide = {
  key: string;
  label: string;
  headline: string;
  body: string;
  // Put your real screenshots/videos here later
  mediaType: "image" | "video";
  mediaSrc: string;
};

export default function BuyPage() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "dashboard",
        label: "Dashboard",
        headline: "Daily horoscope, calibrated to the real sky.",
        body:
          "Tap your band and your dashboard opens instantly — your reading and meters for the day, built around real sky positions.",
        mediaType: "image",
        mediaSrc: "/placeholders/iphone-dashboard.png",
      },
      {
        key: "stardust",
        label: "Stardust Action",
        headline: "A daily move that helps you align your day.",
        body:
          "Your Cosmic Card gives you a simple challenge — a small action that helps you feel more focused, grounded, and intentional.",
        mediaType: "image",
        mediaSrc: "/placeholders/iphone-stardust.png",
      },
      {
        key: "tapshare",
        label: "Tap Share",
        headline: "Share details with one tap — on your terms.",
        body:
          "Arm Tap Share, choose what to send, then share once. It turns off automatically so every tap stays intentional.",
        mediaType: "image",
        mediaSrc: "/placeholders/iphone-tapshare.png",
      },
      {
        key: "starsync",
        label: "Star Sync",
        headline: "Instant insight into how you connect with others.",
        body:
          "Compare dynamics across friendship, romantic connection, and work — and see strengths vs. challenges in seconds.",
        mediaType: "image",
        mediaSrc: "/placeholders/iphone-starsync.png",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  // swipe handling
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef<number>(0);

  const clampIndex = (i: number) => Math.max(0, Math.min(slides.length - 1, i));

  const goTo = (i: number) => setActive(clampIndex(i));
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0]?.clientX ?? null;
    deltaXRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const x = e.touches[0]?.clientX ?? 0;
    deltaXRef.current = x - startXRef.current;
  };

  const onTouchEnd = () => {
    const dx = deltaXRef.current;
    startXRef.current = null;
    deltaXRef.current = 0;

    // threshold
    if (dx > 60) prev();
    else if (dx < -60) next();
  };

  const slide = slides[active];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-slate-50"
      style={{
        backgroundImage: "url('/nebula-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark veil */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />

      {/* Moving stars */}
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-6 sm:py-10">
        {/* Header */}
        <section className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-600/70 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/80"
          >
            ← Back
          </Link>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
              NUMA Bands
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Tap-to-open astrology + connection tools.
            </p>
          </div>

          <div className="hidden w-16 sm:block" />
        </section>

        {/* HERO: Tap montage placeholder */}
        <section className="rounded-3xl border border-yellow-200/45 bg-slate-950/55 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.9)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-100/90">
            Tap to open
          </p>

          <div className="mt-2 space-y-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Your future self… with a little more alignment.
            </h1>
            <p className="text-sm text-slate-200">
              This hero section will be your looping tap montage (close-up taps,
              sharing to a friend’s phone, checking a daily reading).
            </p>
          </div>

          {/* montage block */}
          <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
            <div className="relative aspect-[16/9] w-full">
              {/* Replace with your actual montage video later */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-xs text-slate-200">
                  Tap Montage Video Placeholder (16:9)
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
            </div>
          </div>

          {/* feature chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "No batteries required",
              "Waterproof",
              "Durable",
              "Instant tap-to-open",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-200"
              >
                {t}
              </span>
            ))}
          </div>

          {/* BUY BUTTON #1 (only) */}
          <div className="mt-4">
            <a
              href={CHECKOUT_URL}
              className="flex w-full items-center justify-center rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
            >
              Get a NUMA Band
            </a>
            <p className="mt-2 text-[11px] text-slate-400">
              Checkout is handled securely on our store.
            </p>
          </div>
        </section>

        {/* Swipe to explore (no peek) */}
        <section className="rounded-3xl border border-sky-200/40 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.85)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-sky-200/90">
                Swipe to explore
              </p>
              <p className="mt-1 text-sm text-slate-200">
                See what opens when you tap your band.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={active === 0}
                className={
                  "rounded-full border px-3 py-1.5 text-xs transition " +
                  (active === 0
                    ? "cursor-not-allowed border-slate-700 bg-slate-950/60 text-slate-500"
                    : "border-slate-500/80 bg-slate-950/70 text-slate-200 hover:bg-slate-900/70")
                }
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                disabled={active === slides.length - 1}
                className={
                  "rounded-full border px-3 py-1.5 text-xs transition " +
                  (active === slides.length - 1
                    ? "cursor-not-allowed border-slate-700 bg-slate-950/60 text-slate-500"
                    : "border-slate-500/80 bg-slate-950/70 text-slate-200 hover:bg-slate-900/70")
                }
              >
                →
              </button>
            </div>
          </div>

          {/* iPhone frame + content */}
          <div
            className="mt-4"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="mx-auto max-w-[340px] sm:max-w-[380px]">
              {/* Brighter, more prominent frame */}
              <div className="relative rounded-[2.2rem] border border-sky-200/70 bg-slate-950/60 p-3 shadow-[0_0_45px_rgba(56,189,248,0.25)]">
                <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] ring-1 ring-white/10" />
                <div className="pointer-events-none absolute -inset-1 rounded-[2.4rem] bg-sky-300/10 blur-2xl" />

                {/* “phone” screen */}
                <div className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/40">
                  <div className="relative aspect-[9/19.5] w-full">
                    {/* Replace with your real assets later */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <div className="space-y-2">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                          {slide.label}
                        </div>
                        <div className="text-sm font-semibold text-slate-50">
                          iPhone Screen Placeholder
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {slide.mediaSrc}
                        </div>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
                  </div>
                </div>
              </div>

              {/* Slide text */}
              <div className="mt-4 space-y-2 text-center">
                <p className="text-sm font-semibold text-slate-50">
                  {slide.headline}
                </p>
                <p className="text-xs leading-relaxed text-slate-200">
                  {slide.body}
                </p>

                {/* Dots */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  {slides.map((s, i) => {
                    const on = i === active;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${s.label}`}
                        className={
                          "h-2.5 w-2.5 rounded-full border transition " +
                          (on
                            ? "border-sky-200 bg-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.85)]"
                            : "border-slate-500 bg-slate-950/60 hover:border-slate-300")
                        }
                      />
                    );
                  })}
                </div>

                {/* Swipe hint */}
                <p className="mt-2 text-[11px] text-slate-400">
                  Swipe left/right to explore.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom section + BUY BUTTON #2 (only) */}
        <section className="rounded-3xl border border-yellow-200/35 bg-slate-950/55 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.9)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-100/90">
            Ready to tap in?
          </p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
            Make the day feel a little more intentional.
          </h2>
          <p className="mt-2 text-sm text-slate-200">
            NUMA is built for fast, real-life moments — check your alignment,
            share your info once, or sync with someone new.
          </p>

          <div className="mt-4">
            <a
              href={CHECKOUT_URL}
              className="flex w-full items-center justify-center rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
            >
              Get a NUMA Band
            </a>
            <p className="mt-2 text-[11px] text-slate-400">
              You’ll link your band to your profile during setup.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
