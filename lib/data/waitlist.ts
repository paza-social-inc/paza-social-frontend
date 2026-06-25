import { z, infer as zInfer } from "zod";

// Waitlist

export const waitlistSchema = z.object({
  role: z.enum(["creator", "brand", "agency", "community", "manager"]),
  intent: z.string().min(1, "Please select an intent"),
  optimization: z.string().min(1, "Please select what matters most"),
  identity: z.string().min(1, "Please provide your digital footprint"),
  email: z.string().email("Please enter a valid email address").optional(),
});

export type WaitlistPayload = zInfer<typeof waitlistSchema>;

export async function joinWaitlist(
  data: WaitlistPayload,
): Promise<{ message: string }> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? "Something went wrong. Please try again.");
  }
  return json;
}

// Demo Request

export const demoRequestSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select your role"),
  company: z.string().optional(),
  message: z.string().optional(),
});

export type DemoRequestPayload = zInfer<typeof demoRequestSchema>;

export async function requestDemo(
  data: DemoRequestPayload,
): Promise<{ message: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/demo/request`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? "Something went wrong. Please try again.");
  }
  return json;
}