"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/store/auth/useAuth";

/**
 * Runs once on mount to set auth store user from localStorage token
 * so useAuth().user is available after page refresh.
 */
export function AuthRehydrate() {
    const rehydrate = useAuthStore((s) => s.rehydrate);
    useEffect(() => {
        rehydrate();
    }, [rehydrate]);
    return null;
}
