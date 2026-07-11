"use client"

import Logo from "@/assets/Logo"
import { setAuthToken, clearAuthToken } from "@/app/actions/auth"
import { EmailVerificationPrompt } from "@/components/Auth/verify-email/EmailVerificationPrompt"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { TermsModal } from "@/components/Legal/TermsModal"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput
} from "@/components/ui/input-group"
import { useAuthStore } from "@/hooks/store/auth/useAuth"
import { pazaApi, setApiAuthToken } from "@/lib/axiosClients"
import { decodeJwtPayload, getEmailFromPayload, getUserIdStringFromPayload, getAccountTypeFromPayload } from "@/lib/jwtPayload"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { RiEyeLine, RiEyeOffLine, RiMailLine } from "@remixicon/react"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, type Resolver } from "react-hook-form"
import toast from "react-hot-toast"
import { z, infer as zInfer } from "zod"

const BrandOnboarding = dynamic(() => import("@/components/Auth/accountType/Brand/BrandOnboarding"), {
    loading: () => (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    ),
})


const signupPasswordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

const signupSharedFields = {
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email(),
    password: signupPasswordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
        message: "You must accept the Terms and Conditions to continue.",
    }),
} as const;

const passwordMatchRefine = {
    path: ["confirmPassword"] satisfies PropertyKey[],
    message: "Passwords do not match.",
};

function buildSignupSchema(accountType: "brand" | "creator") {
    if (accountType === "brand") {
        return z
            .object(signupSharedFields)
            .refine((data) => data.password === data.confirmPassword, passwordMatchRefine);
    }
    return z
        .object({
            ...signupSharedFields,
            birthday: z
                .string()
                .min(1, "Birthday is required")
                .refine((val) => !Number.isNaN(Date.parse(val.trim())), {
                    message: "Birthday must be a valid date",
                }),
        })
        .refine((data) => data.password === data.confirmPassword, passwordMatchRefine);
}

type FormData = zInfer<ReturnType<typeof buildSignupSchema>>;

/** Single shape for RHF so creator-only fields (e.g. birthday) are valid field paths. */
type SignupFormValues = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
    birthday?: string;
};

interface SignUpFormProps extends React.ComponentProps<'div'> {
    accountType: "brand" | "creator"
}


export function SignupForm({
    accountType,
    className,
    ...props
}: SignUpFormProps) {
    const searchParams = useSearchParams();
    const schema = useMemo(() => buildSignupSchema(accountType), [accountType]);
    const { handleSubmit, register, setValue, control, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(schema) as Resolver<SignupFormValues>,
        defaultValues:
            accountType === "creator"
                ? { agreeToTerms: false, birthday: "" }
                : { agreeToTerms: false },
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const setAuth = useAuthStore((s) => s.setAuth);
    const [phase, setPhase] = useState<"form" | "onboarding" | "verification">("form");
    /** Email of the just-signed-up user, used to show the verification prompt. */
    const [signedUpEmail, setSignedUpEmail] = useState("");

    useEffect(() => {
        const raw = searchParams.get("email");
        if (!raw) return;
        const decoded = decodeURIComponent(raw.trim());
        if (decoded.includes("@")) {
            setValue("email", decoded);
        }
    }, [searchParams, setValue]);

    const onSubmit = (data: SignupFormValues) => {
        const parsed = schema.parse(data);
        signUpMutation.mutate(parsed);
    };

    const signUpMutation = useMutation({
        mutationFn: (data: FormData) => {
            const payload: Record<string, string> = {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
                accountType: accountType === "brand" ? "Business" : "Creator",
            };
            if (accountType === "creator") {
                const birthday = (data as { birthday?: string }).birthday;
                const b = typeof birthday === "string" ? birthday.trim() : "";
                if (b) payload.birthday = b;
            }
            return pazaApi.post("/api/auth/register", payload);
        },
        onSuccess: async (res, variables: FormData) => {
            // Store the token so BrandOnboarding API calls work (they require auth).
            const token: string | undefined = (res as { data?: { token?: string } })?.data?.token;
            if (token) {
                try { await setAuthToken(token); } catch { /* cookie optional */ }
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", token);
                }
                // Set on pazaApi defaults so BrandOnboarding API calls work even if
                // the request interceptor does not fire (observed in production builds).
                setApiAuthToken(token);
                // Build user object from jwt payload to set zustand auth
                const payload = decodeJwtPayload(token);
                setAuth(token, {
                    id: getUserIdStringFromPayload(payload),
                    email: getEmailFromPayload(payload),
                    accountType: getAccountTypeFromPayload(payload),
                });
            }
            setSignedUpEmail(variables.email);
            if (accountType === "brand") {
                // Keep auth alive for BrandOnboarding API calls.
                setPhase("onboarding");
            } else {
                // Creator: clear auth and go straight to verification.
                clearAuthToken().catch(() => {});
                if (typeof window !== "undefined") localStorage.removeItem("token");
                useAuthStore.getState().logout();
                setPhase("verification");
            }
        },
        onError: (err: unknown) => {
            const res = err as { response?: { data?: { details?: { field: string; message: string }[]; message?: string } } };
            const details = res.response?.data?.details;
            if (Array.isArray(details) && details.length) {
                toast.error(details.map((d) => d.message).join(". "));
            } else {
                toast.error(res.response?.data?.message ?? "Registration failed.");
            }
        }
    })

    const handleGoogleSignup = () => {
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
            response_type: "code",
            scope: "openid email profile",
            state: accountType, // "creator" or "brand"
            prompt: "select_account",
        });

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {phase === "verification" && signedUpEmail ? (
                <EmailVerificationPrompt email={signedUpEmail} className="max-w-lg mx-auto" />
            ) : phase === "onboarding" && accountType === "brand" ? (
                <BrandOnboarding
                    embedded
                    onComplete={async () => {
                        // Clear auth so user must verify before accessing the app.
                        await clearAuthToken().catch(() => {});
                        if (typeof window !== "undefined") localStorage.removeItem("token");
                        useAuthStore.getState().logout();
                        setPhase("verification");
                    }}
                    stepOffset={1}
                    totalSteps={4}
                />
            ) : phase === "onboarding" ? (
                // Creator — go straight to verification after signup.
                <EmailVerificationPrompt email={signedUpEmail} className="max-w-lg mx-auto" />
            ) : (
                <form
                    key={accountType}
                    onSubmit={handleSubmit(onSubmit)}
                    className={cn(
                        "space-y-6",
                        (accountType === "creator" || accountType === "brand") &&
                            "rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5 sm:p-6"
                    )}
                >
                    <FieldGroup className="gap-4">
                        <div className="flex justify-center w-full shadow">
                            <Logo />
                        </div>
                        <div
                            className={cn(
                                "flex flex-col items-center gap-2 py-2 text-center sm:gap-3 sm:py-4"
                            )}
                        >
                            {accountType === "creator" || accountType === "brand" ? (
                                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                                    Sign up · Credentials
                                </p>
                            ) : null}
                            <h1
                                className={cn(
                                    "text-2xl font-bold",
                                    (accountType === "creator" || accountType === "brand") && "text-white"
                                )}
                            >
                                Create your account
                            </h1>
                            <p
                                className={cn(
                                    "text-sm text-balance",
                                    accountType === "creator" || accountType === "brand"
                                        ? "text-zinc-400"
                                        : "text-muted-foreground"
                                )}
                            >
                                {accountType === "creator"
                                    ? "Start with the basics — your creator profile journey comes next."
                                    : accountType === "brand"
                                    ? "Start with the basics — your brand profile journey comes next."
                                    : "Start with the basics - we'll ask for more details later"}
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
                                    Step 1 of 3 · Credentials
                                </p>
                            </div>
                        ) : null}

                        {accountType === "brand" ? (
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                                    <div
                                        className="h-full rounded-full bg-orange-600 transition-[width] duration-300 ease-out"
                                        style={{ width: `${(1 / 4) * 100}%` }}
                                    />
                                </div>
                                <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                                    Step 1 of 4 · Credentials
                                </p>
                            </div>
                        ) : null}



                        <Button
                            disabled={signUpMutation.isPending}
                            variant="outline"
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53"
                                />
                                <path fill="none" d="M1 1h22v22H1z" />
                            </svg>
                            <span className="ml-2">Sign up with Google</span>
                        </Button>

                        <div className="relative my-4 flex items-center justify-center">
                            <hr className="w-1/2 border-input-border" />
                            <span className="px-4 text-sm text-muted-foreground">Or</span>
                            <hr className="w-1/2 border-input-border" />
                        </div>

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

                        {accountType === "creator" ? (
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
                        ) : null}

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput {...register("email")} id="email" type="email" placeholder="your@email.com" required />
                                <InputGroupAddon align="inline-end" className="ps-3">
                                    <RiMailLine />
                                </InputGroupAddon>
                            </InputGroup>
                            {errors && errors.email ?
                                <FieldError>
                                    {errors.email.message}
                                </FieldError> :
                                <FieldDescription>
                                    We&apos;ll use this to contact you and verify your account
                                </FieldDescription>
                            }
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput {...register("password")} id="password" type={showPass ? "text" : "password"} placeholder="••••••••" required />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <RiEyeLine /> : <RiEyeOffLine />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>

                            {errors && errors.password &&
                                <FieldError>
                                    {errors.password.message}
                                </FieldError>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput {...register("confirmPassword")} id="confirm-password" type={showConfirmPass ? "text" : "password"} placeholder="••••••••" required />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                        {showConfirmPass ? <RiEyeLine /> : <RiEyeOffLine />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>

                            {errors && errors.confirmPassword &&
                                <FieldError>
                                    {errors.confirmPassword.message}
                                </FieldError>}
                        </Field>

                        {/* Terms: full-width row above submit, checkbox + label as one clear block */}
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
                                        <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>
                                    )}
                                </div>
                            </div>
                            <TermsModal open={termsModalOpen} onOpenChange={setTermsModalOpen} />
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "w-full mt-5",
                                (accountType === "creator" || accountType === "brand") &&
                                    "bg-orange-600 font-semibold text-black hover:bg-orange-500"
                            )}
                            disabled={signUpMutation.isPending}
                        >
                            {signUpMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </Button>

                        <FieldDescription className="text-center">
                            Already have an account?{" "}
                            <a href="/login" className="underline">Sign in</a>
                        </FieldDescription>
                    </FieldGroup>
                </form>
            )}
        </div>
    )
}
