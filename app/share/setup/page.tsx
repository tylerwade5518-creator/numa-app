"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type ShareFields = {
  name: boolean;
  phone: boolean;
  email: boolean;
  website: boolean;
  instagram: boolean;
  tiktok: boolean;
};

function randomToken(len = 32) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

export default function ShareSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bandCode = useMemo(() => {
    return (searchParams.get("band") || "").trim();
  }, [searchParams]);

  const [fields, setFields] = useState<ShareFields>({
    name: true,
    phone: false,
    email: false,
    website: false,
    instagram: false,
    tiktok: false,
  });

  const [loading, setLoading] = useState(false);
  const [armedToken, setArmedToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function armBand() {
    setErrorMsg(null);

    if (!bandCode) {
      setErrorMsg("Missing band code.");
      return;
    }

    setLoading(true);
    try {
      // 1) Must be logged in (owner)
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        setErrorMsg("Please sign in first.");
        return;
      }

      // 2) Lookup band by band_code
      const { data: band, error: bandErr } = await supabase
        .from("bands")
        .select("id, band_code, owner_user_id")
        .eq("band_code", bandCode)
        .maybeSingle();

      if (bandErr || !band) {
        setErrorMsg("Band not found.");
        return;
      }

      // 3) Verify owner (basic check)
      if (!band.owner_user_id || band.owner_user_id !== user.id) {
        setErrorMsg("You don’t own this band.");
        return;
      }

      // 4) Pull profile fields (adjust table/column names if needed)
      // If you already store these in a profiles table, this will work.
      // If not, tell me and we’ll change this to read from your existing place.
      const { data: profile, error: profErr } = await supabase
        .from("profiles")
        .select("full_name, phone, email, website, instagram, tiktok")
        .eq("id", user.id)
        .maybeSingle();

      if (profErr) {
        setErrorMsg("Could not load your profile info (profiles table).");
        return;
      }

      const values = {
        name: profile?.full_name || "",
        phone: profile?.phone || "",
        email: profile?.email || "",
        website: profile?.website || "",
        instagram: profile?.instagram || "",
        tiktok: profile?.tiktok || "",
      };

      // 5) Build snapshot (fields + values)
      const token = randomToken(36);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const prefs_snapshot = {
        fields,
        values,
        band_code: bandCode,
      };

      // 6) Insert share token
      const { error: insErr } = await supabase.from("share_tokens").insert({
        token,
        user_id: user.id,
        band_id: band.id,
        prefs_snapshot,
        status: "active",
        expires_at: expiresAt,
      });

      if (insErr) {
        setErrorMsg(insErr.message);
        return;
      }

      setArmedToken(token);
    } catch (e: any) {
      setErrorMsg(e?.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  function ToggleRow({
    label,
    k,
  }: {
    label: string;
    k: keyof ShareFields;
  }) {
    return (
      <label
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span>{label}</span>
        <input
          type="checkbox"
          checked={fields[k]}
          onChange={(e) => setFields((p) => ({ ...p, [k]: e.target.checked }))}
        />
      </label>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Share Tap</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Choose what to share. When you press <b>Arm Band</b>, the next tap will
        show your share page one time.
      </p>

      <div style={{ marginTop: 18, padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}>
        <div style={{ opacity: 0.7, marginBottom: 10 }}>
          Band: <b>{bandCode || "—"}</b>
        </div>

        <ToggleRow label="Name" k="name" />
        <ToggleRow label="Phone" k="phone" />
        <ToggleRow label="Email" k="email" />
        <ToggleRow label="Website" k="website" />
        <ToggleRow label="Instagram" k="instagram" />
        <ToggleRow label="TikTok" k="tiktok" />

        <button
          onClick={armBand}
          disabled={loading || !!armedToken}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            cursor: loading || !!armedToken ? "not-allowed" : "pointer",
            opacity: loading || !!armedToken ? 0.7 : 1,
          }}
        >
          {armedToken ? "Band Armed" : loading ? "Arming…" : "Arm Band"}
        </button>

        {armedToken && (
          <div style={{ marginTop: 12, opacity: 0.85 }}>
            Armed. Next tap will open the share page.
            <div style={{ marginTop: 8 }}>
              Test link:{" "}
              <a href={`/share/${armedToken}`} style={{ textDecoration: "underline" }}>
                /share/{armedToken}
              </a>
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ marginTop: 12, color: "#ff6b6b" }}>{errorMsg}</div>
        )}

        <button
          onClick={() => router.back()}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
