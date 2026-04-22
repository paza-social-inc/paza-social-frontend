"use client";

import { Archivo_Black } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RiBriefcaseLine, RiUserLine } from "@remixicon/react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Instagram,
  Mouse,
  Youtube,
} from "lucide-react";
import {
  campaignMotionFocus,
  campaignPressStudio,
  campaignUrbanBodega,
  service,
} from "@/assets";
import { cn } from "@/lib/utils";
import { useDocumentThemeIsDark } from "@/lib/useDocumentThemeIsDark";
import { scrollPageToTop } from "@/lib/scrollWithLenis";
import { AnimatedThemeToggler } from "@/components/ui/theme-toggle";
import HomeLayout from "./Layout";
import { MaskedReveal } from "./MaskedReveal";
import { LandingContactForm } from "./LandingContactForm";

/** Light: zinc plate; dark: near-black editorial (matches Services `bg-background` behavior) */
const LANDING_PLATE =
  "border-t border-border bg-zinc-100 text-neutral-900 dark:border-white/[0.08] dark:bg-[#050505] dark:text-white";
const LANDING_PLATE_DEEP =
  "border-t border-border bg-zinc-100 text-neutral-900 dark:border-white/[0.08] dark:bg-black dark:text-white";

/** Hero “PAZA” — heavy geometric display (Figma / Montserrat-Black class). */
const archivoHero = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** Figma 1419:847 — label & UI accent */
/** CONNECTING … BRANDS / CREATORS */
const ORANGE_CONNECTING = "text-[#FF4D00]";
const bodyMicro =
  "text-[11px] leading-[1.65] text-neutral-600 sm:text-[12px] dark:text-white/90";

/** Figma body in How it works steps — mobile-first type scale */
const howStepCopy =
  "text-[14px] leading-[1.5] text-neutral-600 sm:text-[15px] dark:text-[rgba(255,255,255,0.88)]";
const howStepTitle =
  "text-[clamp(1.125rem,4.2vw,2.9rem)] font-medium tracking-[0.02em] text-neutral-900 dark:text-white";

/** Aligns all sections to 1320 artboard — base = phone gutters, scale up at sm+ */
const PAGE_PAD = "px-4 sm:px-6 md:px-10 lg:px-12 xl:px-[60px]";
const PAGE = cn("mx-auto w-full max-w-[1320px]", PAGE_PAD);

/** Account picker → `/register?accountType=…` (register alone redirects without params) */
const SIGNUP_HREF = "/account-type";

// ─── 1) Hero — Figma `1419:897` (1440×1024, node `1419:847` file) ───

const FIGMA_HERO_BG =
  "https://www.figma.com/api/mcp/asset/aa1bca31-87ee-4ed4-8bd2-127845695238";
const FIGMA_HERO_CENTER_IMG =
  "https://www.figma.com/api/mcp/asset/476027f9-ccbd-4a92-896d-3f865628283f";

const HERO_TOP_IMG_PCT = (418 / 1024) * 100;
const HERO_TOP_PAZA_PCT = (539 / 1024) * 100;
const HERO_TOP_SCROLL_PCT = (968 / 1024) * 100;

function PazaSplashHero() {
  const docIsDark = useDocumentThemeIsDark();
  const heroCopyClass = cn(
    "m-0 max-w-[min(100%,349px)] text-left font-sans text-[15px] font-normal leading-[1.72] sm:text-[16px]",
    docIsDark ? "text-white/88" : "text-neutral-700",
  );
  const heroPlate = cn(
    "fixed inset-0 z-0 h-dvh min-h-dvh w-full overflow-hidden",
    docIsDark ? "bg-[#0e0e0e] text-white" : "bg-zinc-100 text-neutral-900",
  );
  const heroDisplayType = cn(
    archivoHero.className,
    "text-center font-normal uppercase leading-[1.27] tracking-[-0.04em]",
    docIsDark ? "text-white" : "text-neutral-900",
  );
  const heroScrollRow = cn(
    "flex flex-row items-center justify-center gap-2.5 font-sans font-normal leading-[1.72]",
    docIsDark ? "text-white" : "text-neutral-600",
  );

  return (
    <>
      {/* Fixed plate: stays in the viewport until scroll passes the spacer below; clips overflow */}
      <section className={heroPlate} aria-label="Paza introduction">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={FIGMA_HERO_BG}
            alt=""
            fill
            unoptimized
            className={cn("object-cover object-center", !docIsDark && "opacity-35")}
            sizes="100vw"
            priority
          />
          {!docIsDark && (
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 via-zinc-100/95 to-zinc-100" aria-hidden />
          )}
        </div>

        {/* Mobile-first column layout; lg+ switches to absolute Figma frame */}
        <div
          className={cn(
            "relative z-10 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col items-stretch overflow-hidden px-4 pb-24 pt-[min(22vh,6.5rem)] sm:px-6 sm:pb-28 sm:pt-[min(24vh,7.5rem)]",
            "lg:hidden",
          )}
        >
          <MaskedReveal delay={0.06} className="block w-full max-w-[min(100%,349px)] self-start">
            <p className={heroCopyClass}>
              Collaborate with creators, communities, individuals, or brands that perfectly align with your
              essence and goals.
            </p>
          </MaskedReveal>
          <div className="relative mx-auto mt-8 w-full max-w-[min(780px,calc(100vw-2rem))] sm:mt-12" style={{ aspectRatio: "780 / 518" }}>
            <Image
              src={FIGMA_HERO_CENTER_IMG}
              alt=""
              fill
              unoptimized
              className={cn("object-cover object-center grayscale", !docIsDark && "opacity-90")}
              sizes="100vw"
              priority
            />
          </div>
          <h1
            className={cn(heroDisplayType, "mx-auto mt-3 w-full max-w-[min(1066px,calc(100vw-32px))] sm:mt-4")}
            style={{ fontSize: "clamp(3rem, 14vw, 8rem)" }}
          >
            PAZA
          </h1>
          <div
            className={cn(
              heroScrollRow,
              "mt-auto pb-6 sm:pb-8 pt-8 text-[15px] sm:text-[16px]",
            )}
          >
            <span className="whitespace-pre">Scroll Down </span>
            <Mouse className="h-[19px] w-[13px] shrink-0" strokeWidth={1.25} aria-hidden />
          </div>

          {/* Hero Actions for Mobile */}
          {/* <div className="mt-4 flex flex-col gap-3">
            <Button asChild className="h-12 w-full text-sm font-semibold uppercase tracking-wider">
              <Link href={SIGNUP_HREF}>Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 w-full text-sm font-semibold uppercase tracking-wider bg-transparent border-neutral-400 dark:border-white/20">
              <Link href="/login">Login</Link>
            </Button>
          </div> */}
        </div>

        {/* lg+: absolute-layered hero (same content order as mobile: copy → image → PAZA → scroll) */}
        <div className="relative z-10 mx-auto hidden h-full w-full max-w-[1440px] lg:block">
          <div
            className={cn(
              "absolute left-0 z-[2] w-full max-w-[1440px] pl-4 pr-3 sm:pl-6 md:pl-10 lg:pl-12 xl:pl-[60px]",
              "top-[min(22vh,11rem)] sm:top-[min(24vh,12rem)] lg:top-[min(22vh,13rem)]",
            )}
          >
            <MaskedReveal delay={0.06} className="block w-full max-w-[349px]">
              <div className="space-y-8">
                <p className={heroCopyClass}>
                  Collaborate with creators, communities, individuals, or brands that perfectly align with
                  your essence and goals.
                </p>
                {/* <div className="flex items-center gap-4">
                  <Button asChild className="h-11 rounded-none px-8 text-[12px] font-semibold uppercase tracking-wider shadow-none">
                    <Link href={SIGNUP_HREF}>Sign Up</Link>
                  </Button>
                  <Button asChild variant="ghost" className={cn(
                    "h-11 px-6 text-[12px] font-semibold uppercase tracking-wider hover:bg-white/5",
                    docIsDark ? "text-white" : "text-neutral-900"
                  )}>
                    <Link href="/login">Login</Link>
                  </Button>
                </div> */}
              </div>
            </MaskedReveal>
          </div>

          <div
            className="absolute left-1/2 z-[1] w-[min(780px,calc(100%-32px))] -translate-x-1/2"
            style={{ top: `${HERO_TOP_IMG_PCT}%` }}
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "780 / 518" }}>
              <Image
                src={FIGMA_HERO_CENTER_IMG}
                alt=""
                fill
                unoptimized
                className={cn("object-cover object-center grayscale", !docIsDark && "opacity-90")}
                sizes="780px"
                priority
              />
            </div>
          </div>

          <h1
            className={cn(
              heroDisplayType,
              "pointer-events-none absolute left-1/2 z-[3] w-[min(1066px,calc(100vw-24px))] -translate-x-1/2 select-none whitespace-nowrap",
            )}
            style={{
              top: `${HERO_TOP_PAZA_PCT}%`,
              fontSize: "min(400px, calc((100vw - 32px) * 0.278))",
            }}
          >
            PAZA
          </h1>

          <div
            className={cn(
              heroScrollRow,
              "absolute left-1/2 z-[4] flex -translate-x-1/2 gap-2.5 text-[16px]",
            )}
            style={{ top: `${HERO_TOP_SCROLL_PCT}%` }}
          >
            <span className="whitespace-pre">Scroll Down </span>
            <Mouse className="h-[19px] w-[13px] shrink-0" strokeWidth={1.25} aria-hidden />
          </div>
        </div>
      </section>
      {/* One viewport of scroll height so the fixed hero reads “pinned” until you scroll past */}
      <div className="h-dvh min-h-dvh w-full shrink-0" aria-hidden />
    </>
  );
}

// ─── 2) Connecting — dark editorial (staggered type + 3 photos + copy + CTA) ───

const PHOTO_W_MOBILE = "min(34vw, 130px)";
const PHOTO_W_DESKTOP = "clamp(150px, 17.5vw, 230px)";
const PORTRAIT_H_DESKTOP = "clamp(200px, 23.33vw, 307px)";
const PORTRAIT_H_MOBILE = "calc(min(30vw, 116px) * 4 / 3)";

/** Connecting headlines — Figma: #F9F9F9, PP Neue Montreal, 128px / 400 / 172% (capped, responsive) */
const CONNECTING_HEADLINE_FONT =
  '"PP Neue Montreal", var(--font-sans), ui-sans-serif, system-ui, sans-serif';
const connectingHeadlineBase = {
  fontFamily: CONNECTING_HEADLINE_FONT,
  fontWeight: 400,
  fontStyle: "normal" as const,
  lineHeight: 1.72,
};
const connectingHeadlineMobile: CSSProperties = {
  ...connectingHeadlineBase,
  fontSize: "clamp(1.625rem, 4vw + 0.85rem, 3.5rem)",
};
const connectingHeadlineDesktop: CSSProperties = {
  ...connectingHeadlineBase,
  fontSize: "clamp(2.5rem, 5.5vw + 0.5rem, 128px)",
};

/**
 * Our Services quote block — Figma: PP Neue Montreal, 400, 172% leading, uppercase, 40px cap;
 * orange keywords use #FF6B00 (same stack on white lines).
 */
const servicesQuoteTypography: CSSProperties = {
  fontFamily: CONNECTING_HEADLINE_FONT,
  fontSize: "clamp(0.875rem, 2.2vw + 0.5rem, 40px)",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: 1.72,
};

const servicesQuoteOrange: CSSProperties = {
  ...servicesQuoteTypography,
  color: "#FF6B00",
};

const servicesRowTitle: CSSProperties = {
  fontFamily: CONNECTING_HEADLINE_FONT,
  fontWeight: 400,
  fontStyle: "normal",
  lineHeight: 1.72,
  fontSize: "clamp(0.9rem, 2.5vw + 0.2rem, 2.125rem)",
};

function ConnectingHeroSection() {
  return (
    <section
      id="connecting"
      className={cn("relative pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-20 md:pt-14", LANDING_PLATE_DEEP)}
    >
      <div className={PAGE}>
        {/* Mobile / tablet */}
        <div className="relative lg:hidden">
          <div className="relative" style={{ height: PORTRAIT_H_MOBILE }}>
            <MaskedReveal delay={0.04}>
              <div
                className="absolute left-0 top-0 z-[5] overflow-hidden"
                style={{
                  width: "min(30vw, 116px)",
                  aspectRatio: "3/4",
                  border: "2px solid #FF6B00",
                }}
              >
                <Image
                  src={campaignUrbanBodega}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="116px"
                  priority
                />
              </div>
            </MaskedReveal>
            <MaskedReveal delay={0}>
              <p
                className={`${bodyMicro} absolute right-0 top-0 text-right`}
                style={{ maxWidth: "calc(100% - min(30vw, 116px) - 12px)" }}
              >
                Build partnerships driven by mutual success, growth, and a shared passion to create
                lasting impact — maximizing the value and potential of every campaign.
              </p>
            </MaskedReveal>
          </div>

          <div className="relative">
            <MaskedReveal delay={0.09}>
              <div
                className="absolute right-0 top-0 z-30 overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
                style={{ width: PHOTO_W_MOBILE, aspectRatio: "1/1" }}
              >
                <Image src={service} alt="" fill className="object-cover" sizes="130px" />
                <span className="absolute bottom-1.5 left-1.5 text-[8px] font-semibold uppercase tracking-wider text-white drop-shadow">
                  StreetX
                </span>
              </div>
            </MaskedReveal>

            <MaskedReveal delay={0.06}>
              <p
                className="pl-0 font-normal uppercase text-neutral-900 dark:text-[#F9F9F9]"
                style={connectingHeadlineMobile}
              >
                Connecting
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.1}>
              <p className="pl-[min(6vw,48px)] font-normal uppercase" style={connectingHeadlineMobile}>
                <span className={ORANGE_CONNECTING}>Brands</span>{" "}
                <span className="text-neutral-900 dark:text-[#F9F9F9]">And</span>
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.14}>
              <div className="flex items-end">
                <div
                  className="pointer-events-none relative shrink-0 overflow-hidden"
                  style={{ width: PHOTO_W_MOBILE, aspectRatio: "4/5" }}
                >
                  <Image
                    src={campaignMotionFocus}
                    alt=""
                    fill
                    className="object-cover object-top blur-[2px] scale-110 saturate-[1.4] brightness-90"
                    sizes="130px"
                  />
                </div>
                <p
                  className={cn("flex-1 pl-[min(4vw,24px)] font-normal uppercase", ORANGE_CONNECTING)}
                  style={connectingHeadlineMobile}
                >
                  Creators
                </p>
              </div>
            </MaskedReveal>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <MaskedReveal delay={0.17}>
              <p className={`${bodyMicro} max-w-[260px]`}>
                Seamlessly manage projects of any scale, complexity, or team setup — across any
                timeline, budget, or scope
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.19}>
              <EditorialRuleCta align="end" href={SIGNUP_HREF}>
                <>
                  Start your journey
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
                </>
              </EditorialRuleCta>
            </MaskedReveal>
          </div>
        </div>

        {/* Desktop */}
        <div className="relative hidden lg:block">
          <div className="relative" style={{ height: PORTRAIT_H_DESKTOP }}>
            <MaskedReveal delay={0.04}>
              <div
                className="absolute left-0 top-0 z-[5] overflow-hidden"
                style={{
                  width: "clamp(150px, 17.5vw, 230px)",
                  aspectRatio: "3/4",
                  border: "2.5px solid #FF6B00",
                }}
              >
                <Image
                  src={campaignUrbanBodega}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                  sizes="230px"
                />
              </div>
            </MaskedReveal>
            <MaskedReveal delay={0}>
              <p
                className={`${bodyMicro} absolute right-0 top-0 z-20 text-right`}
                style={{ maxWidth: "clamp(220px, 22vw, 320px)" }}
              >
                Build partnerships driven by mutual success, growth, and a shared passion to create
                lasting impact — maximizing the value and potential of every campaign.
              </p>
            </MaskedReveal>
          </div>

          <div className="relative">
            <MaskedReveal delay={0.08}>
              <div
                className="absolute right-0 top-0 z-30 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
                style={{ width: PHOTO_W_DESKTOP, aspectRatio: "1/1" }}
              >
                <Image src={service} alt="" fill className="object-cover" sizes="230px" />
                <span className="absolute bottom-2 left-2 text-[9px] font-semibold uppercase tracking-wider text-white drop-shadow">
                  StreetX
                </span>
              </div>
            </MaskedReveal>

            <MaskedReveal delay={0.06}>
              <p
                className="pl-0 font-normal uppercase text-neutral-900 dark:text-[#F9F9F9]"
                style={connectingHeadlineDesktop}
              >
                Connecting
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.11}>
              <p className="pl-[min(6vw,100px)] font-normal uppercase" style={connectingHeadlineDesktop}>
                <span className={ORANGE_CONNECTING}>Brands</span>{" "}
                <span className="text-neutral-900 dark:text-[#F9F9F9]">And</span>
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.15}>
              <div className="flex items-end">
                <div
                  className="pointer-events-none relative shrink-0 overflow-hidden"
                  style={{ width: PHOTO_W_DESKTOP, aspectRatio: "4/5" }}
                >
                  <Image
                    src={campaignMotionFocus}
                    alt=""
                    fill
                    className="object-cover object-top blur-[2px] scale-110 saturate-[1.4] brightness-90"
                    sizes="230px"
                  />
                </div>
                <p
                  className={cn("flex-1 pl-[min(5vw,80px)] font-normal uppercase", ORANGE_CONNECTING)}
                  style={connectingHeadlineDesktop}
                >
                  Creators
                </p>
              </div>
            </MaskedReveal>
          </div>

          <div className="mt-8 flex items-end justify-between gap-8">
            <MaskedReveal delay={0.18}>
              <p className={`${bodyMicro} max-w-[320px]`}>
                Seamlessly manage projects of any scale, complexity, or team setup — across any
                timeline, budget, or scope
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.2}>
              <EditorialRuleCta align="end" href={SIGNUP_HREF}>
                <>
                  Start your journey
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
                </>
              </EditorialRuleCta>
            </MaskedReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialLabel({
  children,
  uppercase,
}: {
  children: ReactNode;
  /** Small caps eyebrow (e.g. Our Services on black). */
  uppercase?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[#FF6B00] sm:gap-3">
      <span className="flex gap-1" aria-hidden>
        <span className="h-[17px] w-1.5 shrink-0 bg-[#FF6B00] sm:h-[21px] sm:w-2" />
        <span className="h-[17px] w-1.5 shrink-0 bg-[#FF6B00] sm:h-[21px] sm:w-2" />
      </span>
      <span
        className={cn(
          "font-normal tracking-normal text-[#FF6B00]",
          uppercase
            ? "text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-[12px]"
            : "text-[15px] normal-case sm:text-[18px]",
        )}
      >
        {children}
      </span>
    </span>
  );
}

type EditorialRuleAlign = "start" | "center" | "end";

const editorialCtaLabel =
  "inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-neutral-900 transition-colors group-hover:text-[#FF6B00] sm:text-[12px] dark:text-white dark:group-hover:text-[#FF6B00]";

const editorialCtaLabelOnBlack =
  "inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] text-white transition-colors group-hover:text-[#FF6B00] sm:text-[12px]";

/**
 * CTA: label + arrow with a separate rule extending past the text (Figma spec).
 */
function EditorialRuleCta(
  props:
    | {
      align: EditorialRuleAlign;
      children: ReactNode;
      href: string;
      /** White label + rule on black (Our Services footer). */
      invert?: boolean;
    }
    | {
      align: EditorialRuleAlign;
      children: ReactNode;
      onClick: () => void;
      invert?: boolean;
    },
) {
  const { align, children } = props;
  const invert = "invert" in props && props.invert;
  const href = "href" in props ? props.href : undefined;
  const onClick = "onClick" in props ? props.onClick : undefined;
  const ruleWidth = cn(
    "h-px shrink-0 transition-colors group-hover:bg-[#FF6B00]",
    invert ? "bg-white/65" : "bg-neutral-400 dark:bg-white/65",
    align === "center" && "w-[min(calc(100%+28px),min(100vw-2rem,420px))] sm:w-[calc(100%+28px)]",
    align === "end" && "w-[calc(100%+28px)]",
    align === "start" && "w-[calc(100%+28px)]",
  );

  const root = cn(
    "group inline-flex max-w-full flex-col gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2",
    invert
      ? "focus-visible:ring-offset-black"
      : "focus-visible:ring-offset-background dark:focus-visible:ring-offset-black",
    align === "center" && "mx-auto items-center",
    align === "end" && "ml-auto items-end text-right",
    align === "start" && "mr-auto items-start text-left",
  );

  const inner = (
    <>
      <span className={invert ? editorialCtaLabelOnBlack : editorialCtaLabel}>{children}</span>
      <span className={ruleWidth} aria-hidden />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={root}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(root, "cursor-pointer bg-transparent p-0")}>
      {inner}
    </button>
  );
}

/** Section 3 — mission + Learn more (design: about block before studio image). */
function MissionIntroSection() {
  return (
    <section
      id="who-is-paza"
      className={cn("py-12 sm:py-16 md:py-24 lg:py-32", LANDING_PLATE)}
    >
      <div className={PAGE}>
        <MaskedReveal delay={0}>
          <h2 className="m-0 flex justify-start p-0 font-[inherit] font-normal leading-none">
            <EditorialLabel>Who is Paza</EditorialLabel>
          </h2>
        </MaskedReveal>

        <MaskedReveal delay={0.06}>
          <p className="mt-8 max-w-[min(100%,1251px)] text-left text-[clamp(1.1rem,4.2vw,2.5rem)] font-bold uppercase leading-[1.72] tracking-[0.01em] text-neutral-900 dark:text-white sm:mt-10">
            Paza is a collaboration management hub that delivers precision matches among brands,
            creators and partners.
            <br />
            <span className="mt-2 block">
              By aligning on identity, vision, values, and audience, Paza enables partnerships that
              feel authentic, resonate deeply, and create lasting impact
            </span>
          </p>
        </MaskedReveal>

        <MaskedReveal delay={0.12}>
          <div className="mt-10 flex justify-center sm:mt-14 md:mt-16">
            <EditorialRuleCta align="center" href="/about">
              <>
                Learn More About Us
                <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
              </>
            </EditorialRuleCta>
          </div>
        </MaskedReveal>
      </div>
    </section>
  );
}

/** Section 4 — studio image + secondary mission (Figma 1419:1036). */
function StudioSecondarySection() {
  return (
    <section className={cn("py-12 sm:py-16 md:py-20 lg:py-24", LANDING_PLATE)}>
      <div className={PAGE}>
        <MaskedReveal delay={0}>
          <div className="relative mx-auto w-full max-w-[min(92%,720px)] overflow-hidden border border-zinc-800/90">
            <div className="relative aspect-[16/10] w-full sm:aspect-[5/3]">
              <Image
                src={campaignPressStudio}
                alt="Collaborators reviewing work at a desk in a studio"
                fill
                className="object-cover object-center grayscale"
                sizes="(max-width: 768px) 92vw, 720px"
                loading="lazy"
              />
            </div>
          </div>
        </MaskedReveal>

        <MaskedReveal delay={0.08}>
          <p className="mt-10 max-w-[min(100%,1108px)] text-left text-[clamp(1rem,3.8vw,2.25rem)] font-bold uppercase leading-[1.72] tracking-[0.01em] text-neutral-900 dark:text-white sm:mt-14 md:mt-20">
            Finding the right partner can be slow, unclear, and risky. we streamline
            collaboration—from discovery and connection to campaign planning, real-time
            communication, task management, and secure escrow payments— ensuring every collaboration
            is aligned, transparent, and results-driven.
          </p>
        </MaskedReveal>

        <MaskedReveal delay={0.14}>
          <div className="mt-10 flex w-full justify-center sm:mt-12 md:mt-14 lg:justify-end">
            <EditorialRuleCta align="end" href={SIGNUP_HREF}>
              <>
                Start your journey
                <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
              </>
            </EditorialRuleCta>
          </div>
        </MaskedReveal>
      </div>
    </section>
  );
}

/** Figma / reference — four rows, black plate (always), white type, orange keywords. */
const SERVICE_ROWS = [
  { index: "01", title: "Creator Partnerships" },
  { index: "02", title: "Production" },
  { index: "03", title: "Brand Strategy" },
  { index: "04", title: "Content Production" },
] as const;

function OurServicesSection() {
  const docIsDark = useDocumentThemeIsDark();

  return (
    <section
      id="our-services"
      className="border-t border-border bg-zinc-100 py-14 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:py-20 md:py-24 lg:py-32"
    >
      <div className={PAGE}>
        {/*
          Figma header: row, items-center, gap between label and headline.
          Headline = 2 lines, 40px / 172% / PP Neue / uppercase; #fff + #FF6B00 on CREATORS & BRANDS.
        */}
        <div className="mb-10 flex flex-col items-start gap-8 sm:mb-12 sm:flex-row sm:items-center sm:gap-12 md:mb-24 md:gap-16 lg:gap-20 xl:gap-24">
          <MaskedReveal delay={0}>
            <h2 className="m-0 shrink-0 p-0 font-[inherit] font-normal leading-none">
              <EditorialLabel>Our Services</EditorialLabel>
            </h2>
          </MaskedReveal>
          <MaskedReveal delay={0.06}>
            <div className="min-w-0 flex-1">
              <p
                className="m-0 text-left uppercase text-neutral-900 dark:text-white"
                style={servicesQuoteTypography}
              >
                <span className="block">
                  {'\u201c'}
                  Dive into services built for{' '}
                  <span style={servicesQuoteOrange}>creators</span>
                  {' and'}
                </span>
                <span className="block">
                  <span style={servicesQuoteOrange}>brands</span>
                  {' to convert and thrive together'}
                </span>
              </p>
            </div>
          </MaskedReveal>
        </div>
      </div>

      <div className="w-full border-y border-border bg-zinc-100 dark:border-white/10 dark:bg-black">
        <ul className="m-0 list-none divide-y divide-border dark:divide-white/10 p-0">
          {SERVICE_ROWS.map((row) => (
            <li key={`${row.index}-${row.title}`}>
              <Link
                href="/services"
                className={cn(
                  "group mx-auto grid w-full max-w-[1320px] touch-manipulation items-center",
                  PAGE_PAD,
                  "grid-cols-[minmax(2rem,2.75rem)_minmax(0,5.25rem)_minmax(0,1fr)_auto]",
                  "gap-x-2 gap-y-2 py-6 sm:gap-x-5 sm:py-8 md:gap-x-8 md:py-10",
                  "transition-colors hover:bg-black/5 dark:hover:bg-white/3",
                )}
              >
                <span className="services-index tabular-nums text-[clamp(1.1rem,2.2vw,1.75rem)] font-medium leading-none text-neutral-900 dark:text-white">
                  {row.index}
                </span>
                <span className="services-click hidden min-w-0 whitespace-nowrap text-[10px] font-medium leading-snug tracking-[0.04em] text-neutral-500 dark:text-zinc-500 sm:block sm:text-[11px] md:text-[12px]">
                  Click to open
                </span>
                <span
                  className="services-title min-w-0 text-left text-neutral-900 dark:text-white"
                  style={servicesRowTitle}
                >
                  {row.title}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-900 transition group-hover:text-[#FF6B00] dark:text-white sm:h-10 sm:w-10">
                  <ArrowUpRight className="h-5 w-5 stroke-[1.25] sm:h-[22px] sm:w-[22px]" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={PAGE}>
        <MaskedReveal delay={0.1}>
          <div className="mt-16 flex justify-center md:mt-20">
            <EditorialRuleCta align="center" href="/services" invert={docIsDark}>
              <>
                View Our Services
                <ArrowRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 stroke-[1.75] group-hover:text-[#FF6B00]",
                    docIsDark ? "text-white" : "text-neutral-900",
                  )}
                  aria-hidden
                />
              </>
            </EditorialRuleCta>
          </div>
        </MaskedReveal>
      </div>
    </section>
  );
}

/** Account-type modal mock — matches “Please select your account type” + Continue (comp). */
function AccountTypeMockupCard({
  className,
  href = "/account-type",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "mx-auto block w-full max-w-[min(100%,280px)] rounded-[10px] border border-border bg-card p-4 shadow-lg transition hover:border-[#FF6B00]/40 sm:max-w-[320px] sm:p-5 dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_28px_90px_rgba(0,0,0,0.55)] dark:hover:border-white/20",
        className,
      )}
    >
      <p className="mb-4 text-center text-xs font-medium leading-4 text-foreground">
        Please select your account type
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/60 px-2 py-4 text-center dark:border-white/10 dark:bg-black/60">
          <RiBriefcaseLine className="mx-auto mb-2 h-7 w-7 text-[#FF6B00] sm:h-8 sm:w-8" aria-hidden />
          <p className="text-[10px] font-semibold text-foreground sm:text-[11px]">I&apos;m a Brand</p>
        </div>
        <div className="rounded-lg border border-[#FF6B00]/50 bg-muted/60 px-2 py-4 text-center ring-1 ring-[#FF6B00]/25 dark:bg-black/60">
          <RiUserLine className="mx-auto mb-2 h-7 w-7 text-[#FF6B00] sm:h-8 sm:w-8" aria-hidden />
          <p className="text-[10px] font-semibold text-foreground sm:text-[11px]">I&apos;m a Creator</p>
        </div>
      </div>
      <div className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#FF6B00] text-sm font-semibold text-white">
        <span>Continue</span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      </div>
    </Link>
  );
}

const HOW_PLATFORM_WORKS_STEPS = [
  {
    id: "01",
    title: "Create Your Profile",
    layout: "mockRight" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Sign up and set up your account, adding details about your brand or creator identity to
          attract the right collaborators
        </p>
      </>
    ),
  },
  {
    id: "02",
    title: "Find & Connect",
    layout: "stackMockTop" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Use Paza&apos;s job board to post campaigns (for brands) or apply to opportunities (for
          creators), connecting with potential partners.
        </p>
      </>
    ),
  },
  {
    id: "03",
    title: "Manage Your Collaboration",
    layout: "mockLeft" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Use Paza&apos;s tools to plan, execute, and track campaigns, including task assignment and
          communication.
        </p>
      </>
    ),
  },
  {
    id: "04",
    title: "Review and Improve",
    layout: "mockLeft" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Review campaign metrics, gather feedback, and spot what to repeat or refine. Strong
          partnerships compound when every launch teaches you something new.
        </p>
      </>
    ),
  },
];

function HowItWorksStepPanel({
  stepNumber,
  title,
  layout,
  children,
}: {
  stepNumber: string;
  title: string;
  layout: "mockRight" | "mockLeft" | "stackMockTop";
  children: ReactNode;
}) {
  const mock = (
    <div
      className={cn(
        "flex w-full shrink-0 justify-center",
        layout === "mockRight" && "lg:max-w-[320px] lg:justify-end",
        layout === "mockLeft" && "lg:max-w-[320px] lg:justify-start",
        layout === "stackMockTop" && "mx-auto w-full max-w-[min(100%,320px)]",
      )}
    >
      <AccountTypeMockupCard />
    </div>
  );

  const copy = (
    <div className="relative z-10 min-w-0 max-w-[480px]">
      <h3 id={`how-step-${stepNumber}-title`} className={howStepTitle}>
        {title}
      </h3>
      <div className="mt-4 text-left">{children}</div>
    </div>
  );

  return (
    <article
      className={cn(
        "relative isolate w-[calc(100vw-2rem)] max-w-[600px] shrink-0 snap-center snap-always px-1 py-8 sm:w-[600px] sm:min-w-[600px] sm:px-2 sm:py-12 lg:px-4 lg:py-14",
      )}
      aria-labelledby={`how-step-${stepNumber}-title`}
    >
      <span
        className="pointer-events-none absolute left-2 top-6 -z-10 select-none text-[min(28vw,7.5rem)] font-semibold leading-[0.82] text-[#141414] sm:left-4 sm:top-8 sm:text-[clamp(7rem,18vw,13.75rem)]"
        aria-hidden
      >
        {stepNumber}
      </span>

      {layout === "stackMockTop" ? (
        <div className="relative z-10 flex w-full flex-col items-stretch gap-12">
          {mock}
          <div className="w-full max-w-[540px]">{copy}</div>
        </div>
      ) : (
        <div className="relative z-10 grid w-full gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {layout === "mockRight" ? (
            <>
              {copy}
              {mock}
            </>
          ) : (
            <>
              {mock}
              {copy}
            </>
          )}
        </div>
      )}
    </article>
  );
}

/** lg+: vertical scroll maps to horizontal translate; clamped at start/end. */
function HowItWorksDesktopScrollDriver() {
  const driverRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxOffset, setMaxOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;
    setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (track) ro.observe(track);
    if (viewport) ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: driverRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, (p) => -p * maxOffset);

  const panels = (
    <>
      {HOW_PLATFORM_WORKS_STEPS.map((step) => (
        <HowItWorksStepPanel
          key={step.id}
          stepNumber={step.id}
          title={step.title}
          layout={step.layout}
        >
          {step.body}
        </HowItWorksStepPanel>
      ))}
      <div className="w-4 shrink-0 sm:w-8" aria-hidden />
    </>
  );

  if (reduceMotion) {
    return (
      <div className="hidden touch-pan-x lg:block" role="region" aria-label="Platform workflow steps">
        <div
          className={cn(
            PAGE_PAD,
            "flex gap-12 overflow-x-auto overflow-y-visible pb-4 pt-2 [scrollbar-width:thin] sm:gap-14 lg:gap-16",
            "[scrollbar-color:rgba(0,0,0,0.22)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent]",
            "snap-x snap-mandatory scroll-smooth",
          )}
        >
          {panels}
        </div>
      </div>
    );
  }

  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  /**
   * Shorter vertical scroll track than `maxOffset + vh` so less empty space before the CTA,
   * while `useTransform` still maps full horizontal distance across scroll progress 0→1.
   */
  const driverHeightPx =
    maxOffset > 0 ? Math.max(Math.round(vh * 0.85), Math.round(maxOffset * 0.42 + vh * 0.55)) : undefined;

  return (
    <div
      ref={driverRef}
      className="relative hidden lg:block"
      style={driverHeightPx ? { height: driverHeightPx } : { minHeight: "100dvh" }}
      role="region"
      aria-label="Platform workflow steps"
    >
      <div className="sticky top-0 flex h-[100dvh] max-h-[100dvh] w-full items-center overflow-hidden bg-zinc-100 dark:bg-[#050505]">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className={cn(PAGE_PAD, "flex w-max flex-nowrap gap-12 pb-4 pt-2 will-change-transform sm:gap-14 lg:gap-16")}
        >
          {panels}
        </motion.div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative">
      {/*
        Figma header: black strip, label left + centered 2-line headline (40px / 172% / PP Neue),
        #FFFFFF + #FF6B00 on CONNECT / CAMPAIGNS.
      */}
      <div className="border-b border-border bg-zinc-100 py-10 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:py-12 md:py-16 lg:py-20">
        <div className={PAGE}>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
            <MaskedReveal delay={0}>
              <h2 className="m-0 shrink-0 p-0 font-[inherit] font-normal leading-none">
                <EditorialLabel>How It Works</EditorialLabel>
              </h2>
            </MaskedReveal>
            <MaskedReveal delay={0.06}>
              <div className="flex min-w-0 flex-1 justify-center">
                <p
                  className="m-0 max-w-[min(100%,52rem)] text-center uppercase text-neutral-900 dark:text-white"
                  style={servicesQuoteTypography}
                >
                  <span className="block">
                    See how Paza works to <span style={servicesQuoteOrange}>connect</span>
                  </span>
                  <span className="block">
                    and drive impactful <span style={servicesQuoteOrange}>campaigns</span>
                  </span>
                </p>
              </div>
            </MaskedReveal>
          </div>
        </div>
      </div>

      <div className={cn("py-6 sm:py-8 md:py-10 lg:py-12", LANDING_PLATE)}>
        <div className="touch-pan-x lg:hidden" role="region" aria-label="Platform workflow steps">
          <div
            className={cn(
              PAGE_PAD,
              "flex gap-12 overflow-x-auto overflow-y-visible pb-4 pt-2 [scrollbar-width:thin] sm:gap-14 lg:gap-16",
              "[scrollbar-color:rgba(0,0,0,0.22)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent]",
              "snap-x snap-mandatory scroll-smooth",
            )}
          >
            {HOW_PLATFORM_WORKS_STEPS.map((step) => (
              <HowItWorksStepPanel
                key={step.id}
                stepNumber={step.id}
                title={step.title}
                layout={step.layout}
              >
                {step.body}
              </HowItWorksStepPanel>
            ))}
            <div className="w-4 shrink-0 snap-end sm:w-8" aria-hidden />
          </div>
        </div>

        <HowItWorksDesktopScrollDriver />

        <div className={PAGE}>
          <div className="mt-6 flex flex-col items-center gap-2.5 sm:mt-8 sm:gap-3 md:mt-10 md:items-end">
            <EditorialRuleCta align="end" href={SIGNUP_HREF}>
              <>
                Start your journey
                <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
              </>
            </EditorialRuleCta>
            <p className="max-w-sm text-center text-[11px] leading-relaxed text-neutral-900/75 md:text-right dark:text-white/80">
              Start today and see how your vision can shape the world
            </p>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-border sm:mt-8 md:mt-10 dark:bg-white/10" aria-hidden />
      </div>
    </section>
  );
}

/** Figma 1419:925 — form + contact grid in one #050505 plate */
function FigmaContactSection() {
  const docIsDark = useDocumentThemeIsDark();

  return (
    <section id="contact" className={cn("py-12 sm:py-16 md:py-24 lg:py-28", LANDING_PLATE)}>
      <div className={PAGE}>
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16 xl:gap-20">
          <div>
            <MaskedReveal delay={0}>
              <p className="m-0">
                <EditorialLabel>Get in touch</EditorialLabel>
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.05}>
              <h2 className="mt-8 text-[clamp(2rem,5vw,4rem)] font-normal uppercase leading-[1.48] tracking-tight text-neutral-900 dark:text-white">
                let&apos;s talk about YOUR project!
              </h2>
            </MaskedReveal>
            <MaskedReveal delay={0.1}>
              <p className="mt-6 max-w-[26rem] text-lg leading-[1.35] text-[#8d8d8d]">
                Have questions, feedback, or partnership ideas? We&apos;d love to hear from you.
                Reach out and let&apos;s make great things happen!
              </p>
            </MaskedReveal>
            <MaskedReveal delay={0.14}>
              <p className="mt-8 max-w-[26rem] text-lg leading-[1.35] text-[#8d8d8d]">
                Have a collaboration need? Contact us to design a solution that scales with your
                vision
              </p>
            </MaskedReveal>
          </div>
          <div className="min-w-0">
            <LandingContactForm />
          </div>
        </div>

        {/*
          Figma contact footer: black plate, CONTACT US + subtext | Start your journey (rule),
          social row right, divider, Nairobi | phone/email/location grid.
        */}
        <div className="mt-12 w-full border-t border-border bg-zinc-100 py-12 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:mt-16 sm:py-16 md:mt-20 md:py-20 lg:py-24">
          <div className={PAGE}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="min-w-0 max-w-[min(100%,36rem)]">
                <h2
                  id="contact-us-heading"
                  className="m-0 uppercase leading-[1.72] tracking-tight text-neutral-900 dark:text-white"
                  style={servicesQuoteTypography}
                >
                  Contact us
                </h2>
                <p className="mt-4 max-w-[26rem] text-base leading-relaxed text-neutral-600 dark:text-[#9e9e9e] sm:text-lg">
                  Have a collaboration need? Contact us to design a solution that scales with your
                  vision
                </p>
              </div>
              <div className="shrink-0 self-end lg:self-auto lg:pt-1">
                <EditorialRuleCta align="end" href={SIGNUP_HREF} invert={docIsDark}>
                  <>
                    Start your journey
                    <ArrowRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 stroke-[1.75] group-hover:text-[#FF6B00]",
                        docIsDark ? "text-white" : "text-neutral-900",
                      )}
                      aria-hidden
                    />
                  </>
                </EditorialRuleCta>
              </div>
            </div>

            <nav
              className="mt-10 flex flex-wrap justify-end gap-x-10 gap-y-3 text-lg underline decoration-neutral-400/70 underline-offset-4 dark:decoration-white/40 sm:mt-12"
              aria-label="Social links"
            >
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 transition-colors hover:text-[#FF6B00] dark:text-white"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-900 transition-colors hover:text-[#FF6B00] dark:text-white"
              >
                <Instagram className="h-5 w-5 shrink-0" aria-hidden />
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-900 transition-colors hover:text-[#FF6B00] dark:text-white"
              >
                <Youtube className="h-5 w-5 shrink-0" aria-hidden />
                Youtube
              </a>
            </nav>

            <div className="mt-8 h-px w-full bg-border dark:bg-white/15 sm:mt-10" aria-hidden />

            <div className="mt-10 flex flex-col gap-10 sm:mt-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <p
                className="m-0 uppercase leading-[1.72] tracking-tight text-neutral-900 dark:text-white"
                style={servicesQuoteTypography}
              >
                Nairobi, Kenya
              </p>
              <div className="grid w-full max-w-2xl gap-10 sm:grid-cols-3 sm:gap-8 lg:max-w-none">
                <div className="text-left">
                  <p className="text-lg font-medium text-neutral-600 dark:text-[#9e9e9e]">Phone no.</p>
                  <a
                    href="tel:+254422189529"
                    className="mt-2 block text-lg text-neutral-900 transition-colors hover:text-[#FF6B00] dark:text-white"
                  >
                    +254 422 189 529
                  </a>
                </div>
                <div className="text-left">
                  <p className="text-lg font-medium text-neutral-600 dark:text-[#9e9e9e]">Email</p>
                  <a
                    href="mailto:info@pazasocial.com"
                    className="mt-2 block text-lg text-neutral-900 transition-colors hover:text-[#FF6B00] dark:text-white"
                  >
                    info@pazasocial.com
                  </a>
                </div>
                <div className="text-left">
                  <p className="text-lg font-medium text-neutral-600 dark:text-[#9e9e9e]">Location</p>
                  <p className="mt-2 text-lg text-neutral-900 dark:text-white">00100, Ronald Ngala St, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPageFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 text-foreground dark:border-white/[0.08] dark:bg-black dark:text-white">
      <div className={`${PAGE} py-10 sm:py-12 md:py-16`}>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <AnimatedThemeToggler className="h-10 w-10 shrink-0 touch-manipulation md:h-12 md:w-12 dark:border-white/35 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 [&_svg]:dark:text-white" />
            <button
              type="button"
              onClick={() => scrollPageToTop()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-[#FF6B00] hover:text-[#FF6B00] md:h-12 md:w-12 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:text-[#FF6B00]"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.25} />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
            <p className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl dark:text-white">
              PAZA
            </p>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-10 sm:flex sm:flex-1 sm:justify-end sm:gap-16 md:gap-24" aria-label="Footer">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Menu
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#contact"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Legal
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground transition-colors hover:text-[#FF6B00] dark:text-zinc-300"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 dark:border-white/[0.08]">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PAZA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("signup") === "creator") {
      router.replace("/register?accountType=creator");
    }
  }, [router]);

  return (
    <HomeLayout hideFooter>
      <div className="bg-background text-foreground">
        <PazaSplashHero />
        <div className="relative z-10 bg-background text-foreground">
          <ConnectingHeroSection />

          <MissionIntroSection />
          <StudioSecondarySection />

          <OurServicesSection />

          <HowItWorksSection />

          <FigmaContactSection />

          <LandingPageFooter />
        </div>
      </div>
    </HomeLayout>
  );
}
