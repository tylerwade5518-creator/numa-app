"use client";

import React from "react";
import { useRouter } from "next/navigation";

const videoIdeas = [
  "Watch what happens when someone taps my bracelet.",
  "Apparently we're only 42% compatible...",
  "I wear this instead of carrying business cards.",
  "Let's see today's astrology dashboard.",
  "Compare the small and large NUMA Band sizes.",
  "Let a friend tap my band to test our compatibility.",
  "Share my digital business card with one tap.",
  "This bracelet doesn't need batteries.",
];

const hooks = [
  "Tap my wrist.",
  "Watch this.",
  "Guess my zodiac sign.",
  "This surprised me.",
  "Would you wear this?",
  "Let's see if we're compatible.",
  "I didn't think this would work...",
  "My bracelet just opened my astrology dashboard.",
];

const rules = [
  {
    title: "Show, don't explain.",
    body: "A tap, reaction, and result will usually beat a long explanation.",
  },
  {
    title: "Start with curiosity.",
    body: "Give viewers a reason to stay for the result in the first three seconds.",
  },
  {
    title: "Capture real reactions.",
    body: "Surprise, laughter, and genuine conversations make NUMA feel real.",
  },
  {
    title: "Stay accurate.",
    body: "NUMA is not a smartwatch, GPS tracker, medical device, or fitness tracker.",
  },
];

const faqs = [
  {
    question: "What should I say NUMA is?",
    answer:
      "NUMA is an NFC bracelet that opens a personal astrology dashboard and lets users choose what others receive when they tap the band.",
  },
  {
    question: "What happens when someone taps the band?",
    answer:
      "Depending on what the owner has armed, the visitor can receive their digital business card or discover their zodiac compatibility.",
  },
  {
    question: "Does NUMA need charging?",
    answer:
      "No. NUMA uses NFC technology, so there are no batteries and no charging.",
  },
  {
    question: "Can I create videos in my own style?",
    answer:
      "Absolutely. Authentic content is encouraged. We want your personality, reactions, and creative ideas—not a scripted commercial.",
  },
  {
    question: "What should I avoid saying?",
    answer:
      "Do not describe NUMA as a smartwatch, fitness tracker, GPS tracker, medical device, or a tool that predicts the future.",
  },
  {
    question: "Who do I contact for help?",
    answer:
      "Email numabands@gmail.com and include your TikTok username and question.",
  },
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
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/80">
              NUMA Creator Hub
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-5xl">
              Create the Next Trend.
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="shrink-0 rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition hover:bg-slate-800/90"
          >
            Dashboard
          </button>
        </header>

        {/* AREA 1: FOUNDING CREATOR */}
        <section className="overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-950/90 via-indigo-950/90 to-slate-950/95 p-6 shadow-[0_0_45px_rgba(76,29,149,0.3)] backdrop-blur-xl sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.28em] text-violet-200/75">
            Founding Creator
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-slate-50">
            Welcome to NUMA.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Thank you for being one of the first creators introducing NUMA.
            Create authentic videos that spark curiosity, feel natural, and
            make people want to tap.
          </p>

          <div className="mt-5 inline-flex rounded-full border border-violet-300/20 bg-white/5 px-5 py-2">
            <span className="text-sm font-semibold text-violet-100">
              Earn over <span className="text-white">$6</span> for every band
              you sell — with no cap on commissions.
            </span>
          </div>
        </section>

        {/* WHAT IS NUMA */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            What is NUMA?
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            NUMA is an NFC bracelet that creates personal and social
            experiences with a simple phone tap.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FeatureCard
              icon="✦"
              title="Astrology Dashboard"
              body="Tap the band with your phone to access daily astrology, moon insights, meters, and Cosmic Cards."
            />

            <FeatureCard
              icon="↗"
              title="Digital Business Card"
              body="Arm Tap Share and let someone tap your band to instantly receive your selected contact information."
            />

            <FeatureCard
              icon="♡"
              title="Zodiac Compatibility"
              body="Arm Star Sync and let someone tap your band to discover your friendship or romance compatibility."
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            People do not buy NUMA because it uses NFC. They buy it because it
            creates conversations, connections, and moments worth sharing.
          </p>
        </section>

        {/* AREA 2: CREATE */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/80">
              Create
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-50">
              Make people want to tap.
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Keep the setup simple, show the tap clearly, and let the result
              create the story.
            </p>
          </div>

          {/* Video Vault */}
          <div className="mt-6">
            <SectionHeading
              title="Video Vault"
              subtitle="Simple ideas you can film in under one minute."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {videoIdeas.map((idea, index) => (
                <div
                  key={idea}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-100/70">
                    Idea {index + 1}
                  </p>

                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-100">
                    {idea}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hooks */}
          <div className="mt-7 border-t border-white/10 pt-6">
            <SectionHeading
              title="Hooks That Work"
              subtitle="The first three seconds matter most. Begin with curiosity."
            />

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
          </div>

          {/* Golden Rules */}
          <div className="mt-7 border-t border-white/10 pt-6">
            <SectionHeading
              title="Golden Rules"
              subtitle="A few things to remember before you post."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rules.map((rule) => (
                <RuleCard
                  key={rule.title}
                  title={rule.title}
                  body={rule.body}
                />
              ))}
            </div>
          </div>
        </section>

        {/* AREA 3: FAQ */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-violet-200/80">
            Affiliate FAQ
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-50">
            Quick answers before you create.
          </h2>

          <div className="mt-5 space-y-3">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        {/* Closing Banner */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-950/90 via-indigo-950/90 to-slate-950/95 p-6 text-center shadow-[0_0_45px_rgba(76,29,149,0.3)] backdrop-blur-xl sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-violet-200/75">
            Build Something People Remember
          </p>

          <h2 className="mt-3 text-xl font-semibold text-slate-50 sm:text-2xl">
            One creative idea can inspire thousands of people.
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            Thank you for helping build NUMA from the beginning.
          </p>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-200/20 bg-yellow-200/10 text-sm text-yellow-100">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-50">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-slate-300">
        {body}
      </p>
    </div>
  );
}

function RuleCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3">
      <p className="text-sm font-semibold text-slate-100">
        {title}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-slate-300">
        {body}
      </p>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 open:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-100">
        <span>{question}</span>

        <span className="text-lg font-light text-slate-400 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <p className="mt-3 pr-6 text-xs leading-relaxed text-slate-300">
        {answer}
      </p>
    </details>
  );
}