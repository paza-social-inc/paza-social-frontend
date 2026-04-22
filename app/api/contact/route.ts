import { NextResponse } from "next/server";

export type ContactBody = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  /** Landing page project-type select (optional) */
  projectType?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const { email, message } = body;

    if (!email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: "Email and message are required." },
        { status: 400 }
      );
    }

    // Optional: forward to your backend or email service
    // const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, { method: "POST", body: JSON.stringify(body) });
    // For now we just validate and return success
    return NextResponse.json({
      message: "Thank you! We'll be in touch soon.",
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
