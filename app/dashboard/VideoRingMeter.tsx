// app/dashboard/VideoRingMeter.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Labels = { low: string; mid: string; high: string };

type Props = {
  progress: number; // 0..1
  directive: string; // 2-word line in center
  labels?: Labels; // kept for future, not rendered now (percent replaces it)
  tickCount?: number;
  videoSrc: string; // e.g. "/textures/solar-flare-animated.mp4"
  videoHueRotateDeg?: number; // e.g. 0, 210, 305
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function VideoRingMeter({
  progress,
  directive,
  tickCount = 10,
  videoSrc,
  videoHueRotateDeg = 0,
}: Props) {
  const p = clamp01(progress);

  // 1–100% correlated to fill
  const pct = useMemo(() => {
    const v = Math.round(p * 100);
    return Math.max(1, Math.min(100, v));
  }, [p]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Ensure autoplay in modern browsers
    try {
      v.muted = true;
      v.playsInline = true as any;
      v.play().catch(() => {});
    } catch {}
  }, []);

  // Ring geometry
  const R = 54;
  const C = 2 * Math.PI * R;

  // We reveal "filled" by clipping the video wedge.
  // 0% starts at top (12 o'clock), fills clockwise.
  const filledDeg = p * 360;

  // Using conic-gradient mask for the fill (video),
  // and a soft feather edge via blur on a pseudo overlay.
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `conic-gradient(from -90deg, #fff 0deg, #fff ${filledDeg}deg, transparent ${filledDeg}deg, transparent 360deg)`,
    maskImage: `conic-gradient(from -90deg, #fff 0deg, #fff ${filledDeg}deg, transparent ${filledDeg}deg, transparent 360deg)`,
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer size */}
      <div className="relative h-[132px] w-[132px]">
        {/* Dark base disk */}
        <div className="absolute inset-0 rounded-full bg-black/35" />

        {/* Subtle inner disk for contrast */}
        <div className="absolute inset-[14px] rounded-full bg-slate-950/55 border border-white/8" />

        {/* Tick ring (reduced, subtle) */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 132 132"
          fill="none"
          aria-hidden="true"
        >
          <g opacity="0.55">
            {Array.from({ length: tickCount }).map((_, i) => {
              const a = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
              const x1 = 66 + Math.cos(a) * 56;
              const y1 = 66 + Math.sin(a) * 56;
              const x2 = 66 + Math.cos(a) * 50;
              const y2 = 66 + Math.sin(a) * 50;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Thin inner ring */}
          <circle
            cx="66"
            cy="66"
            r="40"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
          />
        </svg>

        {/* VIDEO FILL (masked wedge) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0" style={maskStyle}>
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `hue-rotate(${videoHueRotateDeg}deg) saturate(1.15) brightness(1.05)`,
                transform: "scale(1.08)", // slightly bigger to show more motion in ring
              }}
              onError={(e) => {
                // @ts-ignore
                console.error("Meter ring video error:", e?.currentTarget?.error);
              }}
            />
            {/* Feathered edge: a subtle blur layer to soften the cutoff */}
            <div className="absolute inset-0 ringFeather" />
          </div>
        </div>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          <div className="meterPct">{pct}%</div>
          <div className="meterDirective">{directive}</div>
        </div>
      </div>

      <style jsx>{`
        .meterPct {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.92);
          text-transform: uppercase;
          line-height: 1;
        }
        .meterDirective {
          margin-top: 6px;
          font-size: 11px;
          color: rgba(226, 232, 240, 0.78);
          line-height: 1.2;
        }

        .ringFeather {
          pointer-events: none;
          position: absolute;
          inset: -1px;
          border-radius: 9999px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
        /* Soften the conic edge without blurring the whole video */
        .ringFeather::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          filter: blur(1.8px);
          background: radial-gradient(
            circle at center,
            transparent 52%,
            rgba(0, 0, 0, 0.35) 68%,
            rgba(0, 0, 0, 0.55) 78%,
            rgba(0, 0, 0, 0.75) 100%
          );
          mix-blend-mode: multiply;
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
}
