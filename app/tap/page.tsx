'use client';

import React from 'react';

export default function TapPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-slate-100">
      <div className="max-w-md text-center px-6 py-8 border border-slate-700/60 rounded-2xl bg-slate-900/60">
        <h1 className="text-xl font-semibold tracking-wide mb-3">
          NUMA Tap (Placeholder)
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          This is a temporary tap screen so we can get the app deployed and
          fully working on your band. The real tap behavior and flows will be
          added in a later version.
        </p>
      </div>
    </main>
  );
}
