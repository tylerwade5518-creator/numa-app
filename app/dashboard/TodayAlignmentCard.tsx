// app/dashboard/TodayAlignmentCard.tsx
"use client";

import React from "react";

type Props = {
  todayLabel: string;
  horoscopeTitle: string;
  horoscopeSummary: string;
};

export default function TodayAlignmentCard({
  todayLabel,
  horoscopeTitle,
  horoscopeSummary,
}: Props) {
  return (
    <section className="-mt-8 relative z-20">
      <div className="relative rounded-3xl border border-yellow-200/45 bg-slate-950/40 p-6 sm:p-7 backdrop-blur-md shadow-[0_0_45px_rgba(15,23,42,0.9)]">
        <div className="relative space-y-5">
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/95">
              {todayLabel}
            </p>
            <p className="text-xs sm:text-[13px] text-slate-100/90"></p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
              {horoscopeTitle}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-100/95">
              {horoscopeSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
            <p className="text-[12px] text-slate-100/80">
              Based on today’s real sky positions.
            </p>
            <p className="text-[12px] text-slate-300/80">
              Tap your band any time today to reopen this reading.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
