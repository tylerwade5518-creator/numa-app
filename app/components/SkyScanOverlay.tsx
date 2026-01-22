"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export function SkyScanOverlay({
  open,
  onDone,
  onClose,
  durationMs = 5000,
  signLabel,
}: {
  open: boolean;
  onDone: () => void;
  onClose: () => void;
  durationMs?: number;
  signLabel?: string; // optional: "Aries"
}) {
  const [phase, setPhase] = useState<
    "calibrating" | "mapping" | "comparing" | "revealing"
  >("calibrating");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const phaseTimes = useMemo(() => {
    const d = Math.max(1800, durationMs);
    return {
      t1: Math.round(d * 0.25),
      t2: Math.round(d * 0.52),
      t3: Math.round(d * 0.78),
      tDone: d,
    };
  }, [durationMs]);

  useEffect(() => {
    if (!open) return;

    setPhase("calibrating");

    const t1 = setTimeout(() => setPhase("mapping"), phaseTimes.t1);
    const t2 = setTimeout(() => setPhase("comparing"), phaseTimes.t2);
    const t3 = setTimeout(() => setPhase("revealing"), phaseTimes.t3);
    const tDone = setTimeout(() => onDone(), phaseTimes.tDone);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDone);
    };
  }, [open, phaseTimes, onDone]);

  // Force autoplay + restart when opened
  useEffect(() => {
    if (!open) return;

    const v = videoRef.current;
    if (!v) return;

    // Remount covers most issues, but also reset time and try play.
    try {
      v.currentTime = 0;
    } catch {
      // ignore
    }

    const t = window.setTimeout(() => {
      v.play().catch(() => {
        // Autoplay should work because it's muted + playsInline.
        // If a browser blocks it anyway, the first frame should still render.
      });
    }, 80);

    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const label =
    phase === "calibrating"
      ? "Calibrating sensors"
      : phase === "mapping"
      ? "Mapping current sky"
      : phase === "comparing"
      ? `Aligning sky to ${signLabel ?? "your sign"}`
      : "Selecting your Stardust Action";

  // Key forces a full remount each time open toggles on
  const videoKey = `skyscan-${open ? "open" : "closed"}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-[92%] max-w-sm overflow-hidden rounded-3xl border border-white/12 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(56,189,248,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-sky-200/80">
              Sky Scan
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-50">
              Analyzing today’s sky for your personal Stardust Action
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800/80"
          >
            Close
          </button>
        </div>

        {/* MP4 container */}
        <div className="relative mt-5 h-44 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          {/* Visible proof you’re rendering THIS component */}
          <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
            MP4 ACTIVE
          </div>

          {/* fallback glow */}
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
          </div>

          {/* the video */}
          <video
            key={videoKey}
            ref={videoRef}
            className="absolute inset-0 z-10 h-full w-full object-cover"
            src="/videos/skyscan.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/videos/skyscan.mp4#t=0.1"
            onError={(e) => {
              // @ts-ignore
              console.error("SkyScan video error:", e?.currentTarget?.error);
            }}
          />

          {/* scan haze */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.10),transparent_55%)]" />
          </div>

          {/* scanline overlay */}
          <div className="scanline pointer-events-none absolute left-0 top-0 z-30 h-16 w-full bg-gradient-to-b from-sky-300/18 via-sky-300/10 to-transparent" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-200">
            {label}
            <LoadingDots />
          </div>
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300/90" />
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300/35" />
          </div>
        </div>

        <style jsx>{`
          .scanline {
            animation: scanMove 1.15s ease-in-out infinite;
          }
          @keyframes scanMove {
            0% {
              transform: translateY(-40px);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            60% {
              opacity: 1;
            }
            100% {
              transform: translateY(210px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span
      className="ml-2 inline-flex items-center gap-1 align-middle"
      aria-hidden="true"
    >
      <span className="dot h-1 w-1 rounded-full bg-slate-200/70" />
      <span className="dot h-1 w-1 rounded-full bg-slate-200/70 [animation-delay:150ms]" />
      <span className="dot h-1 w-1 rounded-full bg-slate-200/70 [animation-delay:300ms]" />
      <style jsx>{`
        .dot {
          display: inline-block;
          animation: dotBounce 900ms infinite ease-in-out;
        }
        @keyframes dotBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
