import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="max-w-md space-y-4">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold tracking-tight">404</h1>
                    <p className="text-muted-foreground text-sm">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>
                <div>
                    <Link
                        href="/"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
