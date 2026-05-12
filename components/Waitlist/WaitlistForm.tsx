"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { joinWaitlist, waitlistSchema, type WaitlistPayload } from "@/lib/data/waitlist";

export default function WaitlistForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WaitlistPayload>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { role: "creator" },
  });

  const role = watch("role");

  const mutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      toast.success("You're on the list! We'll be in touch soon.");
      reset();
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Something went wrong. Please try again.");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-5 md:space-y-6"
    >
      <input type="hidden" {...register("role")} />

      <div className="flex w-fit items-center border border-[#8c8c8c]">
        <button
          type="button"
          aria-pressed={role === "creator"}
          onClick={() => setValue("role", "creator")}
          className={`px-5 py-2 text-[13px] font-medium uppercase tracking-wide transition-colors ${
            role === "creator"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-foreground hover:text-orange-500 dark:text-zinc-400"
          }`}
        >
          I&apos;m a Creator
        </button>
        <button
          type="button"
          aria-pressed={role === "brand"}
          onClick={() => setValue("role", "brand")}
          className={`px-5 py-2 text-[13px] font-medium uppercase tracking-wide transition-colors ${
            role === "brand"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-foreground hover:text-orange-500 dark:text-zinc-400"
          }`}
        >
          I&apos;m a Brand
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <Field>
          <FieldLabel
            htmlFor="waitlist-name"
            className="text-sm font-medium text-[#9e9e9e]"
          >
            Full name
          </FieldLabel>
          <Input
            id="waitlist-name"
            {...register("name")}
            placeholder="Your name"
            autoComplete="name"
            disabled={mutation.isPending}
            className="min-h-[44px] rounded-none border border-[#8c8c8c] bg-transparent px-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#FF6B00] focus-visible:ring-1 focus-visible:ring-[#FF6B00] sm:min-h-10 dark:text-white dark:placeholder:text-[#72716d]"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel
            htmlFor="waitlist-email"
            className="text-sm font-medium text-[#9e9e9e]"
          >
            Email address
          </FieldLabel>
          <Input
            id="waitlist-email"
            {...register("email")}
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            disabled={mutation.isPending}
            className="min-h-[44px] rounded-none border border-[#8c8c8c] bg-transparent px-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#FF6B00] focus-visible:ring-1 focus-visible:ring-[#FF6B00] sm:min-h-10 dark:text-white dark:placeholder:text-[#72716d]"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-none border border-neutral-900/25 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60 sm:w-auto sm:min-w-[220px] dark:border-white/80 dark:text-white"
      >
        {mutation.isPending ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <>
            Join the Waitlist
            <ArrowRight
              className="h-4 w-4 shrink-0 text-[#FF6B00]"
              aria-hidden
            />
          </>
        )}
      </button>
    </form>
  );
}
