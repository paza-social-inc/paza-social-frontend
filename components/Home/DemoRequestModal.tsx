"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { demoRequestSchema, type DemoRequestPayload, requestDemo } from "@/lib/data/demo";

const ROLES = [
  { value: "brand", label: "Brand" },
  { value: "creator", label: "Creator" },
  { value: "agency", label: "Agency" },
  { value: "creator_manager", label: "Creator Manager" },
  { value: "other", label: "Other" },
];

const COMPANY_REQUIRED_ROLES = ["brand", "agency"];

interface DemoRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoRequestModal({ open, onOpenChange }: DemoRequestModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DemoRequestPayload>({
    resolver: zodResolver(demoRequestSchema),
  });

  const selectedRole = watch("role");
  const companyRequired = COMPANY_REQUIRED_ROLES.includes(selectedRole);

  const mutation = useMutation({
    mutationFn: requestDemo,
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleClose = (open: boolean) => {
    if (!open) {
      setTimeout(() => setSubmitted(false), 300);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <h3 className="text-lg font-semibold">Request received!</h3>
            <p className="text-sm text-muted-foreground">
              We'll be in touch within 24 hours. Check your inbox for a confirmation.
            </p>
            <Button className="mt-4" onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Join Our Waitlist</DialogTitle>
              <DialogDescription>
                Tell us about yourself and we'll be in touch within 24 hours.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4 mt-2"
            >
              {/* Role */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  I am a
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setValue("role", r.value as DemoRequestPayload["role"], { shouldValidate: true })}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm font-medium transition-colors text-left",
                        selectedRole === r.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role.message}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="demo-name">Full name</Label>
                <Input
                  id="demo-name"
                  placeholder="Jane Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="demo-email">Email</Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Company — required for brand/agency, optional otherwise */}
              <div className="space-y-1.5">
                <Label htmlFor="demo-company">
                  Company{" "}
                  {!companyRequired && (
                    <span className="text-muted-foreground">(optional)</span>
                  )}
                </Label>
                <Input
                  id="demo-company"
                  placeholder={companyRequired ? "Your company name" : "Acme Inc."}
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="demo-message">
                  What are you hoping to achieve?{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <textarea
                  id="demo-message"
                  rows={3}
                  placeholder="Tell us about your goals..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}