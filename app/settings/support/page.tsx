// app/settings/support/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const APP_VERSION = "1.0.0";

type BandInfo = {
  band_code: string | null;
  status: string | null;
};

function prettyStatus(status: string | null) {
  if (!status) return "Not linked";
  if (status.toLowerCase() === "claimed") return "Linked";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function SupportPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bandInfo, setBandInfo] = useState<BandInfo | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session?.user) {
        router.replace(`/login?redirect=${encodeURIComponent("/settings/support")}`);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("band_code")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const bandCode = String(profile?.band_code ?? "").trim();

      if (bandCode) {
        const { data: band } = await supabase
          .from("bands")
          .select("band_code, status")
          .eq("band_code", bandCode)
          .maybeSingle();

        if (mounted) {
          setBandInfo(
            band || {
              band_code: bandCode,
              status: "claimed",
            }
          );
        }
      }

      if (mounted) setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
        <div className="text-sm text-slate-300">Loading support…</div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/nebula-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/80" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-4 py-6 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Settings
            </p>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              Help & Support
            </h1>
            <p className="text-xs text-slate-300">
              Get help with your NUMA Band, account, Tap Share, and Star Sync.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/settings/profile")}
            className="rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800/90"
          >
            Back to Profile
          </button>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Frequently Asked Questions
          </h2>

          <div className="mt-4 space-y-3">
            <FAQ
              question="How do I change my birthday?"
              answer="Go to Profile Settings → Birthday & Sign. Your zodiac sign updates automatically when you save."
            />

            <FAQ
              question="I forgot my password."
              answer="Tap Forgot Password on the login screen and enter the email you used to create your account. If you don't receive the email within a minute, check your Spam and Junk folders."
            />

            <FAQ
              question="My band isn't opening."
              answer="Make sure NFC is enabled on your phone and tap the top of your phone against your NUMA Band. If it still doesn't work, contact us below."
            />

            <FAQ
              question="How do I use Tap Share?"
              answer="Open Tap Share from your dashboard, choose what you want to share, then tap Arm Band. The next person who taps your NUMA Band will instantly see the information you selected."
            />

            <FAQ
              question="How do I use Star Sync?"
              answer="Open Star Sync from your dashboard, tap Arm Band, then have another person tap your NUMA Band to compare compatibility."
            />

            <FAQ
              question="I entered the wrong email when I created my account."
              answer="Email us at numabands@gmail.com and tell us what happened. If possible, include your Band ID so we can help recover access faster."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Contact Us
          </h2>

          <p className="mt-3 text-sm text-slate-200">
            Need more help? Email us at:
          </p>

          <p className="mt-2 break-words text-lg font-semibold text-sky-200">
            numabands@gmail.com
          </p>

          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            Please describe your issue in as much detail as possible. You can
            always find your Band ID in{" "}
            <span className="font-semibold text-slate-100">
              Profile Settings → My NUMA Band
            </span>
            . Including it helps us help you faster.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Your NUMA Band
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InfoRow label="Band ID" value={bandInfo?.band_code || "Not linked"} />
            <InfoRow label="Band Status" value={prettyStatus(bandInfo?.status || null)} />
            <InfoRow label="Build" value={APP_VERSION} />
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-yellow-200/15 bg-yellow-200/10 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-100">
            Help Shape NUMA
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-100">
            Have an idea for a new feature or found something that isn’t working
            quite right? We’d love to hear from you.
          </p>

          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Your feedback helps make NUMA better for everyone.
          </p>
        </section>
      </main>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3">
      <p className="text-sm font-semibold text-slate-100">{question}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">{answer}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}