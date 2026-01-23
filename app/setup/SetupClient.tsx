"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/client";

type Step = 1 | 2 | 3;

type BirthForm = {
  day: string;
  month: string;
  year: string;
};

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Simple year range – you can adjust later if you want
const years = Array.from({ length: 70 }, (_, i) => `${1955 + i}`);

const PENDING_BAND_STORAGE_KEY = "numa:pendingBandCode";

function getZodiacSign(monthIndex: number, day: number): string {
  if ((monthIndex === 0 && day >= 20) || (monthIndex === 1 && day <= 18)) return "Aquarius";
  if ((monthIndex === 1 && day >= 19) || (monthIndex === 2 && day <= 20)) return "Pisces";
  if ((monthIndex === 2 && day >= 21) || (monthIndex === 3 && day <= 19)) return "Aries";
  if ((monthIndex === 3 && day >= 20) || (monthIndex === 4 && day <= 20)) return "Taurus";
  if ((monthIndex === 4 && day >= 21) || (monthIndex === 5 && day <= 20)) return "Gemini";
  if ((monthIndex === 5 && day >= 21) || (monthIndex === 6 && day <= 22)) return "Cancer";
  if ((monthIndex === 6 && day >= 23) || (monthIndex === 7 && day <= 22)) return "Leo";
  if ((monthIndex === 7 && day >= 23) || (monthIndex === 8 && day <= 22)) return "Virgo";
  if ((monthIndex === 8 && day >= 23) || (monthIndex === 9 && day <= 22)) return "Libra";
  if ((monthIndex === 9 && day >= 23) || (monthIndex === 10 && day <= 21)) return "Scorpio";
  if ((monthIndex === 10 && day >= 22) || (monthIndex === 11 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

function safeGetPendingBand(): string {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(PENDING_BAND_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
}

function safeSetPendingBand(band: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_BAND_STORAGE_KEY, band);
  } catch {}
}

function safeClearPendingBand() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_BAND_STORAGE_KEY);
  } catch {}
}

function buildAuthUrl(path: "/login" | "/signup", redirectPath: string, band: string) {
  const qs = new URLSearchParams();
  qs.set("redirect", redirectPath);
  if (band) qs.set("band", band);
  return `${path}?${qs.toString()}`;
}

export default function SetupClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bandFromUrl = (searchParams.get("band") || "").trim();
  const [bandId, setBandId] = useState<string>("");

  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [step, setStep] = useState<Step>(1);

  const [birth, setBirth] = useState<BirthForm>({
    day: "",
    month: "",
    year: "",
  });

  const [sign, setSign] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Resolve band id from URL OR localStorage fallback
  useEffect(() => {
    const pending = safeGetPendingBand();
    const resolved = (bandFromUrl || pending || "").trim();
    setBandId(resolved);
    if (resolved) safeSetPendingBand(resolved);
  }, [bandFromUrl]);

  const hasValidBirthdate = useMemo(() => {
    const monthIndex = months.indexOf(birth.month);
    const dayNum = Number(birth.day);
    const yearNum = Number(birth.year);
    if (monthIndex < 0 || !dayNum || !yearNum) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    return true;
  }, [birth]);

  useEffect(() => {
    if (!hasValidBirthdate) {
      setSign("");
      return;
    }
    const monthIndex = months.indexOf(birth.month);
    const dayNum = Number(birth.day);
    setSign(getZodiacSign(monthIndex, dayNum));
  }, [birth, hasValidBirthdate]);

  if (!bandId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-100">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 text-center border border-slate-700/70">
          <h1 className="text-xl font-semibold mb-2">No Band Detected</h1>
          <p className="text-sm text-slate-300">
            This setup link is missing a band ID. Try tapping your NUMA Band again to start setup.
          </p>
        </div>
      </div>
    );
  }

  const onBirthChange =
    (field: keyof BirthForm) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBirth((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleNextFromClaim = async () => {
    setError(null);

    // If not logged in, send them to signup but bring them back here
    try {
      const { data, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;

      const user = data?.session?.user;
      const returnTo = `/setup?band=${encodeURIComponent(bandId)}`;

      if (!user) {
        router.replace(buildAuthUrl("/signup", returnTo, bandId));
        return;
      }

      setStep(2);
    } catch (e: any) {
      setError(e?.message || "Could not check login status.");
    }
  };

  const handleNextFromStarSync = () => {
    setError(null);
    if (!hasValidBirthdate || !sign) {
      setError("Choose a valid birthdate so we can complete Star Sync.");
      return;
    }
    setStep(3);
  };

  // REAL finish: require auth; claim band; set profile.band_code; route to dashboard
  const handleFinish = async () => {
    setError(null);

    if (!agree) {
      setError("Please confirm that you want to link this band to your account.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;

      const user = sessionData?.session?.user;
      const returnTo = `/setup?band=${encodeURIComponent(bandId)}`;

      if (!user) {
        router.replace(buildAuthUrl("/signup", returnTo, bandId));
        return;
      }

      // 1) Fetch band
      const { data: band, error: bandFetchErr } = await supabase
        .from("bands")
        .select("id, band_code, owner_user_id, status, claimed_at")
        .eq("band_code", bandId)
        .maybeSingle();

      if (bandFetchErr) throw bandFetchErr;
      if (!band) throw new Error("That band code was not found. Please tap your band again.");

      const owner = (band as any).owner_user_id as string | null;
      if (owner && owner !== user.id) throw new Error("This band is already linked to another account.");

      // 2) Claim if needed
      if (!owner) {
        const { error: claimErr } = await supabase
          .from("bands")
          .update({
            owner_user_id: user.id,
            status: "claimed",
            claimed_at: new Date().toISOString(),
          })
          .eq("id", (band as any).id);

        if (claimErr) throw claimErr;
      }

      // 3) Store the band on the user's profile
      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          band_code: bandId,
          // If you have columns, you can store these later. Keeping it minimal right now.
          // sign,
        })
        .eq("user_id", user.id);

      if (profErr) throw profErr;

      // 4) Clear pending band so it doesn’t “stick” to future logins
      safeClearPendingBand();

      // 5) Dashboard
      router.replace(`/dashboard?band=${encodeURIComponent(bandId)}`);
    } catch (e: any) {
      setError(e?.message || "Something went wrong finishing setup. Please try again.");
      setSubmitting(false);
    }
  };

  const BackgroundStars = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.55),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(30,64,175,0.55),_transparent_55%)] opacity-80" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-12 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
      <div className="absolute top-24 right-16 w-1 h-1 bg-white/80 rounded-full animate-pulse" />
      <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-white/70 rounded-full animate-pulse" />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-slate-100 flex items-center justify-center px-4 py-10">
      <BackgroundStars />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 border border-slate-700/70 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {step === 1 && "Step 1 of 3 • Confirm Band"}
            {step === 2 && "Step 2 of 3 • Star Sync"}
            {step === 3 && "Step 3 of 3 • Link & Enter"}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Band • <span className="text-slate-300">{bandId}</span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-800/80 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-sky-400 transition-all duration-500"
            style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
          />
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Let’s claim your band</h1>
            <p className="text-sm text-slate-300 mb-6">
              This band will be linked to your account so only you control its taps and Tap Share.
            </p>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleNextFromClaim}
              className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
            >
              Continue
            </button>

            <div className="mt-4 text-[11px] text-slate-400">
              If you’re not logged in, we’ll send you to create an account first, then bring you back here automatically.
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Star Sync</h1>
            <p className="text-sm text-slate-300 mb-6">
              Choose your birthdate. We’ll map your solar sign and align your stardust profile.
            </p>

            <div className="relative mb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Month
                  </label>
                  <select
                    value={birth.month}
                    onChange={onBirthChange("month")}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-20">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Day
                  </label>
                  <select
                    value={birth.day}
                    onChange={onBirthChange("day")}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => `${i + 1}`).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wide">
                    Year
                  </label>
                  <select
                    value={birth.year}
                    onChange={onBirthChange("year")}
                    className="w-full rounded-full bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3">
              {!hasValidBirthdate || !sign ? (
                <p className="text-xs text-slate-400">
                  Tracing constellations… select your full birthdate to see your solar sign.
                </p>
              ) : (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Constellations aligned
                  </p>
                  <p className="text-lg font-semibold text-slate-50">{sign}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    This is the sign we’ll use to shape your daily dashboard and stardust discoveries.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextFromStarSync}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
              >
                Lock My Star Sync
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">Review & Enter</h1>
            <p className="text-sm text-slate-300 mb-6">
              This will link your band to your account in the database, then open your dashboard.
            </p>

            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Band Link
                </p>
                <p className="font-mono text-xs text-slate-200">{bandId}</p>
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Stardust Profile
                </p>
                <p className="text-slate-50">
                  {birth.month || "—"} {birth.day || ""}{birth.day && ","} {birth.year || ""}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Solar Sign: <span className="font-semibold">{sign || "—"}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
              />
              <label htmlFor="agree" className="text-xs text-slate-300">
                I understand this NUMA Band will be linked to my account and used to open my dashboard.
              </label>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-700/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(2);
                }}
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition-colors"
              >
                {submitting ? "Linking & Opening…" : "Finish Setup & Open Dashboard"}
              </button>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              If you’re not logged in, we’ll send you to create an account first, then bring you back here automatically.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
