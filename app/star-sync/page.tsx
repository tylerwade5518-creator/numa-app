"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedSpaceBackground from "../dashboard/AnimatedSpaceBackground";

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

type PathMode = "tap" | "sign" | "birthday" | null;

interface CompatibilityResult {
  alignment: number;
  challenge: number;
  magnetism: number;
  summary: string;
}

/**
 * Placeholder compatibility logic — safe to ship now.
 * You can swap this later for a real astrology engine.
 */
function getCompatibility(
  owner: ZodiacSign,
  other: ZodiacSign
): CompatibilityResult {
  const ownerIndex = ZODIAC_SIGNS.indexOf(owner);
  const otherIndex = ZODIAC_SIGNS.indexOf(other);

  const diff = Math.abs(ownerIndex - otherIndex);
  const normalized = 1 - diff / (ZODIAC_SIGNS.length - 1);

  const alignment = Math.round(50 + normalized * 40); // 50–90
  const magnetism = Math.round(40 + normalized * 50); // 40–90
  const challenge = Math.round(30 + (1 - normalized) * 50); // 30–80

  let summary = "";

  if (alignment >= 80) {
    summary =
      "This connection leans easy and familiar. You’ll feel most aligned when you both keep things honest and simple.";
  } else if (alignment >= 65) {
    summary =
      "You’re close enough to move in the same direction, but growth comes from listening more than assuming.";
  } else {
    summary =
      "This bond is more about lessons than ease. With patience, it can still become something rare and strong.";
  }

  return { alignment, challenge, magnetism, summary };
}

/**
 * Basic Western tropical zodiac from date.
 */
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
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius";
  return "Pisces";
}

interface MeterRowProps {
  label: string;
  value: number;
}

function MeterRow({ label, value }: MeterRowProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-200">{label}</span>
        <span className="font-semibold text-slate-50">{clamped}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-sky-200/50 bg-slate-950/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default function StarSyncPage() {
  const router = useRouter();

  // TODO: pull this from the logged-in user / band owner profile later
  const ownerSign: ZodiacSign = "Aquarius";

  const [mode, setMode] = useState<PathMode>(null);
  const [otherSign, setOtherSign] = useState<ZodiacSign | "">("");
  const [birthday, setBirthday] = useState("");

  const otherSignFromBirthday = useMemo(
    () => getSignFromDate(birthday),
    [birthday]
  );

  const effectiveOtherSign: ZodiacSign | null =
    mode === "birthday"
      ? otherSignFromBirthday
      : otherSign !== ""
      ? otherSign
      : null;

  const result: CompatibilityResult | null = useMemo(() => {
    if (!effectiveOtherSign) return null;
    return getCompatibility(ownerSign, effectiveOtherSign);
  }, [ownerSign, effectiveOtherSign]);

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
      {/* Dark veil */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/70" />

      {/* Moving stars */}
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
        {/* Header */}
        <section className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-slate-600/70 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900/80"
          >
            ← Back
          </button>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
              Star Sync
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Compare your alignment with someone else&apos;s chart.
            </p>
          </div>
          <div className="hidden w-16 sm:block" />
        </section>

        {/* Owner card */}
        <section>
          <div className="rounded-3xl border border-slate-600/80 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Band Owner
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold sm:text-lg">
                  {ownerSign}
                </p>
                <p className="text-xs text-slate-300">
                  Star Sync always compares others to your chart.
                </p>
              </div>
              <div className="rounded-full border border-yellow-200/60 bg-slate-900/80 px-3 py-1 text-[11px] text-yellow-100">
                NUMA Band Linked
              </div>
            </div>
          </div>
        </section>

        {/* Mode selector */}
        <section>
          <div className="rounded-3xl border border-sky-200/40 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.85)]">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/90">
                Choose Connection Path
              </p>
              <p className="text-xs text-slate-200">
                Use a tap, their sign, or their birthday to sync.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setMode("tap")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left text-xs transition sm:text-sm " +
                  (mode === "tap"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Tap a NUMA Band
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  In the live app, this will wait for another band tap and auto
                  pull their chart.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("sign")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left text-xs transition sm:text-sm " +
                  (mode === "sign"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Select Their Sign
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  Use this when you know their sign but not their full birth
                  details.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("birthday")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left text-xs transition sm:text-sm " +
                  (mode === "birthday"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Enter Their Birthday
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  We&apos;ll auto-detect their sign from the date you choose.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic input area */}
        {mode === "tap" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)] text-sm">
              <p className="text-slate-100 font-medium">
                NFC tap coming online soon.
              </p>
              <p className="mt-2 text-xs text-slate-300">
                When your NFC logic is wired in, this card will listen for a
                second NUMA band tap, grab their sign from their profile, and
                trigger the Star Sync report automatically.
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                For now, test Star Sync using{" "}
                <span className="font-semibold text-slate-100">
                  Select Their Sign
                </span>{" "}
                or{" "}
                <span className="font-semibold text-slate-100">
                  Enter Their Birthday
                </span>
                .
              </p>
            </div>
          </section>
        )}

        {mode === "sign" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)] text-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Your Sign
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">
                    {ownerSign}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    This will be pulled from your band profile in production.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="otherSign"
                    className="text-[11px] uppercase tracking-[0.18em] text-slate-400"
                  >
                    Their Sign
                  </label>
                  <select
                    id="otherSign"
                    value={otherSign}
                    onChange={(e) =>
                      setOtherSign(e.target.value as ZodiacSign | "")
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
                  >
                    <option value="">Select sign</option>
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign}>
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
        )}

        {mode === "birthday" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)] text-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Their Birthday
                  </p>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
                  />
                  {birthday && !otherSignFromBirthday && (
                    <p className="mt-2 text-[11px] text-red-400">
                      That date doesn&apos;t look valid. Try again.
                    </p>
                  )}
                  {otherSignFromBirthday && (
                    <p className="mt-2 text-xs text-slate-200">
                      Detected sign:{" "}
                      <span className="font-semibold">
                        {otherSignFromBirthday}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Resonance report */}
        {effectiveOtherSign && result && (
          <section className="mb-4">
            <div className="rounded-3xl border border-yellow-200/50 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950/98 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                Resonance Report
              </p>
              <p className="mt-2 text-sm text-slate-100">
                {ownerSign} × {effectiveOtherSign}
              </p>

              <div className="mt-4 space-y-3">
                <MeterRow label="Alignment" value={result.alignment} />
                <MeterRow label="Challenge" value={result.challenge} />
                <MeterRow label="Magnetism" value={result.magnetism} />
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-100/90">
                {result.summary}
              </p>

              <p className="mt-3 text-[11px] text-slate-400">
                Star Sync is built for real-life choices: conversations,
                check-ins, and small moves that keep your orbit feeling right.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
