// app/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../lib/supabase/client";

export default function Home() {
  const router = useRouter();

  // create the browser client once
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  useEffect(() => {
    let mounted = true;

    async function redirectToDashboard() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        // Always route users to dashboard
        router.replace("/dashboard");
      } catch {
        if (!mounted) return;
        router.replace("/dashboard");
      }
    }

    redirectToDashboard();

    // If auth state changes while here, still route to dashboard
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      router.replace("/dashboard");
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, [router, supabase]);

  // Minimal loading shell — never really visible
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p style={{ opacity: 0.5 }}>Redirecting…</p>
    </main>
  );
}
