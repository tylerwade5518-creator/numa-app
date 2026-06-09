import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data: moonRow, error: moonError } = await supabase
  .from("moon_calendar")
  .select("moon_phase, moon_sign")
  .eq("date", today)
  .single();

if (moonError || !moonRow) {
  throw new Error(`No moon_calendar row found for ${today}`);
}

const moonPhaseLabel = moonRow.moon_phase;
const moonSignLabel = moonRow.moon_sign;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
Create NUMA daily astrology content for ${today}.

Return ONLY valid JSON.
Use this exact moon data:
Moon Phase: ${moonPhaseLabel}
Moon Sign: ${moonSignLabel}

Use the exact moon phase and moon sign provided above.
The values in the sky object must exactly match those values.
Do not wrap it in markdown.
Do not use \`\`\`json.
Do not include any explanation.

Use this shape:
{
  "schemaVersion": 1,
  "date": "${today}",
  "sky": {
    "moonPhaseLabel": "${moonPhaseLabel}",
    "moonSignLabel": "${moonSignLabel}"
  },
  "metersIntro": {
    "title": "Daily Meters",
    "subtitle": ""
  },
  "signs": {
    "aries": {
      "title": "",
      "summary": "",
      "meters": {
        "energy": 0,
        "connection": 0,
        "flow": 0
      },
      "metersHero": ""
    }
  },
  "starSync": {
    "aries_taurus": {
      "friendship": {
        "score": 0,
        "sentence": ""
      },
      "romance": {
        "score": 0,
        "sentence": ""
      }
    }
  }
}

Rules:
- Include all 12 zodiac signs.
- Include Star Sync for every sign pair.
- Include metersIntro with a short daily subtitle based on the overall mood of the meters.

NUMA Voice:
- Write like a wise friend, not a fortune teller.
- Sound intelligent, modern, grounded, and thoughtful.
- Avoid cheesy astrology language.
- Avoid phrases like "the universe wants", "the stars say", "trust your intuition", "your destiny", or "cosmic energy is flowing".
- Make the writing feel useful even to someone who does not fully believe in astrology.
- Make users feel understood, not predicted.

Horoscope Quality:
- Every horoscope should include one practical insight or takeaway.
- Focus on decisions, confidence, relationships, momentum, communication, creativity, and personal growth.
- Occasionally challenge the user instead of always encouraging them.
- Each sign should feel unique.
- Do not repeat the same sentence structure across signs.
- Avoid vague lines that could apply to anyone.

Title Rules:
- Create short, intriguing titles.
- Titles should create curiosity.
- Use 2 to 4 words.
- Good examples: "The First Move", "Hidden Momentum", "A Better Question", "The Quiet Advantage", "Forward Motion", "Signals and Noise".
- Avoid generic titles like "Cosmic Flow", "Dynamic Energy", "Bright Path", or "New Beginnings".

Summary Rules:
- Write 2 to 3 complete sentences.
- Target 40 to 60 words.
- Keep it clean, direct, and easy to read on mobile.
- Do not make it overly romantic, dramatic, or mystical.
- The summary should feel personal, but not fake-specific.

Meter Rules:
- Energy, Connection, and Flow scores should be between 55 and 98.
- Most scores should fall between 65 and 90.
- Only occasionally exceed 92.
- Different signs should have noticeably different meter patterns.
- metersHero must be one of: "energy", "connection", or "flow".
- metersHero should match the strongest or most important meter for that sign.

Meters Intro Rules:
- metersIntro.title should always be "Daily Meters".
- metersIntro.subtitle should be 2 to 6 words.
- Keep it punchy and memorable.
- No punctuation.
- Match the overall mood of today's meters.
- Example subtitles:
  "Connection is strong reach out"
  "Energy is strong use it"
  "Clear signals today"
  "Energy takes center stage"
  "You are flowing"

Star Sync Rules:
- Friendship should focus on communication, trust, timing, and social energy.
- Romance should focus on chemistry, emotional rhythm, attraction, and long-term potential.
- Keep each Star Sync sentence short, specific, and not cheesy.
- Star Sync scores should be between 55 and 98.
`;
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = response.output_text.trim();

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const contentJson = JSON.parse(cleanedText);



    const { error } = await supabase.from("daily_content").upsert(
      {
        date: today,
        content_json: contentJson,
      },
      { onConflict: "date" }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      date: today,
      content: contentJson,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}