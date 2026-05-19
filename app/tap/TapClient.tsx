"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TapClient() {
  const router = useRouter();
  const params = useSearchParams();

  const bandId = params.get("band");

  useEffect(() => {
    if (!bandId) return;

    async function handleTap() {
      console.log("Band tapped:", bandId);

      // Get current band state
      const { data: state, error } = await supabase
        .from("band_state")
        .select("*")
        .eq("band_id", bandId)
        .maybeSingle();

      if (error) {
        console.error("Band state error:", error);

        // fallback to dashboard
        router.push(`/dashboard?band=${bandId}`);
        return;
      }

      // =========================
      // STAR SYNC MODE
      // =========================
      if (state?.starsync_armed) {
        console.log("Star Sync armed");

        // Immediately reset after ONE tap
        await supabase
          .from("band_state")
          .update({
            starsync_armed: false,
            starsync_used_at: new Date().toISOString(),
          })
          .eq("band_id", bandId);

        // Send stranger to guest page
        router.push(`/star-sync/guest?band=${bandId}`);
        return;
      }

      // =========================
      // TAP SHARE MODE
      // =========================
      if (state?.tapshare_armed) {
        router.push(`/share?band=${bandId}`);
        return;
      }

      // =========================
      // DEFAULT DASHBOARD
      // =========================
      router.push(`/dashboard?band=${bandId}`);
    }

    handleTap();
  }, [bandId, router]);

  return (
    <main className="min-h-screen bg-black text-slate-50 flex items-center justify-center">
      <p className="text-slate-400 text-sm">
        Detecting band… redirecting…
      </p>
    </main>
  );
}