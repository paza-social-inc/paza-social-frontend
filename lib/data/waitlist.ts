import { z, infer as zInfer } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  role: z.enum(["creator", "brand"]),
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
