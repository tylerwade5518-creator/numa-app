// app/dashboard/DailyInstrumentPanel.tsx
"use client";

import React, { useMemo } from "react";

type Props = {
  moonPhaseLabel?: string | null;
  showLive?: boolean;

  // Accept extra props that DashboardClient/DashboardClient.tsx passes
  toneName?: string;
  toneHex?: string;
  signalNumber?: number;
};

type PhaseKey =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

function normalizePhase(label?: string | null): PhaseKey {
  const v = (label ?? "").trim().toLowerCase();
  if (!v) return "first_quarter";

  if (v.includes("new")) return "new";
  if (v.includes("waxing") && v.includes("crescent")) return "waxing_crescent";
  if (v.includes("first") && v.includes("quarter")) return "first_quarter";
  if (v.includes("waxing") && v.includes("gibbous")) return "waxing_gibbous";
  if (v.includes("full")) return "full";
  if (v.includes("waning") && v.includes("gibbous")) return "waning_gibbous";
  if (v.includes("last") && v.includes("quarter")) return "last_quarter";
  if (v.includes("waning") && v.includes("crescent")) return "waning_crescent";

  return "first_quarter";
}

const MOON_SRC: Record<PhaseKey, string> = {
  new: "/moons/moon-new.png",
  waxing_crescent: "/moons/moon-waxing-crescent.png",
  first_quarter: "/moons/moon-first-quarter.png",
  waxing_gibbous: "/moons/moon-waxing-gibbous.png",
  full: "/moons/moon-full.png",
  waning_gibbous: "/moons/moon-waning-gibbous.png",
  last_quarter: "/moons/moon-last-quarter.png",
  waning_crescent: "/moons/moon-waning-crescent.png",
};

export default function DailyInstrumentPanel({ moonPhaseLabel }: Props) {
  const safeLabel = (moonPhaseLabel ?? "").trim() || "First Quarter";

  const phaseKey = useMemo(
    () => normalizePhase(moonPhaseLabel),
    [moonPhaseLabel]
  );

  const moonSrc = useMemo(() => MOON_SRC[phaseKey], [phaseKey]);

  return (
    <section className="wrap" aria-label={`Moon phase: ${safeLabel}`}>
      <div className="hero">
        <div className="moonLayer" aria-hidden="true">
          <div className="haloCore" />
          <img src={moonSrc} alt="" className="moon" draggable={false} />
          <div className="rim" />
          <div className="rimPulse" />
          <div className="shimmer" />
          <img src={moonSrc} alt="" className="moonBlur" draggable={false} />
        </div>

        <div className="hud">
          <p className="kicker">LUNAR PHASE</p>
          <p className="value">{safeLabel}</p>
          <div className="hairline">
            <span className="hairScan" />
          </div>
        </div>

        <div className="grain" />
      </div>

      <style jsx>{`
        .wrap {
          position: relative;
          z-index: 0;
          width: calc(100% + 2rem);
          margin-left: -1rem;
          margin-right: -1rem;
          padding: 0;
          margin-top: 2px;
        }

        .hero {
          position: relative;
          height: 176px;
          overflow: visible;
          background: transparent;
          z-index: 0;
        }

        .moonLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
          z-index: 0;
        }

        .haloCore,
        .rim,
        .rimPulse,
        .shimmer,
        .moonBlur {
          position: absolute;
          right: -32px;
          top: 52%;
          transform: translateY(-50%) scale(0.68);
          width: min(420px, 92%);
          aspect-ratio: 1 / 1;
          height: auto;
          border-radius: 999px;
        }

        .moon {
          position: absolute;
          right: -32px;
          top: 52%;
          transform: translateY(-50%) scale(0.68);
          width: min(420px, 92%);
          height: auto;
          object-fit: contain;
          opacity: 0.985;
          filter: drop-shadow(0 20px 34px rgba(0, 0, 0, 0.7));
          z-index: 0;
        }

        .haloCore {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0) 0%,
            rgba(56, 189, 248, 0) 58%,
            rgba(56, 189, 248, 0.24) 63%,
            rgba(56, 189, 248, 0.07) 69%,
            rgba(56, 189, 248, 0) 74%
          );
          mix-blend-mode: screen;
          opacity: 0.85;
          filter: blur(1.6px);
          z-index: -1;
        }

        .rim {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0.1) 68%,
            rgba(56, 189, 248, 0.16) 74%,
            rgba(56, 189, 248, 0) 80%
          );
          mix-blend-mode: screen;
          opacity: 0.36;
          z-index: 1;
        }

        .rimPulse {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0) 60%,
            rgba(56, 189, 248, 0.14) 73%,
            rgba(250, 204, 21, 0.08) 79%,
            rgba(250, 204, 21, 0) 84%
          );
          mix-blend-mode: screen;
          opacity: 0.07;
          animation: haloPulse 7s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes haloPulse {
          0% {
            opacity: 0.06;
          }
          50% {
            opacity: 0.11;
          }
          100% {
            opacity: 0.06;
          }
        }

        .shimmer {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.07) 48%,
            rgba(255, 255, 255, 0) 76%
          );
          mix-blend-mode: screen;
          opacity: 0.06;
          animation: shimmer 9s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes shimmer {
          0% {
            transform: translateY(-50%) translateX(-22px) scale(0.68);
            opacity: 0.045;
          }
          45% {
            opacity: 0.075;
          }
          100% {
            transform: translateY(-50%) translateX(22px) scale(0.68);
            opacity: 0.045;
          }
        }

        /*
          ✅ FIX: remove the visible “mask seam / blur line”
          - make the fade-in MUCH more gradual (no tight transition band)
          - slightly lower opacity + slightly more blur
          - push the clone down a touch so the fade happens deeper behind the card
          - include -webkit-mask-image for Safari consistency
        */
        .moonBlur {
          filter: blur(16px);
          opacity: 0.14;
          z-index: -2;
          transform: translateY(-50%) scale(0.68) translateY(70px);
          will-change: transform;

          -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 28%,
            rgba(0, 0, 0, 0.05) 44%,
            rgba(0, 0, 0, 0.14) 56%,
            rgba(0, 0, 0, 0.28) 66%,
            rgba(0, 0, 0, 0.55) 78%,
            rgba(0, 0, 0, 0.85) 90%,
            rgba(0, 0, 0, 1) 100%
          );
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 28%,
            rgba(0, 0, 0, 0.05) 44%,
            rgba(0, 0, 0, 0.14) 56%,
            rgba(0, 0, 0, 0.28) 66%,
            rgba(0, 0, 0, 0.55) 78%,
            rgba(0, 0, 0, 0.85) 90%,
            rgba(0, 0, 0, 1) 100%
          );

          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-position: center;
          mask-position: center;
        }

        .hud {
          position: absolute;
          left: 16px;
          top: 20px;
          z-index: 5;
        }

        .kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.74);
        }

        .value {
          font-size: 30px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.96);
        }

        .hairline {
          position: relative;
          width: 120px;
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(56, 189, 248, 0),
            rgba(56, 189, 248, 0.52),
            rgba(250, 204, 21, 0.3),
            rgba(250, 204, 21, 0)
          );
          overflow: hidden;
        }

        .hairScan {
          position: absolute;
          top: -2px;
          left: -30%;
          width: 30%;
          height: 5px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.22),
            rgba(255, 255, 255, 0)
          );
          opacity: 0.36;
          filter: blur(0.3px);
          animation: scan 5s ease-in-out infinite;
        }

        @keyframes scan {
          0% {
            transform: translateX(0);
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(520%);
            opacity: 0.2;
          }
        }

        .grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
        }

        @media (max-width: 560px) {
          .hero {
            height: 170px;
          }
          .value {
            font-size: 26px;
          }
        }

        @media (max-width: 420px) {
          .hero {
            height: 164px;
          }
          .value {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  );
}
