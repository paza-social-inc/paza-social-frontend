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

    return (
        <div className="w-full rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-6 sm:p-10">
            {status === "verifying" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                    <RiLoader2Line className="h-10 w-10 animate-spin text-orange-500" />
                    <p className="text-sm text-zinc-400">Verifying your email…</p>
                </div>
            ) : status === "success" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <RiCheckLine className="h-8 w-8 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Email verified</h1>
                    <p className="max-w-sm text-sm text-zinc-400">
                        {message || "Your email has been verified. You can now log in to your account."}
                    </p>
                    <Button asChild className="mt-2 w-full max-w-xs bg-orange-600 text-black hover:bg-orange-500">
                        <Link href="/login">Continue to login</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                        <RiErrorWarningLine className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Verification failed</h1>
                    <p className="max-w-sm text-sm text-zinc-400">
                        {message || "This verification link is invalid or has expired."}
                    </p>
                    <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
                        <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                            <Link href="/login">Back to login</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
