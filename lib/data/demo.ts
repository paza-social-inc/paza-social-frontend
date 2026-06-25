import { z, infer as zInfer } from "zod";

// export const demoRequestSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.email("Please enter a valid email address"),
//   company: z.string().min(1, "Company name is required"),
//   phone: z.string().optional(),
//   role: z.enum(
//     ["brand", "creator", "agency", "creator_manager", "other"],
//     { error: "Please select your role" },
//   ),
//   message: z.string().max(500, "Message must be under 500 characters").optional(),
// });

export const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["brand", "creator", "agency", "creator_manager", "other"]),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
}).superRefine((data, ctx) => {
  if (["brand", "agency"].includes(data.role) && !data.company?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Company name is required for brands and agencies",
      path: ["company"],
    });
  }
});

export type DemoRequestPayload = zInfer<typeof demoRequestSchema>;

export async function requestDemo(
  data: DemoRequestPayload,
): Promise<{ message: string }> {
  const res = await fetch("/api/demo", {
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
