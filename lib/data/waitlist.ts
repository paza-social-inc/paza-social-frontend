import { z, infer as zInfer } from "zod";

export const waitlistSchema = z.object({
  role: z.enum(["creator", "brand", "agency", "community", "manager"]),
  intent: z.string().min(1, "Please select an intent"),
  optimization: z.string().min(1, "Please select what matters most"),
  identity: z.string().min(1, "Please provide your digital footprint"),
  email: z.email("Please enter a valid email address").optional(),
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
