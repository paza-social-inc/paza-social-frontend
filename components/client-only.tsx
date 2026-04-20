"use client";

import { useState, useEffect } from "react";

/**
 * Renders children only after mount. Use to avoid hydration mismatch when
 * children include Radix UI (or other libs) that generate different IDs on server vs client.
 * Server and initial client render show fallback; after hydration, children are shown.
 */
export function ClientOnly({
    children,
    fallback = null,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return <>{fallback}</>;
    return <>{children}</>;
}
