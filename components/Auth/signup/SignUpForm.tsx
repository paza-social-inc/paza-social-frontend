"use client"

import Logo from "@/assets/Logo"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput
} from "@/components/ui/input-group"
import { pazaApi } from "@/lib/axiosClients"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { RiEyeLine, RiEyeOffLine, RiMailLine } from "@remixicon/react"
import { useMutation } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z, infer as zInfer } from "zod"


const schema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long.")
        // .max(50, "Password cannot exceed 50 characters.")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
        .regex(/[0-9]/, "Password must include at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must include at least one special character."),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match."
    })

type FormData = zInfer<typeof schema>;

interface SignUpFormProps extends React.ComponentProps<'div'> {
    accountType: "brand" | "creator"
}


export function SignupForm({
    accountType,
    className,
    ...props
}: SignUpFormProps) {
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const router = useRouter()

    const onSubmit = (data: FormData) => {
        console.log(data);
        signUpMutation.mutate(data);
    };

    const signUpMutation = useMutation({
        mutationFn: (data: FormData) =>
            pazaApi.post("/api/auth/register", data)
        ,
        onSuccess: (res: AxiosResponse) => {
            toast.success("Registration successfull");
        },
        onError: (res: AxiosResponse) => {
            toast.error(res.data);
        }
    })

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {signUpMutation.isSuccess ? 
            <div className="flex flex-col gap-6 h-[calc(100vh-4rem)] justify-center">
                <h1 className="text-3xl font-bold">Registration successful</h1>
                <p className="text-muted-foreground text-base text-balance">
                    We have sent a verification email to your email address.
                    If you haven't received it, please check your spam folder.
                </p>
                <Button onClick={() => router.push('/login')}>Login</Button>
            </div>
            :
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup className="gap-4">
                    <div className="flex justify-center w-full shadow">
                        <Logo />
                    </div>
                    <div className="flex flex-col py-4 items-center gap-3 text-center">
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Start with the basics - we'll ask for more details later
                        </p>
                    </div>



                    <Button disabled={signUpMutation.isPending} variant="outline" type="button" onClick={() => window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&state=${accountType}`} className="w-full">
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
                                We'll use this to contact you and verify your account
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



                    <Button type="submit" className="w-full mt-4" disabled={signUpMutation.isPending}>
                        {signUpMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </Button>

                    <FieldDescription className="text-center">
                        Already have an account?{" "}
                        <a href="/login" className="underline">Sign in</a>
                    </FieldDescription>
                </FieldGroup>
            </form>
            }
        </div>
    )
}
