import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<{
      name: unknown;
      email: unknown;
      role: unknown;
    }>;

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const rawEmail = typeof payload.email === "string" ? payload.email.trim() : "";
    const role = payload.role === "creator" || payload.role === "brand" ? payload.role : null;
    const atIndex = rawEmail.lastIndexOf("@");

    let email = "";
    let isValidEmail = false;

    if (atIndex > 0 && atIndex < rawEmail.length - 1) {
      const localPart = rawEmail.slice(0, atIndex);
      const domainPart = rawEmail.slice(atIndex + 1);
      const domainSegments = domainPart.split(".");
      const topLevelDomain = domainSegments[domainSegments.length - 1];

      const hasValidDomainStructure =
        !domainPart.startsWith(".") &&
        !domainPart.endsWith(".") &&
        domainPart.includes(".") &&
        !domainPart.includes("..") &&
        domainSegments.every((segment) => segment.length > 0) &&
        topLevelDomain.length >= 2;

      if (localPart && !localPart.includes("..") && hasValidDomainStructure) {
        email = `${localPart}@${domainPart.toLowerCase()}`;
        isValidEmail = true;
      }
    }

    if (!name || !email || !isValidEmail || !role) {
      return NextResponse.json(
        { message: "Please provide a valid name, email, and role." },
        { status: 400 }
      );
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

    return NextResponse.json({ message: "You're on the list. We'll be in touch soon." });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
