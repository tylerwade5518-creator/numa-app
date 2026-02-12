// app/dashboard/VideoRingMeter.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Labels = { low: string; mid: string; high: string };

type Variant = "energy" | "luck" | "social";

type Props = {
  // ✅ Preferred (current)
  progress?: number; // 0..1
  directive?: string;

  // ✅ Back-compat (older calls)
  value?: number; // 0..1
  label?: string;

  labels?: Labels;
  tickCount?: number;

  // ✅ Visual controls
  videoSrc?: string; // default locked to solar flare
  videoHueRotateDeg?: number; // overrides variant if provided
  variant?: Variant;

  // ✅ Layout hooks (parent can overlap meters without changing visuals)
  size?: number; // default 132
  className?: string;
};

function clamp01(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function variantHue(variant?: Variant): number {
  // One texture, 3 colorways. Tuned for: Energy (cool), Luck (gold), Social (purple/pink).
  switch (variant) {
    case "energy":
      return 210; // cool / electric
    case "luck":
      return 0; // solar / gold
    case "social":
      return 315; // purple/pink
    default:
      return 0;
  }
}

export default function VideoRingMeter({
  progress,
  directive,
  value,
  label,
  tickCount = 10,
  videoSrc = "/textures/solar-flare-animated.mp4",
  videoHueRotateDeg,
  variant,
  size = 132,
  className,
}: Props) {
  const p = clamp01(progress ?? value);

  const pct = useMemo(() => {
    const v = Math.round(p * 100);
    return Math.max(1, Math.min(100, v));
  }, [p]);

  const shownDirective = (directive ?? label ?? "").trim();

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

  // Geometry (scaled from original 132 template)
  const SIZE = size;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  // Preserve the original ratios
  const ringMidR = (60 / 132) * SIZE;
  const ringThickness = (30 / 132) * SIZE;

  const innerDiskInset = (14 / 132) * SIZE;
  const innerDiskR = CX - innerDiskInset;

  const angleDeg = useMemo(() => Math.max(0.001, p * 360), [p]);

  const hue =
    typeof videoHueRotateDeg === "number" ? videoHueRotateDeg : variantHue(variant);

  const ringVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${hue}deg) saturate(1.32) brightness(1.12) contrast(1.08)`,
    transform: "scale(1.22) translateZ(0)",
  };

  const centerVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${hue}deg) saturate(1.18) brightness(0.92) contrast(1.08)`,
    transform: "scale(1.12) translateZ(0)",
  };

  const centerMaskStyle = useMemo(() => {
    const feather = (10 / 132) * SIZE;
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
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
    } as React.CSSProperties;
  }, [innerDiskR, CX, CY, SIZE]);

  const masks = useMemo(() => {
    const outer = ringMidR + ringThickness / 2;
    const inner = ringMidR - ringThickness / 2;
    const feather = (2.75 / 132) * SIZE;

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
    const capFeather = (2.0 / 132) * SIZE;

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
  }, [CX, CY, ringMidR, ringThickness, angleDeg, SIZE]);

  const showCaps = p > 0.01;

  const ringMaskStyle = useMemo(() => {
    const images = showCaps
      ? `${masks.donutMask}, ${masks.progressMask}, ${masks.capMask}`
      : `${masks.donutMask}, ${masks.progressMask}`;

    const composites = showCaps ? "source-in, source-over" : "source-in";

    const style: any = {
      WebkitMaskImage: images,
      maskImage: images,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
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
    <div className={"relative flex items-center justify-center " + (className ?? "")}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <div className="absolute inset-0 rounded-full bg-black/35" />

        {/* Center plasma */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
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
        <div
          className="absolute rounded-full border border-white/8 bg-slate-950/55"
          style={{ inset: innerDiskInset }}
        />

        {/* Tick ring */}
        <svg
          className="absolute inset-0"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          fill="none"
          aria-hidden="true"
        >
          <g opacity="0.55">
            {Array.from({ length: tickCount }).map((_, i) => {
              const a = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
              const x1 = CX + Math.cos(a) * ((56 / 132) * SIZE);
              const y1 = CY + Math.sin(a) * ((56 / 132) * SIZE);
              const x2 = CX + Math.cos(a) * ((50 / 132) * SIZE);
              const y2 = CY + Math.sin(a) * ((50 / 132) * SIZE);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth={(2 / 132) * SIZE}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          <circle
            cx={CX}
            cy={CY}
            r={(40 / 132) * SIZE}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={(2 / 132) * SIZE}
          />
        </svg>

        {/* Ring */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
          <div className="meterPct">{pct}%</div>
          {shownDirective ? <div className="meterDirective">{shownDirective}</div> : null}
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
