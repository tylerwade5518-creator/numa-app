"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnimatedSpaceBackground from "../../dashboard/AnimatedSpaceBackground";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

type ZodiacSign = (typeof ZODIAC_SIGNS)[number];
type SyncType = "friendship" | "romantic";
type Step = "input" | "scanning" | "results";

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getSignFromDate(dateStr: string | null): ZodiacSign | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function getScores(owner: ZodiacSign, other: ZodiacSign) {
  const a = ZODIAC_SIGNS.indexOf(owner);
  const b = ZODIAC_SIGNS.indexOf(other);
  const diff = Math.abs(a - b);
  const normalized = 1 - diff / (ZODIAC_SIGNS.length - 1);

  const base = clampInt(
    Math.round(48 + normalized * 44 + ((a + b) % 7) - 3),
    25,
    95
  );

  return {
    friendship: clampInt(Math.round(base + ((a * 3 + b) % 9) - 4), 20, 98),
    romantic: clampInt(Math.round(base + ((a + b * 2) % 11) - 6), 18, 98),
  };
}

function getReading(type: SyncType, score: number) {
  if (type === "friendship") {
    if (score >= 80) {
      return "Today’s conditions support easy conversation, shared timing, and a natural social rhythm.";
    }
    if (score >= 65) {
      return "Today’s conditions work best when both people keep expectations simple and allow different pacing.";
    }
    return "Today’s conditions may need more patience, clearer signals, and smaller moments of consistency.";
  }

  if (score >= 80) {
    return "Attraction moves easily today when curiosity stays grounded and communication stays direct.";
  }
  if (score >= 65) {
    return "Romantic energy builds steadily today when both people stay honest about timing and expectations.";
  }
  return "Romantic energy may feel slower today, with trust and emotional safety mattering more than intensity.";
}

function CosmicHeroMeter({
  value,
  type,
}: {
  value: number;
  type: SyncType;
}) {
  const clamped = clampInt(value, 0, 100);
  const radius = 142;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const isFriendship = type === "friendship";

  const theme = isFriendship
    ? {
        label: "Friendship",
        subtitle: "Connection Alignment",
        soft: "rgba(56,189,248,0.42)",
        glow: "rgba(14,165,233,0.75)",
        text: "text-sky-100",
        muted: "text-sky-200/70",
        gradientA: "#bff4ff",
        gradientB: "#38bdf8",
        gradientC: "#2563eb",
        gradientD: "#c084fc",
        orbA: "from-white/90",
        orbB: "via-sky-300/85",
        orbC: "to-violet-500/75",
        shadow: "drop-shadow-[0_0_26px_rgba(56,189,248,0.75)]",
      }
    : {
        label: "Romance",
        subtitle: "Romantic Alignment",
        soft: "rgba(236,72,153,0.42)",
        glow: "rgba(236,72,153,0.78)",
        text: "text-pink-100",
        muted: "text-pink-200/70",
        gradientA: "#ffe0f0",
        gradientB: "#fb7185",
        gradientC: "#ec4899",
        gradientD: "#a855f7",
        orbA: "from-white/90",
        orbB: "via-pink-300/85",
        orbC: "to-fuchsia-500/75",
        shadow: "drop-shadow-[0_0_26px_rgba(236,72,153,0.8)]",
      };

  return (
    <div className="relative mx-auto flex h-[450px] w-full max-w-[450px] items-center justify-center overflow-visible sm:h-[580px] sm:max-w-[580px]">
      <div
        className="absolute h-[350px] w-[350px] rounded-full blur-3xl sm:h-[470px] sm:w-[470px]"
        style={{ background: theme.soft }}
      />

      <div className="absolute h-[375px] w-[375px] rounded-full border border-white/10 bg-black/10 shadow-[inset_0_0_45px_rgba(255,255,255,0.04)] sm:h-[500px] sm:w-[500px]" />

      <div className="absolute h-[350px] w-[350px] animate-[spin_54s_linear_infinite] rounded-full border border-white/10 sm:h-[470px] sm:w-[470px]" />
      <div className="absolute h-[315px] w-[315px] animate-[spin_38s_linear_infinite_reverse] rounded-full border border-white/5 sm:h-[420px] sm:w-[420px]" />

      <svg
        className="relative z-10 h-[360px] w-[360px] -rotate-90 overflow-visible sm:h-[500px] sm:w-[500px]"
        viewBox="0 0 360 360"
      >
        <defs>
          <linearGradient id={`syncGradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.gradientA} />
            <stop offset="18%" stopColor="#ffffff" />
            <stop offset="38%" stopColor={theme.gradientB} />
            <stop offset="68%" stopColor={theme.gradientC} />
            <stop offset="100%" stopColor={theme.gradientD} />
          </linearGradient>

          <filter id={`heavyGlow-${type}`}>
            <feGaussianBlur stdDeviation="10" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="180" cy="180" r="160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle cx="180" cy="180" r={radius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="30" />

        <circle
          cx="180"
          cy="180"
          r={radius}
          fill="none"
          stroke="rgba(2,6,23,0.72)"
          strokeWidth="30"
          strokeDasharray={`${circumference * 0.13} ${circumference}`}
          strokeDashoffset={-circumference * 0.09}
        />

        <circle
          cx="180"
          cy="180"
          r={radius}
          fill="none"
          stroke={`url(#syncGradient-${type})`}
          strokeWidth="30"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#heavyGlow-${type})`}
          className="transition-all duration-1000 ease-out"
        />

        <circle cx="180" cy="180" r="111" fill="rgba(2,6,23,0.93)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i / 48) * 360;
          return (
            <line
              key={i}
              x1="180"
              y1="54"
              x2="180"
              y2={i % 4 === 0 ? "65" : "61"}
              stroke={i % 4 === 0 ? theme.gradientA : "rgba(255,255,255,0.16)"}
              strokeWidth={i % 4 === 0 ? "1.2" : "0.8"}
              transform={`rotate(${angle} 180 180)`}
            />
          );
        })}

        <circle cx="180" cy="180" r="94" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </svg>

      <div className="absolute z-30 h-[372px] w-[372px] animate-[spin_15s_linear_infinite] sm:h-[500px] sm:w-[500px]">
        <div
          className={`absolute left-[15%] top-[74%] h-9 w-9 rounded-full border border-white/80 bg-gradient-to-br ${theme.orbA} ${theme.orbB} ${theme.orbC} backdrop-blur-md sm:h-12 sm:w-12`}
          style={{
            boxShadow: `0 0 24px ${theme.glow}, inset 0 0 18px rgba(255,255,255,0.35)`,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              boxShadow: `0 0 24px ${theme.glow}`,
            }}
          />
        </div>
      </div>

      <div className="absolute z-20 flex flex-col items-center justify-center text-center">
        <div className="mb-4 text-lg opacity-80">{isFriendship ? "☊" : "♡"}</div>

        <p className="text-[11px] uppercase tracking-[0.48em] text-slate-100/90 sm:text-xs">
          Star Sync
        </p>

        <div className="mt-4 flex items-start justify-center overflow-visible pl-2">
          <span
            className={`bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-[80px] font-light leading-none tracking-[-0.035em] text-transparent sm:text-[112px] ${theme.shadow}`}
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.16)",
            }}
          >
            {clamped}
          </span>
          <span className={`ml-4 mt-5 text-4xl font-light sm:ml-5 sm:mt-8 sm:text-5xl ${theme.text}`}>
            %
          </span>
        </div>

        <p className={`mt-2 text-lg font-medium sm:text-2xl ${theme.text}`}>
          {clamped >= 80 ? "Strong Alignment" : clamped >= 65 ? "Steady Alignment" : "Soft Alignment"}
        </p>

        <p className={`mt-1 text-xs uppercase tracking-[0.28em] ${theme.muted}`}>
          {theme.subtitle}
        </p>
      </div>
    </div>
  );
}

function StarSyncGuestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bandId = searchParams.get("band") || "";
  const ownerSign: ZodiacSign = "Aquarius";

  const [step, setStep] = useState<Step>("input");
  const [mode, setMode] = useState<"sign" | "birthday">("birthday");
  const [otherSign, setOtherSign] = useState<ZodiacSign | "">("");
  const [birthday, setBirthday] = useState("");
  const [syncType, setSyncType] = useState<SyncType>("friendship");

  const otherSignFromBirthday = useMemo(() => getSignFromDate(birthday), [birthday]);

  const effectiveOtherSign: ZodiacSign | null =
    mode === "birthday" ? otherSignFromBirthday : otherSign !== "" ? otherSign : null;

  const scores = useMemo(() => {
    if (!effectiveOtherSign) return null;
    return getScores(ownerSign, effectiveOtherSign);
  }, [ownerSign, effectiveOtherSign]);

  const activeScore = scores ? scores[syncType] : 0;
  const activeReading = getReading(syncType, activeScore);

  const runStarSync = () => {
    if (!effectiveOtherSign) return;
    setStep("scanning");

    setTimeout(() => {
      setStep("results");
    }, 1800);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-slate-50"
      style={{
        backgroundImage: "url('/nebula-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/35" />
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
        {step === "input" && (
          <>
            <section className="pt-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/90">
                Star Sync
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">
                Interaction Scan
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-200/90">
                Based on today’s sky conditions and both zodiac profiles.
              </p>
              {bandId && (
                <p className="mt-3 text-[11px] text-slate-500">
                  Connected through band{" "}
                  <span className="font-semibold text-slate-300">{bandId}</span>
                </p>
              )}
            </section>

            <section>
              <div className="rounded-3xl border border-sky-200/45 bg-slate-950/85 p-5 backdrop-blur-xl shadow-[0_0_34px_rgba(56,189,248,0.24)]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("birthday")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (mode === "birthday"
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Enter Birthday
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("sign")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (mode === "sign"
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Select Sign
                  </button>
                </div>

                <div className="mt-5">
                  {mode === "birthday" ? (
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Your birthday
                      </label>
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-3 text-sm text-slate-100 outline-none focus:border-sky-300"
                      />

                      {birthday && otherSignFromBirthday && (
                        <p className="mt-3 text-xs text-slate-200">
                          Detected sign:{" "}
                          <span className="font-semibold text-sky-200">
                            {otherSignFromBirthday}
                          </span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Your sign
                      </label>
                      <select
                        value={otherSign}
                        onChange={(e) => setOtherSign(e.target.value as ZodiacSign | "")}
                        className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-3 text-sm text-slate-100 outline-none focus:border-sky-300"
                      >
                        <option value="">Select sign</option>
                        {ZODIAC_SIGNS.map((sign) => (
                          <option key={sign} value={sign}>
                            {sign}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={runStarSync}
                  disabled={!effectiveOtherSign}
                  className={
                    "mt-5 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition " +
                    (!effectiveOtherSign
                      ? "cursor-not-allowed border-slate-700 bg-slate-900 text-slate-500"
                      : "border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110")
                  }
                >
                  Run Star Sync
                </button>

                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Powered by NUMA
                </p>
              </div>
            </section>
          </>
        )}

        {step === "scanning" && (
          <section className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full rounded-3xl border border-sky-200/45 bg-slate-950/85 p-8 text-center backdrop-blur-xl shadow-[0_0_44px_rgba(56,189,248,0.26)]">
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-2xl" />
                <div className="absolute inset-0 animate-spin rounded-full border border-sky-300/70 border-t-transparent shadow-[0_0_25px_rgba(56,189,248,0.7)]" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-900/90">
                  <span className="text-xs font-semibold text-sky-100">SYNC</span>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-[0.26em] text-sky-200/90">
                Star Sync
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                Reading current conditions
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Comparing sign profiles with today’s sky pattern.
              </p>
            </div>
          </section>
        )}

        {step === "results" && effectiveOtherSign && scores && (
          <>
            <section className="text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/90">
                Star Sync
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">
                Current Alignment
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {ownerSign} × {effectiveOtherSign}
              </p>
            </section>

            <section>
              <div className="mx-auto grid max-w-xl grid-cols-2 overflow-hidden rounded-full border border-white/15 bg-slate-950/70 p-1 backdrop-blur-xl shadow-[0_0_28px_rgba(15,23,42,0.85)]">
                <button
                  type="button"
                  onClick={() => setSyncType("friendship")}
                  className={
                    "rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition " +
                    (syncType === "friendship"
                      ? "bg-sky-300/15 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.55)]"
                      : "text-slate-300 hover:text-slate-100")
                  }
                >
                  Friendship
                </button>
                <button
                  type="button"
                  onClick={() => setSyncType("romantic")}
                  className={
                    "rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition " +
                    (syncType === "romantic"
                      ? "bg-pink-300/15 text-pink-50 shadow-[0_0_22px_rgba(236,72,153,0.55)]"
                      : "text-slate-300 hover:text-slate-100")
                  }
                >
                  Romance
                </button>
              </div>
            </section>

            <section className="-mt-4">
              <CosmicHeroMeter value={activeScore} type={syncType} />

              <div className="mx-auto -mt-8 max-w-2xl rounded-[2rem] border border-white/15 bg-slate-950/78 px-6 py-6 text-center backdrop-blur-xl shadow-[0_0_38px_rgba(15,23,42,0.8)]">
                <p className="text-xl leading-relaxed text-slate-100/95 sm:text-2xl">
                  {activeReading}
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Based on today’s sky conditions
                </p>
              </div>
            </section>

            <section className="mb-8 mt-2">
              <button
                type="button"
                onClick={() => router.push("/buy")}
                className="mx-auto flex w-full max-w-2xl items-center justify-center rounded-full border border-yellow-100/80 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-100 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.22em] text-slate-950 shadow-[0_0_34px_rgba(250,204,21,0.55)] transition hover:scale-[1.01] hover:brightness-110"
              >
                Get Your NUMA Band
              </button>

              <p className="mt-4 text-center text-[11px] text-slate-500">
                This reading disappears when you leave.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function StarSyncGuestPage() {
  return (
    <Suspense fallback={null}>
      <StarSyncGuestContent />
    </Suspense>
  );
}