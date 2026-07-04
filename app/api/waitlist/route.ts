import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { waitlistSchema } from "@/lib/data/waitlist";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL as string;
const FROM_EMAIL = process.env.EMAIL_FROM as string;

const ROLE_LABELS: Record<string, string> = {
  brand: "Brand",
  agency: "Agency",
  creator: "Creator",
  community: "Community",
  manager: "Creator Manager",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { role, intent, optimization, identity, email } = parsed.data;
    const roleLabel = ROLE_LABELS[role] ?? role;

    // Notify the admin. replyTo is only set when the submitter provided an
    // email (brands/agencies do; creators often don't — only a profile link).
    await resend.emails.send({
      from: `Paza Social <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      ...(email ? { replyTo: email } : {}),
      subject: `New waitlist signup — ${roleLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #f5f5f5; margin: 0; padding: 0; }
              .wrapper { max-width: 560px; margin: 40px auto; background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
              .header { background: #ff5c00; padding: 24px 32px; }
              .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: 0.02em; }
              .body { padding: 32px; }
              .field { margin-bottom: 20px; }
              .label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin-bottom: 4px; }
              .value { font-size: 15px; color: #f5f5f5; }
              .divider { border: none; border-top: 1px solid #222; margin: 24px 0; }
              .note { font-size: 13px; color: #666; }
              .cta { display: inline-block; margin-top: 24px; padding: 12px 24px; background: #ff5c00; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>New Waitlist Signup — PAZA</h1>
              </div>
              <div class="body">
                <div class="field">
                  <div class="label">Role</div>
                  <div class="value">${roleLabel}</div>
                </div>
                <div class="field">
                  <div class="label">Intent</div>
                  <div class="value">${intent}</div>
                </div>
                <div class="field">
                  <div class="label">Optimizing for</div>
                  <div class="value">${optimization}</div>
                </div>
                <div class="field">
                  <div class="label">Digital footprint</div>
                  <div class="value">${identity}</div>
                </div>
                ${
                  email
                    ? `<div class="field">
                        <div class="label">Email</div>
                        <div class="value">${email}</div>
                      </div>`
                    : ""
                }
                <hr class="divider" />
                <p class="note">${
                  email
                    ? `Hit <strong>Reply</strong> to respond directly to ${email}.`
                    : `No email provided — reach out via their digital footprint above.`
                }</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "You're on the list! We'll be in touch soon." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[waitlist/route] Error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
