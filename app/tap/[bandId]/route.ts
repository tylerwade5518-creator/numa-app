// app/tap/[bandId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function redirectTo(path: string, req: Request, reason?: string) {
  const url = new URL(path, req.url);
  if (reason) url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

function makeShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// IMPORTANT: "unclaimed" contains "claim" so never use includes("claim")
function bandIsClaimed(band: any): boolean {
  const status = String(band?.status ?? "").toLowerCase().trim();
  return status === "claimed" || Boolean(band?.owner_user_id) || Boolean(band?.claimed_at);
}

async function findBandSmart(bandIdOrCode: string) {
  const byCode = await supabaseAdmin
    .from("bands")
    .select("*")
    .eq("band_code", bandIdOrCode)
    .maybeSingle();
  if (byCode.data && !byCode.error) return byCode;

  const byCodeIlike = await supabaseAdmin
    .from("bands")
    .select("*")
    .ilike("band_code", bandIdOrCode)
    .maybeSingle();
  if (byCodeIlike.data && !byCodeIlike.error) return byCodeIlike;

  const byId = await supabaseAdmin
    .from("bands")
    .select("*")
    .eq("id", bandIdOrCode)
    .maybeSingle();

  return byId;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const { bandId } = await params;
  const bandIdOrCode = String(bandId ?? "").trim();

  if (!bandIdOrCode) {
    return redirectTo(`/setup?band=`, req, "no_band_param");
  }

  const { data: band, error: bandError } = await findBandSmart(bandIdOrCode);

  if (bandError || !band) {
    return redirectTo(
      `/setup?band=${encodeURIComponent(bandIdOrCode)}`,
      req,
      bandError ? "band_lookup_error" : "band_not_found"
    );
  }

  const bandCode = String(band.band_code ?? bandIdOrCode).trim();

  // Optional: if you want to allow Tap Share even before "claimed", comment this block out.
  const isClaimed = bandIsClaimed(band);
  if (!isClaimed) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandCode)}`, req, "band_not_claimed");
  }

  // ✅ CRITICAL: your band_state is keyed by band_id TEXT = bandCode (NUMA-TEST-002)
  const { data: stateRow, error: stateError } = await supabaseAdmin
    .from("band_state")
    .select("band_id, band_code, tapshare_armed, tapshare_fields, tapshare_armed_until")
    .eq("band_id", bandCode)
    .maybeSingle();

  if (stateError) {
    return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req, "band_state_error");
  }

  const armed = Boolean(stateRow?.tapshare_armed);

  const now = new Date();
  const nowIso = now.toISOString();
  const armedUntilIso = stateRow?.tapshare_armed_until
    ? new Date(stateRow.tapshare_armed_until as any).toISOString()
    : null;

  const notExpired = !armedUntilIso || armedUntilIso > nowIso;

  if (armed && notExpired) {
    const token = makeShareToken();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000).toISOString();

    // ✅ CRITICAL: share_tokens table uses band_code (NOT band_id)
    const { error: insertError } = await supabaseAdmin.from("share_tokens").insert({
      token,
      band_code: bandCode,
      status: "active",
      expires_at: expiresAt,
    });

    if (insertError) {
      return redirectTo(
        `/dashboard?band=${encodeURIComponent(bandCode)}`,
        req,
        "share_token_insert_failed"
      );
    }

    return redirectTo(`/share/${token}`, req, "ok_share");
  }

  if (!armed) {
    return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req, "not_armed");
  }

  if (!notExpired) {
    return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req, "armed_expired");
  }

  return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req, "default_dashboard");
}
