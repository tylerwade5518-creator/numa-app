import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: usersData, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error("User lookup error:", usersError);
      return NextResponse.json(
        { error: "Could not process reset request." },
        { status: 500 }
      );
    }

    const user = usersData.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    // Always return success so people cannot check which emails exist.
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

    await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("used_at", null);

    const { error: insertError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        email: normalizedEmail,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Token insert error:", insertError);
      return NextResponse.json(
        { error: "Could not create reset token." },
        { status: 500 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://app.numabands.com";

    const resetUrl = `${siteUrl}/reset-password?token=${rawToken}`;

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          message: "Reset link created.",
          resetUrl,
        });
      }

      return NextResponse.json(
        { error: "Email provider is not configured." },
        { status: 500 }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: normalizedEmail,
        subject: "Reset your NUMA Bands password",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Reset your NUMA Bands password</h2>
            <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
            <p>
              <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:white;text-decoration:none;border-radius:8px;">
                Reset Password
              </a>
            </p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      console.error("Email send error:", errorText);

      return NextResponse.json(
        { error: "Could not send reset email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Password reset request error:", err);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}