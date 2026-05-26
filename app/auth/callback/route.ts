import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const type = url.searchParams.get("type");
  const nextParam = url.searchParams.get("next");

  const isRecovery =
    type === "recovery" ||
    nextParam === "/reset-password" ||
    url.searchParams.toString().includes("recovery");

  const next = isRecovery ? "/reset-password" : nextParam || "/dashboard";

  const res = NextResponse.redirect(new URL(next, url.origin));
  const supabase = createSupabaseServer(req, res);

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return res;
}