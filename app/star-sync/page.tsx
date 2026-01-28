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

type ConnectionCategory = "friendship" | "romantic" | "business";
type Lens = "strengths" | "challenges";

interface CompatibilityResult {
  overall: number; // 0-100
  friendship: number;
  romantic: number;
  business: number;
  overallSummary: string;
  categorySummary: Record<ConnectionCategory, string>;
  strengths: Record<ConnectionCategory, string[]>;
  challenges: Record<ConnectionCategory, string[]>;
}

/**
 * Simple placeholder logic.
 * - Produces stable-feeling scores and text using sign indices + distance.
 * - Replace later with real synastry engine.
 */
function getCompatibility(owner: ZodiacSign, other: ZodiacSign): CompatibilityResult {
  const a = ZODIAC_SIGNS.indexOf(owner);
  const b = ZODIAC_SIGNS.indexOf(other);
  const diff = Math.abs(a - b);
  const normalized = 1 - diff / (ZODIAC_SIGNS.length - 1); // 0..1 (closer signs -> higher)

  // overall: keep it chunky and optimistic but not always 90+
  const overall = clampInt(Math.round(48 + normalized * 44 + ((a + b) % 7) - 3), 25, 95);

  // Category shaping: a little variance so categories feel distinct
  const friendship = clampInt(Math.round(overall + ((a * 3 + b) % 9) - 4), 20, 98);
  const romantic = clampInt(Math.round(overall + ((a + b * 2) % 11) - 6), 18, 98);
  const business = clampInt(Math.round(overall + ((a * 2 + b * 3) % 10) - 5), 18, 98);

  const overallSummary =
    overall >= 82
      ? "This connection feels naturally easy right now—quick understanding, smooth pacing, and strong momentum."
      : overall >= 65
      ? "There’s real potential here. You’ll click when you communicate clearly and stay flexible with each other’s style."
      : "This connection can still be meaningful, but it works best with patience, honesty, and a little extra intention.";

  const categorySummary: Record<ConnectionCategory, string> = {
    friendship:
      friendship >= 80
        ? "As friends, you tend to ‘get’ each other fast. The bond feels light, loyal, and easy to keep going."
        : friendship >= 65
        ? "Friendship flows when you make space for different rhythms—one leads, the other steadies."
        : "Friendship can grow here, but it needs consistency. Small check-ins beat big expectations.",
    romantic:
      romantic >= 80
        ? "Romantic chemistry is high. You spark each other’s curiosity and feel pulled into the same orbit."
        : romantic >= 65
        ? "Romance builds steadily when you both stay direct about needs and don’t read between the lines too much."
        : "Romance can work, but it’s a ‘slow-burn’ match—trust and emotional safety matter more than intensity.",
    business:
      business >= 80
        ? "Together you’re efficient and motivated. Great for planning, building, and following through."
        : business >= 65
        ? "Work synergy is solid when roles are clear—one drives vision while the other keeps execution grounded."
        : "Business works best with structure. Clear expectations and boundaries turn friction into productivity.",
  };

  // Strengths + challenges: we’ll tailor these a bit by category + diff bucket
  const bucket =
    diff <= 2 ? "close" : diff <= 5 ? "mid" : "far";

  const strengths: Record<ConnectionCategory, string[]> = {
    friendship:
      bucket === "close"
        ? [
            "You share a similar pace, so plans are easy and low-stress.",
            "You recharge each other instead of draining each other.",
          ]
        : bucket === "mid"
        ? [
            "Different perspectives make conversations fun and surprising.",
            "You balance each other—one brings spark, the other brings steadiness.",
          ]
        : [
            "You can teach each other a lot without competing.",
            "When you align on values, the bond becomes unusually loyal.",
          ],
    romantic:
      bucket === "close"
        ? [
            "Strong emotional fluency—less guessing, more clarity.",
            "Physical/mental attraction tends to stay consistent over time.",
          ]
        : bucket === "mid"
        ? [
            "Chemistry grows through contrast—mystery keeps it exciting.",
            "You bring out confidence in each other when you stay honest.",
          ]
        : [
            "The connection can feel ‘fated’ when you commit to understanding.",
            "You challenge each other to grow beyond comfort zones.",
          ],
    business:
      bucket === "close"
        ? [
            "Aligned priorities make planning and execution smooth.",
            "You’ll naturally agree on standards and quality.",
          ]
        : bucket === "mid"
        ? [
            "Great division of labor—one leads strategy, one handles details.",
            "Problem-solving improves because you don’t think the same way.",
          ]
        : [
            "High upside when roles are defined—big vision + strong accountability.",
            "You can create systems that last because you pressure-test decisions.",
          ],
  };

  const challenges: Record<ConnectionCategory, string[]> = {
    friendship:
      bucket === "close"
        ? [
            "You might avoid hard conversations because things feel ‘fine’—say the small stuff early.",
            "Routines can get repetitive unless you intentionally add variety.",
          ]
        : bucket === "mid"
        ? [
            "One of you may feel unheard if decisions happen too fast—slow down when it matters.",
            "Different social styles can cause misreads (quiet ≠ upset, loud ≠ aggressive).",
          ]
        : [
            "Values can clash under stress—keep respect front and center.",
            "Consistency matters: if one disappears, the bond weakens quickly.",
          ],
    romantic:
      bucket === "close"
        ? [
            "Comfort can turn into complacency—keep flirting with curiosity, not just routine.",
            "If both avoid conflict, issues can stack up quietly.",
          ]
        : bucket === "mid"
        ? [
            "Miscommunication can happen when expectations aren’t spoken—be explicit about needs.",
            "Intensity can spike then cool—pace yourselves and keep trust steady.",
          ]
        : [
            "Different emotional languages can feel like distance—translate, don’t assume.",
            "Power struggles can show up—choose ‘team’ over winning.",
          ],
    business:
      bucket === "close"
        ? [
            "You may mirror each other’s blind spots—invite outside feedback.",
            "If you agree too easily, big risks can be missed.",
          ]
        : bucket === "mid"
        ? [
            "Different decision styles can frustrate—set a process for final calls.",
            "Speed vs perfection can clash—define what ‘done’ means early.",
          ]
        : [
            "Control issues can appear—roles, ownership, and boundaries must be written down.",
            "If communication gets sparse, trust drops—schedule consistent check-ins.",
          ],
  };

  return {
    overall,
    friendship,
    romantic,
    business,
    overallSummary,
    categorySummary,
    strengths,
    challenges,
  };
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

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function BigMeter({
  label,
  value,
  tone = "gold",
}: {
  label: string;
  value: number;
  tone?: "gold" | "sky";
}) {
  const clamped = clampInt(value, 0, 100);

  const barClass =
    tone === "gold"
      ? "bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 shadow-[0_0_26px_rgba(250,204,21,0.55)]"
      : "bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 shadow-[0_0_22px_rgba(56,189,248,0.55)]";

  const borderClass =
    tone === "gold" ? "border-yellow-200/55" : "border-sky-200/55";

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
            {label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-50">{clamped}%</p>
        </div>
      </div>

      <div className={`h-5 overflow-hidden rounded-full border ${borderClass} bg-slate-950/80`}>
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ id: string; label: string }>;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={
              "rounded-2xl border px-3 py-2 text-xs transition " +
              (active
                ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
                : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function StarSyncPage() {
  const router = useRouter();

  // TODO: pull from logged-in band owner profile
  const ownerSign: ZodiacSign = "Aquarius";

  // Keep your existing “select sign / birthday” input for now (quick test flow)
  const [mode, setMode] = useState<"sign" | "birthday">("sign");
  const [otherSign, setOtherSign] = useState<ZodiacSign | "">("");
  const [birthday, setBirthday] = useState("");

  const otherSignFromBirthday = useMemo(() => getSignFromDate(birthday), [birthday]);

  const effectiveOtherSign: ZodiacSign | null =
    mode === "birthday" ? otherSignFromBirthday : otherSign !== "" ? otherSign : null;

  const result: CompatibilityResult | null = useMemo(() => {
    if (!effectiveOtherSign) return null;
    return getCompatibility(ownerSign, effectiveOtherSign);
  }, [ownerSign, effectiveOtherSign]);

  // New UI state for your requested flow
  const [category, setCategory] = useState<ConnectionCategory>("friendship");
  const [lens, setLens] = useState<Lens>("strengths");

  const categoryValue = result
    ? category === "friendship"
      ? result.friendship
      : category === "romantic"
      ? result.romantic
      : result.business
    : 0;

  const categorySummary = result ? result.categorySummary[category] : "";
  const listItems = result ? (lens === "strengths" ? result.strengths[category] : result.challenges[category]) : [];

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
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
              Star Sync
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Compare your alignment with someone else.
            </p>
          </div>
          <div className="hidden w-16 sm:block" />
        </section>

        {/* Quick input (keep simple while we iterate) */}
        <section>
          <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Band Owner
                </p>
                <p className="mt-1 text-base font-semibold text-slate-100">
                  {ownerSign}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("sign")}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs transition " +
                    (mode === "sign"
                      ? "border-sky-300/90 bg-slate-900/95 text-sky-50"
                      : "border-slate-600/70 bg-slate-950/80 text-slate-200 hover:border-slate-400")
                  }
                >
                  Their Sign
                </button>
                <button
                  type="button"
                  onClick={() => setMode("birthday")}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs transition " +
                    (mode === "birthday"
                      ? "border-sky-300/90 bg-slate-900/95 text-sky-50"
                      : "border-slate-600/70 bg-slate-950/80 text-slate-200 hover:border-slate-400")
                  }
                >
                  Their Birthday
                </button>
              </div>
            </div>

            <div className="mt-4">
              {mode === "sign" ? (
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Select their sign
                  </label>
                  <select
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
              ) : (
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Enter their birthday
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
                  />
                  {birthday && otherSignFromBirthday && (
                    <p className="mt-2 text-xs text-slate-200">
                      Detected sign:{" "}
                      <span className="font-semibold">{otherSignFromBirthday}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        {effectiveOtherSign && result && (
          <>
            {/* 1) Overall Compatibility FIRST */}
            <section>
              <div className="rounded-3xl border border-yellow-200/50 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950/98 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                  Overall Compatibility
                </p>
                <p className="mt-2 text-sm text-slate-100">
                  {ownerSign} × {effectiveOtherSign}
                </p>

                <div className="mt-4">
                  <BigMeter label="Overall Connection" value={result.overall} tone="gold" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-100/90">
                  {result.overallSummary}
                </p>

                <p className="mt-3 text-[11px] text-slate-400">
                  Next: pick the connection type to explore it deeper.
                </p>
              </div>
            </section>

            {/* 2) Category selector */}
            <section>
              <div className="rounded-3xl border border-sky-200/40 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.85)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-sky-200/90">
                  Explore this connection
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  Choose the lens you care about right now.
                </p>

                <div className="mt-3">
                  <Segmented
                    value={category}
                    onChange={(v) => {
                      setCategory(v as ConnectionCategory);
                      // reset lens for clarity when switching category
                      setLens("strengths");
                    }}
                    options={[
                      { id: "friendship", label: "Friendship" },
                      { id: "romantic", label: "Romantic" },
                      { id: "business", label: "Business" },
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* 3) Category meter + summary */}
            <section>
              <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  {category === "friendship"
                    ? "Friendship Dynamics"
                    : category === "romantic"
                    ? "Romantic Connection"
                    : "Work & Ambition"}
                </p>

                <div className="mt-4">
                  <BigMeter
                    label={
                      category === "friendship"
                        ? "Friendship Compatibility"
                        : category === "romantic"
                        ? "Romantic Compatibility"
                        : "Business Compatibility"
                    }
                    value={categoryValue}
                    tone="sky"
                  />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-100/90">
                  {categorySummary}
                </p>
              </div>
            </section>

            {/* 4) Strengths vs Challenges toggle for that category */}
            <section className="mb-6">
              <div className="rounded-3xl border border-yellow-200/40 bg-slate-950/90 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/90">
                      {lens === "strengths" ? "Strengths" : "Challenges"}
                    </p>
                    <p className="mt-1 text-xs text-slate-200">
                      {lens === "strengths"
                        ? "What works well between you right now."
                        : "What to watch for so it doesn’t drift off course."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLens("strengths")}
                      className={
                        "rounded-full border px-3 py-1.5 text-xs transition " +
                        (lens === "strengths"
                          ? "border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 text-slate-950"
                          : "border-slate-600/70 bg-slate-950/80 text-slate-200 hover:border-slate-400")
                      }
                    >
                      Strengths
                    </button>
                    <button
                      type="button"
                      onClick={() => setLens("challenges")}
                      className={
                        "rounded-full border px-3 py-1.5 text-xs transition " +
                        (lens === "challenges"
                          ? "border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 text-slate-950"
                          : "border-slate-600/70 bg-slate-950/80 text-slate-200 hover:border-slate-400")
                      }
                    >
                      Challenges
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {listItems.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100/90"
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-slate-400">
                  These insights are a lightweight preview. Later we can make this feel more “real-time”
                  by mixing in the day’s sky positions + your meters.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
