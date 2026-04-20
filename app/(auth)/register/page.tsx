"use client"
import { SignupForm } from "@/components/Auth/signup/SignUpForm";
import Authlayout from "@/components/layout/AuthLayout";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterInner() {
    const params = useSearchParams();
    const accountType = params.get("accountType") as "brand" | "creator";

    if (!accountType ||
        accountType !== "brand" && accountType !== "creator") {
        redirect("/account-type");
    }

    return (
        <SignupForm accountType={accountType} className="max-w-2xl mx-auto min-h-screen py-12" />
    );
}

export default function page() {
    return (
        <Authlayout
            imageSide="left"
            title="Register"
            authImage="https://pazasocial.netlify.app/static/media/hero2.273b3d3ea29814271bd2.jpg"
        >
            <Suspense fallback={<div className="mx-auto max-w-2xl min-h-screen py-12 text-center text-sm text-muted-foreground">Loading…</div>}>
                <RegisterInner />
            </Suspense>
        </Authlayout>
    )
}
