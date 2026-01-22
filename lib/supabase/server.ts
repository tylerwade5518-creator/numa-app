// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server Component usage:
 *   const supabase = createSupabaseServer();
 */
export function createSupabaseServer(): ReturnType<typeof createServerClient>;

/**
 * Middleware / Route Handler usage:
 *   const res = NextResponse.next();
 *   const supabase = createSupabaseServer(req, res);
 */
export function createSupabaseServer(
  req: NextRequest,
  res: NextResponse
): ReturnType<typeof createServerClient>;

export function createSupabaseServer(req?: NextRequest, res?: NextResponse) {
  // ✅ Middleware / Route Handler mode (can WRITE cookies)
  if (req && res) {
    return createServerClient(url, anon, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });
  }

  // ✅ Server Component mode
  // Some Next versions/types don't expose cookieStore.getAll(), so we use get(name).
  const cookieStore: any = cookies();

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Server Components can't set cookies.
        // Cookie writes happen in middleware/route handlers (e.g. /auth/callback)
      },
      remove() {
        // same as above
      },
    } as any, // avoid TS mismatch across @supabase/ssr versions
  });
}
