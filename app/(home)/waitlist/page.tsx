import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import HomeLayout from "@/components/Home/Layout";
import WaitlistContainer from "@/components/Waitlist/WaitlistContainer";
import WaitlistHero from "@/components/Waitlist/WaitlistHero";
import WaitlistForm from "@/components/Waitlist/WaitlistForm";
import WaitlistPerks from "@/components/Waitlist/WaitlistPerks";

export default function WaitlistPage() {
  return (
    <HomeLayout>
      <section className="bg-background pt-14 pb-16 text-foreground sm:pb-24" id="waitlist">

        <WaitlistHero />

        <WaitlistContainer>
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_380px] lg:gap-20 xl:grid-cols-[1fr_440px]">
              <div>
                <p className="mb-6 text-[13px] uppercase tracking-widest text-zinc-500">
                  Reserve your spot
                </p>
                <WaitlistForm />
              </div>
              <WaitlistPerks />
            </div>
          </div>
        </WaitlistContainer>

        <WaitlistContainer>
          <div className="mt-20 border-t border-zinc-800 pt-10 sm:mt-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="max-w-[640px] text-[clamp(1.6rem,6vw,3.6rem)] uppercase leading-[1.08] tracking-[-0.02em]">
                The creator economy is changing.{" "}
                <span className="text-zinc-500">Be early.</span>
              </h2>
              <Link
                href="/about"
                className="inline-flex shrink-0 items-center gap-2 border-b border-zinc-500 pb-1 text-[14px] transition-colors hover:border-orange-500 hover:text-orange-500 sm:text-[16px]"
              >
                Learn about Paza
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </WaitlistContainer>

      </section>
    </HomeLayout>
  );
}
