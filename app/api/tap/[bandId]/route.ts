import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function redirectPath(path: string, reason?: string) {
  const url = new URL(path, "https://www.numabands.com");
  if (reason) url.searchParams.set("reason", reason);
  return `${url.pathname}${url.search}`;
}

function makeShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function bandIsClaimed(band: any): boolean {
  const status = String(band?.status ?? "").toLowerCase().trim();
  return status === "claimed" || Boolean(band?.owner_user_id) || Boolean(band?.claimed_at);
}

async function findBandSmart(bandIdOrCode: string) {
  const cleanCode = String(bandIdOrCode ?? "").trim();

  const byCode = await supabaseAdmin
    .from("bands")
    .select("*")
    .eq("band_code", cleanCode)
    .maybeSingle();

  if (byCode.data && !byCode.error) return byCode;

  const byCodeIlike = await supabaseAdmin
    .from("bands")
    .select("*")
    .ilike("band_code", cleanCode)
    .maybeSingle();

  if (byCodeIlike.data && !byCodeIlike.error) return byCodeIlike;

  return await supabaseAdmin
    .from("bands")
    .select("*")
    .eq("id", cleanCode)
    .maybeSingle();
}

async function createUnclaimedBand(bandCode: string) {
  const nowIso = new Date().toISOString();
  const cleanCode = String(bandCode ?? "").trim();

  return await supabaseAdmin
    .from("bands")
    .insert({
      band_code: cleanCode,
      status: "unclaimed",
      owner_user_id: null,
      claimed_at: null,
      created_at: nowIso,
      updated_at: nowIso,
    })
    .select("*")
    .maybeSingle();
}

function jsonRedirect(path: string) {
  return NextResponse.json({ redirectTo: path });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const { bandId } = await params;
  const bandIdOrCode = String(bandId ?? "").trim();

  if (!bandIdOrCode) {
    return jsonRedirect(redirectPath(`/setup?band=`, "no_band_param"));
  }

  let { data: band, error: bandError } = await findBandSmart(bandIdOrCode);

  if (!band && !bandError) {
    const created = await createUnclaimedBand(bandIdOrCode);
    band = created.data;
    bandError = created.error;
  }

  if (bandError || !band) {
    return jsonRedirect(
      redirectPath(
        `/setup?band=${encodeURIComponent(bandIdOrCode)}`,
        bandError ? "band_create_error" : "band_not_found"
      )
    );
  }

  const bandCode = String(band.band_code ?? bandIdOrCode).trim();

  let { data: stateRow, error: stateError } = await supabaseAdmin
  .from("band_state")
  .select(
    "band_id, band_code, tapshare_armed, tapshare_fields, tapshare_armed_until, starsync_armed, starsync_armed_at, starsync_used_at"
  )
  .eq("band_id", bandCode)
  .maybeSingle();

if (!stateRow && band?.id) {
  const byBandId = await supabaseAdmin
    .from("band_state")
    .select(
      "band_id, band_code, tapshare_armed, tapshare_fields, tapshare_armed_until, starsync_armed, starsync_armed_at, starsync_used_at"
    )
    .eq("band_id", band.id)
    .maybeSingle();

  stateRow = byBandId.data;
  stateError = byBandId.error;
}

if (!stateRow) {
  const byBandCode = await supabaseAdmin
    .from("band_state")
    .select(
      "band_id, band_code, tapshare_armed, tapshare_fields, tapshare_armed_until, starsync_armed, starsync_armed_at, starsync_used_at"
    )
    .eq("band_code", bandCode)
    .maybeSingle();

  stateRow = byBandCode.data;
  stateError = byBandCode.error;
}

  const now = new Date();
  const nowIso = now.toISOString();

  if (!stateError) {
    const starSyncArmed = Boolean(stateRow?.starsync_armed);
    const starSyncUsed = Boolean(stateRow?.starsync_used_at);

    if (stateRow && starSyncArmed && !starSyncUsed) {
      await supabaseAdmin
        .from("band_state")
        .update({
          starsync_armed: false,
          starsync_used_at: nowIso,
          updated_at: nowIso,
        })
        .eq("band_id", stateRow.band_id);

      return jsonRedirect(
        redirectPath(
          `/star-sync/guest?band=${encodeURIComponent(bandCode)}`,
          "ok_starsync"
        )
      );
    }

    const tapShareArmed = Boolean(stateRow?.tapshare_armed);

    const armedUntilIso = stateRow?.tapshare_armed_until
      ? new Date(stateRow.tapshare_armed_until as any).toISOString()
      : null;

    const notExpired = !armedUntilIso || armedUntilIso > nowIso;

    if (tapShareArmed && notExpired) {
      const token = makeShareToken();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 1000).toISOString();

      const { error: insertError } = await supabaseAdmin.from("share_tokens").insert({
        token,
        band_code: bandCode,
        status: "active",
        expires_at: expiresAt,
      });

      if (insertError) {
        return jsonRedirect(
          redirectPath(
            `/dashboard?band=${encodeURIComponent(bandCode)}`,
            "share_token_insert_failed"
          )
        );
      }

      return jsonRedirect(redirectPath(`/share/${token}`, "ok_share"));
    }
  }

  const isClaimed = bandIsClaimed(band);

  if (!isClaimed) {
    return jsonRedirect(
      redirectPath(`/setup?band=${encodeURIComponent(bandCode)}`, "band_not_claimed")
    );
  }

  if (stateError) {
    return jsonRedirect(
      redirectPath(`/dashboard?band=${encodeURIComponent(bandCode)}`, "band_state_error")
    );
  }

  return jsonRedirect(
    redirectPath(`/dashboard?band=${encodeURIComponent(bandCode)}`, "default_dashboard")
  );
}