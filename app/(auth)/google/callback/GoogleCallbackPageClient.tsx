"use client";

import { setAuthToken } from "@/app/actions/auth";
import { pazaApi } from "@/lib/axiosClients";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GoogleCallbackPageClient() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const [ready, setReady] = useState(false);

    const googleAuthMutation = useMutation({
        mutationFn: (code: string) =>
            pazaApi.post("/api/auth/google/callback", { code }),

        onSuccess: async (res) => {

            const token = res.data.token;

            await setAuthToken(token);

            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
            }

            toast.success("Successfully logged in with Google!");

            window.location.href = "/overview";
        },

        onError: (error: unknown) => {

            const msg = axios.isAxiosError(error)
                ? String(error.response?.data?.message ?? "")
                : "";

            toast.error(
                msg || "Google authentication failed."
            );

            router.push("/login");
        },
    });

    useEffect(() => {

        /**
         * Wait until params are hydrated
         */

        const code = searchParams.get("code");

        if (!ready) {
            setReady(true);
            return;
        }

        if (code) {

            console.log("GOOGLE CODE:", code);

            googleAuthMutation.mutate(code);

        } else {

            console.error("NO GOOGLE CODE FOUND");

            toast.error("Authorization code not found.");

            router.push("/login");
        }

    }, [searchParams, ready]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="mt-2">
                    Authenticating with Google...
                </p>
            </div>
        </div>
    );
}