import { ForgotPasswordForm } from "@/components/Auth/forgot-password/ForgotPasswordForm"
import Authlayout from "@/components/layout/AuthLayout"

export default function ForgotPasswordPage() {
    return (
        <Authlayout
            imageSide="right"
            title="Forgot Password"
            authImage="https://pazasocial.netlify.app/static/media/hero3.c6fd46a4b9c25cbcc75e.jpg"
        >
            <ForgotPasswordForm />
        </Authlayout>
    )
}
