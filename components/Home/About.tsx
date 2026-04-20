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

const CONTAINER = "px-6 sm:px-10 lg:px-14 max-w-[1220px] mx-auto";

export default function About() {
  return (
    <HomeLayout hideFooter>
      <section className="bg-background pt-14 text-foreground pb-20">
        <div className={`${CONTAINER} border-x border-zinc-800`}>
          <div className="relative h-[300px] sm:h-[420px] md:h-[560px] overflow-hidden">
            <Image src={campaignPortraitElder} alt="About hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/60 flex items-center justify-center"
                aria-label="Play video"
              >
                <Play className="ml-1 h-10 w-10 fill-foreground text-foreground dark:fill-white dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} mt-16`}>
          <h1 className="text-[40px] sm:text-[56px] md:text-[62px] leading-[1.18] tracking-[-0.02em] max-w-[1120px]">
            We believe in nurturing relationships built on trust, shared values and a mutual understanding and commitment to success
          </h1>
        </div>

        <div className={`${CONTAINER} mt-24`}>
          <div className="grid md:grid-cols-[130px_180px_1fr] gap-10 items-start">
            <p className="text-[12px] text-orange-500">▮&nbsp; Our Story</p>
            <p className="text-[36px] tracking-[-0.01em]">PAZA SOCIAL</p>
            <p className="text-[17px] text-foreground dark:text-zinc-300 leading-[1.8] max-w-[780px]">
              Paza was born in Nairobi from a simple but urgent insight: creators-full of talent and vision-lacked
              structured access to meaningful, lasting opportunities. The digital space was crowded with platforms
              built for transactions, prioritizing quantitative reach over qualitative alignment.
              <br />
              We envisioned a space where collaborations are shaped by deep alignment-of identity, tone, goals, and purpose.
              <br />
              Hence <span className="text-orange-500">Paza Social</span>-not just a tool, but a creative ecosystem.
              <br />
              We&apos;re continuously expanding our platform with the essential tools needed to support structured,
              successful campaigns-ensuring that every collaboration is meaningful and built to last.
            </p>
          </div>
        </div>

        <div className={`${CONTAINER} mt-16`}>
          <div className="grid md:grid-cols-[130px_180px_1fr] gap-10 items-start">
            <div />
            <p className="text-[36px] tracking-[-0.01em]">VISION</p>
            <p className="text-[17px] text-foreground dark:text-zinc-300 leading-[1.8] max-w-[780px]">
              Be the premier space for collaboration in the creator economy, enabling strategic brand
              integration across diverse creative content. while allowing creators to connect with
              like minded talents to elevate their projects.
            </p>
          </div>
          <div className="mt-10 flex justify-end">
            <Link href="/#contact" className="inline-flex items-center gap-2 text-[34px] border-b border-zinc-500 pb-1">
              Start your journey
              <ArrowUpRight className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className={`${CONTAINER} mt-20`}>
          <h2 className="text-[64px] sm:text-[84px] leading-[1.06] tracking-[-0.02em] uppercase max-w-[980px]">
            Fostering creativity, community building, & meaningful relationships
          </h2>
        </div>

        <div className={`${CONTAINER} mt-16`}>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <div className="relative h-[290px]">
              <div className="absolute left-8 top-0 w-[280px] h-[180px] rotate-[-7deg] overflow-hidden">
                <Image src={campaignStreetCrew} alt="" fill className="object-cover" />
              </div>
              <div className="absolute left-0 bottom-16 w-[200px] h-[120px] rotate-2 overflow-hidden">
                <Image src={campaignUrbanBodega} alt="" fill className="object-cover" />
              </div>
              <div className="absolute left-24 bottom-2 w-[240px] h-[150px] rotate-6 overflow-hidden">
                <Image src={campaignRedWallTrio} alt="" fill className="object-cover grayscale" />
              </div>
            </div>

            <div>
              <p className="text-[12px] text-orange-500">▮&nbsp; Our Mission</p>
              <p className="mt-2 text-[47px] leading-[1.35] tracking-[-0.01em] max-w-[760px]">
                Make it easy to collaborate with anyone around the world while maximizing the
                potential of every collaboration fostering a win-win scenario where creativity thrives
                and all the parties involved get to achieve their goals and objectives.
              </p>
              <div className="mt-6 flex justify-end">
                <Link href="/#contact" className="inline-flex items-center gap-2 text-[14px] border-b border-zinc-500 pb-1">
                  Let&apos;s Work Together
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} mt-16 pb-10`}>
          <div className="grid md:grid-cols-[170px_1fr] gap-10 items-start">
            <p className="text-[12px] text-orange-500">▮&nbsp; Why choose us</p>
            <div>
              <p className="text-[43px] leading-[1.45] tracking-[-0.01em] text-black dark:text-zinc-100 max-w-[900px]">
                At Paza, its not just about connecting -it&apos;s about forging collaborations where
                identity, tone, purpose and vision converge-delivering campaigns that achieve its goals
                as well as shape culture. Paza supports long-term synergy and empowers any type of
                collaboration to thrive.
                <br />
                Whether scaling, experimenting, or fine-tuning your strategy, Paza evolves with
                you-equipping you to co-create with intention and build lasting impact, one genuine
                story at a time.
              </p>
              <div className="mt-7 flex justify-end">
                <Link href="/#contact" className="inline-flex items-center gap-2 text-[34px] text-black dark:text-zinc-100 border-b border-zinc-500 pb-1">
                  Start your journey
                  <ArrowUpRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} mt-10 border-t border-zinc-900 pt-8`}>
          <div className="relative min-h-[880px] overflow-hidden">
            <Image src={campaignTradingFloor} alt="" fill className="object-cover grayscale opacity-45" />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 p-10 sm:p-12">
              <p className="text-[12px] text-orange-500">▮&nbsp; About Us</p>
              <h3 className="mt-4 text-[74px] sm:text-[98px] leading-[1.03] tracking-[-0.02em] uppercase max-w-[980px]">
                At our core, we are guided by <span className="text-zinc-500">collaboration, flexibility, transparency,
                performance, and authenticity</span>-values that empower us to nurture real
                connections, and shape partnerships that turn bold ideas into lasting impact
              </h3>
            </div>
          </div>
        </div>

        <div className={`${CONTAINER} py-16`}>
          <h3 className="text-center text-[82px] sm:text-[108px] uppercase leading-[1.02] tracking-[-0.02em]">
            Be part of
          </h3>
          <div className="mt-4 grid grid-cols-[1fr_430px_1fr] gap-6 items-center">
            <p className="text-[14px] text-foreground dark:text-zinc-300 leading-relaxed max-w-[300px]">
              Together we create a powerful synergy that propels creativity, fuels innovation and
              unlocks endless possibilities.
            </p>
            <div className="relative h-[320px]">
              <Image src={campaignOutdoorCelebration} alt="Paza community" fill className="object-cover grayscale" />
            </div>
            <p className="text-[14px] text-foreground dark:text-zinc-300 leading-relaxed max-w-[280px] justify-self-end">
              Join us at Paza and embark on a transformative journey.
            </p>
          </div>
          <h3 className="mt-4 text-center text-[82px] sm:text-[108px] uppercase leading-[1.02] tracking-[-0.02em]">
            Our community
          </h3>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              className="h-14 w-[340px] border border-zinc-600 text-[34px] inline-flex items-center justify-between px-4 hover:border-zinc-400"
            >
              <span>Join Us Today</span>
              <ArrowUpRight className="h-7 w-7" />
            </button>
          </div>
        </div>

        <div className={`${CONTAINER} py-16`}>
          <div className="grid md:grid-cols-[1fr_1.2fr_1fr] gap-8 items-start">
            <div>
              <div className="text-[14px]">
                <p>Home</p>
              </div>
              <div className="mt-16 flex items-center gap-4">
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

            <div className="text-[14px]">
              <div className="space-y-1">
                <p className="text-orange-500">Services</p>
                <p>Partnership</p>
                <p>About us</p>
              </div>
              <div className="mt-16 space-y-1 text-foreground dark:text-zinc-300">
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
              <div className="mt-16 text-[10px] uppercase text-zinc-500">
                <p>© 2023 — copyright</p>
                <p>Privacy</p>
              </div>
            </div>

            <div className="text-[14px]">
              <p>Contacts</p>
              <p className="mt-20 text-foreground dark:text-zinc-300">
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
