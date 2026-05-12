import { z, infer as zInfer } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  role: z.enum(["creator", "brand"]),
});

export type WaitlistPayload = zInfer<typeof waitlistSchema>;

export async function joinWaitlist(data: WaitlistPayload): Promise<{ message: string }> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const responseBody = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : typeof responseBody === "string" && responseBody.trim().length > 0
          ? responseBody
          : "Something went wrong. Please try again.";

    throw new Error(message);
  }

  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "message" in responseBody &&
    typeof responseBody.message === "string"
  ) {
    return { message: responseBody.message };
  }

  if (typeof responseBody === "string" && responseBody.trim().length > 0) {
    return { message: responseBody };
  }

  return { message: "You're on the list. We'll be in touch soon." };
}
