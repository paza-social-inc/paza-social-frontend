"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Play } from "lucide-react";
import { scrollPageToTop } from "@/lib/scrollWithLenis";
import {
  campaignOutdoorCelebration,
  campaignPortraitElder,
  campaignRedWallTrio,
  campaignStreetCrew,
  campaignTradingFloor,
  campaignUrbanBodega,
} from "@/assets";
import HomeLayout from "./Layout";

const CONTAINER = "px-4 sm:px-6 lg:px-10 xl:px-14 max-w-[1220px] mx-auto";

function SectionEyebrow({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-[12px] font-medium text-orange-500">
      <span className="block h-2 w-2 shrink-0 bg-orange-500" aria-hidden />
      <span>{label}</span>
    </p>
  );
}

export default function About() {
  return (
    <HomeLayout hideFooter>
      <section className="bg-background pt-14 text-foreground pb-16 sm:pb-20">
        <div className={`${CONTAINER} border-x border-zinc-800`}>
          <div className="relative h-[250px] sm:h-[420px] md:h-[560px] overflow-hidden">
            <Image src={campaignPortraitElder} alt="About hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/60 flex items-center justify-center"
                aria-label="Play video"
              >
                <Play className="ml-1 h-8 w-8 sm:h-10 sm:w-10 fill-foreground text-foreground dark:fill-white dark:text-white" />
              </button>
            </div>
          </div>
        </div>

<div className={`${CONTAINER} mt-12 sm:mt-24`}>
  <div className="grid grid-cols-1 md:grid-cols-[120px_160px_1fr] lg:grid-cols-[130px_180px_1fr] gap-4 sm:gap-8 lg:gap-10 items-start">
    <SectionEyebrow label="Our Story" />

    <p className="text-[28px] sm:text-[36px] tracking-[-0.01em]">
      PAZA SOCIAL
    </p>

    <div className="max-w-[820px] space-y-5 text-[14px] sm:text-[17px] text-foreground dark:text-zinc-300 leading-[1.85]">
      <p>
        Paza was born in{" "}
        <span className="text-orange-500">Nairobi, Kenya</span> from a
        simple but urgent insight: creators full of talent and vision lacked
        structured access to meaningful opportunities, while brands struggled
        to identify which creators could genuinely connect with the right
        audiences.
      </p>

      <p>
        Most digital advertising and creator platforms prioritize reach,
        impressions, and transactions over trust, contextual relevance, and
        authentic alignment — reducing creators to surface-level metrics like
        follower counts and engagement rates.
      </p>

      <p>
        At the same time, audiences are increasingly resistant to generic
        advertising. Brands no longer just need visibility; they need trusted
        voices capable of naturally translating products into the right
        cultural and emotional contexts.
      </p>

      <p>
        We envisioned a space where collaborations are shaped by deep alignment
        — of identity, tone, values, audience, and purpose.
      </p>

      <p>
        Hence{" "}
        <span className="text-orange-500">Paza Social</span> — a creative
        ecosystem designed to help brands and creators build more authentic,
        effective, and lasting collaborations.
      </p>
    </div>
  </div>
</div>

<div className={`${CONTAINER} mt-12 sm:mt-16`}>
  <div className="grid grid-cols-1 md:grid-cols-[120px_160px_1fr] lg:grid-cols-[130px_180px_1fr] gap-4 sm:gap-8 lg:gap-10 items-start">
    <div />

    <p className="text-[28px] sm:text-[36px] tracking-[-0.01em]">
      VISION
    </p>

    <p className="max-w-[780px] text-[14px] sm:text-[17px] text-foreground dark:text-zinc-300 leading-[1.85]">
      To become the infrastructure that powers how collaboration is formed
      around audience understanding across digital and real-world ecosystems.
    </p>
  </div>

  <div className="mt-6 sm:mt-10 flex justify-start sm:justify-end">
    <Link
      href="/#contact"
      className="inline-flex items-center gap-2 text-[23px] sm:text-[34px] border-b border-zinc-500 pb-1"
    >
      Start your journey
      <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  </div>
</div>

        <div className={`${CONTAINER} mt-14 sm:mt-20`}>
          <h2 className="text-[clamp(2rem,10vw,5.2rem)] leading-[1.04] sm:leading-[1.06] tracking-[-0.02em] uppercase max-w-[980px]">
            Fostering creativity, community building, & meaningful relationships
          </h2>
        </div>

        <div className={`${CONTAINER} mt-12 sm:mt-16`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 sm:gap-12 items-center">
            <div className="relative h-[260px] sm:h-[290px]">
              <div className="absolute left-4 sm:left-8 top-0 w-[210px] sm:w-[280px] h-[130px] sm:h-[180px] rotate-[-7deg] overflow-hidden">
                <Image src={campaignStreetCrew} alt="" fill className="object-cover" />
              </div>
              <div className="absolute left-0 bottom-14 sm:bottom-16 w-[150px] sm:w-[200px] h-[90px] sm:h-[120px] rotate-2 overflow-hidden">
                <Image src={campaignUrbanBodega} alt="" fill className="object-cover" />
              </div>
              <div className="absolute left-16 sm:left-24 bottom-2 w-[180px] sm:w-[240px] h-[110px] sm:h-[150px] rotate-6 overflow-hidden">
                <Image src={campaignRedWallTrio} alt="" fill className="object-cover grayscale" />
              </div>
            </div>

            <div>
              <SectionEyebrow label="Our Mission" />
              <p className="mt-2 max-w-[min(100%,38rem)] text-[0.9375rem] leading-[1.65] tracking-[-0.01em] text-foreground sm:mt-3 sm:max-w-[760px] sm:text-[1rem] sm:leading-relaxed md:text-[1.0625rem]">

To better understand audience identity, interests, intent, and behavior in order to maximize the effectiveness of collaborations and outcomes.

              </p>
              <div className="mt-6 flex justify-start sm:justify-end">
                <Link href="/#contact" className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] border-b border-zinc-500 pb-1">
                  Let&apos;s Work Together
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} mt-12 sm:mt-16 pb-8 sm:pb-10`}>


<div className="grid grid-cols-1 md:grid-cols-[140px_1fr] lg:grid-cols-[170px_1fr] gap-4 sm:gap-8 lg:gap-10 items-start">
  <SectionEyebrow label="Why choose us" />

  <div>
    <div className="max-w-[900px] space-y-5 text-[0.9375rem] leading-[1.8] tracking-[-0.01em] text-black dark:text-zinc-100 sm:text-[1rem] md:text-[1.0625rem]">
      <p>
        Paza maps the intersection of{" "}
        <span className="text-orange-500">
          creator identity, audience behavior, and brand intent
        </span>
        . By using behavioral clustering, we ensure collaborations are rooted
        in actual audience compatibility before a campaign begins.
      </p>

      <p>
        We don&apos;t just facilitate connections; we provide the continuous
        feedback loop necessary for long-term synergy.
      </p>

      <p>
        By closing the gap between discovery and attribution, Paza enables
        creators, brands, and communities to scale with intentionality and
        verified impact.
      </p>

      <p>
        Whether testing new market segments or scaling proven partnerships,
        Paza enables teams to build with precision, consistency, and long-term
        synergy — turning every collaboration into a measurable and improving
        system rooted in real audience compatibility and intent.
      </p>
    </div>

    <div className="mt-6 sm:mt-7 flex justify-start sm:justify-end">
      <Link
        href="/#contact"
        className="inline-flex items-center gap-2 border-b border-zinc-500 pb-1 text-[17px] font-medium text-black dark:text-zinc-100 sm:text-[22px] md:text-[26px]"
      >
        Start your journey
        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Link>
    </div>
  </div>
</div>

        </div>



        <div className={`${CONTAINER} mt-8 sm:mt-10 border-t border-zinc-900 pt-6 sm:pt-8`}>
          <div className="relative min-h-[560px] sm:min-h-[880px] overflow-hidden">
            <Image src={campaignTradingFloor} alt="" fill className="object-cover grayscale opacity-45" />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <SectionEyebrow label="About Us" />


<div className="mt-3 max-w-[1080px] space-y-6 sm:space-y-8">
  <h3 className="text-balance text-[clamp(1.15rem,3.9vw+0.4rem,2.75rem)] leading-[1.14] tracking-[-0.015em] text-white sm:text-[clamp(1.4rem,3.2vw+0.55rem,3.25rem)] sm:leading-[1.1] lg:text-[clamp(1.55rem,2.4vw+0.65rem,4rem)] lg:leading-[1.08]">
    Paza was born in{" "}
    <span className="text-zinc-400 sm:text-zinc-500">Nairobi, Kenya</span>{" "}
    from a simple but urgent insight: creators full of talent and vision lacked
    structured access to meaningful opportunities, while brands struggled to
    identify which creators could genuinely connect with the right audiences.
  </h3>
  <div className="max-w-[900px] space-y-5 text-[14px] leading-[1.9] tracking-[-0.01em] text-zinc-300 sm:text-[15px] md:text-[16px]">
    <p>
      Current growth systems are constrained by high customer acquisition costs,
      inefficient ad spend, and overdependence on short form metrics like views,
      clicks, and engagement rates. These signals fail to represent actual
      audience intent, likelihood to convert or cultural alignment.
    </p>
    <p>
      At the same time, audiences have fragmented across creators, niche
      communities, and multi-platform content ecosystems. Brands are still forced
      to buy attention through centralized ad networks, even though real influence
      and decision-making now happens in distributed spaces.
    </p>
    <p>
      Paza replaces this model by shifting from targeting to locating. It
      analyzes behavioral signals across creators and communities to identify
      where relevant audiences already exist, what they care about, and how they
      engage with products and culture.
    </p>
    <p>
      It replaces surface-level targeting with behavioral signal analysis, mapping
      real audience intent, values, and consumption patterns across creators and
      communities. Brands can discover creators whose audiences already match
      their ideal customers, reducing wasted spend and improving conversion
      efficiency.
    </p>
    <p>
      It also enables continuous collaboration between brands and creator
      networks, allowing campaigns to be shaped by real audience behavior rather
      than static demographic assumptions.
    </p>
  </div>
</div>              
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} py-12 sm:py-16`}>
          <h3 className="text-center text-[clamp(1.45rem,5vw+0.45rem,3.25rem)] uppercase leading-[1.08] tracking-[-0.02em] sm:text-[clamp(1.75rem,4.5vw,3.75rem)] lg:text-[clamp(2rem,3.5vw,4.5rem)]">
            Be part of
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_320px_1fr] lg:grid-cols-[1fr_430px_1fr] gap-6 items-center">
            <p className="text-[13px] sm:text-[14px] text-foreground dark:text-zinc-300 leading-relaxed max-w-[300px]">
              Together we create a powerful synergy that propels creativity, fuels innovation and
              unlocks endless possibilities.
            </p>
            <div className="relative h-[240px] sm:h-[320px]">
              <Image src={campaignOutdoorCelebration} alt="Paza community" fill className="object-cover grayscale" />
            </div>
            <p className="text-[13px] sm:text-[14px] text-foreground dark:text-zinc-300 leading-relaxed max-w-[280px] md:justify-self-end">
              Join us at Paza and embark on a transformative journey.
            </p>
          </div>
          <h3 className="mt-4 text-center text-[clamp(1.45rem,5vw+0.45rem,3.25rem)] uppercase leading-[1.08] tracking-[-0.02em] sm:text-[clamp(1.75rem,4.5vw,3.75rem)] lg:text-[clamp(2rem,3.5vw,4.5rem)]">
            Our community
          </h3>
          <div className="mt-8 sm:mt-12 flex justify-center">
            <button
              type="button"
              className="h-12 sm:h-14 w-full sm:w-[340px] border border-zinc-600 text-[20px] sm:text-[34px] inline-flex items-center justify-between px-4 hover:border-zinc-400"
            >
              <span>Join Us Today</span>
              <ArrowUpRight className="h-5 w-5 sm:h-7 sm:w-7" />
            </button>
          </div>
        </div>

        <div className={`${CONTAINER} py-12 sm:py-16`}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-10 md:gap-8 items-start">
            <div className="order-1 md:order-0">
              <div className="text-[14px]">
                <p>Home</p>
              </div>
              <div className="mt-8 sm:mt-16 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollPageToTop()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-card text-foreground transition-colors hover:border-zinc-600 hover:bg-zinc-900"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="text-[14px] order-3 md:order-0">
              <div className="space-y-1">
                <p className="text-orange-500">Services</p>
                <p>Partnership</p>
                <p>About us</p>
              </div>
              <div className="mt-10 sm:mt-16 space-y-1 text-foreground dark:text-zinc-300">
                <p>+1 891 989-11-91</p>
                <p>hello@logoipsum.com</p>
                <p className="text-orange-500">Call me back</p>
              </div>
              <div className="mt-6 text-[10px] uppercase text-zinc-500">
                <p>Contact us</p>
              </div>
              <div className="mt-7 text-[10px] uppercase text-zinc-500">
                <p>Follow us</p>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[14px]">
                <span>Telegram</span>
                <span>/</span>
                <span>Whatsapp</span>
                <span>/</span>
                <span>Instagram</span>
              </div>
              <div className="mt-10 sm:mt-16 text-[10px] uppercase text-zinc-500">
                <p>© 2023 — copyright</p>
                <p>Privacy</p>
              </div>
            </div>

            <div className="text-[14px] order-2 md:order-0">
              <p>Contacts</p>
              <p className="mt-8 sm:mt-20 text-foreground dark:text-zinc-300">
                2972 Westheimer Rd. Santa Ana,<br />
                Illinois 85486
              </p>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
