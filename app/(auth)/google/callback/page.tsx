import { Suspense } from "react";
import GoogleCallbackPageClient from "./GoogleCallbackPageClient";

function GoogleCallbackFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
            Loading…
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<GoogleCallbackFallback />}>
            <GoogleCallbackPageClient />
        </Suspense>
    );
}
