// app/dashboard/VideoRingMeter.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";

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
        v.setAttribute("playsinline", "");
        v.setAttribute("webkit-playsinline", "");
        v.play().catch(() => {});
      } catch {}
    };
    tryPlay(ringVideoRef.current);
    tryPlay(centerVideoRef.current);
  }, []);

  // Geometry aligned with your original
  const SIZE = 132;
  const CX = 66;
  const CY = 66;

  const ringMidR = 60;
  const ringThickness = 30;

  const innerDiskInset = 14;
  const innerDiskR = CX - innerDiskInset; // 52

  const angleDeg = useMemo(() => Math.max(0.001, p * 360), [p]);

  const ringVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${videoHueRotateDeg}deg) saturate(1.3) brightness(1.15)`,
    transform: "scale(1.22) translateZ(0)",
  };

  const centerVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${videoHueRotateDeg}deg) saturate(1.15) brightness(0.95) contrast(1.05)`,
    transform: "scale(1.12) translateZ(0)",
  };

  const centerMaskStyle = useMemo(() => {
    const feather = 10;
    const hard = Math.max(0, innerDiskR - feather);
    const soft = innerDiskR;

    const m = `radial-gradient(circle at ${CX}px ${CY}px,
      rgba(255,255,255,1) 0px,
      rgba(255,255,255,1) ${hard}px,
      rgba(255,255,255,0) ${soft}px
    )`;

    // TS-safe: cast once (Safari needs -webkit-)
    return {
      WebkitMaskImage: m,
      maskImage: m,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
    } as React.CSSProperties;
  }, [innerDiskR, CX, CY]);

  // Build donut + progress + cap masks
  const masks = useMemo(() => {
    const outer = ringMidR + ringThickness / 2;
    const inner = ringMidR - ringThickness / 2;
    const feather = 2.75;

    const donutMask = `radial-gradient(circle at ${CX}px ${CY}px,
      rgba(255,255,255,0) 0px,
      rgba(255,255,255,0) ${Math.max(0, inner - feather)}px,
      rgba(255,255,255,1) ${inner}px,
      rgba(255,255,255,1) ${outer}px,
      rgba(255,255,255,0) ${outer + feather}px
    )`;

    const progressMask = `conic-gradient(from -90deg,
      rgba(255,255,255,1) 0deg ${angleDeg}deg,
      rgba(255,255,255,0) ${angleDeg}deg 360deg
    )`;

    // Cap centers
    const sx = CX;
    const sy = CY - ringMidR;

    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const ex = CX + Math.cos(rad) * ringMidR;
    const ey = CY + Math.sin(rad) * ringMidR;

    const capR = ringThickness / 2;
    const capFeather = 2.0;

    const capMask = [
      `radial-gradient(circle at ${sx}px ${sy}px,
        rgba(255,255,255,1) 0px,
        rgba(255,255,255,1) ${capR}px,
        rgba(255,255,255,0) ${capR + capFeather}px
      )`,
      `radial-gradient(circle at ${ex}px ${ey}px,
        rgba(255,255,255,1) 0px,
        rgba(255,255,255,1) ${capR}px,
        rgba(255,255,255,0) ${capR + capFeather}px
      )`,
    ].join(",");

    return { donutMask, progressMask, capMask };
  }, [CX, CY, ringMidR, ringThickness, angleDeg]);

  const showCaps = p > 0.01;

  // IMPORTANT:
  // React.CSSProperties typings don't include WebkitMaskComposite or multi-value sizes.
  // So we build a plain object and cast once.
  const ringMaskStyle = useMemo(() => {
    const images = showCaps
      ? `${masks.donutMask}, ${masks.progressMask}, ${masks.capMask}`
      : `${masks.donutMask}, ${masks.progressMask}`;

    // For WebKit: composites are between layer1->layer2, then result->layer3
    const composites = showCaps ? "source-in, source-over" : "source-in";

    const style: any = {
      WebkitMaskImage: images,
      maskImage: images,

      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",

      // Provide 3 entries even if caps hidden; extra is harmless
      WebkitMaskSize: "100% 100%, 100% 100%, 100% 100%",
      maskSize: "100% 100%, 100% 100%, 100% 100%",

      WebkitMaskPosition: "center, center, center",
      maskPosition: "center, center, center",

      WebkitMaskComposite: composites,

      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
      willChange: "transform",
    };

    return style as React.CSSProperties;
  }, [masks.donutMask, masks.progressMask, masks.capMask, showCaps]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative h-[132px] w-[132px]" style={{ width: SIZE, height: SIZE }}>
        <div className="absolute inset-0 rounded-full bg-black/35" />

        {/* Center plasma */}
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
            />
            <div className="absolute inset-0 centerBloom" />
          </div>
        </div>

        {/* Inner disk */}
        <div className="absolute inset-[14px] rounded-full bg-slate-950/55 border border-white/8" />

        {/* Tick ring */}
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

        {/* Ring */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0" style={ringMaskStyle}>
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
              />
              <div className="absolute inset-0 ringFeather" />
            </div>
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
          transform: translateZ(0);
        }

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
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}
