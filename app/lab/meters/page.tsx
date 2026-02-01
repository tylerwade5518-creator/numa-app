"use client";

import React from "react";
import AnimatedSpaceBackground from "../../dashboard/AnimatedSpaceBackground";

// IMPORTANT: this import pattern avoids the “red squiggles” when the meter file
// switched between `export default` vs `export function VideoRingMeter(...)`.
import * as VideoRingMeterModule from "../../dashboard/VideoRingMeter";

const VideoRingMeter = ((VideoRingMeterModule as any).default ??
  (VideoRingMeterModule as any).VideoRingMeter) as React.ComponentType<any>;

export default function LabMetersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedSpaceBackground />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-3xl border border-white/10 bg-slate-950/35 p-6 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.75)]">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Daily Meters
          </p>

          <div className="grid grid-cols-3 gap-6">
            {/* ENERGY */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Energy
                </div>
                <div className="text-[11px] text-slate-400">Capacity to act</div>
              </div>

              <VideoRingMeter progress={0.86} directive="Make moves" />
            </div>

            {/* FOCUS */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Focus
                </div>
                <div className="text-[11px] text-slate-400">
                  Precision attention
                </div>
              </div>

              <VideoRingMeter
                progress={0.62}
                directive="Lock in"
                videoHueRotateDeg={210}
              />
            </div>

            {/* CONNECTION */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Connection
                </div>
                <div className="text-[11px] text-slate-400">
                  Social resonance
                </div>
              </div>

              <VideoRingMeter
                progress={0.48}
                directive="Reach out"
                videoHueRotateDeg={305}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
