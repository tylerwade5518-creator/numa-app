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
  // crypto.randomUUID() is available in Node runtime used by Next server routes
  return crypto.randomUUID().replace(/-/g, "");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const resolvedParams = await params;
  const bandCode = String(resolvedParams?.bandId ?? "").trim();

  // NOTE: preserve your original flow (even though this currently redirects with an empty bandCode)
  if (!bandCode) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandCode)}`, req);
  }

  // 1) Find band by band_code (matches your existing design)
  const { data: band, error: bandError } = await supabaseAdmin
    .from("bands")
    .select("id, band_code, status, owner_user_id, claimed_at")
    .eq("band_code", bandCode)
    .maybeSingle();

  // If band missing/unreadable → setup
  if (bandError || !band) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandCode)}`, req);
  }

  const status = String(band.status ?? "").toLowerCase();
  const isClaimed =
    status === "claimed" ||
    Boolean(band.owner_user_id) ||
    Boolean(band.claimed_at);

  // If not claimed → setup
  if (!isClaimed) {
    return redirectTo(`/setup?band=${encodeURIComponent(bandCode)}`, req);
  }

  // 2) Check new band_state table (band_id = bandCode)
  const now = new Date();
  const nowIso = now.toISOString();

  const { data: stateRow, error: stateError } = await supabaseAdmin
    .from("band_state")
    .select("band_id, tapshare_armed, tapshare_fields, tapshare_armed_until")
    .eq("band_id", bandCode)
    .maybeSingle();

  // If state table errors, fail gracefully to dashboard
  if (stateError) {
    return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req);
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

    const { error: insertError } = await supabaseAdmin.from("share_tokens").insert({
      token,
      band_id: band.id,
      status: "active",
      expires_at: expiresAt,
    });

    // If insert fails, fall back to dashboard rather than breaking the tap
    if (insertError) {
      return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req);
    }

    // Not disarming here; /share/[token] should consume/disarm.
    return redirectTo(`/share/${token}`, req);
  }

  // 4) Default: go to dashboard
  return redirectTo(`/dashboard?band=${encodeURIComponent(bandCode)}`, req);
}
