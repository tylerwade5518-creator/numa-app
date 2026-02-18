// app/dashboard/StardustScanCTA.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Phase = "idle" | "press" | "scanning" | "locating" | "finalizing" | "scanned";

type Props = {
  onScan?: () => Promise<void> | void;
  onScanComplete?: () => void;
  scanned?: boolean;
  defaultState?: "idle" | "scanned";
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function StardustScanCTA({
  onScan,
  onScanComplete,
  scanned = false,
  defaultState = "idle",
}: Props) {
  const [phase, setPhase] = useState<Phase>(
    scanned || defaultState === "scanned" ? "scanned" : "idle"
  );
  const [progress, setProgress] = useState(0);

  const runningRef = useRef(false);
  const scanPromiseRef = useRef<Promise<void> | null>(null);

  const isBusy =
    phase === "press" ||
    phase === "scanning" ||
    phase === "locating" ||
    phase === "finalizing";

  const isScanned = phase === "scanned" || scanned || defaultState === "scanned";

  useEffect(() => {
    if (scanned || defaultState === "scanned") setPhase("scanned");
  }, [scanned, defaultState]);

  const stepLabel = useMemo(() => {
    if (phase === "scanning") return "Scanning todays sky";
    if (phase === "locating") return "Locating your stardust card";
    if (phase === "finalizing") return "Finalizing";
    return "Powered by real-time moon and planet positions for your sign.";
  }, [phase]);

  const headline = useMemo(() => {
    return "DISCOVER YOUR DAILY STARDUST CARD";
  }, []);

  const runScan = async () => {
    if (isScanned) return;
    if (isBusy) return;
    if (runningRef.current) return;

    runningRef.current = true;
    setProgress(0);

    setPhase("press");
    await new Promise((r) => setTimeout(r, 140));

    // Start real scan work if provided
    try {
      scanPromiseRef.current = Promise.resolve(onScan ? onScan() : undefined);
    } catch {
      scanPromiseRef.current = Promise.resolve();
    }

    // ✅ +1s per phrase (3 phrases) so it doesn't feel too fast
    const baseMinMs = 900;
    const extraPerPhaseMs = 1000;
    const minMs = baseMinMs + extraPerPhaseMs * 3; // +3s total

    setPhase("scanning");
    const start = performance.now();

    const waitForRealScan = async () => {
      try {
        await (scanPromiseRef.current ?? Promise.resolve());
      } catch {
        // swallow
      }
    };

    // Animate to 95% over minMs, but never finish until real scan resolves.
    while (true) {
      const now = performance.now();
      const elapsed = now - start;
      const tMin = clamp01(elapsed / minMs); // 0..1

      let p = 0;

      // 3 equal windows = each phrase gets time on screen
      if (tMin <= 1 / 3) {
        setPhase("scanning");
        const local = tMin / (1 / 3);
        p = local * 0.45; // 0 -> 45%
      } else if (tMin <= 2 / 3) {
        setPhase("locating");
        const local = (tMin - 1 / 3) / (1 / 3);
        p = 0.45 + local * 0.42; // 45% -> 87%
      } else {
        setPhase("finalizing");
        const local = (tMin - 2 / 3) / (1 / 3);
        p = 0.87 + local * 0.08; // 87% -> 95%
      }

      setProgress(clamp01(p));

      // After min animation is done, hold at 95% until real scan resolves
      if (elapsed >= minMs) {
        setPhase("finalizing");
        setProgress(0.95);
        await waitForRealScan();
        break;
      }

      await new Promise((r) => setTimeout(r, 40));
    }

    // Finish to 100% right when the card is ready
    setPhase("finalizing");
    for (let i = 95; i <= 100; i++) {
      await new Promise((r) => setTimeout(r, 18));
      setProgress(clamp01(i / 100));
    }

    setPhase("scanned");
    runningRef.current = false;
    onScanComplete?.();
  };

  // ✅ Compact header after scan completes (mobile-safe)
  if (isScanned) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-emerald-300/18 bg-slate-950/45 px-4 py-3 backdrop-blur-md shadow-[0_0_28px_rgba(15,23,42,0.85)]">
        <div className="pointer-events-none absolute inset-0 cornerGlow opacity-80" />
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-white/10" />

        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-[3px] h-2.5 w-2.5 rounded-full bg-emerald-300/90 shadow-[0_0_14px_rgba(110,231,183,0.55)]" />
            <div className="min-w-0">
              <div className="text-[11px] font-extrabold tracking-[0.28em] text-emerald-100/90 whitespace-normal">
                SCAN COMPLETE
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-200/65 whitespace-normal">
                Today’s Stardust Card
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .cornerGlow {
            background: radial-gradient(
                900px 260px at 12% 0%,
                rgba(110, 231, 183, 0.14),
                transparent 55%
              ),
              radial-gradient(
                900px 260px at 88% 30%,
                rgba(56, 189, 248, 0.1),
                transparent 58%
              );
          }
        `}</style>
      </div>
    );
  }

  // Main CTA (✅ ONLY one progress bar + changing phrase above it)
  return (
    <button
      type="button"
      onClick={runScan}
      disabled={isBusy}
      aria-label="Scan today's sky to reveal your Stardust Card"
      className={[
        "group relative w-full overflow-hidden rounded-3xl border",
        "px-6 py-5 text-left transition-transform",
        isBusy
          ? "cursor-not-allowed opacity-95"
          : "hover:scale-[1.01] active:scale-[0.99]",
        isBusy ? "border-sky-200/40" : "border-white/12 group-hover:border-sky-200/35",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.78) 55%, rgba(2,6,23,0.86) 100%)",
        boxShadow: isBusy
          ? "0 0 60px rgba(56,189,248,0.18), 0 0 38px rgba(0,0,0,0.6)"
          : "0 0 42px rgba(0,0,0,0.55)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 skyWindow" />
      <div className="pointer-events-none absolute inset-0 glassGrain" />
      <div
        className={[
          "pointer-events-none absolute inset-0 cornerGlow",
          isBusy ? "opacity-100" : "opacity-75",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-white/10" />

      <div className="relative flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-black/25 ring-1 ring-white/10" />
          <div className="absolute inset-[7px] rounded-xl bg-slate-900/25 ring-1 ring-white/10" />
          <div
            className={[
              "absolute inset-[5px] rounded-2xl radarRing",
              isBusy ? "opacity-95" : "opacity-75 group-hover:opacity-90",
            ].join(" ")}
          />
          <div
            className={[
              "absolute inset-[5px] rounded-2xl orbitWrap",
              isBusy ? "orbitFast" : "orbitSlow",
            ].join(" ")}
          >
            <div className="orbitDot" />
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="scanLabel">SCAN</span>
          </div>
          <div className="pointer-events-none absolute inset-[8px] rounded-xl scanGlow" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-extrabold tracking-[0.28em] text-white/85 whitespace-normal">
            {headline}
          </div>

          {/* ✅ phrases change here */}
          <div className="mt-2 text-[12.5px] text-slate-200/65 whitespace-normal">
            {isBusy ? stepLabel : "Powered by real-time moon and planet positions for your sign."}
          </div>

          {/* ✅ ONLY one progress bar */}
          {isBusy && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full progressFill"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/10" />

      <style jsx>{`
        .scanLabel {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 18px rgba(56, 189, 248, 0.35);
          transform: translateX(1px);
        }
        .scanGlow {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.22) 0%,
            rgba(56, 189, 248, 0.12) 38%,
            rgba(56, 189, 248, 0) 70%
          );
          mix-blend-mode: screen;
          opacity: ${isBusy ? 0.9 : 0.65};
          filter: blur(0.4px);
        }
        .skyWindow {
          opacity: 0.9;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            radial-gradient(rgba(56, 189, 248, 0.06) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 28px 28px, 46px 46px, 74px 74px;
          background-position: 0 0, 14px 18px, 36px 10px;
          animation: skyDrift 16s linear infinite;
          mask-image: radial-gradient(
            1200px 320px at 30% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.65) 60%,
            rgba(0, 0, 0, 0.1) 100%
          );
          -webkit-mask-image: radial-gradient(
            1200px 320px at 30% 0%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.65) 60%,
            rgba(0, 0, 0, 0.1) 100%
          );
        }
        @keyframes skyDrift {
          0% {
            background-position: 0px 0px, 14px 18px, 36px 10px;
          }
          100% {
            background-position: 160px 80px, 98px 62px, 126px 54px;
          }
        }
        .glassGrain {
          opacity: 0.35;
          background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 18px 18px;
          filter: blur(0.2px);
          mask-image: radial-gradient(
            circle at 50% 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.55) 70%,
            rgba(0, 0, 0, 0) 100%
          );
          -webkit-mask-image: radial-gradient(
            circle at 50% 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.55) 70%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        .cornerGlow {
          background: radial-gradient(900px 280px at 12% 0%, rgba(56, 189, 248, 0.18), transparent 55%),
            radial-gradient(900px 280px at 88% 30%, rgba(255, 120, 210, 0.14), transparent 58%),
            radial-gradient(820px 320px at 50% 120%, rgba(255, 200, 120, 0.12), transparent 58%);
        }
        .radarRing {
          background: conic-gradient(
            from -90deg,
            transparent 0deg,
            rgba(56, 189, 248, 0.15) 45deg,
            transparent 90deg,
            transparent 360deg
          );
          filter: blur(0.4px);
          mix-blend-mode: screen;
          animation: radarSpin 1.55s linear infinite;
        }
        @keyframes radarSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .orbitWrap {
          position: absolute;
          inset: 0;
        }
        .orbitSlow {
          animation: orbitSpin 3.6s linear infinite;
          opacity: 0.7;
        }
        .orbitFast {
          animation: orbitSpin 1.55s linear infinite;
          opacity: 1;
        }
        @keyframes orbitSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .orbitDot {
          position: absolute;
          top: 7px;
          left: 50%;
          width: 7px;
          height: 7px;
          transform: translateX(-50%);
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.95);
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.75);
        }
        .progressFill {
          background: linear-gradient(
            90deg,
            rgba(56, 189, 248, 0.55),
            rgba(255, 255, 255, 0.65)
          );
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.35);
        }
      `}</style>
    </button>
  );
}
