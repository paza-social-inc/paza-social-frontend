import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("waitlist")
      .insert({ name, email, role });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "This email is already on the waitlist." }, { status: 409 });
      }
      throw error;
    }

    const [firstName, ...rest] = name.trim().split(" ");
    await resend.contacts.create({
      email,
      firstName,
      lastName: rest.join(" ") || undefined,
      unsubscribed: false,
    });

    return NextResponse.json({ message: "You're on the list. We'll be in touch soon." });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
