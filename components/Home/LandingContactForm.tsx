"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";

export function LandingContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();

    const body = {
      firstName,
      lastName,
      email: formData.get("email") ?? "",
      projectType: formData.get("projectType") ?? "",
      message: formData.get("message") ?? "",
    };

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Thank you! We'll be in touch soon.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const fieldClass =
    "min-h-[44px] rounded-none border border-[#8c8c8c] bg-transparent px-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#FF6B00] focus-visible:ring-1 focus-visible:ring-[#FF6B00] sm:min-h-10 dark:text-white dark:placeholder:text-[#72716d]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <Field>
          <FieldLabel htmlFor="landing-first-name" className="text-sm font-medium text-[#9e9e9e]">
            First name
          </FieldLabel>
          <Input
            id="landing-first-name"
            name="firstName"
            placeholder="First name"
            autoComplete="given-name"
            required
            className={fieldClass}
            disabled={status === "loading"}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="landing-last-name" className="text-sm font-medium text-[#9e9e9e]">
            Last name
          </FieldLabel>
          <Input
            id="landing-last-name"
            name="lastName"
            placeholder="Last name"
            autoComplete="family-name"
            required
            className={fieldClass}
            disabled={status === "loading"}
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="landing-email" className="text-sm font-medium text-[#9e9e9e]">
          Email address
        </FieldLabel>
        <Input
          id="landing-email"
          name="email"
          type="email"
          placeholder="you@email.com"
          required
          className={fieldClass}
          disabled={status === "loading"}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="landing-project-type" className="text-sm font-medium text-[#9e9e9e]">
          Inquiry type
        </FieldLabel>
        <select
          id="landing-project-type"
          name="projectType"
          className="flex h-11 w-full rounded-none border border-[#8c8c8c] bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none focus-visible:border-[#FF6B00] focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:opacity-50 dark:text-white"
          disabled={status === "loading"}
          defaultValue=""
        >
          <option value="" disabled>
            Select your inquiry type
          </option>
          <option value="brand">Brand campaign</option>
          <option value="creator">Creator partnership</option>
          <option value="production">Production / content</option>
          <option value="strategy">Strategy & consulting</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="landing-message" className="text-sm font-medium text-[#9e9e9e]">
          Your message
        </FieldLabel>
        <Textarea
          id="landing-message"
          name="message"
          rows={6}
          placeholder="Tell us about your project..."
          required
          className="min-h-[140px] resize-y rounded-none border border-[#8c8c8c] bg-transparent px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#FF6B00] focus-visible:ring-1 focus-visible:ring-[#FF6B00] dark:text-white dark:placeholder:text-[#72716d]"
          disabled={status === "loading"}
        />
      </Field>
      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-none border border-neutral-900/25 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60 sm:w-auto sm:min-w-[220px] dark:border-white/80 dark:text-white"
      >
        {status === "loading" ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <>
            Send Your Request
            <ArrowRight className="h-4 w-4 shrink-0 text-[#FF6B00]" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
