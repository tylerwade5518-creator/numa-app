// app/dashboard/VideoRingMeter.tsx
"use client";

import React, { useEffect, useMemo, useRef, useId } from "react";

type Labels = { low: string; mid: string; high: string };

type Props = {
  progress: number; // 0..1
  directive: string;
  labels?: Labels;
  tickCount?: number;
  videoSrc: string;
  videoHueRotateDeg?: number;
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

  const pct = useMemo(() => {
    const v = Math.round(p * 100);
    return Math.max(1, Math.min(100, v));
  }, [p]);

  const ringVideoRef = useRef<HTMLVideoElement | null>(null);
  const centerVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tryPlay = (v: HTMLVideoElement | null) => {
      if (!v) return;
      try {
        v.muted = true;
        v.playsInline = true as any;
        v.play().catch(() => {});
      } catch {}
    };
    tryPlay(ringVideoRef.current);
    tryPlay(centerVideoRef.current);
  }, []);

  // Ring geometry (kept)
  const R = 54;
  const C = 2 * Math.PI * R;

  const SIZE = 132;
  const CX = 66;
  const CY = 66;

  // Thick, lively ring
  const ringMidR = 60;
  const ringThickness = 30;

  // Inner disk in your layout is inset 14px => radius ~52px
  const innerDiskInset = 14;
  const innerDiskR = CX - innerDiskInset; // 66 - 14 = 52

  const ringCirc = 2 * Math.PI * ringMidR;
  const dash = Math.max(0.001, p * ringCirc);
  const gap = ringCirc;

  const uid = useId().replace(/:/g, "");
  const maskId = `ringMask-${uid}`;

  const ringVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${videoHueRotateDeg}deg) saturate(1.3) brightness(1.15)`,
    transform: "scale(1.22)",
  };

  // Center plasma should be calmer + readable, but still visibly animated
  const centerVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${videoHueRotateDeg}deg) saturate(1.15) brightness(0.95) contrast(1.05)`,
    transform: "scale(1.12)",
  };

  // Soft circular mask so the plasma fades near the edge of the inner disk
  const centerMaskStyle: React.CSSProperties = useMemo(() => {
    // feather = how soft the edge fades (px)
    const feather = 10;
    const hard = Math.max(0, innerDiskR - feather);
    const soft = innerDiskR;

    const m = `radial-gradient(circle at ${CX}px ${CY}px,
      rgba(255,255,255,1) 0px,
      rgba(255,255,255,1) ${hard}px,
      rgba(255,255,255,0) ${soft}px
    )`;

    return {
      WebkitMaskImage: m,
      maskImage: m,
    };
  }, [innerDiskR]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative h-[132px] w-[132px]">
        {/* Dark base disk */}
        <div className="absolute inset-0 rounded-full bg-black/35" />

        {/* ✅ NEW: Center plasma layer (behind inner disk, inside circle) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0" style={centerMaskStyle}>
            <video
              ref={centerVideoRef}
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              style={centerVideoStyle}
              onError={(e) => {
                // @ts-ignore
                console.error("Center plasma video error:", e?.currentTarget?.error);
              }}
            />
            {/* A subtle “bloom” so plasma feels like it’s under glass */}
            <div className="absolute inset-0 centerBloom" />
          </div>
        </div>

        {/* Inner disk for contrast (kept), now sits above plasma */}
        <div className="absolute inset-[14px] rounded-full bg-slate-950/55 border border-white/8" />

        {/* Tick ring (kept) */}
        <svg className="absolute inset-0" viewBox="0 0 132 132" fill="none" aria-hidden="true">
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

          <circle cx="66" cy="66" r="40" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        </svg>

        {/* VIDEO RING WITH ROUNDED CAPS (kept) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <svg className="absolute inset-0" viewBox="0 0 132 132" width={SIZE} height={SIZE} aria-hidden="true">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <rect width={SIZE} height={SIZE} fill="black" />
                <circle
                  cx={CX}
                  cy={CY}
                  r={ringMidR}
                  fill="none"
                  stroke="white"
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${gap}`}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
              </mask>
            </defs>

            <foreignObject width={SIZE} height={SIZE} mask={`url(#${maskId})`}>
              <div className="relative h-full w-full">
                <video
                  ref={ringVideoRef}
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={ringVideoStyle}
                  onError={(e) => {
                    // @ts-ignore
                    console.error("Meter ring video error:", e?.currentTarget?.error);
                  }}
                />
                <div className="absolute inset-0 ringFeather" />
              </div>
            </foreignObject>
          </svg>
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
        }
        .ringFeather::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          filter: blur(1.5px);
          background: radial-gradient(
            circle at center,
            transparent 48%,
            rgba(0, 0, 0, 0.2) 65%,
            rgba(0, 0, 0, 0.35) 80%,
            rgba(0, 0, 0, 0.45) 100%
          );
          mix-blend-mode: multiply;
          opacity: 0.35;
        }

        /* Center bloom: keeps plasma visible but not overpowering text */
        .centerBloom {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.03) 35%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.18) 100%
          );
          mix-blend-mode: screen;
          opacity: 0.22;
        }
      `}</style>
    </div>
  );
}
