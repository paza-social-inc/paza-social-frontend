const PERKS = [
  {
    label: "Early access",
    description: "Be among the first to use the platform before public launch.",
  },
  {
    label: "Launch updates",
    description: "Direct updates on features, milestones, and go-live dates.",
  },
  {
    label: "Founder pricing",
    description: "Exclusive rates locked in for early supporters only.",
  },
];

export default function WaitlistPerks() {
  return (
    <div className="space-y-8">
      {PERKS.map(({ label, description }) => (
        <div key={label} className="border-t border-zinc-800 pt-6">
          <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-wide text-orange-500">
            <span className="block h-1.5 w-1.5 shrink-0 bg-orange-500" aria-hidden />
            {label}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-foreground dark:text-zinc-400">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}