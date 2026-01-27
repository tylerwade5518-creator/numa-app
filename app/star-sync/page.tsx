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

type InsightMode = "romantic" | "friendship" | "work";
type Lens = "strengths" | "challenges";

interface CompatibilityResult {
  compatibility: number; // 0–100 (main big meter)
  summary: string; // 1–2 sentences (per insight mode)
  strengths: string[]; // 1–2 bullets
  challenges: string[]; // 1–2 bullets
  label: string; // "Strong", "Balanced", etc.
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

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function scoreLabel(score: number) {
  const s = clamp(score);
  if (s >= 90) return "Exceptional";
  if (s >= 75) return "Strong";
  if (s >= 55) return "Balanced";
  if (s >= 35) return "Challenging";
  return "High Friction";
}

function pickTwo(arr: string[]) {
  return arr.slice(0, 2);
}

/**
 * Placeholder compatibility engine that:
 * - Outputs one primary score
 * - Provides mode-based summary + strengths/challenges
 *
 * Later you can replace internals with real astrology logic
 * (elements, modalities, moon phase, etc.) without changing the UI.
 */
function getStarSyncResult(
  owner: ZodiacSign,
  other: ZodiacSign,
  insightMode: InsightMode
): CompatibilityResult {
  const ownerIndex = ZODIAC_SIGNS.indexOf(owner);
  const otherIndex = ZODIAC_SIGNS.indexOf(other);

  const diff = Math.abs(ownerIndex - otherIndex);
  const normalized = 1 - diff / (ZODIAC_SIGNS.length - 1);

  // Main score: keep it feeling optimistic but not cheesy.
  // 48–92ish.
  const base = 48 + normalized * 44;
  // Small, deterministic mode bias so buttons feel meaningful.
  const modeBias = insightMode === "romantic" ? 2 : insightMode === "friendship" ? 0 : -1;
  const compatibility = clamp(Math.round(base + modeBias));

  const label = scoreLabel(compatibility);

  // Copy bank: short, “NUMA voice,” not destiny talk.
  const pair = `${owner} × ${other}`;

  const summaries: Record<InsightMode, string[]> = {
    romantic: [
      `${pair} feels naturally magnetic when you keep things honest and unforced. The connection grows fastest through consistency, not intensity.`,
      `${pair} can be a strong romantic match when you both respect pacing. Clear signals beat mixed messages here.`,
      `${pair} tends to work best when one leads with warmth and the other stabilizes the bond. Small reassurance goes a long way.`,
    ],
    friendship: [
      `${pair} makes a solid friendship when you lean into what you share and give each other space to recharge. Easy loyalty builds over time.`,
      `${pair} is best as friends when you keep communication simple and direct. Show up consistently and it clicks.`,
      `${pair} can be a strong friend-match when you celebrate differences instead of trying to “fix” them. Let the contrast be the fun.`,
    ],
    work: [
      `${pair} can be effective together when roles are clear and expectations are explicit. You’re strongest when you divide and conquer.`,
      `${pair} works best professionally when decisions are documented and timelines are respected. Keep it clean and you’ll move fast.`,
      `${pair} can build serious momentum at work when one drives vision and the other drives execution. Align on priorities early.`,
    ],
  };

  const strengthsBank: Record<InsightMode, string[]> = {
    romantic: [
      "You spark curiosity in each other — the bond stays interesting over time.",
      "When you’re aligned, the chemistry feels effortless and grounding at once.",
      "You balance intensity with stability, which can make the connection last.",
      "You can build trust quickly when you both communicate directly.",
    ],
    friendship: [
      "You encourage each other without needing constant validation.",
      "This pairing can be low-drama when you keep expectations clear.",
      "You bring complementary perspectives that make life feel bigger.",
      "You can be fiercely loyal friends once trust is established.",
    ],
    work: [
      "Great complementary strengths — one sees the big picture, the other tightens the plan.",
      "You can move fast together when roles are defined and respected.",
      "This pairing is strong for execution when priorities are crystal clear.",
      "You’re effective when you keep decisions practical and measurable.",
    ],
  };

  const challengesBank: Record<InsightMode, string[]> = {
    romantic: [
      "Mixed signals can create unnecessary doubt — clarity is everything here.",
      "Pacing differences can cause friction unless you talk about needs early.",
      "When stressed, you may interpret silence differently — check in before assuming.",
      "One of you may want intensity while the other wants steadiness — balance it intentionally.",
    ],
    friendship: [
      "Different social batteries can cause misunderstandings — respect recharge time.",
      "You may joke past feelings — be real when it matters.",
      "If plans are vague, one may feel ignored — make the plan concrete.",
      "Conflict styles differ — repair quickly instead of letting it linger.",
    ],
    work: [
      "Decision speed can clash — agree on a process before pressure hits.",
      "Vague roles create overlap and frustration — define ownership early.",
      "If feedback is too blunt, it can shut down momentum — keep it constructive.",
      "Different risk tolerances can slow progress — set guardrails, then act.",
    ],
  };

  // Pick deterministic lines based on indices so it feels stable for a pair.
  const seed = (ownerIndex + 1) * 31 + (otherIndex + 1) * 17 + (insightMode === "romantic" ? 3 : insightMode === "friendship" ? 5 : 7);
  const summaryList = summaries[insightMode];
  const summary = summaryList[seed % summaryList.length];

  // For strengths/challenges, pick 2 but rotate by seed.
  const sList = strengthsBank[insightMode];
  const cList = challengesBank[insightMode];

  const s1 = sList[seed % sList.length];
  const s2 = sList[(seed + 2) % sList.length];
  const strengths = pickTwo([s1, s2]);

  const c1 = cList[seed % cList.length];
  const c2 = cList[(seed + 2) % cList.length];
  const challenges = pickTwo([c1, c2]);

  return { compatibility, summary, strengths, challenges, label };
}

function BigCompatibilityMeter({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
  const clamped = clamp(score);
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-100/85">
            Compatibility
          </p>
          <p className="mt-1 text-xs text-slate-200/90">
            Overall connection right now
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            {clamped}%
          </div>
          <div className="text-xs text-yellow-100/80">{label}</div>
        </div>
      </div>

      <div className="h-5 overflow-hidden rounded-full border border-yellow-200/50 bg-slate-950/75 shadow-[0_0_30px_rgba(250,204,21,0.16)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 shadow-[0_0_26px_rgba(250,204,21,0.55)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function PillSwitch({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string;
  rightLabel: string;
  value: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <div className="inline-flex w-full overflow-hidden rounded-2xl border border-slate-500/60 bg-slate-950/70 p-1">
      <button
        type="button"
        onClick={() => onChange("left")}
        className={
          "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition " +
          (value === "left"
            ? "bg-slate-900/90 text-slate-50 shadow-[0_0_18px_rgba(56,189,248,0.18)]"
            : "text-slate-300 hover:text-slate-100")
        }
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("right")}
        className={
          "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition " +
          (value === "right"
            ? "bg-slate-900/90 text-slate-50 shadow-[0_0_18px_rgba(56,189,248,0.18)]"
            : "text-slate-300 hover:text-slate-100")
        }
      >
        {rightLabel}
      </button>
    </div>
  );
}

function ModeButtons({
  mode,
  onChange,
}: {
  mode: InsightMode;
  onChange: (m: InsightMode) => void;
}) {
  const btn = (m: InsightMode, title: string, subtitle: string) => {
    const active = mode === m;
    return (
      <button
        type="button"
        onClick={() => onChange(m)}
        className={
          "w-full rounded-2xl border px-3 py-3 text-left transition " +
          (active
            ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.45)]"
            : "border-slate-600/70 bg-slate-950/70 text-slate-100 hover:border-slate-400")
        }
      >
        <div className="text-xs font-semibold sm:text-sm">{title}</div>
        <div className="mt-1 text-[11px] text-slate-300/90">{subtitle}</div>
      </button>
    );
  };

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {btn("romantic", "Romantic Connection", "Chemistry, pacing, emotional tone")}
      {btn("friendship", "Friendship Dynamics", "Trust, fun, long-term flow")}
      {btn("work", "Work & Ambition", "Roles, execution, decisions")}
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

  // New Star Sync UX controls
  const [insightMode, setInsightMode] = useState<InsightMode>("romantic");
  const [lens, setLens] = useState<Lens>("strengths");

  const otherSignFromBirthday = useMemo(() => getSignFromDate(birthday), [birthday]);

  const effectiveOtherSign: ZodiacSign | null =
    mode === "birthday"
      ? otherSignFromBirthday
      : otherSign !== ""
      ? otherSign
      : null;

  const result: CompatibilityResult | null = useMemo(() => {
    if (!effectiveOtherSign) return null;
    return getStarSyncResult(ownerSign, effectiveOtherSign, insightMode);
  }, [ownerSign, effectiveOtherSign, insightMode]);

  const lensItems = useMemo(() => {
    if (!result) return [];
    return lens === "strengths" ? result.strengths : result.challenges;
  }, [result, lens]);

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

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8 text-sm sm:text-base">
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
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
              Star Sync
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Compare your alignment with someone else.
            </p>
          </div>
          <div className="hidden w-16 sm:block" />
        </section>

        {/* Owner card */}
        <section>
          <div className="rounded-3xl border border-slate-600/80 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Band Owner
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-semibold sm:text-xl">{ownerSign}</p>
                <p className="text-sm text-slate-300">
                  Star Sync compares others to your chart.
                </p>
              </div>
              <div className="rounded-full border border-yellow-200/60 bg-slate-900/80 px-3 py-1 text-xs text-yellow-100">
                NUMA Band Linked
              </div>
            </div>
          </div>
        </section>

        {/* Mode selector */}
        <section>
          <div className="rounded-3xl border border-sky-200/40 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(15,23,42,0.85)]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200/90">
                Choose Connection Path
              </p>
              <p className="text-sm text-slate-200">
                Use a tap, their sign, or their birthday.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setMode("tap")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left transition " +
                  (mode === "tap"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Tap a NUMA Band
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  Coming soon: detect another band tap and sync automatically.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("sign")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left transition " +
                  (mode === "sign"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Select Their Sign
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  Use this when you know their sign.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("birthday")}
                className={
                  "w-full rounded-2xl border px-3 py-3 text-left transition " +
                  (mode === "birthday"
                    ? "border-sky-300/90 bg-slate-900/95 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-slate-600/70 bg-slate-950/80 text-slate-100 hover:border-slate-400")
                }
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Enter Their Birthday
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  We&apos;ll detect their sign from the date.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic input area */}
        {mode === "tap" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)]">
              <p className="text-slate-100 font-medium">NFC tap coming online soon.</p>
              <p className="mt-2 text-sm text-slate-300">
                This will listen for a second NUMA tap, pull their sign from their profile,
                and generate the report automatically.
              </p>
              <p className="mt-3 text-xs text-slate-400">
                For now, test Star Sync using <span className="font-semibold text-slate-100">Select Their Sign</span>{" "}
                or <span className="font-semibold text-slate-100">Enter Their Birthday</span>.
              </p>
            </div>
          </section>
        )}

        {mode === "sign" && (
          <section>
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)]">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Your Sign
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-100">
                    {ownerSign}
                  </p>
                  <p className="text-xs text-slate-400">
                    Will be pulled from your band profile in production.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="otherSign"
                    className="text-xs uppercase tracking-[0.16em] text-slate-400"
                  >
                    Their Sign
                  </label>
                  <select
                    id="otherSign"
                    value={otherSign}
                    onChange={(e) => setOtherSign(e.target.value as ZodiacSign | "")}
                    className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-2.5 text-base text-slate-100 outline-none focus:border-sky-300"
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
            <div className="rounded-3xl border border-slate-600/80 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.85)]">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    Their Birthday
                  </p>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-600/80 bg-slate-950/90 px-3 py-2.5 text-base text-slate-100 outline-none focus:border-sky-300"
                  />
                  {birthday && !otherSignFromBirthday && (
                    <p className="mt-2 text-xs text-red-400">
                      That date doesn&apos;t look valid. Try again.
                    </p>
                  )}
                  {otherSignFromBirthday && (
                    <p className="mt-2 text-sm text-slate-200">
                      Detected sign:{" "}
                      <span className="font-semibold">{otherSignFromBirthday}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NEW: Star Sync Result */}
        {effectiveOtherSign && result && (
          <section className="mb-4">
            <div className="rounded-3xl border border-yellow-200/55 bg-gradient-to-b from-slate-950/85 via-slate-950/92 to-slate-950/95 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
              <p className="text-xs uppercase tracking-[0.22em] text-yellow-100/90">
                Star Sync
              </p>
              <p className="mt-2 text-base text-slate-100">
                <span className="font-semibold">{ownerSign}</span> ×{" "}
                <span className="font-semibold">{effectiveOtherSign}</span>
              </p>

              <div className="mt-4">
                <BigCompatibilityMeter score={result.compatibility} label={result.label} />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-100/90">
                {result.summary}
              </p>

              {/* Strengths vs Challenges */}
              <div className="mt-5 space-y-3">
                <PillSwitch
                  leftLabel="Strengths"
                  rightLabel="Challenges"
                  value={lens === "strengths" ? "left" : "right"}
                  onChange={(v) => setLens(v === "left" ? "strengths" : "challenges")}
                />

                <div className="rounded-2xl border border-slate-600/70 bg-slate-950/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    {lens === "strengths" ? "What Works Well" : "What To Watch"}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm text-slate-100/90">
                    {lensItems.map((item, idx) => (
                      <li key={`${lens}-${idx}`} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mode buttons */}
              <div className="mt-5 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Explore This Connection
                </p>
                <ModeButtons mode={insightMode} onChange={setInsightMode} />
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Star Sync is designed for real life: small choices, clean communication, and alignment you can feel.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
