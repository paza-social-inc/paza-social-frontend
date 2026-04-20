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

const CONTAINER = "px-6 sm:px-10 lg:px-14 max-w-[1220px] mx-auto";

const BRAND_SERVICE_DETAILS = [
  {
    idx: "(01)",
    title: "Effortless collaboration",
    description: [
      "Smart Matching — AI-powered system connects brands with the right creators based on audience, style and engagement.",
      "Seamless communication — in-app messaging & collaboration tools to keep discussions organized.",
      "Approval workflows — brands can review, request edits, and approve content before it goes live.",
    ],
  },
  {
    idx: "(02)",
    title: "Campaign Management",
    description: [
      "End-to-End Dashboard — create, manage and track all influencer campaigns in one place.",
      "Seamless communication — in-app messaging & collaboration tools to keep discussions organized.",
      "Approval workflows — brands can review, request edits, and approve content before it goes live.",
    ],
  },
  {
    idx: "(03)",
    title: "Transparent Payments & Rewards",
    description: [
      "Smart Matching — AI-powered system connects brands with the right creators based on audience, style and engagement.",
      "Seamless communication — in-app messaging & collaboration tools to keep discussions organized.",
      "Approval workflows — brands can review, request edits, and approve content before it goes live.",
    ],
  },
];

const CREATOR_SERVICE_DETAILS = [
  {
    idx: "(01)",
    title: "Discover high-fit opportunities",
    description: [
      "Smart discovery — find campaigns matched to your niche, audience and creative style.",
      "Clear briefs — understand deliverables, timelines and approval flow before you commit.",
      "Faster pitching — submit polished proposals and track responses in one place.",
    ],
  },
  {
    idx: "(02)",
    title: "Create with confidence",
    description: [
      "Structured workflows — keep concepting, edits and feedback organized across collaborations.",
      "Project visibility — track campaign progress, objectives and milestones in real time.",
      "Professional presentation — showcase your work with a portfolio brands can review instantly.",
    ],
  },
  {
    idx: "(03)",
    title: "Reliable earnings",
    description: [
      "Transparent payments — know what you are earning and when each payout is scheduled.",
      "Simple reconciliation — manage proposals, accepted work and completed deliverables clearly.",
      "Growth-ready setup — scale from one-off jobs to long-term brand partnerships.",
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
    <HomeLayout hideFooter>
      <div className="min-h-screen bg-background pt-14 text-foreground">
        <section className="relative overflow-hidden">
          <div className={CONTAINER}>
            <div className="pt-10 pb-14">
              <div className="flex items-stretch gap-10">
                <div className="relative flex-1 min-h-[520px]">
                  <Image src={campaignCrowdRadial} alt="" fill className="object-cover grayscale" />
                  <div className="absolute inset-0 bg-black/55" />

                  <div className="absolute inset-0 p-2 sm:p-6 flex flex-col justify-center">
                    <div className="text-[54px] sm:text-[70px] leading-[0.95] font-extrabold tracking-[-0.03em]">
                      <div>BEYOND</div>
                      <div>TRANSACTIONS - UNITING</div>
                      <div>COMMUNITIES THAT BUILD WITH</div>
                      <div className="mt-2">AND SHAPE</div>
                      <div className="mt-1 text-[44px] sm:text-[56px]">CULTURE</div>
                    </div>
                  </div>

                  <div className="absolute left-0 bottom-28 p-6 max-w-[260px] text-[11px] text-foreground dark:text-zinc-300 leading-relaxed">
                    Together we create a powerful synergy that propels creativity fuels innovation and
                    unlocks endless possibilities.Join us at Paza and embark on a transformative journey.
                  </div>
                </div>

                <div className="relative w-[460px] hidden lg:block">
                  <Image src={campaignDjPerformance} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute right-0 top-14 w-[310px] text-[11px] text-foreground dark:text-zinc-300 leading-relaxed">
                    Together we create a powerful synergy that propels creativity fuels innovation and
                    unlocks endless possibilities.Join us at Paza and embark on a transformative journey.
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-between w-[280px] border border-white px-6 py-3 text-[13px] gap-4"
                >
                  <span>Lets talk about project</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className={`${CONTAINER} pb-10`}>
            <div className="flex items-end gap-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 block" />
                <span className="w-2 h-2 bg-orange-500 block" />
                <span className="text-[12px] uppercase tracking-[0.18em] text-orange-500">
                  Our Services
                </span>
              </div>

              <h2 className="text-[22px] sm:text-[28px] leading-[1.15] font-medium">
                EXPLORE SERVICES DESIGNED FOR{" "}
                <span className="text-orange-500">CREATORS</span> AND{" "}
                <span className="text-orange-500">BRANDS</span> TO THRIVE
              </h2>
            </div>

            <div className="mt-10 flex w-full items-stretch border-t border-zinc-800 pt-8 text-[18px] font-medium">
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

            <div className="mt-10">
              {serviceDetails.map((s, i) => (
                <div key={s.idx} className="border-t border-zinc-800 pt-10">
                  <div className="grid grid-cols-[120px_1fr] gap-10 items-start">
                    <div className="text-[18px] text-foreground dark:text-zinc-400">{s.idx}</div>

                    <div>
                      <h3 className="text-[20px] sm:text-[22px] font-medium tracking-tight">
                        {s.title}
                      </h3>
                      <div className="mt-3 space-y-3 text-[11px] text-foreground dark:text-zinc-400 leading-relaxed max-w-[620px]">
                        {s.description.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Link
                          href="/#contact"
                          className="inline-flex items-center gap-2 text-[11px] text-foreground dark:text-zinc-300 underline underline-offset-4 hover:text-foreground dark:hover:text-white"
                        >
                          Get in touch
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {i < serviceDetails.length - 1 && <div className="h-6" />}
                </div>
              ))}
              <div className="flex justify-center mt-14">
                <Link
                  href="/#contact"
                  className="text-[14px] text-foreground dark:text-zinc-200 underline underline-offset-4 decoration-zinc-500"
                >
                  More
                </Link>
              </div>
            </div>

            {/* Pricing */}
            <div className="relative mt-24">
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]">
                <Image src={campaignAerialSuits} alt="" fill className="object-cover object-top" />
              </div>
              <div className="flex items-end gap-8">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-500 block" />
                  <span className="text-[12px] uppercase tracking-[0.18em] text-orange-500">
                    Pricing
                  </span>
                </div>
              </div>

              <h2 className="mt-6 text-[30px] sm:text-[38px] md:text-[52px] leading-none tracking-[-0.02em]">
                LET VALUE DRIVEN{" "}
                <span className="text-orange-500">PATNERSHIPS</span>
                <br />
                <span className="text-foreground dark:text-white">POWER YOUR REVENUE</span>
              </h2>

              <div className="mt-10 flex items-center justify-between font-medium text-[18px]">
                <button
                  type="button"
                  onClick={() => setPricingTab("brands")}
                  className={[
                    "w-1/2 text-center pb-3 border-b-4 transition-colors",
                    pricingTab === "brands"
                      ? "border-orange-500 text-foreground dark:text-zinc-100"
                      : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300",
                  ].join(" ")}
                >
                  Brands
                </button>
                <button
                  type="button"
                  onClick={() => setPricingTab("creators")}
                  className={[
                    "w-1/2 text-center pb-3 border-b-4 transition-colors",
                    pricingTab === "creators"
                      ? "border-orange-500 text-foreground dark:text-zinc-100"
                      : "border-transparent text-foreground dark:text-zinc-500 hover:text-foreground dark:hover:text-zinc-300",
                  ].join(" ")}
                >
                  Creator
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-0">
                {pricingPlans.map((p, idx) => (
                  <div
                    key={p.name}
                    className={[
                      "px-6 py-8 border-t border-zinc-900/40",
                      "bg-black/10",
                      idx === 0 ? "border-l border-zinc-900/40" : "border-l border-zinc-900/40",
                    ].join(" ")}
                  >
                    <div className="text-[12px] uppercase tracking-[0.18em] text-foreground dark:text-zinc-500">
                      {p.name}
                    </div>
                    <div className="mt-2 text-[18px] text-foreground dark:text-zinc-400">
                      Sh{" "}
                      <span className="text-[42px] font-semibold text-foreground dark:text-white leading-none">
                        {p.price}
                      </span>{" "}
                      {p.period}
                    </div>
                    <div className="mt-5 space-y-2 text-[11px] text-foreground dark:text-zinc-500 leading-relaxed uppercase">
                      {p.items.slice(0, 6).map((it) => (
                        <p key={it}>{it}</p>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Link
                        href="/account-type"
                        className="group inline-flex w-full items-center justify-between bg-orange-500 text-black px-5 py-4 text-[12px] font-medium"
                      >
                        <span>GET STARTED</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="relative mt-28 pb-20">
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]">
                <Image src={campaignFashionEnsemble} alt="" fill className="object-cover object-center" />
              </div>
              <h2 className="text-center text-[44px] sm:text-[56px] md:text-[64px] leading-none tracking-[-0.02em]">
                WHAT IF YOUR NEXT <br />
                <span className="text-orange-500">CAMPAIGN</span> STARTED HERE?
              </h2>
              <p className="mx-auto mt-6 max-w-[680px] text-center text-[13px] text-foreground dark:text-zinc-400 leading-relaxed">
                Connect with the right creators, launch impactful campaigns, and watch your brand
                grow. Join us and be among the first to experience seamless brand-creator collaborations.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-3 border border-white px-8 py-4 text-[14px] hover:bg-white/5 transition-colors"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className={`${CONTAINER} py-16`}>
              <div className="grid md:grid-cols-[1fr_1.2fr_1fr] gap-8 items-start">
                <div>
                  <div className="text-[14px]">
                    <Link href="/">Home</Link>
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
                  <div className="space-y-2">
                    <p className="text-orange-500">Services</p>
                    <p>Partnership</p>
                    <p>About us</p>
                  </div>

                  <div className="mt-16 space-y-2 text-foreground dark:text-zinc-300">
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

                  <div className="mt-16 text-[10px] uppercase text-foreground dark:text-zinc-500">
                    <p>© 2023 — copyright</p>
                    <p>Privacy</p>
                  </div>
                </div>

                <div className="text-[14px]">
                  <p>Contacts</p>
                  <p className="mt-20 text-foreground dark:text-zinc-300">
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

