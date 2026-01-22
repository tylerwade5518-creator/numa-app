// app/logout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // This only clears auth in the browser when called from client with cookies;
  // we’ll do a better cookie-based signout once middleware is finalized.
  // For now it’s a placeholder route so you can link to /logout later.
  return NextResponse.redirect(new URL("/login", url));
}
