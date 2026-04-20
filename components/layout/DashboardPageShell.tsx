import { cn } from "@/lib/utils";

/**
 * Mobile-first content frame for dashboard routes: consistent padding, max width,
 * safe-area bottom inset, and horizontal overflow containment.
 */
export function DashboardPageShell({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "mx-auto w-full min-w-0 max-w-[1600px]",
                "px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8",
                "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
                className
            )}
        >
            {children}
        </div>
    );
}

/** Shared TabsList styling for dashboard tab strips (stack/wrap on narrow viewports). */
export const DASHBOARD_TABS_LIST_CLASS =
    "inline-flex h-auto min-h-10 w-full flex-wrap items-center justify-start gap-1 rounded-lg bg-muted/80 p-1 sm:h-10 sm:flex-nowrap";

/**
 * Use only when there are exactly two tabs: equal-width controls on phones, inline pill row from `sm` up.
 */
export const DASHBOARD_TABS_LIST_TWO_UP_CLASS =
    "grid h-auto min-h-11 w-full grid-cols-2 gap-1 rounded-lg bg-muted/80 p-1 sm:inline-flex sm:h-10 sm:min-h-10 sm:w-full sm:flex-nowrap sm:items-center sm:justify-start sm:gap-1";
