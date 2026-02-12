// app/dashboard/DailyInstrumentPanel.tsx
"use client";

import React, { useMemo } from "react";

type Props = {
  moonPhaseLabel?: string | null;
  showLive?: boolean;
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

  // Default to First Quarter if undefined
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
        /* Create a stacking context so later dashboard sections can sit ABOVE this moon art */
        .wrap {
          position: relative;
          z-index: 0; /* key: prevents moon art from floating above the next card */
          width: calc(100% + 2rem);
          margin-left: -1rem;
          margin-right: -1rem;
          padding: 0;
          margin-top: 2px;
        }

        .hero {
          position: relative;
          height: 236px;
          overflow: visible;
          background: transparent;
          z-index: 0;
        }

        /* Moon art stays behind everything else on the page */
        .moonLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
          z-index: 0;
        }

        /* Shared geometry: keep halo perfectly circular on ALL screen sizes */
        .haloCore,
        .rim,
        .rimPulse,
        .shimmer,
        .moonBlur {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%) scale(0.82);

          /* ✅ FIX #1: circle stays a circle (no fixed height fighting max-width) */
          width: min(420px, 92%);
          aspect-ratio: 1 / 1;
          height: auto;

          border-radius: 999px;
        }

        .moon {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%) scale(0.82);

          width: min(420px, 92%);
          height: auto;

          object-fit: contain;
          opacity: 0.995;
          filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.78));
          z-index: 2; /* below HUD, still within this panel */
        }

        /* ✅ FIX #1: halo as a uniform ring, symmetrical thickness */
        .haloCore {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0) 0%,
            rgba(56, 189, 248, 0) 58%,
            rgba(56, 189, 248, 0.26) 63%,
            rgba(56, 189, 248, 0.08) 69%,
            rgba(56, 189, 248, 0) 74%
          );
          mix-blend-mode: screen;
          opacity: 0.95;
          filter: blur(1.6px);
          z-index: 1;
        }

        .rim {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0.10) 68%,
            rgba(56, 189, 248, 0.16) 74%,
            rgba(56, 189, 248, 0) 80%
          );
          mix-blend-mode: screen;
          opacity: 0.45;
          z-index: 3;
        }

        .rimPulse {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0) 60%,
            rgba(56, 189, 248, 0.16) 73%,
            rgba(250, 204, 21, 0.09) 79%,
            rgba(250, 204, 21, 0) 84%
          );
          mix-blend-mode: screen;
          opacity: 0.09;
          animation: haloPulse 7s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes haloPulse {
          0% {
            opacity: 0.08;
          }
          50% {
            opacity: 0.14;
          }
          100% {
            opacity: 0.08;
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
          opacity: 0.08;
          animation: shimmer 9s ease-in-out infinite;
          z-index: 4;
        }

        @keyframes shimmer {
          0% {
            transform: translateY(-50%) translateX(-22px) scale(0.82);
            opacity: 0.06;
          }
          45% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-50%) translateX(22px) scale(0.82);
            opacity: 0.06;
          }
        }

        /* ✅ FIX #2: blurred bleed is behind the next card (never on top) */
        .moonBlur {
          filter: blur(12px);
          opacity: 0.22;
          z-index: -1; /* pushes the bleed behind panel stacking */
          transform: translateY(-50%) scale(0.82) translateY(18px);
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 52%,
            rgba(0, 0, 0, 0.35) 70%,
            rgba(0, 0, 0, 1) 100%
          );
        }

        /* HUD always above moon art */
        .hud {
          position: absolute;
          left: 16px;
          top: 46px;
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
          width: 120px;
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(56, 189, 248, 0),
            rgba(56, 189, 248, 0.52),
            rgba(250, 204, 21, 0.3),
            rgba(250, 204, 21, 0)
          );
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
            height: 228px;
          }

          .hud {
            top: 48px;
          }

          .value {
            font-size: 26px;
          }
        }

        @media (max-width: 420px) {
          .hero {
            height: 218px;
          }

          .value {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  );
}
