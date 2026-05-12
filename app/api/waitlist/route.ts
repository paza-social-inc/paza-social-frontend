import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
    }

    // TODO: connect your ESP here (Brevo, Loops, Resend Audiences, etc.)
    // e.g. await addContactToList({ name, email, role })

    console.log("Waitlist signup:", { name, email, role });

    return NextResponse.json({ message: "You're on the list. We'll be in touch soon." });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}