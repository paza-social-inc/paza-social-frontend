"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="dark">
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
                    <div className="max-w-md space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">
                                Critical error
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                The application failed to load. This is usually caused by a network issue
                                while loading essential resources. Please try again.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => reset()}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                Go home
                            </button>
                        </div>
                    </div>
                </div>
                <style>{`
                    .dark { --background: hsl(0 0% 3.9%); --foreground: hsl(0 0% 98%); --primary: hsl(0 0% 98%); --primary-foreground: hsl(0 0% 9%); --muted-foreground: hsl(0 0% 63.9%); --accent: hsl(0 0% 14.9%); --accent-foreground: hsl(0 0% 98%); --input: hsl(0 0% 14.9%); --border: hsl(0 0% 14.9%); --ring: hsl(0 0% 83.1%); --radius: 0.5rem; }
                `}</style>
            </body>
        </html>
    );
}
