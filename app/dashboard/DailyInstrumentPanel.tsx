// app/dashboard/DailyInstrumentPanel.tsx
"use client";

import React, { useMemo } from "react";

type Props = {
  moonPhaseLabel: string; // e.g. "Waxing Crescent"
  toneName: string; // e.g. "Midnight Gold"
  toneHex: string; // e.g. "#D6B35A"
  signalNumber: number; // e.g. 7
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

function normalizePhase(label: string): PhaseKey {
  const v = label.trim().toLowerCase();
  if (v.includes("new")) return "new";
  if (v.includes("waxing") && v.includes("crescent")) return "waxing_crescent";
  if (v.includes("first") && v.includes("quarter")) return "first_quarter";
  if (v.includes("waxing") && v.includes("gibbous")) return "waxing_gibbous";
  if (v.includes("full")) return "full";
  if (v.includes("waning") && v.includes("gibbous")) return "waning_gibbous";
  if (v.includes("last") && v.includes("quarter")) return "last_quarter";
  if (v.includes("waning") && v.includes("crescent")) return "waning_crescent";
  return "waxing_crescent";
}

/** Public asset paths: /public/moons */
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

export default function DailyInstrumentPanel({
  moonPhaseLabel,
  toneName,
  toneHex,
  signalNumber,
  showLive = true,
}: Props) {
  const phaseKey = useMemo(() => normalizePhase(moonPhaseLabel), [moonPhaseLabel]);
  const moonSrc = useMemo(() => MOON_SRC[phaseKey], [phaseKey]);

  return (
    <section className="dipWrap">
      <header className="dipHeader">
        <p className="dipTitle">DAILY INSTRUMENT PANEL</p>

        {showLive && (
          <div className="liveTech" aria-label="Live status">
            <span className="livePing" aria-hidden="true" />
            <span className="liveDot" aria-hidden="true" />
            <span className="liveText">live</span>
          </div>
        )}
      </header>

      <div className="dipLayout">
        {/* LEFT: Moon hero */}
        <div className="moonHero" aria-label={`Moon phase: ${moonPhaseLabel}`}>
          <div className="moonMeta">
            <p className="kicker">MOON PHASE</p>
            <p className="phaseLabel">{moonPhaseLabel}</p>
          </div>

          <div className="moonStage" aria-hidden="true">
            <img src={moonSrc} alt="" className="moonImg" draggable={false} />
          </div>
        </div>

        {/* RIGHT: Tone + Signal stacked */}
        <div className="rightStack">
          {/* Tone */}
          <div className="miniCard">
            <div className="miniTop">
              <p className="kicker">TONE</p>
            </div>

            <div className="miniCenter">
              <div
                className="toneSwatch"
                style={
                  {
                    ["--toneHex" as any]: toneHex,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              >
                <div className="toneSheen" />
                <div className="toneEdge" />
              </div>
              <p className="miniValue">{toneName}</p>
            </div>
          </div>

          {/* Signal */}
          <div className="miniCard">
            <div className="miniTop">
              <p className="kicker">SIGNAL</p>
            </div>

            <div className="miniCenter signalRow">
              <div className="signalNumber">{signalNumber}</div>
              <div className="signalTicks" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Transparent outer container (no “big block” background) */
        .dipWrap {
          border-radius: 24px;
          padding: 14px 14px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          box-shadow: none;
        }

        .dipHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .dipTitle {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.7);
        }

        /* Tech-style live indicator */
        .liveTech {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(2, 6, 23, 0.14);
          backdrop-filter: blur(10px);
        }

        .liveText {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: lowercase;
          color: rgba(255, 255, 255, 0.85);
        }

        .liveDot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgb(239, 68, 68);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.45);
        }

        .livePing {
          position: absolute;
          left: 9px;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          border: 1px solid rgba(239, 68, 68, 0.55);
          animation: ping 1.6s ease-out infinite;
          opacity: 0.0;
        }

        @keyframes ping {
          0% { transform: scale(1); opacity: 0.0; }
          15% { opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0.0; }
        }

        /* Layout */
        .dipLayout {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 12px;
          align-items: stretch;
        }

        /* Shared text */
        .kicker {
          margin: 0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
        }

        /* LEFT: Moon hero panel (subtle separation only) */
        .moonHero {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(2, 6, 23, 0.10); /* light separation like meters */
          backdrop-filter: blur(10px);
          box-shadow: 0 0 26px rgba(0, 0, 0, 0.35);
          min-height: 118px;
        }

        .moonMeta {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 75%;
        }

        .phaseLabel {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Big moon with no inner background */
        .moonStage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 10px 10px;
        }

        .moonImg {
          width: min(240px, 92%);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 16px 26px rgba(0, 0, 0, 0.65));
          transform: translateZ(0);
          user-select: none;
          pointer-events: none;
        }

        /* RIGHT: stacked */
        .rightStack {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 12px;
        }

        .miniCard {
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(2, 6, 23, 0.10);
          backdrop-filter: blur(10px);
          box-shadow: 0 0 22px rgba(0, 0, 0, 0.35);
          padding: 12px;
          overflow: hidden;
          min-height: 53px;
        }

        .miniTop {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 10px;
        }

        .miniCenter {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .miniValue {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Tone swatch */
        .toneSwatch {
          position: relative;
          width: 44px;
          height: 30px;
          border-radius: 16px;
          background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.18) 0%,
              rgba(255, 255, 255, 0.06) 22%,
              rgba(0, 0, 0, 0) 55%
            ),
            radial-gradient(
              circle at 30% 35%,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0) 52%
            ),
            var(--toneHex);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.55),
            inset 0 0 0 1px rgba(255, 255, 255, 0.16);
          transform: translateZ(0);
          flex: 0 0 auto;
        }

        .toneSheen {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            circle at 25% 30%,
            rgba(255, 255, 255, 0.30) 0%,
            rgba(255, 255, 255, 0) 55%
          );
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .toneEdge {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          pointer-events: none;
        }

        /* Signal */
        .signalRow {
          justify-content: space-between;
          width: 100%;
        }

        .signalNumber {
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 10px 26px rgba(0, 0, 0, 0.75);
          letter-spacing: -0.02em;
        }

        .signalTicks {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          opacity: 0.7;
        }

        .signalTicks span {
          width: 6px;
          height: 20px;
          border-radius: 999px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.40),
            rgba(255, 255, 255, 0.08)
          );
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.10);
        }

        /* Responsive */
        @media (max-width: 560px) {
          .dipLayout {
            grid-template-columns: 1.35fr 1fr;
          }
          .moonImg {
            width: min(220px, 90%);
          }
        }

        @media (max-width: 420px) {
          .dipLayout {
            grid-template-columns: 1fr;
          }
          .rightStack {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: none;
          }
        }
      `}</style>
    </section>
  );
}
