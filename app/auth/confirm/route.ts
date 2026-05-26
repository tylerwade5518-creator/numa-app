import { NextResponse, type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  const redirectUrl = new URL(next, requestUrl.origin);
  const errorUrl = new URL("/forgot-password", requestUrl.origin);

  const res = NextResponse.redirect(redirectUrl);
  const supabase = createSupabaseServer(req, res);

  if (!token_hash || !type) {
    errorUrl.searchParams.set("error", "missing_token");
    return NextResponse.redirect(errorUrl);
  }

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    errorUrl.searchParams.set("error", "invalid_or_expired_link");
    return NextResponse.redirect(errorUrl);
  }

  return res;
}