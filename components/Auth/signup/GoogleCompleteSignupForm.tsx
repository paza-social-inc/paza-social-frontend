"use client";

import Logo from "@/assets/Logo";
import { clearAuthToken } from "@/app/actions/auth";
import { EmailVerificationPrompt } from "@/components/Auth/verify-email/EmailVerificationPrompt";
import { useAuthStore } from "@/hooks/store/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsModal } from "@/components/Legal/TermsModal";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pazaApi, setApiAuthToken, getAuthHeaderConfig } from "@/lib/axiosClients";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiMailLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import { z, infer as zInfer } from "zod";

const BrandOnboarding = dynamic(() => import("@/components/Auth/accountType/Brand/BrandOnboarding"), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

const signupPasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

const sharedFields = {
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  password: signupPasswordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions to continue.",
  }),
} as const;

function buildSchema(accountType: "brand" | "creator") {
  const base = z.object(sharedFields).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
  if (accountType === "brand") return base;
  return base.extend({
    birthday: z
      .string()
      .min(1, "Birthday is required")
      .refine((val) => !Number.isNaN(Date.parse(val.trim())), {
        message: "Birthday must be a valid date",
      }),
  });
}

type FormData = zInfer<ReturnType<typeof buildSchema>>;

type FormValues = {
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  birthday?: string;
  gender?: string;
  phone?: string;
  city?: string;
};

interface GoogleCompleteSignupFormProps extends React.ComponentProps<"div"> {
  accountType: "brand" | "creator";
  defaults: {
    email?: string;
    firstname?: string;
    lastname?: string;
  };
}

export function GoogleCompleteSignupForm({
  accountType,
  defaults,
  className,
  ...props
}: GoogleCompleteSignupFormProps) {
  const schema = useMemo(() => buildSchema(accountType), [accountType]);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      firstname: defaults.firstname ?? "",
      lastname: defaults.lastname ?? "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      ...(accountType === "creator" ? { birthday: "" } : {}),
    },
  });
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [phase, setPhase] = useState<"form" | "onboarding" | "verification">("form");
  /** Email to display on the verification prompt after completing signup. */
  const [completedEmail, setCompletedEmail] = useState("");
  const logout = useAuthStore((s) => s.logout);

  // ── Bootstrap: ensure the auth token from the OAuth callback (stored in
  //     localStorage) is available to every pazaApi call, even when the
  //     axios request interceptor does not fire reliably in production. ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setApiAuthToken(token);
      }
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    const parsed = schema.parse(data);
    completeMutation.mutate(parsed);
  };

  const completeMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload: Record<string, string> = {
        firstname: data.firstname,
        lastname: data.lastname,
        accountType: accountType === "brand" ? "Business" : "Creator",
      };
      const pwd = (data as FormValues).password;
      if (pwd) payload.password = pwd;
      if (accountType === "creator") {
        const birthday = (data as { birthday?: string }).birthday;
        const b = typeof birthday === "string" ? birthday.trim() : "";
        if (b) payload.birthday = b;
      }
      const extra = data as FormValues;
      if (extra.gender) payload.gender = extra.gender;
      if (extra.phone) payload.phone = extra.phone;
      if (extra.city) payload.city = extra.city;
      // Explicitly pass the auth header so this critical call works even
      // when the axios interceptor or default headers fail.
      return pazaApi.put("/api/auth/google/complete-signup", payload, getAuthHeaderConfig());
    },
    onSuccess: async () => {
      setCompletedEmail(defaults.email ?? "");
      if (accountType === "brand") {
        // Ensure the token is wired into pazaApi so BrandOnboarding API calls
        // (auth/me, business/bootstrap, uploads/image) all succeed.
        const existingToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (existingToken) {
          setApiAuthToken(existingToken);
        }
        setPhase("onboarding");
      } else {
        // Creator: clear auth and go straight to verification.
        try { await clearAuthToken(); } catch {}
        if (typeof window !== "undefined") localStorage.removeItem("token");
        logout();
        setPhase("verification");
      }
    },
    onError: (err: unknown) => {
      const res = err as {
        response?: {
          data?: {
            details?: { field: string; message: string }[];
            message?: string;
          };
        };
      };
      const details = res.response?.data?.details;
      if (Array.isArray(details) && details.length) {
        toast.error(details.map((d) => d.message).join(". "));
      } else {
        toast.error(
          res.response?.data?.message ?? "Could not complete your profile.",
        );
      }
    },
  });

  const handleOnboardingDone = async () => {
    // Brand onboarding complete — now clear auth and show verification prompt.
    try { await clearAuthToken(); } catch {}
    if (typeof window !== "undefined") localStorage.removeItem("token");
    logout();
    setPhase("verification");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {phase === "verification" && completedEmail ? (
        <EmailVerificationPrompt email={completedEmail} className="max-w-lg mx-auto" />
      ) : phase === "onboarding" && accountType === "brand" ? (
        <BrandOnboarding
          embedded
          onComplete={handleOnboardingDone}
          stepOffset={1}
          totalSteps={4}
        />
      ) : phase === "onboarding" ? (
        // Creator — shouldn't reach here (onSuccess handles it), but fallback to verification.
        <EmailVerificationPrompt email={completedEmail} className="max-w-lg mx-auto" />
      ) : (
        <form
          key={accountType}
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "space-y-6",
            "rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5 sm:p-6",
          )}
        >
          <FieldGroup className="gap-4">
            <div className="flex justify-center w-full shadow">
              <Logo />
            </div>
            <div className="flex flex-col items-center gap-2 py-2 text-center sm:gap-3 sm:py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                Complete sign up · Google
              </p>
              <h1 className="text-2xl font-bold text-white">
                Finish your account
              </h1>
              <p className="text-sm text-zinc-400">
                {accountType === "creator"
                  ? "Confirm a few details — your creator profile journey comes next."
                  : "Confirm a few details — your brand profile journey comes next."}
              </p>
            </div>

            {accountType === "creator" ? (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-orange-600 transition-[width] duration-300 ease-out"
                    style={{ width: `${(1 / 3) * 100}%` }}
                  />
                </div>
                <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  Step 1 of 3 · Your details
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-orange-600 transition-[width] duration-300 ease-out"
                    style={{ width: `${(1 / 4) * 100}%` }}
                  />
                </div>
                <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  Step 1 of 4 · Your details
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstname">First name</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("firstname")}
                    id="firstname"
                    type="text"
                    placeholder="Jane"
                    required
                  />
                </InputGroup>
                {errors?.firstname && (
                  <FieldError>{errors.firstname.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="lastname">Last name</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("lastname")}
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </InputGroup>
                {errors?.lastname && (
                  <FieldError>{errors.lastname.message}</FieldError>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  value={defaults.email ?? ""}
                  readOnly
                  disabled
                />
                <InputGroupAddon align="inline-end" className="ps-3">
                  <RiMailLine />
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                From your Google account — this is what we&apos;ll verify.
              </FieldDescription>
            </Field>

            <p className="text-xs text-zinc-500">
              Set a password so you can also log in with your email.
            </p>

            {/* ── Password ── */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register("password")}
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <InputGroupAddon align="inline-end">
                  {/* ✅ Fixed: replaced undefined InputGroupButton with a plain button */}
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="flex items-center justify-center p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <RiEyeLine size={18} /> : <RiEyeOffLine size={18} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              {errors?.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>

            {/* ── Confirm Password ── */}
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register("confirmPassword")}
                  id="confirm-password"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <InputGroupAddon align="inline-end">
                  {/* ✅ Fixed: replaced undefined InputGroupButton with a plain button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="flex items-center justify-center p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                    aria-label={showConfirmPass ? "Hide password" : "Show password"}
                  >
                    {showConfirmPass ? <RiEyeLine size={18} /> : <RiEyeOffLine size={18} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              {errors?.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
            </Field>

            {accountType === "creator" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register("birthday")}
                      id="birthday"
                      type="date"
                      required
                    />
                  </InputGroup>
                  {errors?.birthday && (
                    <FieldError>{errors.birthday.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger id="gender" className="h-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 890"
                  />
                </InputGroup>
                {errors?.phone && (
                  <FieldError>{errors.phone.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="city">City (optional)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("city")}
                    id="city"
                    type="text"
                    placeholder="New York"
                  />
                </InputGroup>
                {errors?.city && <FieldError>{errors.city.message}</FieldError>}
              </Field>
            </div>

            <div className="w-full pt-1">
              <div className="flex items-start gap-3 w-full rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      onBlur={field.onBlur}
                      className="mt-0.5 shrink-0 border-border size-5"
                      aria-invalid={!!errors.agreeToTerms}
                    />
                  )}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-snug text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setTermsModalOpen(true)}
                      className="text-primary underline hover:no-underline touch-manipulation font-medium"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                  {errors?.agreeToTerms && (
                    <p className="text-xs text-destructive">
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
              <TermsModal open={termsModalOpen} onOpenChange={setTermsModalOpen} />
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full mt-5",
                "bg-orange-600 font-semibold text-black hover:bg-orange-500",
              )}
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}