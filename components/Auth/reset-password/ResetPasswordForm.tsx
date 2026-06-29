"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { pazaApi } from "@/lib/axiosClients"
import axios from "axios"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z, infer as zInfer } from "zod"

const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type FormData = zInfer<typeof schema>

export function ResetPasswordForm({
    token,
    className,
    ...props
}: { token: string } & React.ComponentProps<"div">) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const resetPasswordMutation = useMutation({
        // Backend route is /api/auth/reset-password/:token — token goes in the URL path.
        mutationFn: (data: FormData) =>
            pazaApi.post(`/api/auth/reset-password/${token}`, { password: data.password }),
        onSuccess: () => {
            toast.success("Password reset successfully! You can now log in with your new password.")
            router.push("/login")
        },
        onError: (error: unknown) => {
            const msg = axios.isAxiosError(error)
                ? String(error.response?.data?.message ?? "")
                : ""
            toast.error(msg || "Failed to reset password. Please try again.")
        }
    })

    const onSubmit = (data: FormData) => {
        if (!token) {
            toast.error("Invalid reset link. Please request a new password reset.")
            return
        }
        resetPasswordMutation.mutate(data)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold">Reset Password</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="password">New Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your new password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </Field>
                </FieldGroup>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending}
                >
                    {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                </Button>
            </form>
        </div>
    )
}
