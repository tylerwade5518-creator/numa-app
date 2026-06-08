import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("daily_content")
      .select("content_json")
      .eq("date", today)
      .single();

    if (!error && data?.content_json) {
      return NextResponse.json(data.content_json);
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const fallback = await fetch(`${siteUrl}/daily.json`, {
      cache: "no-store",
    });

    const fallbackJson = await fallback.json();

    return NextResponse.json(fallbackJson);
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