"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedSpaceBackground from "./AnimatedSpaceBackground";

type Meter = {
  label: string;
  value: number; // 0–100
  note: string;
};

type CometMeterProps = Meter & {
  color: string; // main comet color
};

function CometMeter({ label, value, note, color }: CometMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(clamped);
  }, [clamped]);

  return (
    <div className="space-y-1.5">
      {/* Label + value */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-100 tracking-wide">
          {label}
        </span>
        <span className="text-slate-300">{clamped}%</span>
      </div>

      {/* Track with comet */}
      <div className="relative h-2.5 overflow-hidden rounded-full border border-slate-700/70 bg-slate-950/85">
        {/* Background star texture */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(148,163,184,0.28)_0,transparent_45%),radial-gradient(circle_at_80%_30%,rgba(148,163,184,0.18)_0,transparent_50%)] opacity-30" />

        {/* Filled portion with comet */}
        <div
          className="comet-tail-wrapper relative h-full transition-[width] duration-900 ease-out"
          style={{ width: `${displayed}%` }}
        >
          <div
            className="comet-tail"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0) 0%, ${color} 40%, ${color} 100%)`,
              boxShadow: `0 0 16px ${color}`,
            }}
          >
            <span
              className="comet-head"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 18px ${color}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-[11px] leading-snug text-slate-400">{note}</p>
    </div>
  );
}

/* Tap Share types */

type TapShareField = "phone" | "email" | "website" | "instagram" | "tiktok";

const TAP_SHARE_FIELD_LABELS: Record<TapShareField, string> = {
  phone: "Phone",
  email: "Email",
  website: "Website",
  instagram: "Instagram",
  tiktok: "TikTok",
};

type TapShareProfile = "none" | "social" | "business";

/* Tap Share Sheet component */

interface TapShareSheetProps {
  selectedProfile: TapShareProfile;
  selectedFields: Set<TapShareField>;
  onProfileChange: (profile: TapShareProfile) => void;
  onFieldToggle: (field: TapShareField) => void;
  onArm: () => void;
  onClose: () => void;
}

function TapShareSheet({
  selectedProfile,
  selectedFields,
  onProfileChange,
  onFieldToggle,
  onArm,
  onClose,
}: TapShareSheetProps) {
  const isFieldSelected = (field: TapShareField) =>
    selectedFields.has(field);

  return (
    <div className="tapshare-overlay">
      <div className="tapshare-backdrop" onClick={onClose} />

      <div className="tapshare-sheet">
        {/* Grip */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-500/40" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Tap Share
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Choose what you want to send with your next tap.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800/80"
          >
            Close
          </button>
        </div>

        {/* Profile cards (Social / Business) */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Quick profiles
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                onProfileChange(
                  selectedProfile === "social" ? "none" : "social"
                )
              }
              className={
                "flex flex-col items-start justify-between rounded-2xl border px-3 py-3 transition " +
                (selectedProfile === "social"
                  ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
                  : "border-slate-600/70 bg-slate-900/80 text-slate-200 hover:border-slate-400")
              }
            >
              <span className="text-[11px] uppercase tracking-[0.16em]">
                Social
              </span>
              <span className="mt-1 text-[11px] text-slate-300">
                TikTok, Instagram
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onProfileChange(
                  selectedProfile === "business" ? "none" : "business"
                )
              }
              className={
                "flex flex-col items-start justify-between rounded-2xl border px-3 py-3 transition " +
                (selectedProfile === "business"
                  ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
                  : "border-slate-600/70 bg-slate-900/80 text-slate-200 hover:border-slate-400")
              }
            >
              <span className="text-[11px] uppercase tracking-[0.16em]">
                Business
              </span>
              <span className="mt-1 text-[11px] text-slate-300">
                Email, Website
              </span>
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Or choose individually
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(TAP_SHARE_FIELD_LABELS) as TapShareField[]).map(
              (field) => {
                const selected = isFieldSelected(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => onFieldToggle(field)}
                    className={
                      "flex items-center justify-between rounded-2xl border px-3 py-2 transition " +
                      (selected
                        ? "border-sky-300/80 bg-slate-900/90 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                        : "border-slate-600/70 bg-slate-900/70 text-slate-200 hover:border-slate-400")
                    }
                  >
                    <span>{TAP_SHARE_FIELD_LABELS[field]}</span>
                    <span
                      className={
                        "h-3 w-3 rounded-full border text-[10px]" +
                        (selected
                          ? " border-sky-300 bg-sky-300"
                          : " border-slate-500")
                      }
                    />
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Arm button */}
        <div className="mt-5 space-y-1.5">
          <button
            type="button"
            onClick={onArm}
            disabled={selectedFields.size === 0}
            className={
              "flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition " +
              (selectedFields.size === 0
                ? "cursor-not-allowed border border-slate-700 bg-slate-900 text-slate-500"
                : "border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110")
            }
          >
            Arm Band for Next Tap
          </button>
          <p className="text-[11px] text-slate-400">
            Shares only the selected details once, then turns off.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Armed state component */

interface TapShareArmedProps {
  selectedFields: Set<TapShareField>;
  secondsRemaining: number;
  onCancel: () => void;
}

function TapShareArmedState({
  selectedFields,
  secondsRemaining,
  onCancel,
}: TapShareArmedProps) {
  const summary =
    selectedFields.size === 0
      ? "No details selected"
      : Array.from(selectedFields)
          .map((f) => TAP_SHARE_FIELD_LABELS[f])
          .join(", ");

  return (
    <div className="tapshare-overlay">
      <div className="tapshare-backdrop" onClick={onCancel} />
      <div className="tapshare-sheet tapshare-armed">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-500/40" />

        <div className="space-y-4 text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-2xl" />
            <div className="ready-ring absolute inset-0 rounded-full border border-sky-300/70" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-900/90">
              <span className="text-xs font-semibold text-sky-100">
                Tap
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-50">
              Ready to Share
            </h2>
            <p className="text-xs text-slate-300">
              Have them tap your band now. This share works once, then turns
              off.
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Sharing
            </p>
            <p className="text-xs text-slate-200">{summary}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-300">
              Time remaining:{" "}
              <span className="font-semibold text-sky-200">
                {secondsRemaining}s
              </span>
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-2xl border border-slate-500 bg-slate-900/90 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800/90"
            >
              Cancel Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main dashboard */

export default function DashboardPage() {
  const router = useRouter();

  const bandName = "NUMA BAND";
  const displayName = "Tyler";
  const sign = "Aquarius";
  const birthday = "Feb 5";

  const todayLabel = "Today’s Alignment";
  const horoscopeTitle = "Quiet Confidence in Motion";
  const horoscopeSummary =
    "Today favors calm, deliberate moves instead of big dramatic swings. Keep your plans simple, follow through once, and let your quiet consistency stand out on its own.";

  const astroActionTitle = "Pick one thing and finish it fully.";
  const astroActionBody =
    "Choose the single task that actually matters most today and give it a clean, uninterrupted block of focus. Everything else can wait.";

  const meters: CometMeterProps[] = [
    {
      label: "Luck",
      value: 76,
      note: "Shows up through timing and pacing, not rushing.",
      color: "#facc15",
    },
    {
      label: "Energy",
      value: 64,
      note: "Best spent in short, intentional bursts, not marathons.",
      color: "#22c55e",
    },
    {
      label: "Social",
      value: 52,
      note: "Small, honest check-ins beat noisy group chats.",
      color: "#38bdf8",
    },
  ];

  /* Tap Share state */

  const [showTapShare, setShowTapShare] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<TapShareProfile>("none");
  const [selectedFields, setSelectedFields] = useState<Set<TapShareField>>(
    () => new Set()
  );
  const [isArmed, setIsArmed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const handleProfileChange = (profile: TapShareProfile) => {
    setSelectedProfile(profile);
    const newSet = new Set<TapShareField>();

    if (profile === "social") {
      newSet.add("instagram");
      newSet.add("tiktok");
    } else if (profile === "business") {
      newSet.add("email");
      newSet.add("website");
    }

    setSelectedFields(newSet);
  };

  const handleFieldToggle = (field: TapShareField) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
    setSelectedProfile("none");
  };

  const handleArmBand = () => {
    if (selectedFields.size === 0) return;
    setIsArmed(true);
    setSecondsRemaining(60);
  };

  const handleCancelShare = () => {
    setIsArmed(false);
    setShowTapShare(false);
    setSecondsRemaining(60);
  };

  useEffect(() => {
    if (!isArmed) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsArmed(false);
          setShowTapShare(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isArmed]);

  return (
    <>
      <div
        className="relative min-h-screen overflow-hidden bg-black"
        style={{
          backgroundImage: "url('/nebula-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark veil */}
        <div className="pointer-events-none absolute inset-0 bg-slate-950/65" />

        {/* Moving stars */}
        <AnimatedSpaceBackground />

        {/* Main content */}
        <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
          {/* Header */}
          <section className="space-y-1 text-center sm:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
              {bandName}
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              {displayName} – {sign}
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              Born {birthday} • {todayLabel}
            </p>
          </section>

          {/* Horoscope – bigger & more transparent */}
          <section>
            <div className="relative rounded-3xl border border-yellow-200/35 bg-slate-900/10 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.85)]">
              <div className="relative space-y-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.22em] text-yellow-100/90">
                    Daily Horoscope
                  </p>
                  <p className="mt-1 text-[13px] text-slate-200/90">
                    Tuned to your band for today
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                    {horoscopeTitle}
                  </h2>
                  <p className="text-base leading-relaxed text-slate-100/90">
                    {horoscopeSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <p className="text-[11px] text-slate-100/80">
                    Tap your band any time today to reopen this reading.
                  </p>
                  <p className="text-[11px] text-slate-300/80">
                    Guidance, not guarantees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Astro Action – simpler */}
          <section>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.7)]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Daily Astro Action
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  One clear move to keep today aligned.
                </p>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-slate-50">
                  {astroActionTitle}
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {astroActionBody}
                </p>
              </div>
            </div>
          </section>

          {/* NEW: Fun buttons under Astro Action – Tap Share + Star Sync */}
          <section>
            <div className="rounded-3xl border border-sky-200/40 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.85)]">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">
                    Connections
                  </p>
                  <p className="text-xs text-slate-200">
                    Share your world or compare your stars with someone else.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  {/* Tap Share (same behavior as before) */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowTapShare(true);
                      setIsArmed(false);
                    }}
                    className="flex-1 rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110"
                  >
                    Tap Share
                  </button>

                  {/* Star Sync – navigate to star-sync page */}
                  <button
                    type="button"
                    onClick={() => router.push("/star-sync")}
                    className="flex-1 rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110"
                  >
                    Star Sync
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Star Sync lets you compare your sign with someone else’s chart
                  for alignment, challenge, and magnetism.
                </p>
              </div>
            </div>
          </section>

          {/* Daily Meters */}
          <section>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.7)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Daily Meters
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Comet tracks for Luck, Energy, and Social alignment.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                  Live cosmic readout
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {meters.map((meter) => (
                  <CometMeter
                    key={meter.label}
                    label={meter.label}
                    value={meter.value}
                    note={meter.note}
                    color={meter.color}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* NEW: Settings buttons moved to bottom */}
          <section className="pb-4">
            <div className="rounded-3xl border border-white/15 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.7)]">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Settings & Layout
                  </p>
                  <p className="text-xs text-slate-300">
                    Tune how your band looks, feels, and what it shows.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  {/* Profile Settings */}
                  <button
                    type="button"
                    onClick={() => router.push("/settings/profile")}
                    className="flex-1 rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110"
                  >
                    Profile Settings
                  </button>

                  {/* Dashboard Layout */}
                  <button
                    type="button"
                    onClick={() => router.push("/settings/dashboard")}
                    className="flex-1 rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110"
                  >
                    Dashboard Layout
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  You control what your band shows, shares, and how your
                  dashboard feels.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .comet-tail-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .comet-tail {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background-size: 200% 100%;
          animation: cometFlow 4s linear infinite;
        }

        .comet-head {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(50%, -50%);
          width: 11px;
          height: 11px;
          border-radius: 9999px;
          animation: cometPulse 2.4s ease-in-out infinite;
        }

        @keyframes cometFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes cometPulse {
          0%,
          100% {
            transform: translate(50%, -50%) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translate(50%, -50%) scale(1.2);
            opacity: 1;
          }
        }

        .tapshare-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .tapshare-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
        }

        .tapshare-sheet {
          position: relative;
          z-index: 50;
          width: 100%;
          max-width: 26rem;
          margin-bottom: env(safe-area-inset-bottom, 0);
          border-radius: 1.5rem 1.5rem 0 0;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: rgba(15, 23, 42, 0.95);
          padding: 0.9rem 1.1rem 1.1rem;
          box-shadow: 0 -18px 45px rgba(0, 0, 0, 0.9);
          animation: sheetEnter 0.3s ease-out;
        }

        .tapshare-armed {
          padding-top: 1.2rem;
          padding-bottom: 1.4rem;
        }

        @keyframes sheetEnter {
          0% {
            transform: translateY(16px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .ready-ring {
          border-radius: 9999px;
          border: 1px solid rgba(56, 189, 248, 0.7);
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.7);
          animation: readySpin 9s linear infinite;
        }

        @keyframes readySpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Tap Share overlay (sheet or armed state) */}
      {showTapShare &&
        (!isArmed ? (
          <TapShareSheet
            selectedProfile={selectedProfile}
            selectedFields={selectedFields}
            onProfileChange={handleProfileChange}
            onFieldToggle={handleFieldToggle}
            onArm={handleArmBand}
            onClose={() => {
              setShowTapShare(false);
              setIsArmed(false);
            }}
          />
        ) : (
          <TapShareArmedState
            selectedFields={selectedFields}
            secondsRemaining={secondsRemaining}
            onCancel={handleCancelShare}
          />
        ))}
    </>
  );
}
