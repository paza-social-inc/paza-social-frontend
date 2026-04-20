"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      firstName: formData.get("firstName") ?? "",
      lastName: formData.get("lastName") ?? "",
      email: formData.get("email") ?? "",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="contact-first-name">First name</FieldLabel>
          <Input
            id="contact-first-name"
            name="firstName"
            placeholder="John"
            className="min-h-[44px] sm:min-h-0 touch-manipulation border-zinc-700 bg-black text-white placeholder:text-zinc-500"
            disabled={status === "loading"}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-last-name">Last name</FieldLabel>
          <Input
            id="contact-last-name"
            name="lastName"
            placeholder="Doe"
            className="min-h-[44px] sm:min-h-0 touch-manipulation border-zinc-700 bg-black text-white placeholder:text-zinc-500"
            disabled={status === "loading"}
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="contact-email">Email address</FieldLabel>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="min-h-[44px] sm:min-h-0 touch-manipulation border-zinc-700 bg-black text-white placeholder:text-zinc-500"
          disabled={status === "loading"}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell us about your project..."
          required
          className="min-h-[120px] touch-manipulation resize-y border-zinc-700 bg-black text-white placeholder:text-zinc-500"
          disabled={status === "loading"}
        />
      </Field>
      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="min-h-[48px] px-6 touch-manipulation bg-orange-500 hover:bg-orange-500/90 text-white"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Send your request
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
