import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/Auth/reset-password/ResetPasswordForm"
import Authlayout from "@/components/layout/AuthLayout"

function ResetPasswordFallback() {
    return (
        <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
            Loading…
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Authlayout
            imageSide="right"
            title="Reset Password"
            authImage="https://pazasocial.netlify.app/static/media/hero3.c6fd46a4b9c25cbcc75e.jpg"
        >
            <Suspense fallback={<ResetPasswordFallback />}>
                <ResetPasswordForm />
            </Suspense>
        </Authlayout>
    )
}
