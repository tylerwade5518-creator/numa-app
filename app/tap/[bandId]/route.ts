import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const { bandId } = await params;
  const bandCode = String(bandId ?? "").trim();
  const nowIso = new Date().toISOString();

  if (!bandCode) {
    return NextResponse.json({ ok: false, step: "no_band_code" }, { status: 400 });
  }

  const found = await supabaseAdmin
    .from("bands")
    .select("*")
    .eq("band_code", bandCode)
    .maybeSingle();

  if (found.data) {
    return NextResponse.json({
      ok: true,
      step: "found_existing_band",
      band: found.data,
    });
  }

  const created = await supabaseAdmin
    .from("bands")
    .insert({
      band_code: bandCode,
      status: "unclaimed",
      owner_user_id: null,
      claimed_at: null,
      created_at: nowIso,
      updated_at: nowIso,
    })
    .select("*")
    .maybeSingle();

  return NextResponse.json({
    ok: !created.error,
    step: "attempted_create",
    bandCode,
    createdData: created.data,
    createdError: created.error,
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}