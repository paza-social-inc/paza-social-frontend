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
        <div className={`${CONTAINER} sm:border-x sm:border-zinc-800`}>
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
        authentic alignment  reducing creators to surface-level metrics like
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
         of identity, tone, values, audience, and purpose.
      </p>

      <p>
        Hence{" "}
        <span className="text-orange-500">Paza Social</span>  a creative
        ecosystem designed to help brands and creators build more authentic,
        effective, and lasting collaborations.
      </p>
    </div>
  </div>
</div>

<div className={`${CONTAINER} mt-12 sm:mt-16`}>
  <div className="grid grid-cols-1 md:grid-cols-[120px_160px_1fr] lg:grid-cols-[130px_180px_1fr] gap-4 sm:gap-8 lg:gap-10 items-start">
    <div className="hidden md:block" />

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

        <div className={`${CONTAINER} relative overflow-hidden mt-14 sm:mt-20`}>
          <span
            className="pointer-events-none absolute right-0 top-0 select-none font-black uppercase leading-[0.85] text-neutral-900/[0.04] dark:text-white/[0.03]"
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", letterSpacing: "-0.05em" }}
            aria-hidden
          >
            PAZA
          </span>
          <h2 className="relative text-[clamp(2rem,10vw,5.2rem)] leading-[1.04] sm:leading-[1.06] tracking-[-0.02em] uppercase max-w-[980px]">
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
        synergy  turning every collaboration into a measurable and improving
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
      An ad can reach the right demographic and still reach the wrong buyer.
      Most growth systems optimize for audience similarity rather than audience
      relevance, relying on demographic targeting, engagement metrics, and
      probabilistic signals that indicate who people are or what they interact
      with, rather than why they buy, who they trust, or what drives action. Two
      people can display identical online behaviors and have completely different
      intentions.
    </p>
    <p>
      The challenge is no longer finding people; it is identifying the people
      most likely to care, trust, and act. Communities, relationships, and
      trusted voices often influence purchasing decisions more than demographic
      attributes alone.
    </p>
    <p>
      <span className="text-white">Paza</span> shifts the focus from targeting
      audiences to locating them. By mapping behavioral, contextual, and
      community signals, it identifies where relevant audiences already exist
      across creators, communities, and digital environments, what they care
      about, and how they engage with products, culture, and influence networks.
    </p>
    <p>
      Instead of asking who looks like a customer, Paza helps brands identify who
      is most likely to care about a product and why. It replaces probabilistic
      assumptions with evidence-based audience relevance, enabling brands to
      discover creators and communities whose audiences already align with their
      ideal customers.
    </p>
    <p>
      The result is stronger audience-product alignment, more efficient customer
      acquisition, and growth strategies built around genuine audience relevance
      rather than purchased attention. The goal is not more impressions. The goal
      is finding the audiences most likely to care, trust, and convert.
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
          <Link
          href="/waitlist"
          >
            <button
              type="button"
              className="h-12 sm:h-14 w-full sm:w-[340px] border border-zinc-600 text-[20px] sm:text-[34px] inline-flex items-center justify-between px-4 hover:border-zinc-400"
            >
              <span>Join Us Today</span>
              <ArrowUpRight className="h-5 w-5 sm:h-7 sm:w-7" />
            </button>
            </Link>
          </div>
        </div>

        <div className={`${CONTAINER} border-t border-zinc-800 pt-10 sm:pt-14 pb-10 sm:pb-14`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 lg:gap-x-12">

            {/* Brand + back to top */}
            <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:gap-10">
              <div>
                <Link
                  href="/"
                  className="text-[13px] font-medium uppercase tracking-[0.18em] text-foreground dark:text-white hover:text-orange-500 transition-colors"
                >
                  Paza Social
                </Link>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
                  © 2024 — All rights reserved
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollPageToTop()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-foreground transition-colors hover:border-zinc-500 hover:bg-zinc-900"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-zinc-600">Navigation</p>
              <div className="space-y-2.5 text-[15px]">
                <div>
                  <Link href="/services" className="text-orange-500 hover:opacity-75 transition-opacity">
                    Services
                  </Link>
                </div>
                <div>
                  <Link href="/#contact" className="text-foreground dark:text-zinc-300 hover:text-white transition-colors">
                    Partnership
                  </Link>
                </div>
                <div>
                  <Link href="/about" className="text-foreground dark:text-zinc-300 hover:text-white transition-colors">
                    About us
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-zinc-600">Contact</p>
              <div className="space-y-2 text-[15px] text-foreground dark:text-zinc-300">
                <p>+1 891 989-11-91</p>
                <p>hello@logoipsum.com</p>
              </div>
              <button
                type="button"
                className="mt-3 text-[14px] text-orange-500 hover:opacity-75 transition-opacity"
              >
                Call me back →
              </button>
            </div>

            {/* Location + Social */}
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-zinc-600">Location</p>
              <p className="text-[15px] text-foreground dark:text-zinc-300 leading-relaxed">
                2972 Westheimer Rd. Santa Ana,<br />
                Illinois 85486
              </p>
              <p className="mb-3 mt-6 text-[11px] uppercase tracking-[0.22em] text-zinc-600">Follow us</p>
              <div className="flex flex-wrap items-center gap-3 text-[14px] text-foreground dark:text-zinc-400">
                <span>Telegram</span>
                <span className="text-zinc-700">/</span>
                <span>Whatsapp</span>
                <span className="text-zinc-700">/</span>
                <span>Instagram</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
