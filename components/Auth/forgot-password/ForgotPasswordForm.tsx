"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { pazaApi } from "@/lib/axiosClients"
import axios from "axios"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z, infer as zInfer } from "zod"

const schema = z.object({
    email: z.email("Please enter a valid email address"),
})

type FormData = zInfer<typeof schema>

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const router = useRouter()
    const forgotPasswordMutation = useMutation({
        mutationFn: (data: FormData) => pazaApi.post("/auth/forgot-password", data),
        onSuccess: () => {
            toast.success("Password reset email sent! Please check your inbox.")
            setTimeout(() => router.push("/login"), 2000)
        },
        onError: (error: unknown) => {
            const msg = axios.isAxiosError(error)
                ? String(error.response?.data?.message ?? "")
                : ""
            toast.error(msg || "Failed to send reset email. Please try again.")
        }
    })

    const onSubmit = (data: FormData) => {
        forgotPasswordMutation.mutate(data)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email address and we&apos;ll send you a link to reset your password
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full"
                    >
                        {forgotPasswordMutation.isPending ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Sending...
                            </>
                        ) : (
                            "Send reset email"
                        )}
                    </Button>
                </FieldGroup>
            </form>

            <div className="text-center text-sm">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}
