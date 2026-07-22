"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="max-w-md space-y-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
                    <p className="text-muted-foreground text-sm">
                        A client-side error occurred while loading this page. It may be caused by a network
                        issue or a temporary glitch.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button variant="outline" onClick={() => (window.location.href = "/")}>
                        Go home
                    </Button>
                </div>
                {error.digest && (
                    <p className="text-muted-foreground text-xs">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    );
}
