import { Suspense } from "react";
import InboxPageClient from "./InboxPageClient";

function InboxFallback() {
    return (
        <div className="relative flex h-full min-h-0 w-full flex-1 items-center justify-center bg-background text-muted-foreground">
            Loading…
        </div>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={<InboxFallback />}>
            <InboxPageClient />
        </Suspense>
    );
}
