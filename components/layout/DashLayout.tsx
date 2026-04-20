"use client";

import { AuthRehydrate } from "@/components/Auth/AuthRehydrate";
import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { ClientOnly } from "@/components/client-only";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import NavMenu from "@/components/Dashboard/nav-menu/nav-menu";

function DashboardShell({
    children,
    /**
     * When false, main is height-constrained (100svh) so full-height views (inbox) can scroll internally.
     * When true (default), page uses natural document scrolling — required for mobile touch scrolling.
     */
    scrollableMain = true,
}: {
    children: React.ReactNode;
    scrollableMain?: boolean;
}) {
    return (
        <SidebarProvider>
            <AuthRehydrate />
            <AppSidebar />
            <SidebarInset
                className={
                    scrollableMain
                        ? "min-w-0 flex-1 flex-col"
                        : "h-svh max-h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                }
            >
                <div
                    className={
                        scrollableMain
                            ? "flex w-full min-w-0 flex-col"
                            : "flex h-full min-h-0 w-full flex-1 flex-col"
                    }
                >
                    <header className="sticky top-0 z-40 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all ease-linear">
                        <div className="flex w-full min-w-0 items-stretch gap-0 py-2 sm:py-3 md:py-4">
                            <div className="flex shrink-0 items-start pt-1 sm:items-center sm:pt-0">
                                <SidebarTrigger className="ms-1 sm:ms-2" />
                            </div>
                            <Separator
                                orientation="vertical"
                                className="mx-1 hidden h-6 self-center sm:mx-2 md:flex data-[orientation=vertical]:h-5"
                            />
                            <div className="min-w-0 flex-1 pr-1 sm:pr-2">
                                <NavMenu />
                            </div>
                        </div>
                    </header>
                    <div
                        className={
                            scrollableMain
                                ? "w-full min-w-0 overflow-x-hidden pb-[env(safe-area-inset-bottom)]"
                                : "flex min-h-0 flex-1 flex-col overflow-hidden"
                        }
                    >
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

/** Placeholder layout (no Radix primitives) to avoid hydration mismatch with Radix-generated IDs. */
function DashboardShellFallback({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh w-full min-w-0 bg-background">
            <div className="hidden w-16 shrink-0 border-r border-sidebar-border bg-sidebar md:block lg:w-64" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-40 flex shrink-0 items-center gap-2 border-b bg-background px-3 py-3 sm:px-4">
                    <div className="h-8 w-8 shrink-0 rounded-md bg-muted" aria-hidden />
                    <div className="flex-1" />
                </header>
                <div className="w-full min-w-0 overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function DashLayout({
    children,
    scrollableMain = true,
}: {
    children: React.ReactNode;
    scrollableMain?: boolean;
}) {
    return (
        <ClientOnly
            fallback={<DashboardShellFallback>{children}</DashboardShellFallback>}
        >
            <DashboardShell scrollableMain={scrollableMain}>{children}</DashboardShell>
        </ClientOnly>
    );
}
