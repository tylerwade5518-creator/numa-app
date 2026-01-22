"use client";

import React from "react";
import type { CardRecord } from "../../lib/cardRegistry";

export function PinnedCard({ card }: { card: CardRecord }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 backdrop-blur-md shadow-[0_0_35px_rgba(15,23,42,0.9)]">
      {/* Mobile: stack / Desktop: side-by-side */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        {/* Card media */}
        <div className="w-full sm:w-auto sm:shrink-0">
          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-2xl
              border border-white/15
              shadow-[0_0_25px_rgba(0,0,0,0.6)]
              sm:w-[280px]
            "
          >
            <video
              src={card.animatedVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="
                block
                w-full
                aspect-[7/10]
                object-contain
              "
            />
          </div>
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Card name (now directly under the card on mobile) */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
              Stardust Action Card
            </div>
            <div className="text-lg font-semibold text-slate-50 sm:text-xl">
              {card.title}
            </div>
          </div>

          {/* Stardust Action (moved up) */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Stardust Action
            </div>
            <div className="text-sm font-semibold leading-relaxed text-slate-50">
              {card.StardustAction}
            </div>
          </div>

          {/* Meaning */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Meaning
            </div>
            <div className="text-sm leading-relaxed text-slate-100/90">
              {card.meaning}
            </div>
          </div>

          {/* Why today */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Why today
            </div>
            <div className="text-sm leading-relaxed text-slate-100/90">
              {card.whyToday}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
