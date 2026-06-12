// app/dashboard/page.tsx
"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "../../lib/supabase/client";
import AnimatedSpaceBackground from "./AnimatedSpaceBackground";

/** Moon phase / daily instrument panel (top widget) */
import DailyInstrumentPanel from "./DailyInstrumentPanel";

/** Stardust Action Card registry + pinned renderer */
import { CARD_REGISTRY, type CardId } from "../../lib/cardRegistry";
import { PinnedCard } from "../components/PinnedCard";
import StardustScanCTA from "./StardustScanCTA";


/** Video ring meters */
import VideoRingMeter from "./VideoRingMeter";

/* -------------------------------
   Supabase client (client-side)
   ------------------------------- */

function getSupabase(): SupabaseClient | null {
  return createSupabaseBrowser();
}

/**
 * Supabase table:
 * public.band_state
 * columns:
 * - band_id (text PK)
 * - tapshare_armed (bool)
 * - tapshare_fields (jsonb)
 * - tapshare_armed_until (timestamptz)
 * - updated_at (timestamptz)
 */
const BAND_STATE_TABLE = "band_state";
const LAST_BAND_STORAGE_KEY = "numa:lastBandId";

/* -------------------------------
   Tap Share types
   ------------------------------- */

type TapShareField =
  | "phone"
  | "email"
  | "website"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "x"
  | "youtube"
  | "whatsapp"
  | "snapchat"
  | "venmo"
  | "cashapp";

const TAP_SHARE_FIELD_LABELS: Record<TapShareField, string> = {
  phone: "Phone",
  email: "Email",
  website: "Website",
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  snapchat: "Snapchat",
  venmo: "Venmo",
  cashapp: "Cash App",
};

type TapShareProfile = "none" | "social" | "business";

/* -------------------------------
   Tap Share Sheet
   ------------------------------- */

interface TapShareSheetProps {
  selectedProfile: TapShareProfile;
  selectedFields: Set<TapShareField>;
  onProfileChange: (profile: TapShareProfile) => void;
  onFieldToggle: (field: TapShareField) => void;
  onArm: () => void;
  onClose: () => void;
  syncing: boolean;
  syncError: string | null;
}

function TapShareSheet({
  selectedProfile,
  selectedFields,
  onProfileChange,
  onFieldToggle,
  onArm,
  onClose,
  syncing,
  syncError,
}: TapShareSheetProps) {
  const isFieldSelected = (field: TapShareField) => selectedFields.has(field);

  const orderedFields: TapShareField[] = [
    "phone",
    "email",
    "website",
    "instagram",
    "tiktok",
    "snapchat",
    "whatsapp",
    "linkedin",
    "x",
    "youtube",
    "venmo",
    "cashapp",
  ];

  return (
    <div className="tapshare-overlay">
      <div className="tapshare-backdrop" onClick={onClose} />

      <div className="tapshare-sheet">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-500/40" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">Tap Share</h2>
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

        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Quick profiles
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                onProfileChange(selectedProfile === "social" ? "none" : "social")
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
                TikTok, Instagram, Snapchat
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
                Email, Website, LinkedIn
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Or choose individually
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {orderedFields.map((field) => {
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
            })}
          </div>
        </div>

        <div className="mt-5 space-y-1.5">
          <button
            type="button"
            onClick={onArm}
            disabled={selectedFields.size === 0 || syncing}
            className={
              "flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition " +
              (selectedFields.size === 0 || syncing
                ? "cursor-not-allowed border border-slate-700 bg-slate-900 text-slate-500"
                : "border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:brightness-110")
            }
          >
            {syncing ? "Arming…" : "Arm Band for Next Tap"}
          </button>
          <p className="text-[11px] text-slate-400">
            Shares only the selected details once, then turns off.
          </p>

          {syncError && (
            <div className="mt-2 rounded-2xl border border-red-300/25 bg-red-500/10 p-2 text-[11px] text-slate-200">
              {syncError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------
   Armed state
   ------------------------------- */

interface TapShareArmedProps {
  selectedFields: Set<TapShareField>;
  secondsRemaining: number;
  onCancel: () => void;
  syncing: boolean;
  syncError: string | null;
}

function TapShareArmedState({
  selectedFields,
  secondsRemaining,
  onCancel,
  syncing,
  syncError,
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
              <span className="text-xs font-semibold text-sky-100">Tap</span>
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
              disabled={syncing}
              className={
                "w-full rounded-2xl border px-4 py-2.5 text-xs font-medium transition " +
                (syncing
                  ? "cursor-not-allowed border-slate-700 bg-slate-900/90 text-slate-500"
                  : "border-slate-500 bg-slate-900/90 text-slate-200 hover:bg-slate-800/90")
              }
            >
              {syncing ? "Canceling…" : "Cancel Share"}
            </button>

            {syncError && (
              <div className="mt-2 rounded-2xl border border-red-300/25 bg-red-500/10 p-2 text-[11px] text-slate-200">
                {syncError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------
   Stardust persistence
   ------------------------------- */

type StardustPersist = {
  date: string;
  pinnedCardSlug: CardId | null;
  hasScannedToday: boolean;
  stardustCardName: string | null;
  stardustTagline: string | null;
};

const STARDUST_STORAGE_KEY = "numa:stardust:today";

function getLocalDayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* -------------------------------
   Daily JSON types + helpers
   ------------------------------- */

type DailyJson = {
  schemaVersion?: number;
  date?: string;
  sky?: {
    moonPhaseLabel?: string | null;
    moonSignLabel?: string | null;
  };
  signs?: Record<
    string,
    {
      horoscope?: { title?: string | null; summary?: string | null };
      meters?: { energy?: number; connection?: number; flow?: number };
      metersHero?: string | null;
    }
  >;
};

function clamp01(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function asPct01(n: unknown) {
  // supports either 0..1 or 0..100 in JSON
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  if (v > 1.01) return clamp01(v / 100);
  return clamp01(v);
}

/* -------------------------------
   Dashboard Inner
   ------------------------------- */

type SyncStatus = "idle" | "syncing";

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bandIdFromUrl = searchParams.get("band") || "";
  const [bandId, setBandId] = useState<string>("");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(LAST_BAND_STORAGE_KEY) || ""
        : "";
    const resolved = (bandIdFromUrl || stored || "").trim();
    setBandId(resolved);
    if (resolved) localStorage.setItem(LAST_BAND_STORAGE_KEY, resolved);
  }, [bandIdFromUrl]);

 const bandName = "NUMA BAND";

const [displayName, setDisplayName] = useState("NUMA Explorer");
const [sign, setSign] = useState("Aquarius");
const [birthday, setBirthday] = useState("");

const todayLabel = "Today’s Alignment";

useEffect(() => {
  let cancelled = false;

  async function loadProfile() {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    

    if (!user) return;

    const res = await fetch(
  `/api/profile?userId=${encodeURIComponent(user.id)}`,
  {
    cache: "no-store",
  }
);

const json = await res.json().catch(() => null);

if (!res.ok || !json?.ok || cancelled) {
  console.log("PROFILE FETCH FAILED:", res.status, json);

  return;
}

const profile = json.profile;

    const profileDisplayName =
      (profile.display_name || profile.username || "NUMA Explorer").trim();

    const profileSign = (profile.sign || "Aquarius").trim();

    let birthdayLabel = "";
    if (profile.birthdate) {
      const d = new Date(profile.birthdate + "T00:00:00");
      birthdayLabel = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    setDisplayName(profileDisplayName);
    setSign(profileSign);
    setBirthday(birthdayLabel);

    if (profile.band_code && !bandIdFromUrl) {
      setBandId(profile.band_code);
      localStorage.setItem(LAST_BAND_STORAGE_KEY, profile.band_code);
    }
  }

  loadProfile();

  return () => {
    cancelled = true;
  };
}, [bandIdFromUrl]);

  // ✅ Daily JSON state
  const [daily, setDaily] = useState<DailyJson | null>(null);

  // ✅ Fetch daily.json (cache-busted so edits show immediately)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/daily?ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as DailyJson;
        if (!cancelled) setDaily(data);
      } catch {
        // ignore (fallbacks below will render)
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signBlock = useMemo(() => {
  const rawSign = String(sign || "").trim();
  const lowerSign = rawSign.toLowerCase();
  const titleSign =
    rawSign.charAt(0).toUpperCase() + rawSign.slice(1).toLowerCase();

  return (
    daily?.signs?.[lowerSign] ??
    daily?.signs?.[titleSign] ??
    daily?.signs?.[rawSign] ??
    null
  );
}, [daily, sign]);

  // ✅ Horoscope from JSON (fallback to your previous hardcoded values)
  const horoscopeTitle =
  (
    signBlock?.horoscope?.title ??
    (signBlock as any)?.title ??
    ""
  ).trim() || "Quiet Confidence in Motion";

const horoscopeSummary =
  (
    signBlock?.horoscope?.summary ??
    (signBlock as any)?.summary ??
    ""
  ).trim() ||
  "Today favors calm, deliberate moves instead of big dramatic swings. Keep your plans simple,";

  // ✅ Meters from JSON (0..100 or 0..1 supported), fallbacks stay sane
  const energyLevel = asPct01(signBlock?.meters?.energy ?? 0.86);
  const connectionLevel = asPct01(signBlock?.meters?.connection ?? 0.48);
  const flowLevel = asPct01(signBlock?.meters?.flow ?? 0.62);

  // ✅ Meters hero title (replaces "Daily Meters")
  const energyPct = Math.round(energyLevel * 100);
const connectionPct = Math.round(connectionLevel * 100);
const flowPct = Math.round(flowLevel * 100);

let metersHero = "Today's strongest signal";

if (
  energyPct >= connectionPct &&
  energyPct >= flowPct
) {
  metersHero = "Energy is strong. Make moves.";
} else if (
  connectionPct >= energyPct &&
  connectionPct >= flowPct
) {
  metersHero = "Connection is strong. Reach out.";
} else {
  metersHero = "Flow is strong. Trust timing.";
}

  const todayKey = useMemo(() => getLocalDayKey(), []);

  /* Stardust */
  const [hasScannedToday, setHasScannedToday] = useState(false);
  const [stardustCardName, setStardustCardName] = useState<string | null>(null);
  const [stardustTagline, setStardustTagline] = useState<string | null>(null);
  const [pinnedCardSlug, setPinnedCardSlug] = useState<CardId | null>(null);

  /* In-dashboard analysis flow */
  const [analysisStep, setAnalysisStep] = useState<
    "idle" | "horoscope" | "meters" | "sky" | "reveal"
  >("idle");

  const analyzing = analysisStep !== "idle";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARDUST_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as any;
      if (!parsed?.date) return;

      if (parsed.date !== todayKey) {
        localStorage.removeItem(STARDUST_STORAGE_KEY);
        return;
      }

      setPinnedCardSlug(parsed.pinnedCardSlug ?? null);
      setHasScannedToday(Boolean(parsed.hasScannedToday));
      setStardustCardName(parsed.stardustCardName ?? null);
      setStardustTagline(parsed.stardustTagline ?? null);
    } catch {
      localStorage.removeItem(STARDUST_STORAGE_KEY);
    }
  }, [todayKey]);

  const persistStardust = (next: Omit<any, "date">) => {
    const payload: any = { date: todayKey, ...next };
    localStorage.setItem(STARDUST_STORAGE_KEY, JSON.stringify(payload));
  };

  const startAnalysisFlow = () => {
    if (hasScannedToday) return;
    if (analysisStep !== "idle") return;

    setAnalysisStep("horoscope");

    const t1 = setTimeout(() => setAnalysisStep("meters"), 850);
    const t2 = setTimeout(() => setAnalysisStep("sky"), 1700);
    const t3 = setTimeout(() => setAnalysisStep("reveal"), 2550);

    const tDone = setTimeout(() => {
      const ids = Object.keys(CARD_REGISTRY) as CardId[];
      const chosen = ids[Math.floor(Math.random() * ids.length)];
      const picked = CARD_REGISTRY[chosen] as any;

      setPinnedCardSlug(chosen);
      setHasScannedToday(true);
      setStardustCardName(picked?.title ?? String(chosen).toUpperCase());
      setStardustTagline(
        picked?.StardustAction ?? "Your Stardust Action is set."
      );

      persistStardust({
        pinnedCardSlug: chosen,
        hasScannedToday: true,
        stardustCardName: picked?.title ?? String(chosen).toUpperCase(),
        stardustTagline:
          picked?.StardustAction ?? "Your Stardust Action is set.",
      });

      setAnalysisStep("idle");
    }, 3350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDone);
    };
  };

  /* -------------------------------
     Tap Share state + Supabase sync
     ------------------------------- */

  const [showTapShare, setShowTapShare] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<TapShareProfile>("none");
  const [selectedFields, setSelectedFields] = useState<Set<TapShareField>>(
    () => new Set()
  );

  const [isArmed, setIsArmed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncTapShareToSupabase = async (next: {
    tapshare_armed: boolean;
    fields: TapShareField[];
    armed_until: Date | null;
  }) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    if (!bandId) {
      throw new Error(
        "Missing band id. Open /dashboard?band=YOUR_BAND_ID at least once."
      );
    }

    const payload = {
      band_id: bandId,
      tapshare_armed: next.tapshare_armed,
      tapshare_fields: next.fields,
      tapshare_armed_until: next.armed_until
        ? next.armed_until.toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(BAND_STATE_TABLE)
      .upsert(payload, { onConflict: "band_id" });

    if (error) throw error;
  };

  const handleProfileChange = (profile: TapShareProfile) => {
    setSelectedProfile(profile);
    const newSet = new Set<TapShareField>();

    if (profile === "social") {
      newSet.add("instagram");
      newSet.add("tiktok");
      newSet.add("snapchat");
    } else if (profile === "business") {
      newSet.add("email");
      newSet.add("website");
      newSet.add("linkedin");
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

  const armAndSync = async () => {
    setSyncError(null);
    setSyncStatus("syncing");

    try {
      const armedUntil = new Date(Date.now() + 60 * 1000);

      setIsArmed(true);
      setSecondsRemaining(60);

      await syncTapShareToSupabase({
        tapshare_armed: true,
        fields: Array.from(selectedFields),
        armed_until: armedUntil,
      });

      setSyncStatus("idle");
    } catch (e: any) {
      setSyncStatus("idle");
      setSyncError(
        e?.message || "Arm failed. Check band id + Supabase configuration."
      );
      setIsArmed(false);
      setSecondsRemaining(60);
    }
  };

  const turnOffAndSyncSilent = async () => {
    setSyncError(null);
    setSyncStatus("syncing");

    try {
      setIsArmed(false);
      setSecondsRemaining(60);
      setShowTapShare(false);

      await syncTapShareToSupabase({
        tapshare_armed: false,
        fields: [],
        armed_until: null,
      });

      setSyncStatus("idle");
    } catch (e: any) {
      setSyncStatus("idle");
      setSyncError(
        e?.message || "Turn off failed. Check band id + Supabase configuration."
      );
    }
  };

  const handleArmBand = async () => {
    if (selectedFields.size === 0) return;
    await armAndSync();
  };

  const handleCancelShare = async () => {
    await turnOffAndSyncSilent();
  };

  useEffect(() => {
    if (!isArmed) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            turnOffAndSyncSilent().catch(() => {});
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArmed]);

  /* Settings menu state */
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const closeSettingsMenu = () => setShowSettingsMenu(false);

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
        <div className="pointer-events-none absolute inset-0 bg-slate-950/15" />
        <AnimatedSpaceBackground />

        <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
          <section className="flex items-start justify-between gap-3">
            <div className="space-y-1 text-left">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                {bandName}
              </p>
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                {displayName} – {sign}
              </h1>
              <p className="text-xs text-slate-300 sm:text-sm">
                {birthday ? `Born ${birthday} • ${todayLabel}` : todayLabel}
              </p>


             
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsMenu(true)}
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.9)] hover:bg-slate-900/90 hover:text-sky-100"
              aria-label="Open settings"
            >
              <span className="text-lg leading-none">⚙</span>
            </button>
          </section>

          {/* MOON PHASE / INSTRUMENT PANEL (TOP CONTAINER) */}
          <section>
            {/* Keep this as-is — you said moon phase + sign are already wired */}
            <DailyInstrumentPanel />
          </section>

         {/* MAIN HOROSCOPE CARD (NOW WIRED TO /api/daily) */}
<section className="-mt-8 relative z-20">
  <div className="relative rounded-3xl border border-yellow-200/45 bg-slate-950/40 p-6 sm:p-7 backdrop-blur-md shadow-[0_0_45px_rgba(15,23,42,0.9)]">
    <div className="relative space-y-5">
      
      <div className="space-y-1.5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/95">
          Today’s Alignment
        </p>
        <p className="text-xs sm:text-[13px] text-slate-100/90"></p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
          {horoscopeTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-slate-100/95">
          {horoscopeSummary}
        </p>
      </div>

      {/* Footer — shortened to one line so meters rise */}
      <div className="border-t border-white/10 pt-2">
        <p className="text-[12px] text-slate-100/80">
          Based on today’s real sky positions.
        </p>
      </div>

    </div>
  </div>
</section>


          {/* METERS (NOW WIRED TO daily.json) */}
          <section>
            <div className="relative">
              <div className="mb-4">
                {/* ✅ this now comes from daily.json per sign */}
                <p className="metersTitle">{metersHero}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-6 items-start py-2 overflow-visible">
                {/* ENERGY */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-1">
                    <div className="meterHead">ENERGY</div>
                    <div className="mt-0.5 text-[11px] text-slate-400/90">
                      Capacity to act
                    </div>
                  </div>

                  <VideoRingMeter
                    progress={energyLevel}
                    size={118}
                    directive="Make moves"
                    tickCount={10}
                    videoSrc="/textures/solar-flare-animated.mp4"
                    videoHueRotateDeg={0}
                  />
                </div>

                {/* CONNECTION */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-1">
                    <div className="meterHead">CONNECTION</div>
                    <div className="mt-0.5 text-[11px] text-slate-400/90">
                      Social resonance
                    </div>
                  </div>

                  <VideoRingMeter
                    progress={connectionLevel}
                    size={118}
                    directive="Reach out"
                    tickCount={10}
                    videoSrc="/textures/solar-flare-animated.mp4"
                    videoHueRotateDeg={305}
                  />
                </div>

                {/* THIRD METER (data key is flow in daily.json) */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-1">
                    <div className="meterHead">FLOW</div>
                    <div className="mt-0.5 text-[11px] text-slate-400/90">
                      Timing advantage
                    </div>
                  </div>

                  <VideoRingMeter
                    progress={flowLevel}
                    size={118}
                    directive="Get lucky"
                    tickCount={10}
                    videoSrc="/textures/solar-flare-animated.mp4"
                    videoHueRotateDeg={210}
                  />
                </div>
              </div>
            </div>
          </section>

       {/* STARDUST BUTTON / CARD */}
{(() => {
  // ✅ TS-safe: treat registry as a string-keyed map for lookup
  const registry = CARD_REGISTRY as Record<string, import("../../lib/cardRegistry").CardRecord>;

  const pinnedCard =
    typeof pinnedCardSlug === "string" && pinnedCardSlug.length > 0
      ? registry[pinnedCardSlug] ?? null
      : null;

  return (
    <>
      <section>
       <StardustScanCTA
  onScan={async () => {
    await Promise.resolve(startAnalysisFlow());
  }}
  scanned={Boolean(pinnedCard)}
/>

      </section>

      {pinnedCard && (
        <section className="mt-3">
          <PinnedCard card={pinnedCard} />
        </section>
      )}
    </>
  );
})()}




          {/* TAP SHARE + STAR SYNC */}
          <section className="pb-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* TAP SHARE CARD */}
              <div className="h-full rounded-3xl border border-yellow-200/60 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="flex h-full flex-col items-center text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-yellow-100/85">
                      Tap Share
                    </p>
                    <p className="text-xs text-slate-200">
                      Arm your band to share just the details you choose on your
                      next tap.
                    </p>
                  </div>

                  <button
  type="button"
  onClick={() => {
    setShowTapShare(true);
    setSyncError(null);
    setIsArmed(false);
    setSecondsRemaining(60);
  }}
  className="mt-1 flex h-24 w-24 items-center justify-center rounded-full border border-yellow-200/90 bg-yellow-300 bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-100 text-center text-slate-950 shadow-[0_0_32px_rgba(250,204,21,0.72)] transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
>
  <span className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
    Tap Share
  </span>
</button>
                  <p className="text-[11px] text-slate-500">
                    One-armed share that turns off after a single tap—every tap
                    is intentional.
                  </p>
                </div>
              </div>

              {/* STAR SYNC CARD */}
              <div className="h-full rounded-3xl border border-sky-200/60 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-md shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                <div className="flex h-full flex-col items-center text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/85">
                      Star Sync
                    </p>
                    <p className="text-xs text-slate-200">
                      Compare your sign’s alignment with someone else’s for
                      today.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/star-sync")}
                    className="mt-1 flex h-24 w-24 items-center justify-center rounded-full border border-sky-200/90 bg-gradient-to-br from-sky-500/95 via-cyan-400/95 to-sky-300/95 text-center shadow-[0_0_28px_rgba(56,189,248,0.7)] hover:brightness-110"
                  >
                    <span className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                      Star Sync
                    </span>
                  </button>

                  <p className="text-[11px] text-slate-500">
                    Enter their sign or birthday—or have them tap their NUMA
                    band to your phone—to see how your energies align under
                    today’s sky.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Global styles */}
      <style jsx global>{`
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

        /* meters typography tuning (unchanged) */
        .metersTitle {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.92);
        }

        .meterHead {
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.88);
        }

        /* Settings overlay */
        .settings-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .settings-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
        }

        .settings-sheet {
          position: relative;
          z-index: 60;
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
      `}</style>

      {/* Tap Share overlay (sheet or armed state) */}
      {showTapShare &&
        (!isArmed ? (
          <TapShareSheet
            selectedProfile={selectedProfile}
            selectedFields={selectedFields}
            onProfileChange={handleProfileChange}
            onFieldToggle={handleFieldToggle}
            onArm={async () => {
              if (selectedFields.size === 0) return;
              setSyncError(null);
              setSyncStatus("syncing");

              try {
                const armedUntil = new Date(Date.now() + 60 * 1000);
                setIsArmed(true);
                setSecondsRemaining(60);

                await syncTapShareToSupabase({
                  tapshare_armed: true,
                  fields: Array.from(selectedFields),
                  armed_until: armedUntil,
                });

                setSyncStatus("idle");
              } catch (e: any) {
                setSyncStatus("idle");
                setSyncError(
                  e?.message ||
                    "Arm failed. Check band id + Supabase configuration."
                );
                setIsArmed(false);
                setSecondsRemaining(60);
              }
            }}
            onClose={() => {
              setShowTapShare(false);
              setSyncError(null);
            }}
            syncing={syncStatus === "syncing"}
            syncError={syncError}
          />
        ) : (
          <TapShareArmedState
            selectedFields={selectedFields}
            secondsRemaining={secondsRemaining}
            onCancel={handleCancelShare}
            syncing={syncStatus === "syncing"}
            syncError={syncError}
          />
        ))}

      {/* Settings menu overlay */}
      {showSettingsMenu && (
        <div className="settings-overlay">
          <div className="settings-backdrop" onClick={closeSettingsMenu} />
          <div className="settings-sheet">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-500/40" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  NUMA Settings
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  Tune your profile and dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSettingsMenu}
                className="rounded-full border border-white/20 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800/90"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  closeSettingsMenu();
                  router.push("/settings/profile");
                }}
                className="w-full rounded-2xl border border-yellow-200/80 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-2.5 text-left text-sm font-semibold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.55)] hover:brightness-110"
              >
                Profile Settings
                <span className="block text-[11px] font-normal text-slate-900/80">
                  Name, @username, sign, and account details.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeSettingsMenu();
                  router.push("/settings/dashboard");
                }}
                className="w-full rounded-2xl border border-slate-400/70 bg-slate-900/90 px-4 py-2.5 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800/90"
              >
                Dashboard Layout
                <span className="block text-[11px] font-normal text-slate-300/95">
                  Choose which widgets appear when you tap your band.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------------
   Export default Page with Suspense boundary
   ------------------------------- */

export default function DashboardClient() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ opacity: 0.7 }}>Loading dashboard…</p>
        </main>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
