export interface WaitlistPayload {
  name: string;
  email: string;
  role: "creator" | "brand";
}

export async function joinWaitlist(data: WaitlistPayload): Promise<{ message: string }> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw json;

  return json;
}
