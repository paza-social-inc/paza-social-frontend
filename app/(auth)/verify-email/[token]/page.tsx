"use client";

import { use } from "react";
import { VerifyEmailForm } from "@/components/Auth/verify-email/VerifyEmailForm";
import Authlayout from "@/components/layout/AuthLayout";

export default function VerifyEmailPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    // In Next.js 15+ params is a Promise; unwrap it with the `use()` hook.
    const resolved = use(params);
    return (
        <Authlayout
            imageSide="right"
            title="Verify Email"
            authImage="https://pazasocial.netlify.app/static/media/hero3.c6fd46a4b9c25cbcc75e.jpg"
        >
            <VerifyEmailForm token={resolved.token} />
        </Authlayout>
    );
}
