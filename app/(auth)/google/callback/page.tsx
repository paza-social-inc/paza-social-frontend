"use client"

import { setAuthToken } from "@/app/actions/auth"
import { pazaApi } from "@/lib/axiosClients"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const code = searchParams.get("code")

    const googleAuthMutation = useMutation({
        mutationFn: (code: string) => pazaApi.post("/auth/google/callback", { code }),
        onSuccess: async (res) => {
            const token = res.data.token
            await setAuthToken(token)
            if (typeof window !== "undefined") window.localStorage.setItem("token", token)
            toast.success("Successfully logged in with Google!")
            window.location.href = "/overview"
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Google authentication failed. Please try again.")
            router.push("/login")
        }
    })

    useEffect(() => {
        if (code) {
            googleAuthMutation.mutate(code)
        } else {
            toast.error("Authorization code not found.")
            router.push("/login")
        }
    }, [code])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2">Authenticating with Google...</p>
            </div>
        </div>
    )
}
