// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createSupabaseServer(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // Routes that should be accessible without being logged in
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth/callback");

  // Routes that require login
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/star-sync") ||
    pathname.startsWith("/setup");

  // If not logged in and trying to access protected routes -> send to login
  if (!user && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and trying to access login/signup -> go to dashboard
  if (user && isAuthRoute && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
