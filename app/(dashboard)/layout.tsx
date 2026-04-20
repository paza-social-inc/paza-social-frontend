"use client";

import { usePathname } from "next/navigation";
import DashLayout from "@/components/layout/DashLayout";
import { DashboardPageShell } from "@/components/layout/DashboardPageShell";

/** Full-bleed routes (no horizontal shell padding — e.g. split inbox/chat). */
function isFlushDashboardPath(pathname: string): boolean {
    return pathname === "/inbox" || pathname.startsWith("/inbox/");
}

export default function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? "";
    const flush = isFlushDashboardPath(pathname);

    return (
        <DashLayout scrollableMain={!flush}>
            {flush ? children : <DashboardPageShell>{children}</DashboardPageShell>}
        </DashLayout>
    );
}
