"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HomeLayout from "./Layout";
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { scrollPageToTop } from "@/lib/scrollWithLenis";
import {
  campaignAerialSuits,
  campaignCrowdRadial,
  campaignDjPerformance,
  campaignFashionEnsemble,
} from "@/assets";

const CONTAINER = "px-4 sm:px-6 lg:px-10 xl:px-14 max-w-[1220px] mx-auto";



const BRAND_SERVICE_DETAILS = [
  {
    idx: "(01)",
    title: "Audience Intelligence",
    description: [
      "Behavioral and community-level audience analysis across creators, channels, and networks.",
    ],
  },
  {
    idx: "(02)",
    title: "Creator Intelligence & Matching",
    description: [
      "Identity, value, and audience alignment engine for discovering relevant creator partnerships.",
    ],
  },
  {
    idx: "(03)",
    title: "Campaign Orchestration",
    description: [
      "End-to-end workflow for planning, assigning, coordinating, and managing collaboration execution across stakeholders.",
    ],
  },
  {
    idx: "(04)",
    title: "Performance & Attribution Analytics",
    description: [
      "Measurement of outcomes from creator activity, including conversion linkage, engagement impact, and campaign effectiveness.",
    ],
  },
  {
    idx: "(05)",
    title: "Payments & Settlement Layer",
    description: [
      "Controlled payout system tied to campaign completion, performance conditions, and trust constraints.",
    ],
  },
];

const CREATOR_SERVICE_DETAILS = [
  {
    idx: "(01)",
    title: "Creator Identity & Portfolio System",
    description: [
      "Structured presentation of creator profile, work, audience positioning, and collaboration history.",
    ],
  },
  {
    idx: "(02)",
    title: "Audience Intelligence",
    description: [
      "Audience behavior, engagement patterns, and community alignment insights.",
    ],
  },
  {
    idx: "(03)",
    title: "Opportunity Matching",
    description: [
      "Discovery and connection to brands based on audience fit, values, and collaboration intent.",
    ],
  },
  {
    idx: "(04)",
    title: "Campaign Execution Hub",
    description: [
      "Management of briefs, deliverables, communication, approvals, and deadlines.",
    ],
  },
  {
    idx: "(05)",
    title: "Performance Insights",
    description: [
      "Analytics on engagement, conversions, and campaign effectiveness.",
    ],
  },
  {
    idx: "(06)",
    title: "Payments & Earnings System",
    description: [
      "Transparent payout tracking and structured settlement from collaborations.",
    ],
  },
];



const PRICING_PLANS = [
  {
    name: "Free plan",
    price: "0",
    period: "/MONTH",
    items: [
      "Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.",
      "8% retainer fee (service charge + marketing change)",
      "20 job swipes a day",
      "20 showcase swipes a day",
      "1 campaign",
      "5 tasks per campaign",
      "upto 5 members in a campaign",
      "2 users per account",
      "email support",
    ],
  },
  {
    name: "Monthly plan",
    price: "6,200",
    period: "/MONTH",
    items: [
      "Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.",
      "6% retainer fee",
      "50 job swipes a day",
      "50 showcase swipes a day",
      "100 campaigns",
      "50 tasks per campaign",
      "upto 100 members in a campaign",
      "2 users per account",
      "email support",
    ],
  },
  {
    name: "One time plan",
    price: "32,000",
    period: "/MONTH",
    items: [
      "Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.",
      "unlimited job post a month",
      "unlimited proposal approvals per post",
      "unlimited showcase swipes a day",
      "unlimited campaigns",
      "unlimited tasks per campaign",
      "unlimited members in a campaign",
      "unlimited users per account",
      "email support",
      "Additional services",
      "• upto 3 managed campaigns",
      "• marketing",
    ],
  },
];

const CREATOR_PRICING_PLANS = [
  {
    name: "Free plan",
    price: "0",
    period: "/MONTH",
    items: [
      "Apply to brand opportunities and manage your creator profile in one place.",
      "8% platform fee on completed payouts",
      "20 job swipes a day",
      "20 showcase swipes a day",
      "1 active project",
      "5 tasks per project",
      "up to 5 collaborators per project",
      "1 user per account",
      "email support",
    ],
  },
  {
    name: "Monthly plan",
    price: "4,800",
    period: "/MONTH",
    items: [
      "Priority visibility in discovery and faster proposal workflows.",
      "6% platform fee on completed payouts",
      "50 job swipes a day",
      "50 showcase swipes a day",
      "100 projects",
      "50 tasks per project",
      "up to 100 collaborators per project",
      "2 users per account",
      "email support",
    ],
  },
  {
    name: "One time plan",
    price: "24,000",
    period: "/MONTH",
    items: [
      "Advanced creator growth toolkit with unlimited collaboration capacity.",
      "unlimited applications a month",
      "unlimited proposal submissions",
      "unlimited showcase swipes a day",
      "unlimited projects",
      "unlimited tasks per project",
      "unlimited collaborators per project",
      "unlimited users per account",
      "email support",
      "Additional services",
      "• creator growth support",
      "• portfolio optimization",
    ],
  },
];

export default function Services() {
  const [audienceTab, setAudienceTab] = useState<"brands" | "creators">("creators");
  const [pricingTab, setPricingTab] = useState<"brands" | "creators">("brands");
  const serviceDetails =
    audienceTab === "brands" ? BRAND_SERVICE_DETAILS : CREATOR_SERVICE_DETAILS;
  const pricingPlans = pricingTab === "brands" ? PRICING_PLANS : CREATOR_PRICING_PLANS;

  return (
    <HomeLayout hideFooter >
      <div className="min-h-screen bg-background pt-14 text-foreground" id="services">
        <section className="relative overflow-hidden">
          <div className={CONTAINER}>
            <div className="pt-8 sm:pt-10 pb-12 sm:pb-14">
              <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 lg:gap-10">
                <div className="relative flex-1 min-h-[clamp(380px,52dvh,560px)] sm:min-h-[560px]">
                  <Image src={campaignCrowdRadial} alt="" fill className="object-cover grayscale" />
                  <div className="absolute inset-0 bg-black/55" />

                  <div className="absolute inset-0 flex flex-col justify-center px-4 pb-28 pt-10 sm:p-6 sm:pb-24">
                    <h1 className="max-w-full text-balance wrap-break-word font-extrabold uppercase tracking-[-0.02em] text-white">
                      <span className="block text-[clamp(1.35rem,4.2vw+0.55rem,2.35rem)] leading-[1.08] sm:text-[clamp(2.25rem,5vw,3.75rem)] sm:leading-[0.98]">
                        Beyond transactions
                      </span>
                      <span className="mt-1 block text-[clamp(1.2rem,3.85vw+0.45rem,2.1rem)] leading-[1.1] sm:mt-2 sm:text-[clamp(2rem,4.5vw,3.25rem)] sm:leading-[1.02]">
                        — uniting communities
                      </span>
                      <span className="mt-1 block text-[clamp(1.15rem,3.6vw+0.4rem,2rem)] leading-[1.12] sm:mt-2 sm:text-[clamp(1.85rem,4vw,2.85rem)] sm:leading-[1.02]">
                        that build with and shape
                      </span>
                      <span className="mt-2 block text-[clamp(1.45rem,4.8vw+0.5rem,2.6rem)] leading-[1.06] sm:mt-3 sm:text-[clamp(2.5rem,5.5vw,4.25rem)] sm:leading-[0.95]">
                        culture
                      </span>
                    </h1>
                  </div>

                  {/* <div className="absolute bottom-4 left-0 right-0 px-4 sm:bottom-10 sm:left-0 sm:right-auto lg:bottom-24 sm:max-w-sm sm:p-6"> */}
                  {/*   <p className="mx-auto max-w-[min(100%,22rem)] text-[13px] leading-relaxed text-white/90 sm:mx-0 sm:max-w-[280px] sm:text-sm"> */}
                  {/*     Together we create a powerful synergy that propels creativity, fuels innovation, and */}
                  {/*     unlocks endless possibilities. Join us at Paza and embark on a transformative journey. */}
                  {/*   </p> */}
                  {/* </div> */}
                </div>

                <div className="relative w-full lg:w-[460px] min-h-[260px] sm:min-h-[320px] lg:min-h-[560px]">
                  <Image src={campaignDjPerformance} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute right-0 top-5 max-w-[min(100%,20rem)] p-4 text-[13px] leading-relaxed text-foreground/95 sm:top-8 sm:w-[310px] sm:max-w-none sm:p-0 sm:text-sm dark:text-zinc-200 lg:top-14">
                    Together we create a powerful synergy that propels creativity, fuels innovation, and
                    unlocks endless possibilities. Join us at Paza and embark on a transformative journey.
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-between w-full sm:w-[280px] border border-white px-5 sm:px-6 py-3 text-[13px] gap-4"
                >
                  <span>Lets talk about project</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className={`${CONTAINER} pb-10`}>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="block h-2 w-2 shrink-0 bg-orange-500" aria-hidden />
                <span className="text-[12px] uppercase tracking-[0.18em] text-orange-500">
                  Our Services
                </span>
              </div>

              <h2 className="text-[20px] sm:text-[28px] leading-[1.15] font-medium max-w-[780px]">
                EXPLORE SERVICES DESIGNED FOR{" "}
                <span className="text-orange-500">CREATORS</span> AND{" "}
                <span className="text-orange-500">BRANDS</span> TO THRIVE
              </h2>
            </div>

            <div className="mt-8 sm:mt-10 flex w-full items-stretch border-t border-zinc-800 pt-6 sm:pt-8 text-[16px] sm:text-[18px] font-medium">
              <button
                type="button"
                onClick={() => setAudienceTab("brands")}
                className={[
                  "flex-1 pb-4 text-center transition-colors border-b-4",
                  audienceTab === "brands"
                    ? "border-orange-500 text-foreground dark:text-zinc-100"
                    : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300",
                ].join(" ")}
              >
                Brands
              </button>
              <button
                type="button"
                onClick={() => setAudienceTab("creators")}
                className={[
                  "flex-1 pb-4 text-center transition-colors border-b-4",
                  audienceTab === "creators"
                    ? "border-orange-500 text-foreground dark:text-zinc-100"
                    : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300",
                ].join(" ")}
              >
                Creators
              </button>
            </div>

            <div className="mt-8 sm:mt-10">
              {serviceDetails.map((s, i) => (
                <div key={s.idx} className="border-t border-zinc-800 pt-7 sm:pt-10">
                  <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] lg:grid-cols-[120px_1fr] gap-3 sm:gap-8 lg:gap-10 items-start">
                    <div className="text-[15px] sm:text-[18px] text-foreground dark:text-zinc-400">{s.idx}</div>

                    <div>
                      <h3 className="text-[18px] sm:text-[22px] font-medium tracking-tight">
                        {s.title}
                      </h3>
                      <div className="mt-3 space-y-3 text-[12px] sm:text-[13px] text-foreground dark:text-zinc-400 leading-relaxed max-w-[620px]">
                        {s.description.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Link
                          href="/#contact"
                          className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-foreground dark:text-zinc-300 underline underline-offset-4 hover:text-foreground dark:hover:text-white"
                        >
                          Get in touch
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {i < serviceDetails.length - 1 && <div className="h-5 sm:h-6" />}
                </div>
              ))}
              {/* <div className="flex justify-center mt-10 sm:mt-14"> */}
              {/*   <Link */}
              {/*     href="/#contact" */}
              {/*     className="text-[14px] text-foreground dark:text-zinc-200 underline underline-offset-4 decoration-zinc-500" */}
              {/*   > */}
              {/*     More */}
              {/*   </Link> */}
              {/* </div> */}
            </div>

            {/* Pricing */}
            {/* <div className="relative mt-16 sm:mt-24"> */}
            {/*   <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"> */}
            {/*     <Image src={campaignAerialSuits} alt="" fill className="object-cover object-top" /> */}
            {/*   </div> */}
            {/*   <div className="flex items-end gap-8"> */}
            {/*     <div className="flex items-center gap-3"> */}
            {/*       <span className="w-2 h-2 bg-orange-500 block" /> */}
            {/*       <span className="text-[12px] uppercase tracking-[0.18em] text-orange-500"> */}
            {/*         Pricing */}
            {/*       </span> */}
            {/*     </div> */}
            {/*   </div> */}
            {/**/}
            {/*   <h2 className="mt-5 sm:mt-6 text-[26px] sm:text-[38px] md:text-[52px] leading-[0.95] tracking-[-0.02em]"> */}
            {/*     LET VALUE DRIVEN{" "} */}
            {/*     <span className="text-orange-500">PATNERSHIPS</span> */}
            {/*     <br /> */}
            {/*     <span className="text-foreground dark:text-white">POWER YOUR REVENUE</span> */}
            {/*   </h2> */}
            {/**/}
            {/*   <div className="mt-8 sm:mt-10 flex items-center justify-between font-medium text-[16px] sm:text-[18px]"> */}
            {/*     <button */}
            {/*       type="button" */}
            {/*       onClick={() => setPricingTab("brands")} */}
            {/*       className={[ */}
            {/*         "w-1/2 text-center pb-3 border-b-4 transition-colors", */}
            {/*         pricingTab === "brands" */}
            {/*           ? "border-orange-500 text-foreground dark:text-zinc-100" */}
            {/*           : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300", */}
            {/*       ].join(" ")} */}
            {/*     > */}
            {/*       Brands */}
            {/*     </button> */}
            {/*     <button */}
            {/*       type="button" */}
            {/*       onClick={() => setPricingTab("creators")} */}
            {/*       className={[ */}
            {/*         "w-1/2 text-center pb-3 border-b-4 transition-colors", */}
            {/*         pricingTab === "creators" */}
            {/*           ? "border-orange-500 text-foreground dark:text-zinc-100" */}
            {/*           : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300", */}
            {/*       ].join(" ")} */}
            {/*     > */}
            {/*       Creator */}
            {/*     </button> */}
            {/*   </div> */}
            {/**/}
            {/*   <div className="mt-7 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-0"> */}
            {/*     {pricingPlans.map((p, idx) => ( */}
            {/*       <div */}
            {/*         key={p.name} */}
            {/*         className={[ */}
            {/*           "px-4 sm:px-6 py-7 sm:py-8 border-t border-zinc-900/40", */}
            {/*           "bg-black/10", */}
            {/*           idx === 0 ? "border-l border-zinc-900/40" : "border-l border-zinc-900/40", */}
            {/*         ].join(" ")} */}
            {/*       > */}
            {/*         <div className="text-[12px] uppercase tracking-[0.18em] text-foreground dark:text-zinc-500"> */}
            {/*           {p.name} */}
            {/*         </div> */}
            {/*         <div className="mt-2 text-[16px] sm:text-[18px] text-foreground dark:text-zinc-400"> */}
            {/*           Sh{" "} */}
            {/*           <span className="text-[34px] sm:text-[42px] font-semibold text-foreground dark:text-white leading-none"> */}
            {/*             {p.price} */}
            {/*           </span>{" "} */}
            {/*           {p.period} */}
            {/*         </div> */}
            {/*         <div className="mt-5 space-y-2 text-[11px] sm:text-[12px] text-foreground dark:text-zinc-500 leading-relaxed uppercase"> */}
            {/*           {p.items.slice(0, 6).map((it) => ( */}
            {/*             <p key={it}>{it}</p> */}
            {/*           ))} */}
            {/*         </div> */}
            {/**/}
            {/*         <div className="mt-6"> */}
            {/*           <Link */}
            {/*             href="/account-type" */}
            {/*             className="group inline-flex w-full items-center justify-between bg-orange-500 text-black px-5 py-4 text-[12px] font-medium" */}
            {/*           > */}
            {/*             <span>GET STARTED</span> */}
            {/*             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> */}
            {/*           </Link> */}
            {/*         </div> */}
            {/*       </div> */}
            {/*     ))} */}
            {/*   </div> */}
            {/* </div> */}

            {/* Final CTA */}
            <div className="relative mt-20 sm:mt-28 pb-16 sm:pb-20">
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]">
                <Image src={campaignFashionEnsemble} alt="" fill className="object-cover object-center" />
              </div>
              <h2 className="text-center text-[28px] sm:text-[56px] md:text-[64px] leading-[0.95] tracking-[-0.02em]">
                WHAT IF YOUR NEXT <br />
                <span className="text-orange-500">CAMPAIGN</span> STARTED HERE?
              </h2>
              <p className="mx-auto mt-5 sm:mt-6 max-w-[680px] text-center text-[12px] sm:text-[13px] text-foreground dark:text-zinc-400 leading-relaxed">
                Connect with the right creators, launch impactful campaigns, and watch your brand
                grow. Join us and be among the first to experience seamless brand-creator collaborations.
              </p>
              <div className="mt-8 sm:mt-10 flex justify-center">
                <Link
                  href="#waitlist"

                  className="inline-flex items-center gap-3 border border-white px-6 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-[14px] hover:bg-white/5 transition-colors"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className={`${CONTAINER} py-12 sm:py-16`}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-10 md:gap-8 items-start">
                <div className="order-1 md:order-0">
                  <div className="text-[14px]">
                    <Link href="/">Home</Link>
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
                  <div className="space-y-2">
                    <p className="text-orange-500">Services</p>
                    <p>Partnership</p>
                    <p>About us</p>
                  </div>

                  <div className="mt-10 sm:mt-16 space-y-2 text-foreground dark:text-zinc-300">
                    <p>+1 891 989-11-91</p>
                    <p>hello@logoipsum.com</p>
                    <p className="text-orange-500">Call me back</p>
                  </div>

                  <div className="mt-6 text-[10px] uppercase text-foreground dark:text-zinc-500">
                    <p>Contact us</p>
                  </div>

                  <div className="mt-4 text-[10px] uppercase text-foreground dark:text-zinc-500">
                    <p>Follow us</p>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-[14px]">
                    <span>Telegram</span>
                    <span>/</span>
                    <span>Whatsapp</span>
                    <span>/</span>
                    <span>Instagram</span>
                  </div>

                  <div className="mt-10 sm:mt-16 text-[10px] uppercase text-foreground dark:text-zinc-500">
                    <p>© 2023 — copyright</p>
                    <p>Privacy</p>
                  </div>
                </div>

                <div className="text-[14px] order-2 md:order-0">
                  <p>Contacts</p>
                  <p className="mt-8 sm:mt-20 text-foreground dark:text-zinc-300">
                    2972 Westheimer Rd. Santa Ana,
                    <br />
                    Illinois 85486
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}

