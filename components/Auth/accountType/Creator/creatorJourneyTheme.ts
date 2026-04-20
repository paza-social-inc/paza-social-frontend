/** Shared visual tokens for the creator signup / profile journey (dark + orange accent). */
export const cj = {
    shell: "bg-black text-zinc-100",
    card: "rounded-2xl border border-zinc-800/90 bg-zinc-950/40",
    labelMuted: "text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500",
    labelField: "text-[13px] font-medium text-zinc-300",
    input:
        "rounded-xl border border-zinc-700/90 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-500 shadow-sm transition-colors focus-visible:border-orange-500/60 focus-visible:ring-2 focus-visible:ring-orange-500/20",
    textarea: "rounded-xl border border-zinc-700/90 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-500 min-h-[120px] focus-visible:border-orange-500/60 focus-visible:ring-2 focus-visible:ring-orange-500/20",
    chip: "rounded-full border border-zinc-600 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500",
    chipActive: "border-orange-500 bg-orange-600 text-white hover:bg-orange-600 hover:border-orange-500",
    btnSecondary: "rounded-xl border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700",
    btnPrimary: "rounded-xl bg-orange-600 font-semibold text-black hover:bg-orange-500",
} as const;
