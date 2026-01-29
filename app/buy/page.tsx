// app/buy/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedSpaceBackground from "../dashboard/AnimatedSpaceBackground";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  // Put your real assets later:
  // imageSrc?: string;
  // videoSrc?: string;
};

const SLIDES: Slide[] = [
  {
    key: "dashboard",
    title: "Your daily dashboard — instantly",
    subtitle:
      "Tap your NUMA Band and your day opens in seconds: alignment, meters, and your next move.",
  },
  {
    key: "stardust",
    title: "Stardust Action",
    subtitle:
      "A simple challenge that nudges your day in the right direction — small moves, real momentum.",
  },
  {
    key: "tapshare",
    title: "Tap Share",
    subtitle:
      "Share exactly what you want with one tap — fast, secure, and intentional.",
  },
  {
    key: "starsync",
    title: "Star Sync",
    subtitle:
      "Get insight into the people around you — friendship, connection, and ambition in one scan.",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function BuyPage() {
  const [active, setActive] = useState(0);

  // swipe handling
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  const goTo = (idx: number) => setActive(clamp(idx, 0, SLIDES.length - 1));
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
    deltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const x = e.touches[0]?.clientX ?? startX.current;
    deltaX.current = x - startX.current;
  };

  const onTouchEnd = () => {
    const dx = deltaX.current;
    startX.current = null;
    deltaX.current = 0;

    // threshold
    if (dx > 40) prev();
    else if (dx < -40) next();
  };

  // keyboard support (nice for desktop testing)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const slide = useMemo(() => SLIDES[active], [active]);

  const checkoutHref = "/checkout"; // swap later to Shopify product URL, or keep internal routing

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
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-7 sm:py-10">
        {/* HERO */}
        <section className="rounded-3xl border border-slate-700/50 bg-slate-950/55 p-5 backdrop-blur-xl shadow-[0_0_45px_rgba(0,0,0,0.85)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
            NUMA Bands
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-50 sm:text-3xl">
            Tap to open your day.
          </h1>

          <p className="mt-2 text-sm text-slate-200/90">
            Daily alignment based on the real sky — plus a band that shares and
            syncs in the moment.
          </p>

          {/* Montage placeholder */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <div className="relative aspect-[16/9] w-full">
              <div className="absolute inset-0 opacity-70">
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
              </div>

              <div className="relative flex h-full w-full items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                    Tap Montage (placeholder)
                  </div>
                  <div className="mt-1 text-sm text-slate-100/90">
                    Replace with your looped tap compilation video.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buy button under montage */}
          <a
            href={checkoutHref}
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-yellow-200/70 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
          >
            Get a NUMA Band
          </a>

          <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
              No batteries required
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
              Waterproof
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
              Durable for daily wear
            </div>
          </div>
        </section>

        {/* SWIPE / IPHONE FRAME SECTION */}
        <section className="rounded-3xl border border-sky-200/35 bg-slate-950/60 p-5 backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.9)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/90">
                Swipe to explore
              </p>
              <p className="mt-1 text-xs text-slate-200/90">
                See what opens when you tap your band.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/70"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/70"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            {/* iPhone frame */}
            <div
              className="iphone-shell"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              role="group"
              aria-label="NUMA feature carousel"
            >
              {/* subtle outer glow */}
              <div className="iphone-glow" />

              {/* bezel */}
              <div className="iphone-bezel">
                {/* top bar / camera */}
                <div className="iphone-top">
                  <div className="iphone-speaker" />
                  <div className="iphone-camera" />
                </div>

                {/* screen */}
                <div className="iphone-screen">
                  {/* Screen content placeholder */}
                  <div className="screen-content">
                    <div className="screen-badge">
                      {active + 1}/{SLIDES.length}
                    </div>

                    <div className="screen-title">{slide.title}</div>
                    <div className="screen-subtitle">{slide.subtitle}</div>

                    <div className="screen-mock">
                      <div className="mock-row" />
                      <div className="mock-row" />
                      <div className="mock-row short" />
                      <div className="mock-card" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DOTS: directly under phone (as you requested) */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.key}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={
                      "h-2.5 w-2.5 rounded-full border transition " +
                      (isActive
                        ? "border-sky-200 bg-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.7)]"
                        : "border-slate-500 bg-slate-700/40 hover:border-slate-300")
                    }
                  />
                );
              })}
            </div>

            <div className="mt-2 text-[11px] text-slate-300">
              Swipe left/right to explore
            </div>
          </div>
        </section>

        {/* BOTTOM BUY BUTTON */}
        <section className="pb-6">
          <a
            href={checkoutHref}
            className="flex w-full items-center justify-center rounded-2xl border border-yellow-200/70 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
          >
            Get a NUMA Band
          </a>
          <p className="mt-3 text-center text-[11px] text-slate-300">
            Limited first drop — more designs and creator collabs coming soon.
          </p>
        </section>
      </main>

      {/* styles */}
      <style jsx global>{`
        /* ---------- iPhone frame ---------- */
        .iphone-shell {
          position: relative;
          width: min(340px, 92vw);
          aspect-ratio: 9 / 19.5;
          border-radius: 44px;
          padding: 10px;
          touch-action: pan-y;
        }

        .iphone-glow {
          position: absolute;
          inset: -14px;
          border-radius: 58px;
          background: radial-gradient(
            circle at 40% 20%,
            rgba(56, 189, 248, 0.22),
            transparent 55%
          );
          filter: blur(10px);
          pointer-events: none;
        }

        .iphone-bezel {
          position: relative;
          height: 100%;
          width: 100%;
          border-radius: 38px;
          background: linear-gradient(
            180deg,
            rgba(30, 41, 59, 0.9),
            rgba(2, 6, 23, 0.95)
          );
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75);
          overflow: hidden;
        }

        /* subtle glass highlight */
        .iphone-bezel:before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.08),
            transparent 30%,
            transparent 70%,
            rgba(255, 255, 255, 0.05)
          );
          pointer-events: none;
        }

        .iphone-top {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 3;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
        }

        .iphone-speaker {
          width: 44px;
          height: 6px;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.22);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
        }

        .iphone-camera {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(56, 189, 248, 0.55),
            rgba(15, 23, 42, 0.95) 70%
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.25);
        }

        .iphone-screen {
          position: absolute;
          inset: 14px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.22);
        }

        .screen-content {
          height: 100%;
          width: 100%;
          padding: 18px 16px 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
          background: radial-gradient(
              circle at 40% 15%,
              rgba(56, 189, 248, 0.14),
              transparent 55%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(99, 102, 241, 0.12),
              transparent 55%
            );
        }

        .screen-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          font-size: 11px;
          color: rgba(226, 232, 240, 0.9);
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .screen-title {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.15;
          color: rgba(248, 250, 252, 0.98);
          text-shadow: 0 0 18px rgba(56, 189, 248, 0.12);
        }

        .screen-subtitle {
          font-size: 12px;
          line-height: 1.35;
          color: rgba(226, 232, 240, 0.85);
        }

        .screen-mock {
          margin-top: 10px;
          display: grid;
          gap: 10px;
        }

        .mock-row {
          height: 10px;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .mock-row.short {
          width: 60%;
        }

        .mock-card {
          height: 130px;
          border-radius: 18px;
          background: rgba(2, 6, 23, 0.5);
          border: 1px solid rgba(56, 189, 248, 0.18);
          box-shadow: 0 0 24px rgba(56, 189, 248, 0.12);
        }
      `}</style>
    </div>
  );
}
