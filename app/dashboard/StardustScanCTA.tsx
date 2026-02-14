// app/dashboard/StardustScanCTA.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Phase =
  | "idle"
  | "hover"
  | "press"
  | "calibrating"
  | "sweeping"
  | "locking"
  | "revealing"
  | "scanned";

type Props = {
  onScanComplete?: () => void;
  defaultState?: "idle" | "scanned";
  /** Optional: show a custom “today” label (e.g. "Tonight") */
  dayLabel?: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function StardustScanCTA({
  onScanComplete,
  defaultState = "idle",
  dayLabel = "today",
}: Props) {
  const [phase, setPhase] = useState<Phase>(defaultState);
  const [progress, setProgress] = useState(0);

  // Prevent stacking runs on rapid taps
  const runningRef = useRef(false);

  const isBusy =
    phase === "calibrating" ||
    phase === "sweeping" ||
    phase === "locking" ||
    phase === "revealing";

  const isScanned = phase === "scanned" || defaultState === "scanned";

  useEffect(() => {
    if (defaultState === "scanned") setPhase("scanned");
  }, [defaultState]);

  // ✅ Main title line (clean)
  const titleText = useMemo(() => {
    if (isScanned) return "Stardust Card ready";
    if (phase === "hover") return "Stardust Card";
    if (phase === "press") return "Engaging sensor…";
    if (phase === "calibrating") return "Scanning today’s sky";
    if (phase === "sweeping") return "Locating your Cosmic Card";
    if (phase === "locking") return "Calculating today’s action";
    if (phase === "revealing") return "Finalizing your pull…";
    return "Stardust Card";
  }, [phase, isScanned]);

  // ✅ Subtext: keep “Powered by …” as the only default copy
  const subText = useMemo(() => {
    if (isScanned) return "Tap to open your Cosmic Card + Stardust Action.";
    if (phase === "calibrating") return "1. Scanning today’s sky.";
    if (phase === "sweeping") return "2. Locating your Cosmic Card.";
    if (phase === "locking" || phase === "revealing")
      return "3. Calculating today’s action.";
    if (isBusy) return "Real-time sky data • fast scan • daily unique pull";
    return "Powered by real-time moon and planet positions for your sign.";
  }, [phase, isBusy, isScanned]);

  const badgeText = useMemo(() => {
    if (isScanned) return "Completed";
    if (isBusy) return `${Math.round(progress * 100)}%`;
    return "Live";
  }, [isBusy, isScanned, progress]);

  const handleEnter = () => {
    if (isScanned || isBusy) return;
    setPhase("hover");
  };

  const handleLeave = () => {
    if (isScanned || isBusy) return;
    setPhase("idle");
  };

  const runScan = async () => {
    if (isScanned) {
      onScanComplete?.();
      return;
    }
    if (isBusy) return;
    if (runningRef.current) return;

    runningRef.current = true;
    setProgress(0);

    setPhase("press");
    await new Promise((r) => setTimeout(r, 140));

    // Phase 1: Scanning today’s sky
    setPhase("calibrating");
    for (let i = 0; i <= 20; i++) {
      await new Promise((r) => setTimeout(r, 22));
      setProgress(clamp01(i / 100));
    }

    // Phase 2: Locating your Cosmic Card
    setPhase("sweeping");
    for (let i = 21; i <= 72; i++) {
      await new Promise((r) => setTimeout(r, 15));
      setProgress(clamp01(i / 100));
    }

    // Phase 3: Calculating today’s action
    setPhase("locking");
    for (let i = 73; i <= 92; i++) {
      await new Promise((r) => setTimeout(r, 18));
      setProgress(clamp01(i / 100));
    }

    // Finalize
    setPhase("revealing");
    for (let i = 93; i <= 100; i++) {
      await new Promise((r) => setTimeout(r, 18));
      setProgress(clamp01(i / 100));
    }

    setPhase("scanned");
    runningRef.current = false;
    onScanComplete?.();
  };

  return (
    <button
      type="button"
      onClick={runScan}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      disabled={isBusy}
      aria-label="Scan today's sky to reveal your Cosmic Card and Stardust Action"
      className={[
        "group relative w-full overflow-hidden rounded-3xl border",
        "px-6 py-5 text-left transition-transform",
        isBusy
          ? "cursor-not-allowed opacity-95"
          : "hover:scale-[1.01] active:scale-[0.99]",
        isScanned
          ? "border-sky-200/30"
          : isBusy
          ? "border-sky-200/40"
          : "border-white/12 group-hover:border-sky-200/35",
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
      {/* LIVE SKY WINDOW */}
      <div className="pointer-events-none absolute inset-0 skyWindow" />

      {/* Subtle “glass” grain */}
      <div className="pointer-events-none absolute inset-0 glassGrain" />

      {/* Corner glows (reactive) */}
      <div
        className={[
          "pointer-events-none absolute inset-0 cornerGlow",
          isBusy ? "opacity-100" : "opacity-70 group-hover:opacity-95",
        ].join(" ")}
      />

      {/* Whole-card scan sweep (only when scanning or hovered) */}
      <div
        className={[
          "pointer-events-none absolute inset-0 cardSweep",
          isBusy
            ? "opacity-85"
            : phase === "hover"
            ? "opacity-55"
            : "opacity-0",
        ].join(" ")}
      />

      {/* Top hairline highlight */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-white/10" />

      {/* CONTENT */}
      <div className="relative flex items-center gap-5">
        {/* LEFT: Sensor “port” — ✅ make SCAN more prominent */}
        <div className="relative h-16 w-16 shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-black/25 ring-1 ring-white/10" />
          <div className="absolute inset-[7px] rounded-xl bg-slate-900/25 ring-1 ring-white/10" />

          {/* Radar ring */}
          <div
            className={[
              "absolute inset-[5px] rounded-2xl radarRing",
              isBusy ? "opacity-95" : "opacity-70 group-hover:opacity-90",
            ].join(" ")}
          />

          {/* Orbit dot */}
          <div
            className={[
              "absolute inset-[5px] rounded-2xl orbitWrap",
              isBusy ? "orbitFast" : "orbitSlow",
            ].join(" ")}
          >
            <div className="orbitDot" />
          </div>

          {/* ✅ Stronger label */}
          <div className="absolute inset-0 grid place-items-center">
            <span className="scanLabel">SCAN</span>
          </div>

          {/* ✅ subtle inner glow to make the icon feel “hotter” */}
          <div className="pointer-events-none absolute inset-[8px] rounded-xl scanGlow" />
        </div>

        {/* MID: Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">
              Discover your stardust
            </div>

            {/* Status chip */}
            <div
              className={[
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                "tracking-[0.14em] uppercase",
                isScanned
                  ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200/90"
                  : isBusy
                  ? "border-sky-200/25 bg-sky-400/10 text-sky-100/90"
                  : "border-white/12 bg-white/5 text-white/70",
              ].join(" ")}
            >
              {badgeText}
            </div>
          </div>

          <div className="mt-1 text-[15px] font-semibold text-white/92">
            {titleText}
          </div>

          <div className="mt-1 text-[12.5px] text-slate-200/65">{subText}</div>

          {/* Progress: scan bar + faint waveform */}
          {isBusy && (
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full progressFill"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className="waveLine" />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: removed the non-functional Open button entirely */}
      </div>

      {/* Bottom “instrument” line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/10" />

      <style jsx>{`
        .scanLabel {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 18px rgba(56, 189, 248, 0.35);
          transform: translateX(1px); /* optical centering with tracking */
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
          background: radial-gradient(
              900px 280px at 12% 0%,
              rgba(56, 189, 248, 0.18),
              transparent 55%
            ),
            radial-gradient(
              900px 280px at 88% 30%,
              rgba(255, 120, 210, 0.14),
              transparent 58%
            ),
            radial-gradient(
              820px 320px at 50% 120%,
              rgba(255, 200, 120, 0.12),
              transparent 58%
            );
        }

        .cardSweep {
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 38%,
            rgba(56, 189, 248, 0.12) 50%,
            rgba(255, 255, 255, 0.03) 62%,
            transparent 100%
          );
          transform: translateX(-70%);
          animation: sweepAcross 1.25s linear infinite;
          mix-blend-mode: screen;
          filter: blur(0.35px);
        }

        @keyframes sweepAcross {
          0% {
            transform: translateX(-70%);
          }
          100% {
            transform: translateX(70%);
          }
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

        .waveLine {
          height: 100%;
          width: 45%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            rgba(56, 189, 248, 0.28),
            rgba(255, 255, 255, 0.22),
            transparent
          );
          filter: blur(0.3px);
          animation: waveMove 0.85s ease-in-out infinite;
          border-radius: 9999px;
        }

        @keyframes waveMove {
          0% {
            transform: translateX(-15%);
            opacity: 0.35;
          }
          50% {
            transform: translateX(75%);
            opacity: 0.9;
          }
          100% {
            transform: translateX(-15%);
            opacity: 0.35;
          }
        }

        .actionGlow {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.14),
            transparent 60%
          );
          opacity: 0.85;
        }
      `}</style>
    </button>
  );
}
