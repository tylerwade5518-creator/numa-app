import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = String(url.searchParams.get("userId") || "").trim();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing userId." },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id, display_name, username, birthdate, sign, band_code")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Profile lookup failed." },
      { status: 500 }
    );
  }
}