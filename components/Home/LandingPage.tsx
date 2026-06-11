"use client";

import { Archivo_Black } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RiBriefcaseLine, RiUserLine } from "@remixicon/react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Instagram,
  Youtube,
} from "lucide-react";

import {
  campaignPressStudio,
  pazaLandingImg,
} from "@/assets";

import { cn } from "@/lib/utils";
import { useDocumentThemeIsDark } from "@/lib/useDocumentThemeIsDark";
import { scrollPageToTop } from "@/lib/scrollWithLenis";
import { AnimatedThemeToggler } from "@/components/ui/theme-toggle";
import HomeLayout from "./Layout";
import { MaskedReveal } from "./MaskedReveal";
import { LandingContactForm } from "./LandingContactForm";
import { ConnectingHeroSection } from "./connectingHeroSection";
import { HowItWorksSection } from "./HowItWorksSectionMain";

/** Light: zinc plate; dark: near-black editorial (matches Services `bg-background` behavior) */
export const LANDING_PLATE =
  "border-t border-border bg-zinc-100 text-neutral-900 dark:border-white/[0.08] dark:bg-[#050505] dark:text-white";
export const LANDING_PLATE_DEEP =
  "border-t border-border bg-zinc-100 text-neutral-900 dark:border-white/[0.08] dark:bg-black dark:text-white";

/** Hero “PAZA” — heavy geometric display (Figma / Montserrat-Black class). */
export const archivoHero = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** Figma 1419:847 — label & UI accent */
/** CONNECTING … BRANDS / CREATORS */
export const ORANGE_CONNECTING = "text-[#FF4D00]";
export const bodyMicro =
  "text-base leading-[1.65] text-neutral-600 sm:text-[12px] dark:text-white/90";

/** Figma body in How it works steps — mobile-first type scale */
export const howStepCopy =
  "text-[14px] leading-[1.5] text-neutral-600 sm:text-[15px] dark:text-[rgba(255,255,255,0.88)]";
export const howStepTitle =
  "text-[clamp(1.125rem,4.2vw,2.9rem)] font-medium tracking-[0.02em] text-neutral-900 dark:text-white";

/** Aligns all sections to 1320 artboard — base = phone gutters, scale up at sm+ */
export const PAGE_PAD = "px-4 sm:px-6 md:px-10 lg:px-12 xl:px-[60px]";
export const PAGE = cn("mx-auto w-full max-w-[1320px]", PAGE_PAD);

/** Account picker → `/register?accountType=…` (register alone redirects without params) */
export const SIGNUP_HREF = "/account-type";

// ─── 1) Hero — Figma `1419:897` (1440×1024, node `1419:847` file) ───

const FIGMA_HERO_BG = pazaLandingImg;

function PazaSplashHero() {
  const docIsDark = useDocumentThemeIsDark();
  const heroCopyClass = cn(
    "m-0 max-w-[min(100%,500px)] text-left font-sans text-lg font-medium leading-[1.6] sm:text-xl lg:text-2xl drop-shadow-md",
    docIsDark ? "text-white" : "text-neutral-900",
  );
  const heroPlate = cn(
    "fixed inset-0 z-0 h-dvh min-h-dvh w-full overflow-hidden flex flex-col",
    docIsDark ? "bg-[#0e0e0e] text-white" : "bg-zinc-100 text-neutral-900",
  );
  const heroDisplayType = cn(
    archivoHero.className,
    "text-center font-normal uppercase leading-[0.85] tracking-[-0.04em] drop-shadow-xl",
    docIsDark ? "text-white" : "text-neutral-900",
  );

  return (
    <>
      <section className={heroPlate} aria-label="Paza introduction">
        <div className="pointer-events-none absolute inset-0 z-0 bg-zinc-900">
          <Image
            src={FIGMA_HERO_BG}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {docIsDark && <div className="absolute inset-0 bg-black/60" aria-hidden />}
          {!docIsDark && <div className="absolute inset-0 bg-white/50" aria-hidden />}
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-4 pb-0 pt-[min(20vh,8rem)] sm:px-6 md:px-10 lg:px-12 xl:px-[60px]">
          <MaskedReveal delay={0.06} className="block w-full">
            <p className={heroCopyClass}>
            identify high-trust audience clusters and run measurable campaigns.
            </p>
          </MaskedReveal>

          <div className="flex flex-1 items-end justify-center">
            <h1
              className={cn(heroDisplayType, "mb-[-2%]")}
              style={{ fontSize: "clamp(6rem, 28vw, 400px)" }}
            >
              PAZA
            </h1>
          </div>
        </div>
      </section>
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
// const CONNECTING_HEADLINE_FONT =
//   '"PP Neue Montreal", var(--font-sans), ui-sans-serif, system-ui, sans-serif';
const connectingHeadlineBase = {
  // fontFamily: CONNECTING_HEADLINE_FONT,
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
export const servicesQuoteTypography: CSSProperties = {
  // fontFamily: CONNECTING_HEADLINE_FONT,
  // fontSize: "clamp(0.850rem, 2.2vw + 0.5rem, 40px)",
  fontSize: "clamp(0.8125rem, 1.8vw + 0.45rem, 2rem)",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: 1.52,
};

const servicesQuoteOrange: CSSProperties = {
  ...servicesQuoteTypography,
  color: "#FF6B00",
};

// function ConnectingHeroSection() {
//   return (
//     <section
//       id="connecting"
//       className={cn("relative pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-20 md:pt-14", LANDING_PLATE_DEEP)}
//     >
//       <div className={PAGE}>
//         {/* Mobile / tablet */}
//         <div className="relative lg:hidden">
//           <div className="relative" style={{ height: PORTRAIT_H_MOBILE }}>
//             <MaskedReveal delay={0.04}>
//               <div
//                 className="absolute left-0 top-0 z-[5] overflow-hidden"
//                 style={{
//                   width: "min(30vw, 116px)",
//                   aspectRatio: "3/4",
//                   border: "2px solid #FF6B00",
//                 }}
//               >
//                 <Image
//                   src={campaignUrbanBodega}
//                   alt=""
//                   fill
//                   className="object-cover"
//                   sizes="116px"
//                   priority
//                 />
//               </div>
//             </MaskedReveal>
//             <MaskedReveal delay={0}>
//               <p
//                 className={`${bodyMicro} absolute right-0 top-0 text-right`}
//                 style={{ maxWidth: "calc(100% - min(30vw, 116px) - 12px)" }}
//               >
//               Detect environments where your topics of interest sits, deploy controlled inputs into those spaces, measure response, establish causality
//               </p>
//             </MaskedReveal>
//           </div>
//
//           <div className="relative">
//             <MaskedReveal delay={0.09}>
//               <div
//                 className="absolute right-0 top-0 z-30 overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
//                 style={{ width: PHOTO_W_MOBILE, aspectRatio: "1/1" }}
//               >
//                 <Image src={service} alt="" fill className="object-cover" sizes="130px" />
//                 <span className="absolute bottom-1.5 left-1.5 text-[8px] font-semibold uppercase tracking-wider text-white drop-shadow">
//                   StreetX
//                 </span>
//               </div>
//             </MaskedReveal>
//
//             {/* // <MaskedReveal delay={0.06}> */}
//             {/* //   <p */}
//             {/* //     className="pl-0 font-normal uppercase text-neutral-900 dark:text-[#F9F9F9]" */}
//             {/* //     style={connectingHeadlineMobile} */}
//             {/* //   > */}
//             {/* //   Map audience signals across brands, {" "} */}
//             {/* // */}
//             {/* //   </p> */}
//             {/* </MaskedReveal> */}
//             <MaskedReveal delay={0.1}>
//               <p className="pl-[min(6vw,48px)] font-normal uppercase " style={connectingHeadlineMobile}>
//               {/* Map audience signals across brands, creators, and communities. */}
//                 <span style={connectingHeadlineMobile} > Map audience signals across brands, </span>{" "} {'\n'}
//                 <span className={ORANGE_CONNECTING}>  creators </span>{" "} {'\n'}
//                 <span className="text-neutral-900 dark:text-[#F9F9F9]"> And </span>
//               </p>
//             </MaskedReveal>
//             <MaskedReveal delay={0.14}>
//               <div className="flex items-end">
//                 <div
//                   className="pointer-events-none relative shrink-0 overflow-hidden"
//                   style={{ width: PHOTO_W_MOBILE, aspectRatio: "4/5" }}
//                 >
//                   <Image
//                     src={campaignMotionFocus}
//                     alt=""
//                     fill
//                     className="object-cover object-top blur-[2px] scale-110 saturate-[1.4] brightness-90"
//                     sizes="130px"
//                   />
//                 </div>
//                 <p
//                   className={cn("flex-1 pl-[min(4vw,24px)] font-normal uppercase", ORANGE_CONNECTING)}
//                   style={connectingHeadlineMobile}
//                 >
//                 </p >
//                 communities.
//               </div>
//             </MaskedReveal>
//           </div>
//
//           <div className="mt-6 flex items-end justify-between gap-4">
//             <MaskedReveal delay={0.17}>
//               <p className={`${bodyMicro} max-w-[260px]`}>
//               Reach is no longer enough. Messages are far more effective when delivered through trusted voices operating within the right cultural, social, and emotional contexts.
//
//
//               </p>
//             </MaskedReveal>
//             <MaskedReveal delay={0.19}>
//               <EditorialRuleCta align="end" href={SIGNUP_HREF}>
//                 <>
//                   Start your journey
//                   <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
//                 </>
//               </EditorialRuleCta>
//             </MaskedReveal>
//           </div>
//         </div>
//
//         {/* Desktop */}
//         <div className="relative hidden lg:block">
//           <div className="relative" style={{ height: PORTRAIT_H_DESKTOP }}>
//             <MaskedReveal delay={0.04}>
//               <div
//                 className="absolute left-0 top-0 z-[5] overflow-hidden"
//                 style={{
//                   width: "clamp(150px, 17.5vw, 230px)",
//                   aspectRatio: "3/4",
//                   border: "2.5px solid #FF6B00",
//                 }}
//               >
//                 <Image
//                   src={campaignUrbanBodega}
//                   alt=""
//                   fill
//                   className="object-cover"
//                   priority
//                   sizes="230px"
//                 />
//               </div>
//             </MaskedReveal>
//             <MaskedReveal delay={0}>
//               <p
//                 className={`${bodyMicro} absolute right-0 top-0 z-20 text-right`}
//                 style={{ maxWidth: "clamp(220px, 22vw, 320px)" }}
//               >
//                             Detect environments where your topics of interest sits, deploy controlled inputs into those spaces, measure response, establish causality
//
//               </p>
//             </MaskedReveal>
//           </div>
//
//           <div className="relative">
//             <MaskedReveal delay={0.08}>
//               <div
//                 className="absolute right-0 top-0 z-30 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
//                 style={{ width: PHOTO_W_DESKTOP, aspectRatio: "1/1" }}
//               >
//                 <Image src={service} alt="" fill className="object-cover" sizes="230px" />
//                 <span className="absolute bottom-2 left-2 text-[9px] font-semibold uppercase tracking-wider text-white drop-shadow">
//                   StreetX
//                 </span>
//               </div>
//             </MaskedReveal>
//
//             <MaskedReveal delay={0.06}>
//               <p
//                 className="pl-0 font-normal uppercase text-neutral-900 dark:text-[#F9F9F9]"
//                 style={connectingHeadlineDesktop}
//               >
//                 {/* Connecting */}
//                       Map audience signals across
//               </p>
//             </MaskedReveal>
//             <MaskedReveal delay={0.11}>
//               <p className="pl-[min(6vw,100px)] font-normal uppercase" style={connectingHeadlineDesktop}>
//                    <span className={ORANGE_CONNECTING}>  creators </span>{" "}
//                 <span className="text-neutral-900 dark:text-[#F9F9F9]">And</span>
//               </p>
//             </MaskedReveal>
//             <MaskedReveal delay={0.15}>
//               <div className="flex items-end">
//                 <div
//                   className="pointer-events-none relative shrink-0 overflow-hidden"
//                   style={{ width: PHOTO_W_DESKTOP, aspectRatio: "4/5" }}
//                 >
//                   <Image
//                     src={campaignMotionFocus}
//                     alt=""
//                     fill
//                     className="object-cover object-top blur-[2px] scale-110 saturate-[1.4] brightness-90"
//                     sizes="230px"
//                   />
//                 </div>
//                 <p
//                   className={cn("flex-1 pl-[min(5vw,80px)] font-normal uppercase", ORANGE_CONNECTING)}
//                   style={connectingHeadlineDesktop}
//                 >
//                   Communities.
//                 </p>
//               </div>
//             </MaskedReveal>
//           </div>
//
//           <div className="mt-8 flex items-end justify-between gap-8">
//             <MaskedReveal delay={0.18}>
//               <p className={`${bodyMicro} max-w-[320px]`}>
//
//               Reach is no longer enough. Messages are far more effective when delivered through trusted voices operating within the right cultural, social, and emotional contexts.
//
//               </p>
//             </MaskedReveal>
//             <MaskedReveal delay={0.2}>
//               <EditorialRuleCta align="end" href={SIGNUP_HREF}>
//                 <>
//                   Start your journey
//                   <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
//                 </>
//               </EditorialRuleCta>
//             </MaskedReveal>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export function EditorialLabel({
  children,
  uppercase,
}: {
  children: ReactNode;
  /** Small caps eyebrow (e.g. Our Services on black). */
  uppercase?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[#FF6B00] sm:gap-3">
      <span
        className="h-[17px] w-1.5 shrink-0 bg-[#FF6B00] sm:h-[21px] sm:w-2"
        aria-hidden
      />
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
export function EditorialRuleCta(
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
      className={cn("py-10 sm:py-16 md:py-24 lg:py-32", LANDING_PLATE)}
    >
      <div className={PAGE}>
        
        <MaskedReveal delay={0}>
          <h2 className="m-0 flex justify-start p-0 font-[inherit] font-normal leading-none">
            <EditorialLabel>Who is Paza</EditorialLabel>
          </h2>
        </MaskedReveal>

        <MaskedReveal delay={0.06}>
<div className="mx-auto mt-2 max-w-[1400px] px-2 text-left sm:mt-10 sm:px-8 lg:px-12">
  {/* The Ultra-Clean, Explicit Two-Line Cinematic Headline */}
  <h2 className="text-[clamp(1.2rem,3.8vw+0.5rem,2.2rem)] leading-[1.05] tracking-[-0.05em] text-neutral-900 dark:text-neutral-50">
    Paza is an{" "}
    <span className="text-neutral-400 dark:text-neutral-600">
      audience intelligence and collaboration infrastructure
    </span>
    <br className="hidden xl:inline" />{" "}
    {/* Clean break to line two at desktop */}
    for brands, creators, and{" "}
    <span className="whitespace-nowrap">community networks.</span>
  </h2>

  {/* Perfectly Proportioned Editorial Body Copy */}
  <div className="mt-5 max-w-4xl space-y-2 text-[16px] leading-[1.8] tracking-[-0.01em] text-neutral-600 dark:text-neutral-400 sm:text-[18px] md:text-[19px]">
    <p>
      It maps audience identity, interests, intent, and behavior alongside
      brand and creator identities, values, and positioning.
    </p>

    <p>
      Paza identifies where specific audience topics, conditions, and needs
      already exist across real-world and digital environments, then connects
      brands to the creators and communities within them.
    </p>

    <p>
      By observing how these relationships perform and evolve over time,{" "}
      <strong className="font-semibold text-neutral-900 dark:text-neutral-200">
        Paza
      </strong>{" "}
      enables stable models of audience behavior and intent.
    </p>
  </div>
</div>


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
        
        {/* Image - Already well centered */}
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
  <div className="mx-auto mt-10 max-w-[1080px] px-4 text-base text-left sm:mt-14 sm:px-6 lg:px-8 md:mt-20">

<h3 className="text-[clamp(1rem,3vw,2rem)] leading-[1.2] tracking-[-0.02em] text-neutral-900 dark:text-white">
  Digital advertising relies on fragmented, top-of-funnel proxies.
  <br />
  <span className="text-neutral-500 dark:text-zinc-500">
    Such as demographics, clicks, and superficial engagement to infer audience intent.
  </span>
</h3>


    <div className="mt-6 space-y-2 text-base leading-[1.9] tracking-[-0.01em] text-neutral-600 dark:text-zinc-400 sm:text-[15px] md:text-[16px]">
      <p>
        While these metrics help optimize for short-term conversions, they fail
        to capture the causal drivers of behaviour the underlying reasons behind
        audience responses and often lose relevance outside the platforms where
        they originate.
      </p>

      <p>
        Privacy restrictions and platform silos further accelerate signal decay.
        Brands struggle to distinguish between durable audiences, emerging
        cohorts, and transient engagement, limiting their ability to build a
        consistent understanding of audience behaviour over time.
      </p>

      <p>
        Without a unified identity anchor, brands cannot isolate the behavioural
        characteristics that define their audiences. This makes it difficult to
        track cohort lifecycles, optimize repeat interactions, and leverage
        audience intelligence beyond individual platform ecosystems.
      </p>

      <p>
        <span className="text-neutral-900 dark:text-white">Paza</span> replaces
        platform proxies with deterministic environmental anchors. By anchoring
        audience identity to specific products, creators, and communities, Paza
        maps how these structural relationships evolve and convert delivering
        portable, platform independent audience intelligence.
      </p>
    </div>
  </div>
</MaskedReveal>
        {/* CTA */}
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
  {
    index: "01",
    title: "Audience Intelligence",
    description:
      "Audience clustering • Behavioral analysis • Community network mapping • Product demand environment",
  },
  {
    index: "02",
    title: "Identity & Value Mapping",
    description:
      "Creator–brand matching • Alignment scoring • Profile positioning",
  },
  {
    index: "03",
    title: "Collaboration Workflow Management",
    description:
      "Real-time collaboration tracking • Asset coordination • Campaign execution • Payment coordination",
  },
  {
    index: "04",
    title: "Attribution & Analytics",
    description:
      "Performance analytics • Conversion tracking • Outcome attribution • Campaign intelligence reporting",
  },
] as const;

function OurServicesSection() {
  const docIsDark = useDocumentThemeIsDark();

  return (
    <section
      id="our-services"
      className="border-t border-border bg-zinc-100 py-14 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:py-20 md:py-24 lg:py-32"
    >

<div className={PAGE}>
  {/* Figma Header Container */}
  <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12 md:mb-20 lg:gap-16">
    
    {/* Clean, zero-margin wrapper for Editorial Label */}
    <MaskedReveal delay={0}>
      <div className="shrink-0">
        <EditorialLabel>Our Services</EditorialLabel>
      </div>
    </MaskedReveal>

    {/* The Two-Line Fluid Headline */}
    <MaskedReveal delay={0.06} className="min-w-0 flex-1">
      <p
        className="m-0 text-left uppercase text-neutral-900 dark:text-white"
        style={{
          ...servicesQuoteTypography,
          lineHeight: "1.72", // Matches the 172% specification precisely
        }}
      >
        <span>
          {'\u201c'}Infrastructure for audience alignment,{" "}
          <span style={servicesQuoteOrange}>creator brand matching,collaboration
          </span>{" "}
        </span>
        <span className="">
          <span style={servicesQuoteOrange}>and campaign outcome measurement </span>{" "}
        </span>
      </p>
    </MaskedReveal>

  </div>
</div>

      <div className="w-full border-y border-border bg-zinc-100 dark:border-white/10 dark:bg-black">
        <ul className="m-0 list-none divide-y divide-border dark:divide-white/10 p-0">
          {SERVICE_ROWS.map((row) => (
            <li key={`${row.index}-${row.title}`}>
              <Link
                href="/services#our-services"
                className={cn(
                  "group relative mx-auto flex w-full max-w-[1320px] touch-manipulation items-center",
                  PAGE_PAD,
                  "gap-4 py-7 sm:gap-6 sm:py-9 md:gap-8 md:py-11",
                  "transition-colors duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.025]",
                )}
              >
                {/* Orange left-border that slides down from the top on hover */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 bg-[#FF6B00] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  aria-hidden
                />

                {/* Ghost number — large, low-opacity, highlights on hover */}
                <span
                  className="pointer-events-none shrink-0 select-none tabular-nums font-black leading-[1] text-neutral-200 transition-colors duration-300 group-hover:text-[#FF6B00]/20 dark:text-white/[0.05] dark:group-hover:text-[#FF6B00]/15"
                  // style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)" }}
style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}

                  aria-hidden
                >
                  {row.index}
                </span>

                {/* Title + description */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-left font-medium uppercase tracking-[-0.01em] text-neutral-900 transition-colors duration-300 group-hover:text-[#FF6B00] dark:text-white dark:group-hover:text-[#FF6B00]"
                    style={{
                      // fontFamily: CONNECTING_HEADLINE_FONT,
                      fontSize: "clamp(1.05rem, 2.5vw + 0.3rem, 2.25rem)",
                      lineHeight: 1.12,
                    }}
                  >
                    {row.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-neutral-400 sm:text-[12px] md:text-[13px] dark:text-zinc-500">
                    {row.description}
                  </p>
                </div>

                {/* Circle arrow button */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-900 transition-all duration-300 group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00]/5 group-hover:text-[#FF6B00] dark:border-white/15 dark:text-white sm:h-10 sm:w-10 md:h-11 md:w-11">
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-[18px] sm:w-[18px]"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={PAGE}>
        <MaskedReveal delay={0.1}>
          <div className="mt-16 flex justify-center md:mt-20">
            <EditorialRuleCta align="center" href="/services#our-services" invert={docIsDark}>
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
export function AccountTypeMockupCard({
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

type WheelSteeredHorizontalScrollProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Maps vertical mouse wheel (and shift+wheel / dominant horizontal delta) to horizontal scroll.
 * At the start/end of the strip, the event is not intercepted so the page can scroll normally.
 * When fully scrolled right, wheel up is not mapped to horizontal (so the page can scroll up).
 */
export function WheelSteeredHorizontalScroll({ className, children }: WheelSteeredHorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      let delta = e.deltaY;
      if (e.shiftKey) {
        delta = e.deltaX;
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        delta = e.deltaX;
      }
      if (delta === 0) return;

      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= el.clientHeight;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const left = el.scrollLeft;
      const atStart = left <= 0.5;
      const atEnd = left >= max - 0.5;

      if (delta > 0 && atEnd) return;
      if (delta < 0 && atStart) return;
      if (delta < 0 && atEnd) return;

      e.preventDefault();
      e.stopPropagation();
      el.scrollBy({ left: delta, top: 0, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export const HOW_PLATFORM_WORKS_STEPS = [
  {
    id: "01",
    title: "Create Campaigns, Post Jobs or Showcase Projects",
    layout: "mockRight" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Brands define their audience, campaign goals, brief, and budget, then post campaign
          opportunities through job openings on the job board where creators can submit proposals.
          Creators define their goals, interests, and identity, then publish project cards in the
          showcase where brands can submit collaboration requests.
        </p>
      </>
    ),
  },
  {
    id: "02",
    title: "Discover Aligned Creators and Communities",
    layout: "stackMockTop" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Paza maps creator identity, community alignment, and audience behavior signals to surface
          relevant creators, brands, and audience groups. Brands discover creators aligned with
          their audience and campaign goals, while creators discover brands aligned with their
          values, identity, and interests.
        </p>
      </>
    ),
  },
  {
    id: "03",
    title: "Activate Audience-Led Campaigns",
    layout: "mockLeft" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Brands collaborate with creators and audience advocates to distribute campaigns through
          trusted communities and relationships. Once campaigns are accepted, participants can be
          organized into teams, assigned tasks, communicate through the inbox, and coordinated
          through shared workflows.
        </p>
      </>
    ),
  },
  {
    id: "04",
    title: "Track Engagement and Campaign Outcomes",
    layout: "mockLeft" as const,
    body: (
      <>
        <p className={howStepCopy}>
          Paza tracks campaign interactions, creator activity, audience engagement, and downstream
          behavioral signals over time, then generates campaign performance reports and outcome
          summaries after completion.
        </p>
      </>
    ),
  },
];

export function HowItWorksStepPanel({
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




// function HowItWorksDesktopScrollDriver() {
//   const driverRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [maxOffset, setMaxOffset] = useState(0);
//   const reduceMotion = useReducedMotion();
//
//   const measure = useCallback(() => {
//     const track = trackRef.current;
//     const viewport = track?.parentElement;
//     if (!track || !viewport) return;
//     setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
//   }, []);
//
//   useLayoutEffect(() => {
//     measure();
//     const ro = new ResizeObserver(() => measure());
//     const track = trackRef.current;
//     const viewport = track?.parentElement;
//     if (track) ro.observe(track);
//     if (viewport) ro.observe(viewport);
//     window.addEventListener("resize", measure);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, [measure]);
//
//   const { scrollYProgress } = useScroll({
//     target: driverRef,
//     offset: ["start start", "end end"],
//   });
//
//   const rawX = useTransform(scrollYProgress, (p) => -p * maxOffset * 0.42 + vh * 0.55 );
// const x = useSpring(rawX, { stiffness: 85, damping: 22, mass: 0.5 });
//   // const x = useTransform(scrollYProgress, (p) => -p * maxOffset);
//
//   const panels = (
//     <>
//       {HOW_PLATFORM_WORKS_STEPS.map((step) => (
//         <HowItWorksStepPanel
//           key={step.id}
//           stepNumber={step.id}
//           title={step.title}
//           layout={step.layout}
//         >
//           {step.body}
//         </HowItWorksStepPanel>
//       ))}
//       <div className="w-4 shrink-0 sm:w-8" aria-hidden />
//     </>
//   );
//
//   if (reduceMotion) {
//     return (
//       <div className="hidden touch-pan-x lg:block" role="region" aria-label="Platform workflow steps">
//         <WheelSteeredHorizontalScroll
//           className={cn(
//             PAGE_PAD,
//             "flex gap-12 overflow-x-auto overflow-y-visible overscroll-x-contain pb-4 pt-2 [scrollbar-width:thin] sm:gap-14 lg:gap-16",
//             "[scrollbar-color:rgba(0,0,0,0.22)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent]",
//             "snap-x snap-mandatory scroll-smooth",
//           )}
//         >
//           {panels}
//         </WheelSteeredHorizontalScroll>
//       </div>
//     );
//   }
//
//   const vh = typeof window !== "undefined" ? window.innerHeight : 900;
//   /**
//    * Shorter vertical scroll track than `maxOffset + vh` so less empty space before the CTA,
//    * while `useTransform` still maps full horizontal distance across scroll progress 0→1.
//    */
//   const driverHeightPx =
//     maxOffset > 0 ? Math.max(Math.round(vh * 0.85), Math.round(maxOffset * 0.42 + vh * 0.55)) : undefined;
//
//   return (
//     <div
//       ref={driverRef}
//       className="relative hidden lg:block"
//       style={driverHeightPx ? { height: driverHeightPx } : { minHeight: "100dvh" }}
//       role="region"
//       aria-label="Platform workflow steps"
//     >
//       <div className="sticky top-0 flex h-[100dvh] max-h-[100dvh] w-full items-center overflow-hidden bg-zinc-100 dark:bg-[#050505]">
//         <motion.div
//           ref={trackRef}
//           style={{ x }}
//           className={cn(PAGE_PAD, " smooth-scroll flex w-max flex-nowrap gap-12 pb-4 pt-2 will-change-transform sm:gap-14 lg:gap-16")}
//         >
//           {panels}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function HowItWorksSection() {
//   return (
//     <section id="how-it-works" className="relative">
//       {/*
//         Figma header: black strip, label left + centered 2-line headline (40px / 172% / PP Neue),
//         #FFFFFF + #FF6B00 on CONNECT / CAMPAIGNS.
//       */}
//       <div className="border-b border-border bg-zinc-100 py-10 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:py-12 md:py-16 lg:py-20">
//         <div className={PAGE}>
//           <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
//             <MaskedReveal delay={0}>
//               <h2 className="m-3 shrink-0 p-0 font-[inherit] font-normal leading-none">
//                 <EditorialLabel>How It Works</EditorialLabel>
//               </h2>
//             </MaskedReveal>
//             <MaskedReveal delay={0.06}>
//
// <div className="flex min-w-0 flex-1 justify-center">
//   <p
//     className="m-0 max-w-[min(100%,52rem)]  uppercase text-neutral-900 dark:text-white"
//     style={servicesQuoteTypography}
//   >
//     Identify, organize, activate, and track aligned audiences.
//   </p>
// </div>
//
//             </MaskedReveal>
//           </div>
//         </div>
//       </div>
//
//       <div className={cn("py-6 sm:py-8 md:py-10 lg:py-12", LANDING_PLATE)}>
//       <div className="touch-pan-x lg:hidden" role="region" aria-label="Platform workflow steps">
//         <WheelSteeredHorizontalScroll
//           className={cn(
//             PAGE_PAD,
//             "flex gap-12 overflow-x-auto overflow-y-visible overscroll-x-contain pb-4 pt-2 [scrollbar-width:thin] sm:gap-14 lg:gap-16",
//             "[scrollbar-color:rgba(0,0,0,0.22)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent]",
//             "snap-x snap-mandatory scroll-smooth",
//           )}
//         >
//           {HOW_PLATFORM_WORKS_STEPS.map((step) => (
//             <HowItWorksStepPanel
//               key={step.id}
//               stepNumber={step.id}
//               title={step.title}
//               layout={step.layout}
//             >
//               {step.body}
//             </HowItWorksStepPanel>
//           ))}
//           <div className="w-4 shrink-0 snap-end sm:w-8" aria-hidden />
//         </WheelSteeredHorizontalScroll>
//       </div>
//
//         <HowItWorksSections/>
//
//         <div className={PAGE}>
//           <div className="mt-6 flex flex-col items-center gap-2.5 sm:mt-8 sm:gap-3 md:mt-10 md:items-end">
//             <EditorialRuleCta align="end" href={SIGNUP_HREF}>
//               <>
//                 Start your journey
//                 <ArrowRight className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]" aria-hidden />
//               </>
//             </EditorialRuleCta>
//             <p className="max-w-sm text-center text-[11px] leading-relaxed text-neutral-900/75 md:text-right dark:text-white/80">
//               Start today and see how your vision can shape the world
//             </p>
//           </div>
//         </div>
//
//         <div className="mt-6 h-px w-full bg-border sm:mt-8 md:mt-10 dark:bg-white/10" aria-hidden />
//       </div>
//     </section>
//   );
// }

function FigmaContactSection() {
  const docIsDark = useDocumentThemeIsDark();

  return (
    <section id="contact" className={cn("relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36", LANDING_PLATE)}>
      {/* Ghost "CONTACT" watermark — full section width, clipped by overflow-hidden */}
      <span
        className="pointer-events-none absolute -top-2 left-0 select-none font-black uppercase leading-[0.85] text-neutral-900/[0.04] dark:text-white/[0.03]"
        style={{ fontSize: "clamp(4.5rem, 22vw, 18rem)", letterSpacing: "-0.05em" }}
        aria-hidden
      >
        CONTACT
      </span>

      <div className={cn(PAGE, "relative z-10")}>
        {/* Top grid: left intro column + right form column */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20 xl:gap-24">

          {/* ── Left column ─────────────────────────────── */}
          <div className="flex flex-col">
            <MaskedReveal delay={0}>
              <p className="m-0">
                <EditorialLabel>Get in touch</EditorialLabel>
              </p>
            </MaskedReveal>

            <MaskedReveal delay={0.06}>
              <h2
                className="mt-6 text-neutral-900 sm:mt-8 dark:text-white"
                style={{
                  // fontFamily: CONNECTING_HEADLINE_FONT,
                  fontSize: "clamp(2.4rem, 8vw, 7rem)",
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                }}
              >
                Let&apos;s Talk<br />
                <span style={{ color: "#FF6B00" }}>About</span><br />
                Your Project.
              </h2>
            </MaskedReveal>

            <MaskedReveal delay={0.12}>
              <p className="mt-6 max-w-[22rem] text-sm leading-relaxed text-neutral-500 sm:mt-8 sm:text-base dark:text-neutral-400">
                Have questions, a collaboration need, or partnership ideas?
                Reach out and let&apos;s build something great together.
              </p>
            </MaskedReveal>

            {/* Social links with "Follow" label */}
            <MaskedReveal delay={0.16}>
              <nav
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-10"
                aria-label="Social links"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                  Follow
                </span>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-900 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-[#FF6B00] hover:decoration-[#FF6B00] dark:text-white dark:decoration-white/30"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-900 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-[#FF6B00] hover:decoration-[#FF6B00] dark:text-white dark:decoration-white/30"
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Instagram
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-900 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-[#FF6B00] hover:decoration-[#FF6B00] dark:text-white dark:decoration-white/30"
                >
                  <Youtube className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Youtube
                </a>
              </nav>
            </MaskedReveal>
          </div>

          {/* ── Right column: form in a bordered card ───── */}
          <div className="min-w-0">
            <div className="border border-border bg-card p-6 sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-[#0a0a0a]">
              <LandingContactForm />
            </div>
          </div>
        </div>

        {/* ── Bottom contact bar ───────────────────────── */}
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 sm:pt-10 dark:border-white/10">
          <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-10 sm:gap-y-8 lg:flex-nowrap lg:gap-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Location
              </p>
              <p className="mt-2 text-sm leading-snug text-neutral-900 sm:text-base dark:text-white">
                00100, Ronald Ngala St<br />Nairobi, Kenya
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Phone
              </p>
              <a
                href="tel:+254422189529"
                className="mt-2 block text-sm text-neutral-900 transition-colors hover:text-[#FF6B00] sm:text-base dark:text-white"
              >
                +254 422 189 529
              </a>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Email
              </p>
              <a
                href="mailto:info@pazasocial.com"
                className="mt-2 block text-sm text-neutral-900 transition-colors hover:text-[#FF6B00] sm:text-base dark:text-white"
              >
                info@pazasocial.com
              </a>
            </div>
            <div className="sm:ml-auto">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Next step
              </p>
              <div className="mt-3">
                <EditorialRuleCta align="start" href={SIGNUP_HREF} invert={docIsDark}>
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
{/*           <h2 className="text-18vw font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl dark:text-white"> */}
{/*   PAZA */}
{/* </h2> */}


<h2 className="text-[clamp(5rem,18vw,16rem)] font-extrabold tracking-[-0.08em] text-foreground dark:text-white">
  PAZA
</h2>

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

          {/* <HowItWorksSection /> */}
          <HowItWorksSection/>

          <FigmaContactSection />

          <LandingPageFooter />
        </div>
      </div>
    </HomeLayout>
  );
}
