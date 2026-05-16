import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { waitlistSchema } from "@/lib/data/waitlist";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, role } = parsed.data;

    const supabase = createServerClient();

    const { error } = await supabase
      .from("waitlist")
      .insert({ name, email, role });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "This email is already on the waitlist." },
          { status: 409 },
        );
      }
      throw error;
    }

    const [firstName, ...rest] = name.trim().split(" ");

    try {
      await resend.contacts.create({
        email,
        firstName,
        lastName: rest.join(" ") || undefined,
        unsubscribed: false,
      });
    } catch (resendError) {
      console.error("Failed to create Resend contact for waitlist signup", {
        email,
        error: resendError,
      });
    }

    return NextResponse.json({
      message: "You're on the list. We'll be in touch soon.",
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}
