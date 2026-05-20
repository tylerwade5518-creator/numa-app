import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bandCode = String(body?.bandCode ?? "").trim();
    const userId = String(body?.userId ?? "").trim();

    if (!bandCode) {
      return NextResponse.json(
        { ok: false, error: "Missing band code." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing user id." },
        { status: 400 }
      );
    }

    const { data: band, error: bandFetchErr } = await supabaseAdmin
      .from("bands")
      .select("id, band_code, owner_user_id, status, claimed_at")
      .eq("band_code", bandCode)
      .maybeSingle();

    if (bandFetchErr) {
      return NextResponse.json(
        { ok: false, error: bandFetchErr.message },
        { status: 500 }
      );
    }

    if (!band) {
      return NextResponse.json(
        { ok: false, error: "That band code was not found. Please tap your band again." },
        { status: 404 }
      );
    }

    const owner = (band as any).owner_user_id as string | null;

    if (owner && owner !== userId) {
      return NextResponse.json(
        { ok: false, error: "This band is already linked to another account." },
        { status: 409 }
      );
    }

    if (!owner) {
      const { error: claimErr } = await supabaseAdmin
        .from("bands")
        .update({
          owner_user_id: userId,
          status: "claimed",
          claimed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", (band as any).id);

      if (claimErr) {
        return NextResponse.json(
          { ok: false, error: claimErr.message },
          { status: 500 }
        );
      }
    }

    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .update({
        band_code: bandCode,
      })
      .eq("user_id", userId);

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: profileErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, bandCode });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Claim band failed." },
      { status: 500 }
    );
  }
}