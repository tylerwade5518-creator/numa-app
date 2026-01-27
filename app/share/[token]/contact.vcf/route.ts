// app/share/[token]/contact.vcf/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function clean(s?: string) {
  return (s || "").replace(/\r?\n/g, " ").trim();
}

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

function normalizeX(s?: string) {
  if (!s) return "";
  const v = s.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const h = cleanHandle(v);
  if (!h) return "";
  return `https://x.com/${h}`;
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
  const digits = onlyDigits(s);
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function normalizeSnapchat(s?: string) {
  const h = cleanHandle(s);
  if (!h) return "";
  return `https://www.snapchat.com/add/${h}`;
}

function normalizeVenmo(s?: string) {
  const h = cleanHandle(s);
  if (!h) return "";
  return `https://venmo.com/u/${h}`;
}

function normalizeCashApp(s?: string) {
  const tag = (s || "").replace(/^\$/, "").trim();
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

function setFromArray(arr: any[]): Set<string> {
  return new Set(
    (arr || [])
      .map((x) => (typeof x === "string" ? x.trim().toLowerCase() : ""))
      .filter(Boolean)
  );
}

// Better iPhone parsing when FN + N exist.
// We'll do a simple N= (Lastname;Firstname;;;) if possible, else empty pieces.
function buildN(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ";;;;";
  if (parts.length === 1) return `;${parts[0]};;;`; // first name only
  const last = parts[parts.length - 1];
  const first = parts.slice(0, -1).join(" ");
  return `${last};${first};;;`;
}

function buildVCard(opts: {
  fullName: string;
  phone?: string;
  email?: string;
  website?: string;
  urls?: Array<{ label: string; url: string }>;
}) {
  const lines: string[] = [];
  const full = clean(opts.fullName) || "NUMA Contact";

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");
  lines.push(`FN:${full}`);
  lines.push(`N:${buildN(full)}`);

  // These are the lines that should populate Phone/Email on iOS/Android
  if (opts.phone) lines.push(`TEL;TYPE=CELL,VOICE:${clean(opts.phone)}`);
  if (opts.email) lines.push(`EMAIL;TYPE=INTERNET:${clean(opts.email)}`);
  if (opts.website) lines.push(`URL:${clean(opts.website)}`);

  // Add extra URLs (socials/payments). Many clients import these as website/links.
  let idx = 1;
  for (const u of opts.urls || []) {
    idx += 1;
    lines.push(`item${idx}.URL:${clean(u.url)}`);
    lines.push(`item${idx}.X-ABLabel:${clean(u.label)}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const resolved = await params;
  const token = String(resolved?.token || "").trim();
  if (!token) return new NextResponse("Missing token", { status: 400 });

  const nowIso = new Date().toISOString();

  // Allow "used" tokens too (because the Share page marks them used before the user taps Save Contact)
  const { data: row, error } = await supabaseAdmin
    .from("share_tokens")
    .select("band_code, expires_at")
    .eq("token", token)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (error || !row?.band_code) {
    return new NextResponse("Share expired", { status: 410 });
  }

  const bandCode = String(row.band_code).trim();

  // Read selected fields (if still present). If empty, we’ll fallback to common fields.
  const { data: state } = await supabaseAdmin
    .from("band_state")
    .select("tapshare_fields")
    .eq("band_id", bandCode)
    .maybeSingle();

  const selected = setFromArray(
    Array.isArray(state?.tapshare_fields) ? (state?.tapshare_fields as any[]) : []
  );

  // Pull owner profile
  const { data: band } = await supabaseAdmin
    .from("bands")
    .select("owner_user_id")
    .eq("band_code", bandCode)
    .maybeSingle();

  const ownerUserId = band?.owner_user_id ?? null;

  let prof: any = null;
  if (ownerUserId) {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", ownerUserId)
      .maybeSingle();
    prof = data || null;
  }

  const fullName = pickName(prof) || "NUMA Contact";

  // Helper: treat as allowed if selected includes it, OR if selection is empty (fallback mode).
  const allow = (key: string) => selected.size === 0 || selected.has(key);

  const phoneRaw = allow("phone")
    ? pickFirstString(prof, ["phone", "phone_number", "mobile", "mobile_phone"])
    : "";
  const emailRaw = allow("email")
    ? pickFirstString(prof, ["email", "contact_email"])
    : "";
  const websiteRaw = allow("website")
    ? pickFirstString(prof, ["website", "site", "url"])
    : "";

  const website = websiteRaw ? normalizeWebsite(websiteRaw) : "";

  const urls: Array<{ label: string; url: string }> = [];

  if (allow("instagram")) {
    const h = cleanHandle(pickFirstString(prof, ["instagram", "ig", "instagram_handle"]));
    if (h) urls.push({ label: "Instagram", url: `https://instagram.com/${h}` });
  }

  if (allow("tiktok")) {
    const h = cleanHandle(pickFirstString(prof, ["tiktok", "tik_tok", "tiktok_handle"]));
    if (h) urls.push({ label: "TikTok", url: `https://www.tiktok.com/@${h}` });
  }

  if (allow("linkedin")) {
    const v = pickFirstString(prof, ["linkedin", "linked_in", "linkedin_url"]);
    const url = normalizeLinkedIn(v);
    if (url) urls.push({ label: "LinkedIn", url });
  }

  if (allow("x") || allow("twitter")) {
    const v = pickFirstString(prof, ["x", "twitter", "twitter_handle"]);
    const url = normalizeX(v);
    if (url) urls.push({ label: "X", url });
  }

  if (allow("youtube")) {
    const v = pickFirstString(prof, ["youtube", "yt", "youtube_url"]);
    const url = normalizeYouTube(v);
    if (url) urls.push({ label: "YouTube", url });
  }

  if (allow("whatsapp") || allow("wa")) {
    const v = pickFirstString(prof, ["whatsapp", "whats_app", "wa"]);
    const url = normalizeWhatsApp(v);
    if (url) urls.push({ label: "WhatsApp", url });
  }

  if (allow("snapchat")) {
    const v = pickFirstString(prof, ["snapchat", "snap"]);
    const url = normalizeSnapchat(v);
    if (url) urls.push({ label: "Snapchat", url });
  }

  if (allow("venmo")) {
    const v = pickFirstString(prof, ["venmo"]);
    const url = normalizeVenmo(v);
    if (url) urls.push({ label: "Venmo", url });
  }

  if (allow("cashapp") || allow("cash_app") || allow("cash")) {
    const v = pickFirstString(prof, ["cashapp", "cash_app", "cash"]);
    const url = normalizeCashApp(v);
    if (url) urls.push({ label: "Cash App", url });
  }

  const vcf = buildVCard({
    fullName,
    phone: phoneRaw ? phoneRaw : undefined,
    email: emailRaw ? emailRaw : undefined,
    website: website ? website : undefined,
    urls,
  });

  const filename =
    `${fullName.replace(/[^\w\- ]+/g, "").trim() || "NUMA-Contact"}.vcf`;

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
