import WaitlistContainer from "./WaitlistContainer";

function SectionEyebrow({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-[12px] font-medium text-orange-500">
      <span className="block h-2 w-2 shrink-0 bg-orange-500" aria-hidden />
      <span>{label}</span>
    </p>
  );
}

export default function WaitlistHero() {
  return (
    <WaitlistContainer>
      <div className="border-x border-zinc-800 py-16 sm:py-24">
        <SectionEyebrow label="Early Access" />
        <h1 className="mt-5 max-w-[900px] text-[clamp(2.4rem,10vw,5.5rem)] leading-[1.04] tracking-[-0.03em]">
          Be the first inside{" "}
          <span className="text-orange-500">Paza Social.</span>
        </h1>
        <p className="mt-6 max-w-[540px] text-[15px] leading-[1.75] text-foreground sm:text-[17px] dark:text-zinc-300">
          We&apos;re building the platform where brands and creators run campaigns,
          build partnerships, and grow together. Join the waitlist and get in
          before everyone else.
        </p>
      </div>
    </WaitlistContainer>
  );
}
