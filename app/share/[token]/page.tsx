// app/share/[token]/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Snapshot = {
  fields?: {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    website?: boolean;
    instagram?: boolean;
    tiktok?: boolean;
    linkedin?: boolean;
    x?: boolean;
    youtube?: boolean;
    whatsapp?: boolean;
    snapchat?: boolean;
    venmo?: boolean;
    cashapp?: boolean;
  };
  values?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
    whatsapp?: string;
    snapchat?: string;
    venmo?: string;
    cashapp?: string;
  };
  band_code?: string;
};

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
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

function cleanHandle(s?: string) {
  if (!s) return "";
  return s.replace(/^@/, "").trim();
}

function onlyDigits(s?: string) {
  if (!s) return "";
  return s.replace(/[^\d]/g, "");
}

function normalizeWebsite(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function normalizeLinkedIn(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.includes("linkedin.com/")) return `https://${v.replace(/^\/+/, "")}`;
  const handle = v.replace(/^@/, "").trim();
  if (!handle) return "";
  return `https://www.linkedin.com/in/${handle}`;
}

function normalizeX(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const h = cleanHandle(v);
  if (!h) return "";
  return `https://x.com/${h}`;
}

function normalizeYouTube(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  const cleaned = v.replace(/^\/+/, "");
  if (cleaned.startsWith("@")) return `https://www.youtube.com/${cleaned}`;
  if (
    cleaned.startsWith("channel/") ||
    cleaned.startsWith("c/") ||
    cleaned.startsWith("user/")
  ) {
    return `https://www.youtube.com/${cleaned}`;
  }
  const h = cleanHandle(cleaned);
  if (!h) return "";
  return `https://www.youtube.com/@${h}`;
}

function normalizeWhatsApp(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const digits = onlyDigits(v);
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function normalizeSnapchat(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const h = cleanHandle(v);
  if (!h) return "";
  return `https://www.snapchat.com/add/${h}`;
}

function normalizeVenmo(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const h = cleanHandle(v);
  if (!h) return "";
  return `https://venmo.com/u/${h}`;
}

function normalizeCashApp(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const tag = v.replace(/^\$/, "").trim();
  if (!tag) return "";
  return `https://cash.app/$${tag}`;
}

function pickFirstString(obj: any, keys: string[]): string {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickName(obj: any): string {
  return (
    pickFirstString(obj, ["display_name", "name", "full_name"]) ||
    pickFirstString(obj, ["username"])
  );
}

function pickPhone(obj: any): string {
  return pickFirstString(obj, ["phone", "phone_number", "mobile", "mobile_phone"]);
}

function pickEmail(obj: any): string {
  return pickFirstString(obj, ["email", "contact_email"]);
}

function pickWebsite(obj: any): string {
  return pickFirstString(obj, ["website", "site", "url"]);
}

function pickInstagram(obj: any): string {
  return pickFirstString(obj, ["instagram", "ig", "instagram_handle"]);
}

function pickTikTok(obj: any): string {
  return pickFirstString(obj, ["tiktok", "tik_tok", "tiktok_handle"]);
}

function pickLinkedIn(obj: any): string {
  return pickFirstString(obj, ["linkedin", "linked_in", "linkedin_url"]);
}

function pickX(obj: any): string {
  return pickFirstString(obj, ["x", "twitter", "twitter_handle"]);
}

function pickYouTube(obj: any): string {
  return pickFirstString(obj, ["youtube", "yt", "youtube_url"]);
}

function pickWhatsApp(obj: any): string {
  return pickFirstString(obj, ["whatsapp", "whats_app", "wa"]);
}

function pickSnapchat(obj: any): string {
  return pickFirstString(obj, ["snapchat", "snap"]);
}

function pickVenmo(obj: any): string {
  return pickFirstString(obj, ["venmo"]);
}

function pickCashApp(obj: any): string {
  return pickFirstString(obj, ["cashapp", "cash_app", "cash"]);
}

function fieldsArrayToSnapshotFields(arr: any[]): Snapshot["fields"] {
  const set = new Set(
    (arr || [])
      .map((x) => (typeof x === "string" ? x.trim().toLowerCase() : ""))
      .filter(Boolean)
  );

  return {
    name: set.has("name"),
    phone: set.has("phone"),
    email: set.has("email"),
    website: set.has("website"),
    instagram: set.has("instagram"),
    tiktok: set.has("tiktok"),
    linkedin: set.has("linkedin"),
    x: set.has("x") || set.has("twitter"),
    youtube: set.has("youtube"),
    whatsapp: set.has("whatsapp") || set.has("wa"),
    snapchat: set.has("snapchat"),
    venmo: set.has("venmo"),
    cashapp: set.has("cashapp") || set.has("cash_app") || set.has("cash"),
  };
}

export default async function ShareTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolved = await params;
  const token = String(resolved?.token || "").trim();
  const nowIso = new Date().toISOString();

  const baseShell = (title: string, message: string, extra?: React.ReactNode) => (
    <div className="min-h-screen bg-black text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(250,204,21,0.18),transparent_42%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.18),transparent_45%)]" />
      <div className="fixed inset-0 opacity-40 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.0),rgba(2,6,23,0.95))]" />
      <main className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-10">
        <div className="mb-5 flex items-center justify-center">
          <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200">
            NUMA • Tap Share
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.55)]">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-slate-300">{message}</p>
          {extra ? <div className="mt-4">{extra}</div> : null}
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Shared once, then automatically turns off.
        </div>
      </main>
    </div>
  );

  if (!token) {
    return baseShell("Share unavailable", "Missing token. The link should look like /share/<token>.");
  }

  // Consume token only if active + not expired
  const { data: usedRow, error } = await supabaseAdmin
    .from("share_tokens")
    .update({ status: "used" })
    .eq("token", token)
    .eq("status", "active")
    .gt("expires_at", nowIso)
    .select("band_code")
    .maybeSingle();

  if (error) {
    return baseShell(
      "Share unavailable",
      "Something went wrong loading this share.",
      <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-xs text-red-200">
        {error.message}
      </div>
    );
  }

  if (!usedRow?.band_code) {
    return baseShell(
      "Share expired",
      "This Share Tap link is no longer active. Ask them to re-arm Tap Share and tap again.",
      <Link
        href="/buy"
        className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-2.5 text-sm hover:bg-slate-900/80"
      >
        Get a NUMA Band
      </Link>
    );
  }

  const bandCode = String(usedRow.band_code).trim();

  // Build snapshot
  let snapshot: Snapshot = {};

  try {
    const { data: band } = await supabaseAdmin
      .from("bands")
      .select("band_code, owner_user_id")
      .eq("band_code", bandCode)
      .maybeSingle();

    const ownerUserId = band?.owner_user_id ?? null;

    const { data: state } = await supabaseAdmin
      .from("band_state")
      .select("tapshare_fields")
      .eq("band_id", bandCode)
      .maybeSingle();

    const selectedFieldsArr = Array.isArray(state?.tapshare_fields)
      ? (state?.tapshare_fields as any[])
      : [];

    const fieldsObj = fieldsArrayToSnapshotFields(selectedFieldsArr);

    let profileRow: any = null;
    if (ownerUserId) {
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("user_id", ownerUserId)
        .maybeSingle();
      profileRow = prof || null;
    }

    const valuesObj: Snapshot["values"] = {
      name: pickName(profileRow),
      phone: pickPhone(profileRow),
      email: pickEmail(profileRow),
      website: pickWebsite(profileRow),
      instagram: pickInstagram(profileRow),
      tiktok: pickTikTok(profileRow),
      linkedin: pickLinkedIn(profileRow),
      x: pickX(profileRow),
      youtube: pickYouTube(profileRow),
      whatsapp: pickWhatsApp(profileRow),
      snapchat: pickSnapchat(profileRow),
      venmo: pickVenmo(profileRow),
      cashapp: pickCashApp(profileRow),
    };

    snapshot = {
      band_code: bandCode,
      fields: fieldsObj,
      values: valuesObj,
    };

    // Disarm after share
    await supabaseAdmin
      .from("band_state")
      .update({
        tapshare_armed: false,
        tapshare_armed_until: null,
      })
      .eq("band_id", bandCode);
  } catch {
    // fail closed
  }

  const fields = snapshot.fields || {};
  const values = snapshot.values || {};

  const items: Array<{ key: string; label: string; value?: string; href?: string }> = [];

  if (fields.name && values.name) items.push({ key: "name", label: "Name", value: values.name });

  if (fields.phone && values.phone)
    items.push({ key: "phone", label: "Phone", value: values.phone, href: `tel:${values.phone}` });

  if (fields.email && values.email)
    items.push({ key: "email", label: "Email", value: values.email, href: `mailto:${values.email}` });

  if (fields.website && values.website) {
    const url = normalizeWebsite(values.website);
    if (url) items.push({ key: "website", label: "Website", value: values.website, href: url });
  }

  if (fields.instagram && values.instagram) {
    const h = cleanHandle(values.instagram);
    if (h) items.push({ key: "instagram", label: "Instagram", value: `@${h}`, href: `https://instagram.com/${h}` });
  }

  if (fields.tiktok && values.tiktok) {
    const h = cleanHandle(values.tiktok);
    if (h) items.push({ key: "tiktok", label: "TikTok", value: `@${h}`, href: `https://www.tiktok.com/@${h}` });
  }

  if (fields.linkedin && values.linkedin) {
    const url = normalizeLinkedIn(values.linkedin);
    if (url) items.push({ key: "linkedin", label: "LinkedIn", value: values.linkedin, href: url });
  }

  if (fields.x && values.x) {
    const url = normalizeX(values.x);
    const h = cleanHandle(values.x);
    if (url && h) items.push({ key: "x", label: "X", value: values.x.startsWith("@") ? values.x : `@${h}`, href: url });
  }

  if (fields.youtube && values.youtube) {
    const url = normalizeYouTube(values.youtube);
    if (url) items.push({ key: "youtube", label: "YouTube", value: values.youtube, href: url });
  }

  if (fields.whatsapp && values.whatsapp) {
    const url = normalizeWhatsApp(values.whatsapp);
    const digits = onlyDigits(values.whatsapp);
    const display = digits ? `+${digits}` : values.whatsapp;
    if (url) items.push({ key: "whatsapp", label: "WhatsApp", value: display, href: url });
  }

  if (fields.snapchat && values.snapchat) {
    const h = cleanHandle(values.snapchat);
    const url = normalizeSnapchat(values.snapchat);
    if (url && h) items.push({ key: "snapchat", label: "Snapchat", value: `@${h}`, href: url });
  }

  if (fields.venmo && values.venmo) {
    const h = cleanHandle(values.venmo);
    const url = normalizeVenmo(values.venmo);
    if (url && h) items.push({ key: "venmo", label: "Venmo", value: `@${h}`, href: url });
  }

  if (fields.cashapp && values.cashapp) {
    const tag = values.cashapp.replace(/^\$/, "").trim();
    const url = normalizeCashApp(values.cashapp);
    if (url && tag) items.push({ key: "cashapp", label: "Cash App", value: `$${tag}`, href: url });
  }

  const displayTitle = values.name ? values.name : "Shared from NUMA";

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(250,204,21,0.18),transparent_42%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.18),transparent_45%)]" />
      <div className="fixed inset-0 opacity-40 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.0),rgba(2,6,23,0.95))]" />

      <main className="relative mx-auto max-w-xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200">
            NUMA • Tap Share
          </div>
          {snapshot.band_code ? (
            <div className="text-[11px] text-slate-400">
              Band: <span className="font-semibold text-slate-200">{snapshot.band_code}</span>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.55)]">
          <h1 className="text-xl font-semibold">{displayTitle}</h1>
          <p className="mt-2 text-sm text-slate-300">Here’s what they chose to share.</p>

          <div className="mt-5 grid gap-3">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                Nothing was selected to share (or the profile fields are empty).
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={it.key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="text-[12px] uppercase tracking-[0.18em] text-slate-400">
                    {it.label}
                  </div>
                  <div className="text-right text-sm text-slate-100">
                    {it.href ? (
                      <a
                        href={it.href}
                        className="underline decoration-white/20 underline-offset-4 hover:decoration-white/60"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {it.value}
                      </a>
                    ) : (
                      <span>{it.value}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href={`/share/${encodeURIComponent(token)}/contact.vcf`}
              className="flex items-center justify-center rounded-2xl border border-yellow-200/60 bg-gradient-to-r from-yellow-400/95 via-amber-300/95 to-yellow-200/95 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(250,204,21,0.45)] hover:brightness-110"
            >
              Save Contact
            </a>

            <Link
              href="/buy"
              className="flex items-center justify-center rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 hover:bg-slate-900/80"
            >
              Get a NUMA Band
            </Link>
          </div>

          <div className="mt-5 text-center text-[11px] text-slate-500">
            Shared once, then automatically turns off.
          </div>
        </div>
      </main>
    </div>
  );
}
