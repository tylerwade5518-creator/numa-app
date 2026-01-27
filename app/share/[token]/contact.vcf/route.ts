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
  if (cleaned.startsWith("channel/") || cleaned.startsWith("c/") || cleaned.startsWith("user/")) {
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

function fieldsFromArray(arr: any[]): Set<string> {
  return new Set(
    (arr || [])
      .map((x) => (typeof x === "string" ? x.trim().toLowerCase() : ""))
      .filter(Boolean)
  );
}

function buildVCard(opts: {
  fullName: string;
  phone?: string;
  email?: string;
  website?: string;
  socials?: Array<{ label: string; url: string }>;
}) {
  const lines: string[] = [];
  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");
  lines.push(`FN:${clean(opts.fullName)}`);

  if (opts.phone) lines.push(`TEL;TYPE=CELL:${clean(opts.phone)}`);
  if (opts.email) lines.push(`EMAIL;TYPE=INTERNET:${clean(opts.email)}`);
  if (opts.website) lines.push(`URL:${clean(opts.website)}`);

  for (const s of opts.socials || []) {
    // “itemX.URL” is widely supported; label goes into X-ABLabel
    lines.push(`item1.URL:${clean(s.url)}`);
    lines.push(`item1.X-ABLabel:${clean(s.label)}`);
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

  // IMPORTANT:
  // If your share page already set status=used, token will be "used" now.
  // So for VCF we allow both active and used, as long as it's not expired.
  const nowIso = new Date().toISOString();

  const { data: row, error } = await supabaseAdmin
    .from("share_tokens")
    .select("band_code, status, expires_at")
    .eq("token", token)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (error || !row?.band_code) {
    return new NextResponse("Share expired", { status: 410 });
  }

  const bandCode = String(row.band_code).trim();

  // Pull selected fields from band_state
  const { data: state } = await supabaseAdmin
    .from("band_state")
    .select("tapshare_fields")
    .eq("band_id", bandCode)
    .maybeSingle();

  const selected = fieldsFromArray(
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

  const phone = selected.has("phone")
    ? pickFirstString(prof, ["phone", "phone_number", "mobile", "mobile_phone"])
    : "";

  const email = selected.has("email")
    ? pickFirstString(prof, ["email", "contact_email"])
    : "";

  const websiteRaw = selected.has("website")
    ? pickFirstString(prof, ["website", "site", "url"])
    : "";
  const website = websiteRaw ? normalizeWebsite(websiteRaw) : "";

  const socials: Array<{ label: string; url: string }> = [];

  if (selected.has("instagram")) {
    const h = cleanHandle(pickFirstString(prof, ["instagram", "ig", "instagram_handle"]));
    if (h) socials.push({ label: "Instagram", url: `https://instagram.com/${h}` });
  }

  if (selected.has("tiktok")) {
    const h = cleanHandle(pickFirstString(prof, ["tiktok", "tik_tok", "tiktok_handle"]));
    if (h) socials.push({ label: "TikTok", url: `https://www.tiktok.com/@${h}` });
  }

  if (selected.has("linkedin")) {
    const v = pickFirstString(prof, ["linkedin", "linked_in", "linkedin_url"]);
    const url = normalizeLinkedIn(v);
    if (url) socials.push({ label: "LinkedIn", url });
  }

  if (selected.has("x") || selected.has("twitter")) {
    const v = pickFirstString(prof, ["x", "twitter", "twitter_handle"]);
    const url = normalizeX(v);
    if (url) socials.push({ label: "X", url });
  }

  if (selected.has("youtube")) {
    const v = pickFirstString(prof, ["youtube", "yt", "youtube_url"]);
    const url = normalizeYouTube(v);
    if (url) socials.push({ label: "YouTube", url });
  }

  if (selected.has("whatsapp") || selected.has("wa")) {
    const v = pickFirstString(prof, ["whatsapp", "whats_app", "wa"]);
    const url = normalizeWhatsApp(v);
    if (url) socials.push({ label: "WhatsApp", url });
  }

  if (selected.has("snapchat")) {
    const v = pickFirstString(prof, ["snapchat", "snap"]);
    const url = normalizeSnapchat(v);
    if (url) socials.push({ label: "Snapchat", url });
  }

  if (selected.has("venmo")) {
    const v = pickFirstString(prof, ["venmo"]);
    const url = normalizeVenmo(v);
    if (url) socials.push({ label: "Venmo", url });
  }

  if (selected.has("cashapp") || selected.has("cash_app") || selected.has("cash")) {
    const v = pickFirstString(prof, ["cashapp", "cash_app", "cash"]);
    const url = normalizeCashApp(v);
    if (url) socials.push({ label: "Cash App", url });
  }

  const vcf = buildVCard({
    fullName,
    phone: phone || undefined,
    email: email || undefined,
    website: website || undefined,
    socials,
  });

  const filename = `${fullName.replace(/[^\w\- ]+/g, "").trim() || "NUMA-Contact"}.vcf`;

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
