// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  // Create a response we can attach cookies to
  const res = NextResponse.redirect(new URL(next, url.origin));

  // Create the Supabase server client wired to req/res cookies
  const supabase = createSupabaseServer(req, res);

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return res;
}
