// app/share/[token]/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// IMPORTANT: only safe on the server. Never import this file into client components.
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
  if (cleaned.startsWith("channel/") || cleaned.startsWith("c/") || cleaned.startsWith("user/")) {
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
  return pickFirstString(obj, ["display_name", "name", "full_name"]) || pickFirstString(obj, ["username"]);
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

export default async function ShareTokenPage({ params }: { params: { token: string } }) {
  const token = String(params.token || "").trim();
  const nowIso = new Date().toISOString();

  if (!token) {
    return (
      <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Share unavailable</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Missing token.</p>
      </div>
    );
  }

  // 1) Consume token ONLY if ACTIVE + not expired.
  // NOTE: share_tokens table uses band_code (NOT band_id)
  const { data: usedRow, error } = await supabaseAdmin
    .from("share_tokens")
    .update({
      status: "used",
      used_at: nowIso,
    })
    .eq("token", token)
    .eq("status", "active")
    .gt("expires_at", nowIso)
    .select("band_code")
    .maybeSingle();

  if (error) {
    return (
      <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Share unavailable</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Something went wrong loading this share.</p>
        <div style={{ marginTop: 12, color: "#ff6b6b" }}>{error.message}</div>
      </div>
    );
  }

  if (!usedRow?.band_code) {
    return (
      <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Share expired</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          This Share Tap link is no longer active. Ask them to re-arm Tap Share and tap again.
        </p>

        <div style={{ marginTop: 18 }}>
          <Link
            href="/buy"
            style={{
              display: "inline-block",
              padding: "12px 14px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            Get a NUMA Band
          </Link>
        </div>
      </div>
    );
  }

  const bandCode = String(usedRow.band_code).trim();

  // 2) Build snapshot from bands + band_state + profiles.
  let snapshot: Snapshot = {};

  try {
    // a) Get owner_user_id from bands by band_code
    const { data: band, error: bandErr } = await supabaseAdmin
      .from("bands")
      .select("band_code, owner_user_id")
      .eq("band_code", bandCode)
      .maybeSingle();

    if (bandErr) throw bandErr;

    const ownerUserId = band?.owner_user_id ?? null;

    // b) band_state keyed by band_id = band_code (your current schema)
    const { data: state, error: stateErr } = await supabaseAdmin
      .from("band_state")
      .select("tapshare_fields")
      .eq("band_id", bandCode)
      .maybeSingle();

    if (stateErr) throw stateErr;

    const selectedFieldsArr = Array.isArray(state?.tapshare_fields) ? (state?.tapshare_fields as any[]) : [];
    const fieldsObj = fieldsArrayToSnapshotFields(selectedFieldsArr);

    // c) profile values for owner
    let profileRow: any = null;
    if (ownerUserId) {
      const { data: prof, error: profErr } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("user_id", ownerUserId)
        .maybeSingle();

      if (profErr) throw profErr;
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

    // d) Disarm Tap Share immediately (one tap then off)
    await supabaseAdmin
      .from("band_state")
      .update({
        tapshare_armed: false,
        tapshare_fields: [],
        tapshare_armed_until: null,
      })
      .eq("band_id", bandCode);
  } catch {
    // fail closed / render safely below
  }

  const fields = snapshot.fields || {};
  const values = snapshot.values || {};

  const items: Array<{ label: string; value?: string; href?: string }> = [];

  if (fields.name && values.name) items.push({ label: "Name", value: values.name });

  if (fields.phone && values.phone) items.push({ label: "Phone", value: values.phone, href: `tel:${values.phone}` });

  if (fields.email && values.email) items.push({ label: "Email", value: values.email, href: `mailto:${values.email}` });

  if (fields.website && values.website) {
    const url = normalizeWebsite(values.website);
    if (url) items.push({ label: "Website", value: values.website, href: url });
  }

  if (fields.instagram && values.instagram) {
    const h = cleanHandle(values.instagram);
    if (h) items.push({ label: "Instagram", value: `@${h}`, href: `https://instagram.com/${h}` });
  }

  if (fields.tiktok && values.tiktok) {
    const h = cleanHandle(values.tiktok);
    if (h) items.push({ label: "TikTok", value: `@${h}`, href: `https://www.tiktok.com/@${h}` });
  }

  if (fields.linkedin && values.linkedin) {
    const url = normalizeLinkedIn(values.linkedin);
    if (url) items.push({ label: "LinkedIn", value: values.linkedin, href: url });
  }

  if (fields.x && values.x) {
    const url = normalizeX(values.x);
    const h = cleanHandle(values.x);
    if (url && h)
      items.push({
        label: "X",
        value: values.x.startsWith("@") ? values.x : `@${h}`,
        href: url,
      });
  }

  if (fields.youtube && values.youtube) {
    const url = normalizeYouTube(values.youtube);
    if (url) items.push({ label: "YouTube", value: values.youtube, href: url });
  }

  if (fields.whatsapp && values.whatsapp) {
    const url = normalizeWhatsApp(values.whatsapp);
    const digits = onlyDigits(values.whatsapp);
    const display = digits ? `+${digits}` : values.whatsapp;
    if (url) items.push({ label: "WhatsApp", value: display, href: url });
  }

  if (fields.snapchat && values.snapchat) {
    const h = cleanHandle(values.snapchat);
    const url = normalizeSnapchat(values.snapchat);
    if (url && h) items.push({ label: "Snapchat", value: `@${h}`, href: url });
  }

  if (fields.venmo && values.venmo) {
    const h = cleanHandle(values.venmo);
    const url = normalizeVenmo(values.venmo);
    if (url && h) items.push({ label: "Venmo", value: `@${h}`, href: url });
  }

  if (fields.cashapp && values.cashapp) {
    const tag = values.cashapp.replace(/^\$/, "").trim();
    const url = normalizeCashApp(values.cashapp);
    if (url && tag) items.push({ label: "Cash App", value: `$${tag}`, href: url });
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Shared from NUMA</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>Here’s what they chose to share.</p>

      <div
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
        }}
      >
        {items.length === 0 ? (
          <div style={{ opacity: 0.8 }}>
            Nothing was selected to share (or the profile fields are empty).
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((it) => (
              <div
                key={it.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ opacity: 0.75 }}>{it.label}</div>
                <div style={{ textAlign: "right" }}>
                  {it.href ? (
                    <a href={it.href} style={{ textDecoration: "underline" }} target="_blank" rel="noreferrer">
                      {it.value}
                    </a>
                  ) : (
                    <span>{it.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <a
            href={`/share/${encodeURIComponent(token)}/contact.vcf`}
            style={{
              display: "block",
              padding: "12px 14px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.16)",
              textAlign: "center",
            }}
          >
            Save Contact
          </a>

          <Link
            href="/buy"
            style={{
              display: "block",
              padding: "12px 14px",
              borderRadius: 10,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.16)",
              textAlign: "center",
            }}
          >
            Get a NUMA Band
          </Link>
        </div>
      </div>
    </div>
  );
}
