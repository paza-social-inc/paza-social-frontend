import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { waitlistSchema } from "@/lib/data/waitlist";

// Instantiate lazily: `new Resend(undefined)` throws "Missing API key" at
// module-load time, which crashes `next build` during page-data collection
// even though the key is only needed at request time.
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

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

    const { role, intent, optimization, identity, email } = parsed.data;

    const supabase = createServerClient();
    const { error } = await supabase
      .from("waitlist")
      .insert({ role, intent, optimization, identity, email: email ?? null });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "This email is already on the waitlist." },
          { status: 409 },
        );
      }
      throw error;
    }

    if (email) {
      const resend = getResend();
      if (!resend) {
        console.warn("RESEND_API_KEY not set; skipping Resend contact creation.");
      } else {
        try {
          await resend.contacts.create({
            email,
            unsubscribed: false,
          });
        } catch (resendError) {
          console.error("Failed to create Resend contact", { email, error: resendError });
        }
      }
    }

    return NextResponse.json({
      message: "You're on the list. We'll be in touch soon.",
    });
  } catch(error) {
    if (error) {
  console.error("Supabase insert error:", error); // add this
  // if (error.code === "23505") {
  //   return NextResponse.json(
  //     { message: "This email is already on the waitlist." },
  //     { status: 409 },
  //   );
  // }
  throw error;
}
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}
