import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { demoRequestSchema } from "@/lib/data/demo";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL;
const FROM_EMAIL = process.env.DEMO_FROM_EMAIL;

const ROLE_LABELS: Record<string, string> = {
  brand: "Brand",
  creator: "Creator",
  agency: "Agency",
  creator_manager: "Creator Manager",
  other: "Other",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = demoRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { name, email, role, company, message } = parsed.data;
    const roleLabel = ROLE_LABELS[role] ?? role;

    // Notify admin
    await resend.emails.send({
      from: `Paza Social <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New Demo Request — ${name} (${roleLabel})`,
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
                <h1>New Demo Request — PAZA</h1>
              </div>
              <div class="body">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                <div class="field">
                  <div class="label">Role</div>
                  <div class="value">${roleLabel}</div>
                </div>
                ${company ? `
                <div class="field">
                  <div class="label">Company</div>
                  <div class="value">${company}</div>
                </div>` : ""}
                ${message ? `
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value">${message}</div>
                </div>` : ""}
                <hr class="divider" />
                <p class="note">Hit <strong>Reply</strong> to respond directly to ${email}.</p>
                <a href="mailto:${email}?subject=Your Paza Demo" class="cta">Reply to ${name}</a>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Confirmation to requester
    await resend.emails.send({
      from: `Paza Social <${FROM_EMAIL}>`,
      to: email,
      subject: `We received your demo request`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #f5f5f5; margin: 0; padding: 0; }
              .wrapper { max-width: 560px; margin: 40px auto; background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
              .header { background: #ff5c00; padding: 24px 32px; }
              .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #fff; }
              .body { padding: 32px; }
              .body p { color: #ccc; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <h1>Thanks, ${name}!</h1>
              </div>
              <div class="body">
                <p>We've received your demo request and will be in touch within 24 hours.</p>
                <p>In the meantime, feel free to explore <a href="https://paza.social" style="color: #ff5c00;">paza.social</a>.</p>
                <p style="margin-top: 32px; color: #666; font-size: 13px;">— The Paza Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "Demo request received. We'll be in touch within 24 hours." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[demo/route] Error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}