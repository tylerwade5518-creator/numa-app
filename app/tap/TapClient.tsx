"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TapClient() {
  const router = useRouter();
  const params = useSearchParams();
  const bandId = params.get("band");

  useEffect(() => {
    if (!bandId) return;

    // Later: verify real band IDs from database
    console.log("Band tapped:", bandId);

    // For now: quick redirect to Dashboard
    router.push(`/dashboard?band=${bandId}`);
  }, [bandId, router]);

  return (
    <main className="min-h-screen bg-black text-slate-50 flex items-center justify-center">
      <p className="text-slate-400 text-sm">
        Detecting band… redirecting…
      </p>
    </main>
  );
}
