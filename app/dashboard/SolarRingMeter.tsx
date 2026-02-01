"use client";

import React from "react";

type Level = "LOW" | "MEDIUM" | "HIGH";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function levelFromProgress(p: number): Level {
  if (p < 0.34) return "LOW";
  if (p < 0.75) return "MEDIUM";
  return "HIGH";
}

/**
 * Edge-safe flare meter:
 * - Always render the full circular flare PNG (animated)
 * - Hide the unfilled portion with an occluder wedge
 * - Keep SVG overlay for ticks/dots/text
 */
export default function SolarRingMeter(props: {
  progress: number; // 0..1
  directive: string; // 2–3 words
  size?: number;
  tickCount?: number;
  stateOverride?: Level;

  flareSrc?: string; // default: /textures/solar-flare.png (CIRCULAR PNG)
  flareHueRotateDeg?: number; // recolor for focus/connection
}) {
  const size = props.size ?? 140;
  const tickCount = props.tickCount ?? 12;

  const pRaw = clamp01(props.progress);
  const p = Math.min(pRaw, 0.95); // keep tiny gap
  const angleDeg = Math.max(0, Math.min(360, p * 360));

  const level = props.stateOverride ?? levelFromProgress(pRaw);

  // Ring geometry for SVG overlay
  const stroke = 10;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + p * 2 * Math.PI;

  const startX = cx + r * Math.cos(startAngle);
  const startY = cy + r * Math.sin(startAngle);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);

  const flareSrc = props.flareSrc ?? "/textures/solar-flare.png";
  const hue = typeof props.flareHueRotateDeg === "number" ? props.flareHueRotateDeg : 0;

  /**
   * Donut cutout sizing (controls flare band thickness)
   * If you want thicker flare: increase ringThicknessPx
   */
  const outerRadiusPx = size / 2;
  const ringThicknessPx = 18;
  const innerRadiusPx = outerRadiusPx - ringThicknessPx;

  // Donut mask (used by both flare + occluder)
  const donutMask = `radial-gradient(circle,
    transparent ${innerRadiusPx}px,
    #fff ${innerRadiusPx + 0.5}px,
    #fff ${outerRadiusPx}px,
    transparent ${outerRadiusPx + 0.5}px
  )`;

  /**
   * Occluder wedge:
   * - Transparent for filled part (0..angleDeg)
   * - Opaque for unfilled (angleDeg..360)
   *
   * IMPORTANT: The opaque color should match your “card background”.
   * We use a near-slate with alpha to blend with your panel.
   */
  const occluder = `conic-gradient(from -90deg,
    rgba(0,0,0,0) 0deg,
    rgba(0,0,0,0) ${angleDeg}deg,
    rgba(8,12,26,0.88) ${angleDeg}deg,
    rgba(8,12,26,0.88) 360deg
  )`;

  const flareFilter =
    hue !== 0
      ? `hue-rotate(${hue}deg) saturate(1.20) contrast(1.10) brightness(1.05)`
      : "saturate(1.10) contrast(1.08) brightness(1.05)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* FULL FLARE RING (always visible) */}
      <div
        className="absolute inset-0 flareRing"
        style={{
          backgroundImage: `url(${flareSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: flareFilter,

          WebkitMaskImage: donutMask,
          maskImage: donutMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",

          // This is key: black parts of the PNG don’t “erase” the UI now.
          mixBlendMode: "screen",
          opacity: 0.92,
        }}
      />

      {/* SOFT GLOW RING (second copy for depth) */}
      <div
        className="absolute inset-0 flareGlow"
        style={{
          backgroundImage: `url(${flareSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `${flareFilter} blur(5px)`,

          WebkitMaskImage: donutMask,
          maskImage: donutMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",

          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      />

      {/* OCCLUDER: hides the unfilled portion (Edge-safe) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: occluder,

          WebkitMaskImage: donutMask,
          maskImage: donutMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />

      {/* SVG overlay: ticks + base ring + dots */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={`dotGlow-${size}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="dotBlur" />
            <feMerge>
              <feMergeNode in="dotBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ticks */}
        {Array.from({ length: tickCount }).map((_, i) => {
          const a = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
          const inner = r - 14;
          const outer = r - 6;

          const x1 = cx + inner * Math.cos(a);
          const y1 = cy + inner * Math.sin(a);
          const x2 = cx + outer * Math.cos(a);
          const y2 = cy + outer * Math.sin(a);

          const isCardinal = i % Math.max(1, Math.floor(tickCount / 4)) === 0;
          const opacity = isCardinal ? 0.30 : 0.12;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeOpacity={opacity}
              strokeWidth={isCardinal ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Base ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeOpacity="0.12" strokeWidth={stroke} />

        {/* Endpoint dots */}
        <circle
          cx={startX}
          cy={startY}
          r={6}
          fill="white"
          opacity={0.10}
          filter={`url(#dotGlow-${size})`}
          className="ringDotGlow ringDotStart"
        />
        <circle cx={startX} cy={startY} r={2.4} fill="white" opacity={0.55} className="ringDotCore ringDotStart" />

        <circle
          cx={endX}
          cy={endY}
          r={6.2}
          fill="white"
          opacity={0.18}
          filter={`url(#dotGlow-${size})`}
          className="ringDotGlow ringDotEnd"
        />
        <circle cx={endX} cy={endY} r={2.7} fill="white" opacity={0.92} className="ringDotCore ringDotEnd" />

        {/* Inner depth ring */}
        <circle cx={cx} cy={cy} r={r - 18} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="2" />
      </svg>

      {/* Center text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[15px] font-semibold tracking-wide text-white">{level}</div>
        <div className="mt-1 text-[12px] text-white/70">{props.directive}</div>
      </div>

      <style jsx>{`
        /* Animate the PNG itself: premium motion without looking “cartoon” */
        .flareRing {
          transform-origin: 50% 50%;
          animation: flareSpin 16s linear infinite, flareBreath 3.6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .flareGlow {
          transform-origin: 50% 50%;
          animation: flareSpin 22s linear infinite reverse, flareBreath 4.4s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes flareSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes flareBreath {
          0% {
            opacity: 0.72;
          }
          50% {
            opacity: 0.98;
          }
          100% {
            opacity: 0.72;
          }
        }

        /* Dot pulses */
        .ringDotGlow {
          transform-origin: center;
          animation: dotPulse 2.9s ease-in-out infinite;
        }
        .ringDotCore {
          transform-origin: center;
          animation: corePulse 2.9s ease-in-out infinite;
        }
        .ringDotStart {
          animation-delay: 0.25s;
        }
        .ringDotEnd {
          animation-delay: 0s;
        }

        @keyframes dotPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.10;
          }
          50% {
            transform: scale(1.10);
            opacity: 0.24;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.10;
          }
        }

        @keyframes corePulse {
          0% {
            transform: scale(0.95);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.10);
            opacity: 0.96;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.72;
          }
        }
      `}</style>
    </div>
  );
}
