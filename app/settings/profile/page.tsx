// app/settings/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  username: string | null;

  birthdate: string | null;
  sign: string | null;
  created_at: string | null;
  updated_at: string | null;

  // Tap Share core
  email: string | null; // Tap Share email (NOT auth email)
  phone: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;

  // Expanded socials
  linkedin: string | null;
  x: string | null;
  youtube: string | null;

  // New
  whatsapp: string | null;
  snapchat: string | null;
  venmo: string | null;
  cashapp: string | null;
};

function isValidUsername(u: string) {
  return /^[a-zA-Z0-9._-]+$/.test(u);
}

function cleanHandle(s: string) {
  return s.replace(/^@/, "").trim();
}

export default function ProfileSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  // Identity
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  // Contact
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Socials
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");
  const [youtube, setYoutube] = useState("");

  // New
  const [whatsapp, setWhatsapp] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [venmo, setVenmo] = useState("");
  const [cashapp, setCashapp] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      setOk(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session?.user) {
        router.replace(`/login?redirect=${encodeURIComponent("/settings/profile")}`);
        return;
      }

      const uid = session.user.id;
      if (!mounted) return;
      setUserId(uid);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (!mounted) return;

      if (profErr) {
        setError(profErr.message);
        setLoading(false);
        return;
      }

      // If profile row missing, create it
      if (!prof) {
        const { error: insErr } = await supabase.from("profiles").insert({
          user_id: uid,
          display_name: session.user.user_metadata?.display_name ?? null,
          username: session.user.user_metadata?.username ?? null,
          updated_at: new Date().toISOString(),
        });

        if (insErr) {
          setError(insErr.message);
          setLoading(false);
          return;
        }

        const { data: prof2, error: prof2Err } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", uid)
          .maybeSingle();

        if (prof2Err) {
          setError(prof2Err.message);
          setLoading(false);
          return;
        }

        hydrateFromProfile((prof2 || {}) as Partial<ProfileRow>);
        setLoading(false);
        return;
      }

      hydrateFromProfile(prof as Partial<ProfileRow>);
      setLoading(false);
    }

    function hydrateFromProfile(p: Partial<ProfileRow>) {
      setDisplayName(p.display_name ?? "");
      setUsername(p.username ?? "");

      setPhone(p.phone ?? "");
      setContactEmail(p.email ?? "");
      setWebsite(p.website ?? "");

      setInstagram(p.instagram ?? "");
      setTiktok(p.tiktok ?? "");
      setLinkedin((p as any).linkedin ?? "");
      setX((p as any).x ?? "");
      setYoutube((p as any).youtube ?? "");

      setWhatsapp((p as any).whatsapp ?? "");
      setSnapchat((p as any).snapchat ?? "");
      setVenmo((p as any).venmo ?? "");
      setCashapp((p as any).cashapp ?? "");
    }

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSave() {
    setError(null);
    setOk(null);

    if (!userId) {
      setError("Not logged in.");
      return;
    }

    const dn = displayName.trim();
    const un = username.trim();

    if (!dn) {
      setError("Display name is required.");
      return;
    }
    if (!un || !isValidUsername(un)) {
      setError("Username can only contain letters, numbers, dots, dashes, and underscores.");
      return;
    }

    // normalize-ish
    const ph = phone.trim();
    const em = contactEmail.trim().toLowerCase();
    const web = website.trim();

    const ig = cleanHandle(instagram);
    const tt = cleanHandle(tiktok);
    const li = linkedin.trim();

    const xh = cleanHandle(x);
    const yt = youtube.trim();

    const wa = whatsapp.trim();
    const sc = cleanHandle(snapchat);
    const vm = cleanHandle(venmo);
    const ca = cashapp.trim().replace(/^\$/, "").trim();

    setSaving(true);
    try {
      const { error: updErr } = await supabase
        .from("profiles")
        .update({
          display_name: dn,
          username: un,

          phone: ph || null,
          email: em || null,
          website: web || null,

          instagram: ig || null,
          tiktok: tt || null,
          linkedin: li || null,
          x: xh || null,
          youtube: yt || null,

          whatsapp: wa || null, // could be phone or wa.me url
          snapchat: sc || null,
          venmo: vm || null,
          cashapp: ca || null,

          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updErr) throw updErr;
      setOk("Saved.");
    } catch (e: any) {
      setError(e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
        <div className="text-sm text-slate-300">Loading profile…</div>
      </div>
    );
  }

  const initialLetter = (displayName.trim()?.[0] || "U").toUpperCase();

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
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Settings</p>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Profile & Tap Share</h1>
            <p className="text-xs text-slate-300">Update what Tap Share can pull from.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-slate-500 bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800/90"
          >
            Back to Dashboard
          </button>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-700/70 bg-red-950/40 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
        {ok && (
          <div className="rounded-2xl border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-100">
            {ok}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Identity</h2>
          <p className="mt-1 text-[11px] text-slate-400">Shown on Tap Share.</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="relative h-14 w-14 rounded-full bg-slate-800/80 ring-2 ring-yellow-200/70">
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-yellow-100">
                {initialLetter}
              </span>
            </div>

            <div className="flex-1 space-y-3 text-xs">
              <Field label="Display name" value={displayName} onChange={setDisplayName} placeholder="Tyler" />
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-300">Username / handle</label>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-900/80 px-2 py-1 text-[11px] text-slate-400">@</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
                    placeholder="numa_ty"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Letters, numbers, dots, underscores, dashes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Contact Channels</h2>
          <p className="mt-1 text-[11px] text-slate-400">Used when selected in Tap Share.</p>

          <div className="mt-4 space-y-3 text-xs">
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 (555) 123-4567" />
            <Field
              label="Email (Tap Share)"
              value={contactEmail}
              onChange={setContactEmail}
              placeholder="you@example.com"
              type="email"
              note="This does not change your login email — it’s just what gets shared."
            />
            <Field label="Website" value={website} onChange={setWebsite} placeholder="https://your-site.com" />
            <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="@your_ig" />
            <Field label="TikTok" value={tiktok} onChange={setTiktok} placeholder="@your_tiktok" />

            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">More</p>
            </div>

            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/yourname OR handle" />
            <Field label="X" value={x} onChange={setX} placeholder="@yourhandle" />
            <Field label="YouTube" value={youtube} onChange={setYoutube} placeholder="@channel OR channel URL" />

            <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="+1 555 123 4567 OR wa.me link" />
            <Field label="Snapchat" value={snapchat} onChange={setSnapchat} placeholder="@snapuser" />
            <Field label="Venmo" value={venmo} onChange={setVenmo} placeholder="@venmouser" />
            <Field label="Cash App" value={cashapp} onChange={setCashapp} placeholder="$cashTag" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-red-400/80 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-500/20"
            >
              Log out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  note?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] text-slate-300">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-yellow-300"
        placeholder={props.placeholder}
        type={props.type || "text"}
      />
      {props.note ? <p className="text-[11px] text-slate-500">{props.note}</p> : null}
    </div>
  );
}
