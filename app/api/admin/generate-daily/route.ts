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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
Create NUMA daily astrology content for ${today}.

Return ONLY valid JSON.
Do not wrap it in markdown.
Do not use \`\`\`json.
Do not include any explanation.

Use this shape:
{
  "schemaVersion": 1,
  "date": "${today}",
  "sky": {
    "moonPhaseLabel": "Waxing Gibbous",
    "moonSignLabel": "Scorpio"
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
- Tone: premium, cosmic, modern, not cheesy.
- Keep summaries short.
- Scores should be 55 to 98.
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