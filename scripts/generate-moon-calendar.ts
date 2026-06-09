import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import * as Astronomy from "astronomy-engine";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  const text = fs.readFileSync(envPath, "utf8");

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").replace(/^"|"$/g, "");

    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function normalizeDegrees(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function moonSign(date: Date) {
  const moon = Astronomy.EclipticGeoMoon(date);
  const lon = normalizeDegrees(moon.lon);
  return SIGNS[Math.floor(lon / 30)];
}

function moonPhase(date: Date) {
  const moon = Astronomy.EclipticGeoMoon(date);
  const sun = Astronomy.SunPosition(date);

  const angle = normalizeDegrees(moon.lon - sun.elon);

  if (angle < 22.5 || angle >= 337.5) return "New Moon";
  if (angle < 67.5) return "Waxing Crescent";
  if (angle < 112.5) return "Waxing Quarter";
  if (angle < 157.5) return "Waxing Gibbous";
  if (angle < 202.5) return "Full Moon";
  if (angle < 247.5) return "Waning Gibbous";
  if (angle < 292.5) return "Waning Quarter";
  return "Waning Crescent";
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function main() {
  const rows = [];

  const start = new Date("2026-01-01T12:00:00Z");
  const end = new Date("2027-12-31T12:00:00Z");

  for (
    let d = new Date(start);
    d <= end;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    rows.push({
      date: isoDate(d),
      moon_phase: moonPhase(d),
      moon_sign: moonSign(d),
    });
  }

  const { error } = await supabase
    .from("moon_calendar")
    .upsert(rows, { onConflict: "date" });

  if (error) {
    throw error;
  }

  console.log(`Inserted/updated ${rows.length} moon_calendar rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});