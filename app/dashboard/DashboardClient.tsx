// app/dashboard/page.tsx
"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// ✅ Dynamic-load heavier visual modules (no visual change, faster initial boot)
const AnimatedSpaceBackground = dynamic(() => import("./AnimatedSpaceBackground"), {
  ssr: false,
});

const StardustScanCTA = dynamic(() => import("./StardustScanCTA"), {
  ssr: false,
});

// ✅ METERS REMOVED: VideoRingMeter is no longer used on dashboard
// const VideoRingMeter = dynamic(() => import("./VideoRingMeter"), { ssr: false });

// ✅ NEW: Instrument Panel (separate file for easy iteration)
const DailyInstrumentPanel = dynamic(() => import("./DailyInstrumentPanel"), {
  ssr: false,
});

const PinnedCard = dynamic(() => import("../components/PinnedCard").then((m) => m.PinnedCard), {
  ssr: false,
});

type CardId =
  | "architect"
  | "ascendant"
  | "ascension"
  | "ash"
  | "beacon"
  | "choice"
  | "conduit"
  | "core"
  | "crossing"
  | "drift"
  | "echo"
  | "entry"
  | "fracture"
  | "gravity"
  | "harbinger"
  | "ignition"
  | "imprint"
  | "lens"
  | "luminary"
  | "matter"
  | "navigator"
  | "oracle"
  | "outrider"
  | "pioneer"
  | "reckon"
  | "release"
  | "remain"
  | "reveal"
  | "root"
  | "seeker"
  | "sentinal"
  | "threshold";

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
type SyncStatus = "idle" | "syncing";

/* -------------------------------
   Planet Orb Button (animated video)
   ------------------------------- */

function PlanetOrbButton(props: {
  labelTop: string;
  labelBottom: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  hueRotateDeg?: number;
  saturate?: number;
  brightness?: number;
  contrast?: number;
  glowRGBA?: string;
  videoSrc?: string;
}) {
  const {
    labelTop,
    labelBottom,
    onClick,
    disabled,
    title,
    hueRotateDeg = 0,
    saturate = 1.15,
    brightness = 1.05,
    contrast = 1.1,
    glowRGBA = "rgba(250,204,21,0.55)",
    videoSrc = "/textures/planet-buttons.mp4",
  } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={`${labelTop} ${labelBottom}`}
      className={
        "planetOrb relative mt-1 flex h-24 w-24 items-center justify-center rounded-full text-center transition " +
        (disabled ? "cursor-not-allowed opacity-55" : "hover:brightness-110")
      }
      style={
        {
          ["--orbGlow" as any]: glowRGBA,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          // ✅ important: don’t block initial load with video fetch
          preload="none"
          style={{
            filter: `hue-rotate(${hueRotateDeg}deg) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`,
            transform: "scale(1.08)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full orbRim" />
      <div className="pointer-events-none absolute inset-0 rounded-full orbScrim" />

      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        <span className="orbTextTop">{labelTop}</span>
        <span className="orbTextBottom">{labelBottom}</span>
      </div>
    </button>
  );
}

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
            <h2 className="text-sm font-semibold text-slate-50">Ready to Share</h2>
            <p className="text-xs text-slate-300">
              Have them tap your band now. This share works once, then turns off.
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
              <span className="font-semibold text-sky-200">{secondsRemaining}s</span>
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
   Dashboard Inner
   ------------------------------- */

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

  const todayKey = useMemo(() => getLocalDayKey(), []);

  const [hasScannedToday, setHasScannedToday] = useState(false);
  const [pinnedCardSlug, setPinnedCardSlug] = useState<CardId | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARDUST_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StardustPersist;
      if (!parsed?.date) return;

      if (parsed.date !== todayKey) {
        localStorage.removeItem(STARDUST_STORAGE_KEY);
        return;
      }

      setPinnedCardSlug(parsed.pinnedCardSlug ?? null);
      setHasScannedToday(Boolean(parsed.hasScannedToday));
    } catch {
      localStorage.removeItem(STARDUST_STORAGE_KEY);
    }
  }, [todayKey]);

  const persistStardust = (next: Omit<StardustPersist, "date">) => {
    const payload: StardustPersist = { date: todayKey, ...next };
    localStorage.setItem(STARDUST_STORAGE_KEY, JSON.stringify(payload));
  };

  // ✅ Lazy-load card registry only when scan completes
  const startAnalysisFlow = async () => {
    if (hasScannedToday) return;

    const mod = await import("../../lib/cardRegistry");
    const CARD_REGISTRY = mod.CARD_REGISTRY as Record<string, any>;
    const ids = Object.keys(CARD_REGISTRY) as CardId[];
    const chosen = ids[Math.floor(Math.random() * ids.length)];
    const picked = CARD_REGISTRY[chosen];

    setPinnedCardSlug(chosen);
    setHasScannedToday(true);

    persistStardust({
      pinnedCardSlug: chosen,
      hasScannedToday: true,
      stardustCardName: picked?.title ?? String(chosen).toUpperCase(),
      stardustTagline: picked?.StardustAction ?? "Your Stardust Action is set.",
    });
  };

  /* -------------------------------
     Tap Share state + Supabase sync
     ✅ Lazy-load Supabase SDK only when needed
     ------------------------------- */

  const [showTapShare, setShowTapShare] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<TapShareProfile>("none");
  const [selectedFields, setSelectedFields] = useState<Set<TapShareField>>(() => new Set());

  const [isArmed, setIsArmed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);

  const runningTurnOffRef = useRef(false);

  const syncTapShareToSupabase = async (next: {
    tapshare_armed: boolean;
    fields: TapShareField[];
    armed_until: Date | null;
  }) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    if (!bandId) {
      throw new Error("Missing band id. Open /dashboard?band=YOUR_BAND_ID at least once.");
    }

    // ✅ Import Supabase only when user uses Tap Share
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const payload = {
      band_id: bandId,
      tapshare_armed: next.tapshare_armed,
      tapshare_fields: next.fields,
      tapshare_armed_until: next.armed_until ? next.armed_until.toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(BAND_STATE_TABLE).upsert(payload, { onConflict: "band_id" });

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
      setSyncError(e?.message || "Arm failed. Check band id + Supabase configuration.");
      setIsArmed(false);
      setSecondsRemaining(60);
    }
  };

  const turnOffAndSyncSilent = async () => {
    if (runningTurnOffRef.current) return;
    runningTurnOffRef.current = true;

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
      setSyncError(e?.message || "Turn off failed. Check band id + Supabase configuration.");
    } finally {
      runningTurnOffRef.current = false;
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

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const closeSettingsMenu = () => setShowSettingsMenu(false);

  // Lazy-load card registry for rendering pinned card (only if needed)
  const [cardRegistryCache, setCardRegistryCache] = useState<any>(null);
  useEffect(() => {
    if (!pinnedCardSlug) return;
    let alive = true;
    (async () => {
      const mod = await import("../../lib/cardRegistry");
      if (!alive) return;
      setCardRegistryCache(mod.CARD_REGISTRY);
    })();
    return () => {
      alive = false;
    };
  }, [pinnedCardSlug]);

  const pinnedCard = pinnedCardSlug && cardRegistryCache ? cardRegistryCache[pinnedCardSlug] : null;

  // ✅ Placeholder instrument values (we’ll wire real moon phase later)
  const moonPhaseLabel = "Waxing Crescent";
  const toneName = "Midnight Gold";
  const toneHex = "#D6B35A";
  const signalNumber = 7;

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
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">NUMA BAND</p>
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Tyler – Aquarius</h1>
              <p className="text-xs text-slate-300 sm:text-sm">Born Feb 5 • Today’s Alignment</p>

              {bandId ? (
                <p className="text-[11px] text-slate-400">
                  Band ID: <span className="font-semibold text-slate-200">{bandId}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Tap Share needs a band id. Open{" "}
                  <span className="font-semibold text-slate-400">/dashboard?band=YOUR_BAND_ID</span>.
                </p>
              )}
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

          {/* MAIN HOROSCOPE CARD */}
          <section>
            <div className="relative overflow-hidden rounded-3xl border border-yellow-200/45 shadow-[0_0_45px_rgba(15,23,42,0.9)]">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
              <div className="relative space-y-5 p-6 sm:p-7">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/95">
                    Today’s Alignment
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                    Quiet Confidence in Motion
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-100/95">
                    Today favors calm, deliberate moves instead of big dramatic swings. Keep your plans
                    simple, follow through once, and let your quiet consistency stand out on its own.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <p className="text-[12px] text-slate-100/80">Based on today’s real sky positions.</p>
                  <p className="text-[12px] text-slate-300/80">
                    Tap your band any time today to reopen this reading.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ INSTRUMENT PANEL (replaces meters) */}
          <section>
            <DailyInstrumentPanel
              moonPhaseLabel={moonPhaseLabel}
              toneName={toneName}
              toneHex={toneHex}
              signalNumber={signalNumber}
            />
          </section>

          {/* STARDUST */}
          <section>
            <StardustScanCTA
              onScanComplete={() => {
                startAnalysisFlow();
              }}
              defaultState={hasScannedToday ? "scanned" : "idle"}
            />
          </section>

          {pinnedCardSlug && pinnedCard && (
            <section>
              <PinnedCard card={pinnedCard} />
            </section>
          )}

          {/* TAP SHARE + STAR SYNC */}
          <section className="pb-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-full rounded-3xl border border-yellow-200/60 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="flex h-full flex-col items-center text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-yellow-100/85">Tap Share</p>
                    <p className="text-xs text-slate-200">
                      Arm your band to share just the details you choose on your next tap.
                    </p>
                  </div>

                  <PlanetOrbButton
                    labelTop="TAP"
                    labelBottom="SHARE"
                    onClick={() => {
                      setShowTapShare(true);
                      setSyncError(null);
                      setIsArmed(false);
                      setSecondsRemaining(60);
                    }}
                    disabled={!bandId}
                    title={bandId ? "Open Tap Share" : "Open /dashboard?band=YOUR_BAND_ID first"}
                    hueRotateDeg={18}
                    saturate={1.18}
                    brightness={1.07}
                    contrast={1.12}
                    glowRGBA="rgba(250,204,21,0.55)"
                    videoSrc="/textures/planet-buttons.mp4"
                  />

                  <p className="text-[11px] text-slate-500">
                    One-armed share that turns off after a single tap—every tap is intentional.
                  </p>
                </div>
              </div>

              <div className="h-full rounded-3xl border border-sky-200/60 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-md shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                <div className="flex h-full flex-col items-center text-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/85">Star Sync</p>
                    <p className="text-xs text-slate-200">
                      Compare your sign’s alignment with someone else’s for today.
                    </p>
                  </div>

                  <PlanetOrbButton
                    labelTop="STAR"
                    labelBottom="SYNC"
                    onClick={() => router.push("/star-sync")}
                    hueRotateDeg={205}
                    saturate={1.12}
                    brightness={1.03}
                    contrast={1.1}
                    glowRGBA="rgba(56,189,248,0.55)"
                    videoSrc="/textures/planet-buttons.mp4"
                  />

                  <p className="text-[11px] text-slate-500">
                    Enter their sign or birthday—or have them tap their NUMA band to your phone—to see
                    how your energies align under today’s sky.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Global styles (unchanged) */}
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
        .metersTitle {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
        }
        .meterHead {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
        }
        .planetOrb {
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.65);
          transform: translateZ(0);
          will-change: transform, filter;
        }
        .planetOrb:hover {
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.65), 0 0 26px var(--orbGlow);
        }
        .orbRim {
          border: 1px solid rgba(255, 255, 255, 0.26);
          box-shadow: 0 0 18px var(--orbGlow), inset 0 0 18px rgba(255, 255, 255, 0.08);
        }
        .orbScrim {
          background: radial-gradient(
            circle at center,
            rgba(2, 6, 23, 0.68) 0%,
            rgba(2, 6, 23, 0.44) 38%,
            rgba(2, 6, 23, 0.12) 62%,
            rgba(2, 6, 23, 0) 78%
          );
        }
        .orbTextTop {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85);
        }
        .orbTextBottom {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85);
        }
      `}</style>

      {/* Tap Share overlay */}
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

      {/* Settings menu overlay (unchanged UI) */}
      {showSettingsMenu && (
        <div className="settings-overlay">
          <div className="settings-backdrop" onClick={closeSettingsMenu} />
          <div className="settings-sheet">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-500/40" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">NUMA Settings</p>
                <p className="text-sm font-semibold text-slate-50">Tune your profile and dashboard.</p>
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

export default function DashboardClient() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}
