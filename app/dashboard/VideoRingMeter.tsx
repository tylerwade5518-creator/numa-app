// app/dashboard/VideoRingMeter.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Labels = { low: string; mid: string; high: string };

type Variant = "energy" | "luck" | "social";

type Props = {
  progress?: number;
  directive?: string;
  value?: number;
  label?: string;
  labels?: Labels;
  tickCount?: number;
  videoSrc?: string;
  videoHueRotateDeg?: number;
  variant?: Variant;
  size?: number;
  className?: string;
};

function clamp01(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function variantHue(variant?: Variant): number {
  switch (variant) {
    case "energy":
      return 210;
    case "luck":
      return 0;
    case "social":
      return 315;
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
  const [videoReady, setVideoReady] = useState(false);

  void directive;
  void label;

  const pct = useMemo(() => {
    const v = Math.round(p * 100);
    return Math.max(1, Math.min(100, v));
  }, [p]);

  const ringVideoRef = useRef<HTMLVideoElement | null>(null);
  const centerVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoReady(false);

    const tryPlay = async (v: HTMLVideoElement | null) => {
      if (!v) return;

      try {
        v.muted = true;
        v.playsInline = true as any;
        v.setAttribute("playsinline", "");
        v.setAttribute("webkit-playsinline", "");

        v.load();
        await v.play().catch(() => {});
      } catch {}
    };

    Promise.all([
      tryPlay(ringVideoRef.current),
      tryPlay(centerVideoRef.current),
    ]).finally(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVideoReady(true);
        });
      });
    });
  }, [videoSrc]);

  const SIZE = size;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const ringMidR = (60 / 132) * SIZE;
  const ringThickness = (30 / 132) * SIZE;

  const innerDiskInset = (14 / 132) * SIZE;
  const innerDiskR = CX - innerDiskInset;

  const angleDeg = useMemo(() => {
    return Math.max(3, p * 360);
  }, [p]);

  const hue =
    typeof videoHueRotateDeg === "number"
      ? videoHueRotateDeg
      : variantHue(variant);

  const ringVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${hue}deg) saturate(1.32) brightness(1.12) contrast(1.08)`,
    transform: "scale(1.22) translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "transform",
  };

  const centerVideoStyle: React.CSSProperties = {
    filter: `hue-rotate(${hue}deg) saturate(1.18) brightness(0.92) contrast(1.08)`,
    transform: "scale(1.12) translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "transform",
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
      backfaceVisibility: "hidden",
      willChange: "transform",
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

    return { donutMask, progressMask, capMask, end: { ex, ey } };
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
      WebkitMaskSize: showCaps
        ? "100% 100%, 100% 100%, 100% 100%"
        : "100% 100%, 100% 100%",
      maskSize: showCaps
        ? "100% 100%, 100% 100%, 100% 100%"
        : "100% 100%, 100% 100%",
      WebkitMaskPosition: showCaps ? "center, center, center" : "center, center",
      maskPosition: showCaps ? "center, center, center" : "center, center",
      WebkitMaskComposite: composites,
      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
      willChange: "transform, opacity, -webkit-mask-image, mask-image",
      backfaceVisibility: "hidden",
      contain: "paint",
    };

    return style as React.CSSProperties;
  }, [masks.donutMask, masks.progressMask, masks.capMask, showCaps]);

  const trackStyle: React.CSSProperties = useMemo(() => {
    const thickness = ringThickness * 0.92;
    return {
      width: ringMidR * 2,
      height: ringMidR * 2,
      left: CX - ringMidR,
      top: CY - ringMidR,
      borderRadius: 9999,
      boxSizing: "border-box",
      border: `${thickness}px solid rgba(0,0,0,0.38)`,
      boxShadow: `inset 0 0 ${Math.max(10, SIZE * 0.09)}px rgba(255,255,255,0.06)`,
      pointerEvents: "none",
      position: "absolute",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
    };
  }, [CX, CY, ringMidR, ringThickness, SIZE]);

  const unfilledShadeStyle: React.CSSProperties = useMemo(() => {
    const inv = `conic-gradient(from -90deg,
      rgba(0,0,0,0) 0deg ${angleDeg}deg,
      rgba(0,0,0,0.52) ${angleDeg}deg 360deg
    )`;

    const outer = ringMidR + ringThickness / 2;
    const inner = ringMidR - ringThickness / 2;
    const feather = (2.75 / 132) * SIZE;

    const donut = `radial-gradient(circle at ${CX}px ${CY}px,
      rgba(255,255,255,0) 0px,
      rgba(255,255,255,0) ${Math.max(0, inner - feather)}px,
      rgba(255,255,255,1) ${inner}px,
      rgba(255,255,255,1) ${outer}px,
      rgba(255,255,255,0) ${outer + feather}px
    )`;

    const images = `${donut}, ${inv}`;

    const style: any = {
      WebkitMaskImage: images,
      maskImage: images,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%, 100% 100%",
      maskSize: "100% 100%, 100% 100%",
      WebkitMaskPosition: "center, center",
      maskPosition: "center, center",
      WebkitMaskComposite: "source-in",
      background: "rgba(0,0,0,0.62)",
      opacity: videoReady ? 0.62 : 0,
      transition: "opacity 180ms ease",
      pointerEvents: "none",
      position: "absolute",
      inset: 0,
      borderRadius: 9999,
      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
      backfaceVisibility: "hidden",
      willChange: "opacity, transform",
      contain: "paint",
    };

    return style as React.CSSProperties;
  }, [CX, CY, ringMidR, ringThickness, angleDeg, SIZE, videoReady]);

  const endGlowStyle: React.CSSProperties = useMemo(() => {
    const { ex, ey } = masks.end;
    const r = ringThickness * 0.42;

    return {
      position: "absolute",
      left: ex,
      top: ey,
      width: r * 2,
      height: r * 2,
      transform: "translate(-50%, -50%) translateZ(0)",
      borderRadius: 9999,
      pointerEvents: "none",
      background:
        "radial-gradient(circle at center, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 38%, rgba(255,255,255,0) 72%)",
      filter: `blur(${Math.max(1.5, SIZE * 0.012)}px)`,
      mixBlendMode: "screen",
      opacity: showCaps && videoReady ? 0.55 : 0,
      transition: "opacity 180ms ease",
      backfaceVisibility: "hidden",
    };
  }, [masks.end, ringThickness, SIZE, showCaps, videoReady]);

  return (
    <div className={"relative flex items-center justify-center " + (className ?? "")}>
      <div
        className="relative"
        style={{
          width: SIZE,
          height: SIZE,
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
          contain: "layout paint",
        }}
      >
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

        {/* Track baseline */}
        <div style={trackStyle} />

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
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: "opacity 180ms ease",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            contain: "paint",
          }}
        >
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

          {/* dim only the unfilled segment */}
          <div style={unfilledShadeStyle} />

          {/* endpoint glow */}
          <div style={endGlowStyle} />
        </div>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center px-3 text-center">
          <div className="meterPct">{pct}%</div>
        </div>
      </div>

      <style jsx>{`
        .meterPct {
          font-size: 16px;
          font-weight: 650;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1;
          text-shadow: 0 1px 14px rgba(0, 0, 0, 0.5);
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