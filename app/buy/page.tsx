// app/buy/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedSpaceBackground from "../dashboard/AnimatedSpaceBackground";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  // Use a real screenshot later (recommended). For now, placeholder gradients.
  // You can swap these for <Image/> inside the phone screen when ready.
  screen: React.ReactNode;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function PhoneFrame({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* Phone shell */}
      <div className="mx-auto w-full max-w-[360px]">
        <div className="relative rounded-[42px] border border-white/15 bg-slate-950/70 shadow-[0_0_60px_rgba(56,189,248,0.18)] backdrop-blur">
          {/* Bezel */}
          <div className="relative m-[10px] rounded-[34px] border border-white/10 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
            {/* Notch / top bar */}
            <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-[30px] w-[56%] -translate-x-1/2 rounded-b-[22px] bg-black/90 border-x border-b border-white/10">
              <div className="absolute left-1/2 top-[9px] h-[6px] w-[52px] -translate-x-1/2 rounded-full bg-white/10" />
              <div className="absolute right-[18px] top-[9px] h-[10px] w-[10px] rounded-full bg-white/10" />
            </div>

            {/* Screen (fills the phone screen area) */}
            <div className="relative z-10 min-h-[640px] w-full">
              {children}
            </div>

            {/* subtle bottom home indicator */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {caption ? <div className="mx-auto mt-3 max-w-[420px]">{caption}</div> : null}
    </div>
  );
}

function Dots({
  count,
  active,
  onPick,
}: {
  count: number;
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => {
        const isOn = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              "h-2.5 w-2.5 rounded-full border transition " +
              (isOn
                ? "border-sky-200/80 bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.8)]"
                : "border-white/20 bg-white/10 hover:bg-white/15")
            }
          />
        );
      })}
    </div>
  );
}

export default function BuyPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  // Slides (swap placeholders for real screenshots later)
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "dashboard",
        title: "Daily Horoscope — tuned to the real sky",
        subtitle:
          "Your band opens your dashboard instantly. The reading updates daily using live sky positions.",
        screen: (
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.18),transparent_50%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,0.65))]" />
            <div className="relative z-10 p-6 pt-14">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                NUMA Dashboard
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                Today’s Alignment
              </div>
              <div className="mt-3 rounded-3xl border border-yellow-200/40 bg-slate-950/45 p-4 backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                  Quiet Confidence
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-100/90">
                  A calm, deliberate day. Small choices compound. Stay steady.
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Luck", "Energy", "Social"].map((x) => (
                  <div
                    key={x}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {x}
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[72%] rounded-full bg-sky-300/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "stardust",
        title: "Stardust Action — one move that shifts your day",
        subtitle:
          "A quick challenge that turns your horoscope into something you actually do.",
        screen: (
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.22),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.22),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.65))]" />
            <div className="relative z-10 p-6 pt-14">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                Stardust Action
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                Make One Move
              </div>
              <div className="mt-3 rounded-3xl border border-sky-200/35 bg-slate-950/45 p-4 backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.22em] text-sky-100/90">
                  Your Card
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-100/90">
                  Reach out to one person you’ve been thinking about — short and
                  sincere.
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                  “Momentum loves a small, honest start.”
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "tapshare",
        title: "Tap Share — connect fast, share only what you choose",
        subtitle:
          "Like a digital card, but controlled. Arm your band for one tap, then it turns off.",
        screen: (
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.65))]" />
            <div className="relative z-10 p-6 pt-14">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                Tap Share
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                One Tap. Clean.
              </div>
              <div className="mt-3 rounded-3xl border border-yellow-200/35 bg-slate-950/45 p-4 backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                  Selected
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {["Phone", "Instagram", "TikTok", "Email"].map((x) => (
                    <div
                      key={x}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
                    >
                      {x}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-sky-200/30 bg-slate-950/40 p-3 text-xs text-slate-200">
                  Armed for next tap (60s)
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "starsync",
        title: "Star Sync — understand how you align with people",
        subtitle:
          "Quick insights for friendship dynamics, romantic connection, and work/ambition.",
        screen: (
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(250,204,21,0.16),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.65))]" />
            <div className="relative z-10 p-6 pt-14">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                Star Sync
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                Compatibility
              </div>
              <div className="mt-3 rounded-3xl border border-sky-200/30 bg-slate-950/45 p-4 backdrop-blur">
                <div className="text-xs text-slate-200">Overall</div>
                <div className="mt-2 h-4 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300" />
                </div>
                <div className="mt-3 text-xs text-slate-100/90">
                  Smooth momentum with a few pressure points — best when you keep
                  it honest.
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    // We don't do "peek next card" — we only decide on release.
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const startX = startXRef.current;
    startXRef.current = null;

    if (startX == null) return;

    const dx = e.clientX - startX;
    const threshold = 50;

    if (dx > threshold) setActive((p) => clamp(p - 1, 0, slides.length - 1));
    else if (dx < -threshold)
      setActive((p) => clamp(p + 1, 0, slides.length - 1));
  };

  const goToCheckout = () => {
    // Keep this routing to whatever you already wired (Shopify product page, etc.)
    router.push("/buy/checkout");
  };

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
      <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6 sm:py-10">
        {/* Top nav */}
        <section className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-slate-600/70 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/80"
          >
            ← Back
          </button>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
              NUMA Bands
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Tap-to-open your astrology dashboard + tap-to-share.
            </p>
          </div>

          <div className="hidden w-16 sm:block" />
        </section>

        {/* Hero montage */}
        <section>
          <div className="overflow-hidden rounded-3xl border border-sky-200/25 bg-slate-950/55 backdrop-blur-xl shadow-[0_0_55px_rgba(56,189,248,0.18)]">
            <div className="relative">
              {/* video placeholder */}
              <div className="relative aspect-[16/9] w-full bg-black/50">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/videos/numa-hero.mp4"
                  autoPlay={!reducedMotion}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/90">
                    Tap. Align. Connect.
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-50 sm:text-3xl">
                    Your future self doesn’t guess — they move with intention.
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-100/90">
                    NUMA turns astrology into a daily ritual you actually use:
                    real-sky horoscopes, one powerful action, and connection tools
                    that feel effortless.
                  </p>
                </div>
              </div>

              {/* Buy button under montage (top CTA) */}
              <div className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={goToCheckout}
                  className="w-full rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
                >
                  Get a NUMA Band
                </button>

                {/* small feature chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {["No batteries required", "Waterproof", "Durable"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Swipe explore */}
        <section>
          <div className="rounded-3xl border border-slate-600/50 bg-slate-950/55 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_45px_rgba(0,0,0,0.8)]">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                Swipe to explore
              </p>
              <p className="text-sm text-slate-100">
                What opens when you tap your band.
              </p>
            </div>

            <div className="mt-5">
              <div
                ref={trackRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className="select-none touch-pan-y"
              >
                <PhoneFrame
                  caption={
                    <div className="mt-4 space-y-2 text-center">
                      <div className="text-base font-semibold text-slate-50">
                        {slides[active].title}
                      </div>
                      <div className="text-sm text-slate-200/90">
                        {slides[active].subtitle}
                      </div>
                    </div>
                  }
                >
                  {/* Slide viewport */}
                  <div className="relative h-full w-full overflow-hidden">
                    <div
                      className={
                        "flex h-full w-full transition-transform duration-300 ease-out " +
                        (reducedMotion ? "" : "")
                      }
                      style={{
                        transform: `translateX(-${active * 100}%)`,
                      }}
                    >
                      {slides.map((s) => (
                        <div key={s.key} className="relative h-full w-full shrink-0">
                          {s.screen}
                        </div>
                      ))}
                    </div>
                  </div>
                </PhoneFrame>
              </div>

              {/* Dots directly below phone */}
              <Dots count={slides.length} active={active} onPick={setActive} />

              {/* Future-self blurb under swipe */}
              <div className="mx-auto mt-5 max-w-2xl rounded-3xl border border-sky-200/15 bg-white/5 p-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-sky-100/80">
                  Build the version of you that follows through
                </p>
                <p className="mt-2 text-sm text-slate-100/90">
                  NUMA is a tiny daily anchor: you tap, you get clarity, you take
                  one action, and you stay aligned long enough to change your
                  outcomes.
                </p>
                <p className="mt-2 text-[13px] font-semibold text-slate-50">
                  Less drifting. More direction.
                </p>
                <p className="mt-1 text-sm text-slate-200/85">
                  A wearable ritual that makes “I’ll do it tomorrow” feel
                  outdated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA with floating band image above button */}
        <section className="pb-6 sm:pb-10">
          <div className="relative rounded-3xl border border-yellow-200/25 bg-slate-950/60 p-5 sm:p-7 backdrop-blur-xl shadow-[0_0_60px_rgba(250,204,21,0.10)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(56,189,248,0.12),transparent_60%)]" />

            <div className="relative z-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.26em] text-yellow-100/85">
                Ready to tap in
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                Get your NUMA Band
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-100/90">
                Daily real-sky horoscope. Stardust Action. Tap Share. Star Sync.
                One band — four rituals.
              </p>

              {/* Floating band image */}
              <div className="relative mx-auto mt-7 w-full max-w-[460px]">
                <div className="pointer-events-none absolute left-1/2 top-10 h-20 w-64 -translate-x-1/2 rounded-full bg-yellow-300/10 blur-2xl" />

                <div className="pointer-events-none mx-auto mb-4 flex justify-center">
                  <Image
                    src="/images/numa-band.png"
                    alt="NUMA Band"
                    width={520}
                    height={220}
                    priority={false}
                    className="h-auto w-[92%] max-w-[520px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                  />
                </div>

                <button
                  type="button"
                  onClick={goToCheckout}
                  className="w-full rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(250,204,21,0.60)] hover:brightness-110"
                >
                  Get a NUMA Band
                </button>

                <p className="mt-3 text-[11px] text-slate-300">
                  Secure, intentional sharing. Built for daily alignment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
