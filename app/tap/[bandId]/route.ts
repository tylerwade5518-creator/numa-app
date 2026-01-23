// app/tap/[bandId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Service role client (server-only). Make sure SUPABASE_SERVICE_ROLE_KEY is set.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: safe redirect
function redirectTo(path: string, req: Request) {
  return NextResponse.redirect(new URL(path, req.url));
}

// Helper: generate a token for /share/[token]
function makeShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// NEW: Smart band lookup (bandId might be band_code OR id)
async function findBandSmart(bandIdOrCode: string) {
  // Try by band_code first (your original intent)
  const byCode = await supabaseAdmin
    .from("bands")
    .select("id, band_code, status, owner_user_id, claimed_at")
    .eq("band_code", bandIdOrCode)
    .maybeSingle();

  if (byCode.data && !byCode.error) return byCode;

  // Fallback: try by primary id (common when NFC stores the row id)
  const byId = await supabaseAdmin
    .from("bands")
    .select("id, band_code, status, owner_user_id, claimed_at")
    .eq("id", bandIdOrCode)
    .maybeSingle();

  return byId;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const resolvedParams = await params;
  const bandIdOrCode = String(resolvedParams?.bandId ?? "").trim();

  // Preserve your original flow
  if (!bandIdOrCode) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandIdOrCode)}`, req);
  }

  // 1) Find band (SMART lookup: band_code OR id)
  const { data: band, error: bandError } = await findBandSmart(bandIdOrCode);

  // If band missing/unreadable → setup
  if (bandError || !band) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandIdOrCode)}`, req);
  }

  // IMPORTANT: from here on, use the real band_code for state checks/redirects
  const resolvedBandCode = String(band.band_code ?? bandIdOrCode).trim();

  const status = String(band.status ?? "").toLowerCase();
  const isClaimed =
    status === "claimed" ||
    Boolean(band.owner_user_id) ||
    Boolean(band.claimed_at);

  // If not claimed → setup
  if (!isClaimed) {
    return redirectTo(`/setup?band=${encodeURIComponent(resolvedBandCode)}`, req);
  }

  // 2) Check band_state table (keyed by band_code)
  const now = new Date();
  const nowIso = now.toISOString();

  const { data: stateRow, error: stateError } = await supabaseAdmin
    .from("band_state")
    .select("band_code, tapshare_armed, tapshare_fields, tapshare_armed_until")
    .eq("band_code", resolvedBandCode)
    .maybeSingle();

  // If state table errors, fail gracefully to dashboard
  if (stateError) {
    return redirectTo(
      `/dashboard?band=${encodeURIComponent(resolvedBandCode)}`,
      req
    );
  }

  const armed = Boolean(stateRow?.tapshare_armed);

  const armedUntilIso = stateRow?.tapshare_armed_until
    ? new Date(stateRow.tapshare_armed_until as any).toISOString()
    : null;

  const notExpired = !armedUntilIso || armedUntilIso > nowIso;

  // Also require at least one field selected
  const fields = Array.isArray(stateRow?.tapshare_fields)
    ? (stateRow?.tapshare_fields as any[])
    : [];
  const hasFields = fields.length > 0;

  // 3) If armed + not expired + has fields → create share token & redirect
  if (armed && notExpired && hasFields) {
    const token = makeShareToken();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000).toISOString(); // 2 minutes

    const { error: insertError } = await supabaseAdmin
      .from("share_tokens")
      .insert({
        token,
        band_id: band.id, // keep your original behavior
        status: "active",
        expires_at: expiresAt,
      });

    // If insert fails, fall back to dashboard rather than breaking the tap
    if (insertError) {
      return redirectTo(
        `/dashboard?band=${encodeURIComponent(resolvedBandCode)}`,
        req
      );
    }

    // Not disarming here; /share/[token] should consume/disarm.
    return redirectTo(`/share/${token}`, req);
  }

  // 4) Default: go to dashboard
  return redirectTo(`/dashboard?band=${encodeURIComponent(resolvedBandCode)}`, req);
}
