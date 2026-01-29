// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only runs on protected routes because of matcher below
  const supabase = createSupabaseServer(req, res);

  // Faster than getUser() for route gating
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// IMPORTANT: Restrict middleware to protected routes only (big speed win)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/star-sync/:path*",
    "/setup/:path*",
  ],
};
