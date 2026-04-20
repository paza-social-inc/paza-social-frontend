import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StepSection({
    kicker,
    title,
    children,
    className,
}: {
    /** Small uppercase label above the block */
    kicker?: string;
    /** Optional section title */
    title?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("space-y-4", className)}>
            {kicker ? (
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{kicker}</p>
            ) : null}
            {title ? <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3> : null}
            {children}
        </div>
    );
}
