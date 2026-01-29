// app/buy/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedSpaceBackground from "../dashboard/AnimatedSpaceBackground";

/**
 * NUMA Buy Page (layout-first)
 * - App-native nebula background + animated stars
 * - Hero montage slot + CTA at top
 * - iPhone carousel: swipe-first, subtle auto-advance (6s) only until first interaction
 * - Feature sections + Creator Editions + Checkout anchor + second CTA
 *
 * Replace placeholder images/videos later.
 */

type SlideId = "dashboard" | "stardust" | "tapshare" | "starsync";

type Slide = {
  id: SlideId;
  title: string;
  blurb: string;
  // Put your real image path later (or render real components)
  imageSrc: string;
  badge: string;
};

const SHOPIFY_PRODUCT_URL = "https://your-shopify-product-link-here.com"; // TODO replace

const SLIDES: Slide[] = [
  {
    id: "dashboard",
    badge: "Daily Dashboard",
    title: "Daily horoscope tuned to today’s sky",
    blurb:
      "Open your dashboard instantly and get a calm read on today’s alignment — built from real moon + planet positions.",
    imageSrc: "/placeholders/iphone-dashboard.png",
  },
  {
    id: "stardust",
    badge: "Stardust Action",
    title: "A small challenge that nudges your day forward",
    blurb:
      "A single intentional move — reflection, action, or connection — designed to compound over time.",
    imageSrc: "/placeholders/iphone-stardust.png",
  },
  {
    id: "tapshare",
    badge: "Tap Share",
    title: "Connect fast — share only what you choose",
    blurb:
      "A secure one-tap exchange. You decide what’s shared, it works once, then turns off.",
    imageSrc: "/placeholders/iphone-tapshare.png",
  },
  {
    id: "starsync",
    badge: "Star Sync",
    title: "Insight into how someone fits your orbit",
    blurb:
      "See overall compatibility plus category views for friendship, romantic connection, and work/ambition.",
    imageSrc: "/placeholders/iphone-starsync.png",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const update = () => setReduced(Boolean(mq.matches));
    update();
    // @ts-ignore
    mq.addEventListener?.("change", update);
    // @ts-ignore
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function PrimaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110 sm:w-auto"
    >
      {children}
    </a>
  );
}

function SecondaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900/80 sm:w-auto"
    >
      {children}
    </a>
  );
}

function Dots({
  count,
  active,
}: {
  count: number;
  active: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => {
        const on = i === active;
        return (
          <div
            key={i}
            className={
              "h-2 w-2 rounded-full border transition " +
              (on
                ? "border-sky-200/80 bg-sky-200/70 shadow-[0_0_14px_rgba(56,189,248,0.6)]"
                : "border-white/20 bg-white/10")
            }
          />
        );
      })}
    </div>
  );
}

function IphoneCarousel() {
  const reducedMotion = usePrefersReducedMotion();

  const slides = useMemo(() => SLIDES, []);
  const [index, setIndex] = useState(0);

  // interaction state: once user swipes/drags, auto-advance stops permanently
  const [hasInteracted, setHasInteracted] = useState(false);

  // touch/drag
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);
  const dragging = useRef(false);

  // subtle auto-advance: wait 3s, then every 6s, until interaction
  useEffect(() => {
    if (reducedMotion) return;
    if (hasInteracted) return;

    const t0 = window.setTimeout(() => {
      const t = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 6000);
      // cleanup interval if interaction flips later
      const stopIfInteracted = () => {
        if (hasInteracted) window.clearInterval(t);
      };
      stopIfInteracted();
      return () => window.clearInterval(t);
    }, 3000);

    return () => window.clearTimeout(t0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInteracted, reducedMotion]);

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = prev + dir;
      return clamp(next, 0, slides.length - 1);
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    deltaX.current = 0;
    // capture for consistent move/up
    // @ts-ignore
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startX.current === null) return;
    deltaX.current = e.clientX - startX.current;
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const dx = deltaX.current;
    startX.current = null;
    deltaX.current = 0;

    const threshold = 40; // px
    if (Math.abs(dx) < threshold) return;

    setHasInteracted(true);

    if (dx < 0) {
      // swipe left -> next
      setIndex((prev) => clamp(prev + 1, 0, slides.length - 1));
    } else {
      // swipe right -> prev
      setIndex((prev) => clamp(prev - 1, 0, slides.length - 1));
    }
  };

  // partial peek: we render a horizontal track with gap and show a bit of next slide
  // using padding-right to expose next.
  const active = slides[index];

  return (
    <div className="rounded-3xl border border-sky-200/35 bg-slate-950/70 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.9)]">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/90">
          What Opens
        </p>
        <p className="text-xs text-slate-200">
          Swipe through the experience — built to feel calm, fast, and real.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* iPhone frame + swipe area */}
        <div className="relative">
          <div className="relative mx-auto w-full max-w-[360px]">
            {/* One-time swipe hint motion if untouched */}
            <div
              className={
                "relative rounded-[2.25rem] border border-white/15 bg-black/35 p-3 shadow-[0_0_45px_rgba(0,0,0,0.9)] " +
                (!hasInteracted && !reducedMotion ? "swipe-nudge" : "")
              }
            >
              {/* phone bezel */}
              <div className="relative rounded-[1.85rem] border border-white/10 bg-slate-950/40 p-2">
                {/* notch */}
                <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-black/40 border border-white/10" />

                {/* swipe track */}
                <div
                  className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {/* the "peek" is implemented by adding right padding to track container
                      so next slide shows on the right edge */}
                  <div
                    className="flex w-full gap-3 p-3 pr-10"
                    style={{
                      transform: `translateX(calc(-${index} * (100% + 0px)))`,
                      transition: dragging.current ? "none" : "transform 260ms ease-out",
                    }}
                  >
                    {slides.map((s) => (
                      <div
                        key={s.id}
                        className="min-w-[100%] overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/25"
                      >
                        {/* Placeholder “screen” */}
                        <div className="relative aspect-[9/19] w-full">
                          <img
                            src={s.imageSrc}
                            alt={`${s.badge} preview`}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                              // If placeholder missing, render a nice fallback block
                              const el = e.currentTarget as HTMLImageElement;
                              el.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                            <div className="rounded-full border border-sky-200/35 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-sky-100/90">
                              {s.badge}
                            </div>
                            <div className="text-sm font-semibold text-slate-50">
                              {s.title}
                            </div>
                            <div className="text-[11px] text-slate-300">
                              (Drop your real screenshot/video later)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* subtle edge glow to suggest swipe */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-950/80 to-transparent" />
                </div>

                <div className="mt-3">
                  <Dots count={slides.length} active={index} />
                  <div className="mt-2 text-center text-[11px] text-slate-400">
                    Swipe to explore •{" "}
                    <span className="text-slate-200">{active.badge}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* swipe hint label */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/70 shadow-[0_0_10px_rgba(56,189,248,0.75)]" />
              <span>Swipe the phone</span>
            </div>
          </div>
        </div>

        {/* text that updates with slide */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200/35 bg-slate-950/55 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-yellow-100/90">
            {active.badge}
          </div>

          <h3 className="text-lg font-semibold text-slate-50 sm:text-xl">
            {active.title}
          </h3>

          <p className="text-sm leading-relaxed text-slate-200/90">
            {active.blurb}
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <SecondaryCTA href="#checkout">Get your band</SecondaryCTA>
            <SecondaryCTA href="#features">See the features</SecondaryCTA>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes numaSwipeNudge {
          0% { transform: translateX(0); }
          35% { transform: translateX(-4px); }
          70% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        .swipe-nudge {
          animation: numaSwipeNudge 1.6s ease-in-out 1;
        }
      `}</style>
    </div>
  );
}

export default function BuyPage() {
  const router = useRouter();

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
      {/* dark veil */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />

      {/* moving stars */}
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
        {/* Header */}
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
              A tap-to-open wearable for daily alignment and real-world connection.
            </p>
          </div>

          <div className="hidden w-16 sm:block" />
        </section>

        {/* HERO: Tap montage slot */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-yellow-200/35 bg-slate-950/55 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            {/* video slot */}
            <div className="relative aspect-[16/9] w-full bg-black/35">
              {/* Replace this block with a <video> later */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <div className="rounded-full border border-yellow-200/45 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                  Tap Montage (placeholder)
                </div>
                <div className="text-lg font-semibold text-slate-50 sm:text-xl">
                  One tap opens your world.
                </div>
                <div className="max-w-lg text-xs leading-relaxed text-slate-200/90">
                  NUMA is a wearable that opens your personal dashboard for alignment,
                  action, and connection — instantly.
                </div>
              </div>

              {/* overlay gradient for future video readability */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Hero CTAs */}
            <div className="grid gap-2 p-4 sm:p-5 sm:grid-cols-[1fr_1fr]">
              <PrimaryCTA href="#checkout">Get Your NUMA Band</PrimaryCTA>
              <SecondaryCTA href="#what-opens">See what opens</SecondaryCTA>
            </div>
          </div>
        </section>

        {/* What Opens */}
        <section id="what-opens">
          <IphoneCarousel />
        </section>

        {/* Features overview (future-self framing) */}
        <section id="features">
          <div className="rounded-3xl border border-slate-600/60 bg-slate-950/70 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.85)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Why NUMA works
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-50 sm:text-2xl">
              A small daily ritual that compounds.
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-200/90">
              <p>
                NUMA isn’t built for endless scrolling. It’s built for quick check-ins —
                a calm read on the day, a small action to move you forward, and tools
                to connect with people intentionally.
              </p>
              <p>
                Over time, those moments stack: clearer choices, better timing, and a
                stronger sense of where you’re headed.
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <SecondaryCTA href="#band">See the band</SecondaryCTA>
              <SecondaryCTA href="#checkout">Get yours</SecondaryCTA>
            </div>
          </div>
        </section>

        {/* Physical band section */}
        <section id="band">
          <div className="rounded-3xl border border-yellow-200/30 bg-slate-950/70 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.9)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
              The Band
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:items-center">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-6">
                {/* placeholder image */}
                <div className="text-center">
                  <div className="mx-auto inline-flex rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                    Band photo placeholder
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    Drop product image/video here later.
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-50">
                  Always ready. No charging.
                </h3>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-200/80" />
                    Tap to open your dashboard instantly
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-200/80" />
                    Designed for comfort + daily wear
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-200/80" />
                    Zodiac tag + collectible future designs
                  </li>
                </ul>

                <div className="grid gap-2 sm:grid-cols-2">
                  <SecondaryCTA href="#creator">Creator editions</SecondaryCTA>
                  <SecondaryCTA href="#checkout">Buy now</SecondaryCTA>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator editions tease */}
        <section id="creator">
          <div className="rounded-3xl border border-sky-200/30 bg-slate-950/70 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(15,23,42,0.9)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/90">
              Creator Editions
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-50">
              Limited designs with creators — coming soon.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-200/90">
              We’ll partner with creators to release signature bands. Same NUMA system,
              new designs — built for collecting and sharing.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <SecondaryCTA href="#checkout">Get the first edition</SecondaryCTA>
              <SecondaryCTA href="#what-opens">Explore the app</SecondaryCTA>
            </div>
          </div>
        </section>

        {/* Checkout anchor (second major CTA) */}
        <section id="checkout" className="pb-10">
          <div className="rounded-3xl border border-yellow-200/45 bg-gradient-to-b from-slate-950/80 via-slate-950/85 to-slate-950/90 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_55px_rgba(250,204,21,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
              Get Your NUMA Band
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:items-start">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="text-sm font-semibold text-slate-50">
                  NUMA Band — First Edition
                </div>
                <div className="mt-1 text-xs text-slate-300">
                  (Replace with real price + options later)
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-200/90">
                  <div className="flex items-center justify-between">
                    <span>Includes</span>
                    <span className="text-slate-100">Band + Zodiac Tag</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Setup</span>
                    <span className="text-slate-100">Tap to start</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Best for</span>
                    <span className="text-slate-100">Daily + social</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-200/90">
                  Checkout will happen on our secure product page (Shopify). This keeps
                  fulfillment, TikTok Shop, and affiliate tracking simple.
                </p>

                <a
                  href={SHOPIFY_PRODUCT_URL}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110"
                >
                  Continue to Secure Checkout
                </a>

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-[11px] text-slate-300">
                  Tip: once your Shopify product is live, paste that link into{" "}
                  <span className="text-slate-100 font-semibold">
                    SHOPIFY_PRODUCT_URL
                  </span>{" "}
                  at the top of this file.
                </div>

                <div className="text-[11px] text-slate-400">
                  You can still keep this page fully on-brand — Shopify just handles the
                  final checkout.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer mini-links */}
        <section className="pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>© {new Date().getFullYear()} NUMA</div>
            <div className="flex gap-3">
              <Link href="/login" className="hover:text-slate-200">
                Login
              </Link>
              <Link href="/buy" className="hover:text-slate-200">
                Buy
              </Link>
              <Link href="/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
