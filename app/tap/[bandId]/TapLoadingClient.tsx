"use client";

import { useEffect } from "react";

export default function TapLoadingClient({ bandId }: { bandId: string }) {
  useEffect(() => {
    async function resolveTap() {
      try {
        const res = await fetch(`/api/tap/${encodeURIComponent(bandId)}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.redirectTo) {
          window.location.replace(data.redirectTo);
          return;
        }

        window.location.replace(
          `/setup?band=${encodeURIComponent(bandId)}&reason=tap_api_no_redirect`
        );
      } catch {
        window.location.replace(
          `/setup?band=${encodeURIComponent(bandId)}&reason=tap_api_failed`
        );
      }
    }

    resolveTap();
  }, [bandId]);

  return (
    <main className="fixed inset-0 min-h-screen overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/numa-loading.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/10" />
    </main>
  );
}