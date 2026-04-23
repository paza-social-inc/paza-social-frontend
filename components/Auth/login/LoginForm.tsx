"use client";

import { setAuthToken } from "@/app/actions/auth";
import { useAuthStore } from "@/hooks/store/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { pazaApi } from "@/lib/axiosClients";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RiEyeLine,
    RiEyeOffLine,
    RiMailLine,
} from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z, infer as zInfer } from "zod";

const schema = z.object({
    email: z.email(),
    password: z.string().min(3, "Password cant be less than 3 characters"),
})

type FormData = zInfer<typeof schema>;


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [showPass, setShowPass] = React.useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    })


    const setAuth = useAuthStore((s) => s.setAuth);

    const loginMutation = useMutation({
        mutationFn: (data: FormData) => pazaApi.post("/api/auth/login", data),
        onSuccess: async (res: AxiosResponse) => {
            toast.success("Login successful!");
            const token = res.data.token;
            const user = res.data.user;
            await setAuthToken(token);
            if (typeof window !== "undefined") window.localStorage.setItem("token", token);
            if (token && user) {
                setAuth(token, {
                    id: user.id != null ? String(user.id) : undefined,
                    email: user.email ?? "",
                    firstname: user.firstName,
                    lastname: user.lastName,
                    accountType: user.accountType,
                });
            }
            window.location.href = "/overview";
        },
        onError: (res: AxiosResponse) => {
            toast.error(res.data || "Invalid Credentials")
        }
    })



    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    }


    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your paza account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <InputGroup className="border-border bg-background dark:bg-input/30">
                        <InputGroupInput
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="bg-background text-foreground placeholder:text-muted-foreground dark:bg-transparent"
                            required
                        />
                        <InputGroupAddon align="inline-end" className="ps-3">
                            <RiMailLine />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors && errors.email && <p className="text-xs text-destructive">{errors.email?.message}</p>}
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                            href="/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <InputGroup className="border-border bg-background dark:bg-input/30">
                        <InputGroupInput
                            {...register("password")}
                            id="password"
                            type={showPass ? "text" : "password"}
                            className="bg-background text-foreground placeholder:text-muted-foreground dark:bg-transparent"
                            required
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton onClick={() => setShowPass(!showPass)}>
                                {showPass ? <RiEyeLine /> : <RiEyeOffLine />}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {errors && errors.password && <p className="text-xs text-destructive">{errors.password?.message}</p>}
                </Field>
                <Field>
                    <Button type="submit" disabled={loginMutation.isPending}>{
                        loginMutation.isPending ?
                            <Loader2 className="animate-spin h-4 w-4" /> : "Login"
                    }</Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button disabled={loginMutation.isPending} variant="outline" type="button" onClick={() => window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
                            ></path>
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
                            ></path>
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
                            ></path>
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53"
                            ></path>
                            <path fill="none" d="M1 1h22v22H1z"></path>
                        </svg>
                        Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/account-type" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
