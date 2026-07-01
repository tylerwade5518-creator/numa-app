"use client";

import React from "react";
import { useRouter } from "next/navigation";

const videoIdeas = [
  "Watch what happens when someone taps my bracelet.",
  "Apparently we're only 42% compatible...",
  "I wear this instead of carrying business cards.",
  "Let's see today's Zodiac Dashboard.",
  "I let strangers guess my zodiac sign.",
  "Everyone at this party tapped my bracelet.",
  "This doesn't need batteries.",
  "Would you wear this?",
  "Guess my zodiac sign.",
  "My favorite feature isn't what you'd expect...",
];

const hooks = [
  "Tap my wrist.",
  "Watch this.",
  "Guess my zodiac sign.",
  "This surprised me.",
  "Would you wear this?",
  "Let's see if we're compatible.",
  "I didn't think this would work...",
  "My bracelet just opened my zodiac dashboard.",
];

export default function CreatorHubPage() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-slate-100"
      style={{
        backgroundImage: "url('/nebula-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/85" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-5 px-4 py-6 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/80">
              NUMA Creator Hub
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-5xl">
              Create the Next Trend.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              You are not just promoting a bracelet. You are helping build a
              social, zodiac-powered experience people want to tap, share, and
              talk about.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800/90"
          >
            Dashboard
          </button>
        </header>

        <section className="rounded-3xl border border-yellow-200/20 bg-yellow-200/10 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-yellow-100">
            Founding Creator
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-50">
            Help shape NUMA from the beginning.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            The first NUMA creators will help define how people discover the
            brand. We are not looking for perfect videos. We are looking for
            authentic moments that make someone say, “Wait...what is that?”
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Daily Discovery"
            body="Every tap opens a personal Zodiac Dashboard with daily insights, moon energy, and Cosmic Cards."
          />
          <FeatureCard
            title="Real Connections"
            body="NUMA helps people share contacts, compare zodiac compatibility, and start conversations."
          />
          <FeatureCard
            title="No Charging"
            body="No batteries. No charging. No app pairing. The band works with a simple NFC tap."
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            What is NUMA?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            NUMA is an NFC bracelet that opens a personalized Zodiac Dashboard
            with one tap. It includes contact sharing, daily astrology, Cosmic
            Cards, moon phase insights, and zodiac compatibility.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            People do not buy NUMA because it is NFC. They buy it because it
            creates moments: meeting someone new, comparing compatibility,
            checking today&apos;s card, or showing friends what happens when
            they tap.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Video Vault
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Start with simple videos creators can film in under one minute.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {videoIdeas.map((idea, index) => (
              <div
                key={idea}
                className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-100/70">
                  Idea {index + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-100">
                  {idea}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Hooks That Work
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            The first three seconds matter most. Start with curiosity.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {hooks.map((hook) => (
              <span
                key={hook}
                className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-100"
              >
                “{hook}”
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Golden Rules
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Rule title="Show, do not explain." body="A tap, a reaction, and a result will usually beat a long explanation." />
            <Rule title="Start with curiosity." body="Try hooks like: Tap my wrist. Watch this. Guess my zodiac sign." />
            <Rule title="Capture reactions." body="Real surprise, laughter, or confusion makes the product feel more interesting." />
            <Rule title="Keep it short." body="Most NUMA videos should be simple, fast, and easy to understand." />
            <Rule title="Sell the moment." body="Do not just sell a bracelet. Show the conversation it creates." />
            <Rule title="Stay accurate." body="Do not call NUMA a smartwatch, GPS tracker, medical device, or fitness tracker." />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Creator Resources
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            This section will grow over time with product photos, lifestyle
            clips, logos, example videos, trending sounds, and creator
            challenges.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            Coming soon: downloadable photos, video clips, logos, and example
            TikToks.
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Affiliate FAQ
          </h2>

          <div className="mt-4 space-y-3">
            <FAQ
              q="What should I say NUMA is?"
              a="NUMA is an NFC bracelet that opens a personalized Zodiac Dashboard with one tap."
            />
            <FAQ
              q="Does it need charging?"
              a="No. NUMA uses NFC, so there are no batteries and no charging."
            />
            <FAQ
              q="What videos should I make first?"
              a="Start with a simple tap demo, a compatibility video, or a Daily Zodiac Dashboard video."
            />
            <FAQ
              q="What should I avoid saying?"
              a="Do not describe NUMA as a smartwatch, fitness tracker, GPS tracker, medical device, or future-predicting tool."
            />
            <FAQ
              q="Who do I contact for help?"
              a="Email numabands@gmail.com with your TikTok username and question."
            />
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-yellow-200/15 bg-yellow-200/10 p-5 text-center shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-50">
            One creative idea can inspire thousands of people.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Thank you for helping build NUMA from the beginning.
          </p>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3">
      <p className="text-sm font-semibold text-slate-100">{q}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-300">{a}</p>
    </div>
  );
}