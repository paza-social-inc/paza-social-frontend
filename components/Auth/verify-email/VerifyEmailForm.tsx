"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyEmailToken } from "@/lib/data/auth";
import { RiCheckLine, RiErrorWarningLine, RiLoader2Line } from "@remixicon/react";
import Link from "next/link";

type Status = "verifying" | "success" | "error";

export function VerifyEmailForm({ token }: { token: string }) {
    const [status, setStatus] = useState<Status>("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token was provided in the link.");
            return;
        }
        let active = true;
        (async () => {
            const res = await verifyEmailToken(token);
            if (!active) return;
            setStatus(res.success ? "success" : "error");
            setMessage(res.message);
        })();
        return () => {
            active = false;
        };
    }, [token]);

    if (status === "verifying") {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <RiLoader2Line className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying your email…</p>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <RiCheckLine className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Email verified</h1>
                <p className="max-w-sm text-sm text-muted-foreground">
                    {message || "Your email has been verified. You can now log in to your account."}
                </p>
                <Button asChild className="mt-2 w-full max-w-xs">
                    <Link href="/login">Continue to login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <RiErrorWarningLine className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verification failed</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
                {message || "This verification link is invalid or has expired."}
            </p>
            <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
                <Button asChild variant="secondary">
                    <Link href="/login">Back to login</Link>
                </Button>
            </div>
        </div>
    );
}
