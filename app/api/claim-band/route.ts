import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildBirthdate(body: any): string | null {
  const birthYear = String(body?.birthYear ?? "").trim();
  const birthMonth = String(body?.birthMonth ?? "").trim();
  const birthDay = String(body?.birthDay ?? "").trim();

  if (!birthYear || !birthMonth || !birthDay) return null;

  const monthIndex = MONTHS.indexOf(birthMonth);
  if (monthIndex < 0) return null;

  const month = String(monthIndex + 1).padStart(2, "0");
  const day = String(Number(birthDay)).padStart(2, "0");

  if (!Number.isFinite(Number(birthYear)) || !Number.isFinite(Number(birthDay))) {
    return null;
  }

  return `${birthYear}-${month}-${day}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bandCode = String(body?.bandCode ?? "").trim();
    const userId = String(body?.userId ?? "").trim();
    const sign = String(body?.sign ?? "").trim();
    const birthdate = buildBirthdate(body);

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

    const nowIso = new Date().toISOString();

    let { data: band, error: bandFetchErr } = await supabaseAdmin
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
        .select("id, band_code, owner_user_id, status, claimed_at")
        .maybeSingle();

      if (created.error || !created.data) {
        return NextResponse.json(
          {
            ok: false,
            error: created.error?.message || "Could not create band.",
          },
          { status: 500 }
        );
      }

      band = created.data;
    }

    const owner = (band as any).owner_user_id as string | null;

    if (owner && owner !== userId) {
      return NextResponse.json(
        {
          ok: false,
          error: "This band is already linked to another account.",
        },
        { status: 409 }
      );
    }

    if (!owner) {
      const { error: claimErr } = await supabaseAdmin
        .from("bands")
        .update({
          owner_user_id: userId,
          status: "claimed",
          claimed_at: nowIso,
          updated_at: nowIso,
        })
        .eq("id", (band as any).id);

      if (claimErr) {
        return NextResponse.json(
          { ok: false, error: claimErr.message },
          { status: 500 }
        );
      }
    }

    const profileUpdate: Record<string, any> = {
      band_code: bandCode,
      updated_at: nowIso,
    };

    if (sign) profileUpdate.sign = sign;
    if (birthdate) profileUpdate.birthdate = birthdate;

    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("user_id", userId);

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: profileErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      bandCode,
      sign: sign || null,
      birthdate,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Claim band failed." },
      { status: 500 }
    );
  }
}