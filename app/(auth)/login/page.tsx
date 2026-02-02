import { LoginForm } from "@/components/Auth/login/LoginForm"
import Authlayout from "@/components/layout/AuthLayout"

export default function page() {
    return (
        <Authlayout
            imageSide="right"
            title="Login"
            authImage="https://pazasocial.netlify.app/static/media/hero3.c6fd46a4b9c25cbcc75e.jpg"
        >
            <LoginForm />
        </Authlayout>
    )
}
