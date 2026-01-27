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

type StrengthOrChallenge = "strengths" | "challenges";
type ConnectionFocus = "friendship" | "romantic" | "work";

interface CompatibilityResult {
  score: number; // 0-100
  overall: string; // 1–2 sentences
  strengths: string[]; // 1–2 bullets
  challenges: string[]; // 1–2 bullets
  focusCopy: Record<
    ConnectionFocus,
    {
      title: string;
      blurb: string; // 1–2 sentences
      bullets: string[]; // 2–3 bullets
    }
  >;
}

/**
 * Placeholder compatibility logic — deterministic-ish, safe to ship.
 * Swap later for real astrology logic.
 */
function getCompatibility(owner: ZodiacSign, other: ZodiacSign): CompatibilityResult {
  const ownerIndex = ZODIAC_SIGNS.indexOf(owner);
  const otherIndex = ZODIAC_SIGNS.indexOf(other);

  const diff = Math.abs(ownerIndex - otherIndex);
  const normalized = 1 - diff / (ZODIAC_SIGNS.length - 1);

  const score = Math.max(0, Math.min(100, Math.round(42 + normalized * 52))); // 42–94-ish

  const overall =
    score >= 82
      ? "This connection runs smooth right now — easy to read each other and stay in sync."
      : score >= 66
      ? "There’s solid harmony here, especially when you communicate clearly and keep expectations simple."
      : "This connection can be powerful, but it asks for patience and good boundaries to stay steady.";

  const strengths =
    score >= 82
      ? ["You naturally support each other’s momentum.", "Misunderstandings clear quickly when you talk."]
      : score >= 66
      ? ["You balance each other’s blind spots.", "There’s a steady mutual respect when you stay honest."]
      : ["You can teach each other important lessons.", "When aligned, you become surprisingly resilient together."];

  const challenges =
    score >= 82
      ? ["Comfort can turn into complacency — keep it intentional.", "Avoid assuming you’re on the same page; confirm it."]
      : score >= 66
      ? ["Different pacing can cause friction — agree on timing.", "Say what you mean instead of hinting."]
      : ["Clashing instincts can trigger quick reactions — slow down.", "Boundaries matter or this gets draining fast."];

  const focusCopy: CompatibilityResult["focusCopy"] = {
    friendship: {
      title: "Friendship Dynamics",
      blurb:
        "How you vibe day-to-day: loyalty, communication, and what keeps the friendship feeling easy.",
      bullets:
        score >= 80
          ? ["You recharge each other instead of competing.", "You bounce back fast after disagreements.", "The friendship feels natural in public and private."]
          : score >= 65
          ? ["You do best with direct check-ins and clear plans.", "Respect grows when you give each other space.", "Shared routines keep this stable."]
          : ["Keep expectations simple and consistent.", "Small misunderstandings can snowball — clarify early.", "Choose kindness over being right."],
    },
    romantic: {
      title: "Romantic Connection",
      blurb:
        "Chemistry and closeness — what feels magnetic, and what keeps the relationship emotionally safe.",
      bullets:
        score >= 80
          ? ["Strong mutual pull with emotional ease.", "Affection lands well when it’s straightforward.", "Conflict resolves faster with honesty."]
          : score >= 65
          ? ["You thrive with reassurance and consistency.", "Different love-languages can be a hidden issue.", "Plan “reset moments” after hard days."]
          : ["Go slow and protect trust with boundaries.", "Avoid testing each other — say needs plainly.", "Stability comes from routine, not intensity."],
    },
    work: {
      title: "Work & Ambition",
      blurb:
        "Collaboration energy: decision-making, execution style, and how to stay productive together.",
      bullets:
        score >= 80
          ? ["Fast alignment on goals and roles.", "Great momentum when you define ownership early.", "You push each other without ego."]
          : score >= 65
          ? ["Agree on timelines to avoid frustration.", "One leads; one stabilizes — lean into it.", "Put decisions in writing to stay efficient."]
          : ["Define boundaries and responsibilities upfront.", "Avoid emotional decision-making in crunch time.", "Short meetings beat long debates here."],
    },
  };

  return { score, overall, strengths, challenges, focusCopy };
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
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function clamp01(n: number) {
  return Math.max(0, Math.min(100, n));
}

function BigMeter({ value }: { value: number }) {
  const clamped = clamp01(value);

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/85">
            Overall Compatibility
          </p>
          <p className="mt-1 text-sm text-slate-200/90">
            A quick read on how your energy matches right now.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-50">{clamped}%</div>
          <div className="text-[11px] text-slate-300/80">sync</div>
        </div>
      </div>

      <div className="h-5 overflow-hidden rounded-full border border-yellow-200/45 bg-slate-950/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-100 shadow-[0_0_28px_rgba(250,204,21,0.55)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default function StarSyncPage() {
  const router = useRouter();

  // TODO: pull from logged-in user / band owner profile later
  const ownerSign: ZodiacSign = "Aquarius";

  const [mode, setMode] = useState<PathMode>(null);
  const [otherSign, setOtherSign] = useState<ZodiacSign | "">("");
  const [birthday, setBirthday] = useState("");

  // NEW: start with Friendship Dynamics (not romantic)
  const [focus, setFocus] = useState<ConnectionFocus>("friendship");

  // NEW: strengths vs challenges toggle
  const [lens, setLens] = useState<StrengthOrChallenge>("strengths");

  const otherSignFromBirthday = useMemo(() => getSignFromDate(birthday), [birthday]);

  const effectiveOtherSign: ZodiacSign | null =
    mode === "birthday" ? otherSignFromBirthday : otherSign !== "" ? otherSign : null;

  const result: CompatibilityResult | null = useMemo(() => {
    if (!effectiveOtherSign) return null;
    return getCompatibility(ownerSign, effectiveOtherSign);
  }, [ownerSign, effectiveOtherSign]);

  // When matchup changes, reset lens/focus defaults (friendship first)
  React.useEffect(() => {
    if (!effectiveOtherSign) return;
    setFocus("friendship");
    setLens("strengths");
  }, [effectiveOtherSign]);

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
      <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">Star Sync</p>
            <p className="mt-1 text-sm text-slate-100">
              Compare your alignment with someone else’s chart.
            </p>
          </div>
          <div className="hidden w-16 sm:block" />
        </section>

        {/* Owner card */}
        <section>
          <div className="rounded-3xl border border-slate-600/80 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Band Owner</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold sm:text-lg">{ownerSign}</p>
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
              <p className="text-xs text-slate-200">Use a tap, their sign, or their birthday.</p>
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
                  This will wait for another band tap and pull their sign automatically.
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
                  Use when you know their sign but not their full birth details.
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
                  We’ll auto-detect their sign from the date you choose.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        {mode === "tap" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)] text-sm">
              <p className="text-slate-100 font-medium">NFC tap coming online soon.</p>
              <p className="mt-2 text-xs text-slate-300">
                When NFC logic is wired in, this will listen for a second NUMA band tap,
                grab their sign, and generate the report instantly.
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                For now, test using <span className="font-semibold text-slate-100">Select Their Sign</span>{" "}
                or <span className="font-semibold text-slate-100">Enter Their Birthday</span>.
              </p>
            </div>
          </section>
        )}

        {mode === "sign" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)] text-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Your Sign</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">{ownerSign}</p>
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
                    onChange={(e) => setOtherSign(e.target.value as ZodiacSign | "")}
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
                      That date doesn’t look valid. Try again.
                    </p>
                  )}
                  {otherSignFromBirthday && (
                    <p className="mt-2 text-xs text-slate-200">
                      Detected sign: <span className="font-semibold">{otherSignFromBirthday}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Report */}
        {effectiveOtherSign && result && (
          <section className="mb-4">
            <div className="rounded-3xl border border-yellow-200/50 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950/98 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                Star Sync Report
              </p>
              <p className="mt-2 text-sm text-slate-100">
                {ownerSign} × {effectiveOtherSign}
              </p>

              {/* NEW: Explore toggles at the TOP */}
              <div className="mt-4 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  Explore this connection
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFocus("friendship")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (focus === "friendship"
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Friendship
                  </button>

                  <button
                    type="button"
                    onClick={() => setFocus("romantic")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (focus === "romantic"
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Romantic
                  </button>

                  <button
                    type="button"
                    onClick={() => setFocus("work")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (focus === "work"
                        ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Work
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLens("strengths")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (lens === "strengths"
                        ? "border-yellow-200/70 bg-slate-900/90 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.35)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Strengths
                  </button>
                  <button
                    type="button"
                    onClick={() => setLens("challenges")}
                    className={
                      "rounded-2xl border px-3 py-2 text-xs transition " +
                      (lens === "challenges"
                        ? "border-yellow-200/70 bg-slate-900/90 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.35)]"
                        : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                    }
                  >
                    Challenges
                  </button>
                </div>
              </div>

              {/* Big meter */}
              <div className="mt-5">
                <BigMeter value={result.score} />
                <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{result.overall}</p>
              </div>

              {/* Strength vs Challenge bullets */}
              <div className="mt-4 rounded-3xl border border-slate-600/60 bg-slate-950/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  {lens === "strengths" ? "What’s working" : "What to watch"}
                </p>
                <div className="mt-2 grid gap-2">
                  {(lens === "strengths" ? result.strengths : result.challenges).slice(0, 2).map((t, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus section */}
              <div className="mt-4 rounded-3xl border border-sky-200/35 bg-slate-950/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/85">
                  {result.focusCopy[focus].title}
                </p>
                <p className="mt-2 text-sm text-slate-100/90">{result.focusCopy[focus].blurb}</p>
                <div className="mt-3 grid gap-2">
                  {result.focusCopy[focus].bullets.slice(0, 3).map((t, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-400">
                Star Sync is meant to help you choose the next best move: a message, a boundary, or a plan that keeps the orbit clean.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
