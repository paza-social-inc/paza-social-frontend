
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  campaignUrbanBodega,
  campaignMotionFocus,
  service,
} from "@/assets/images";
import { MaskedReveal } from "./MaskedReveal";
import { bodyMicro, EditorialRuleCta, LANDING_PLATE_DEEP, PAGE, SIGNUP_HREF } from "./LandingPage";

// ─── constants ────────────────────────────────────────────────────────────────

const ORANGE = "#FF6B00";
const ORANGE_CLS = "text-[#FF6B00]";
const MUTED_CLS = "text-neutral-500 dark:text-neutral-600";
const TEXT_CLS = "text-neutral-900 dark:text-[#EDE8DF]";

const DISPLAY: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

const headlineMobile: React.CSSProperties = {
  ...DISPLAY,
  fontSize: "clamp(50px, 13vw, 68px)",
  lineHeight: 0.91,
};

const headlineDesktop: React.CSSProperties = {
  ...DISPLAY,
  fontSize: "clamp(62px, 7.8vw, 86px)",
  lineHeight: 0.91,
};

// ─── photo collage ────────────────────────────────────────────────────────────

const PRINT_BORDER = "1.5px solid #fff";
const PHOTO_SHADOW =
  "0 8px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.35)";

function PhotoCollage({
  containerW,
  containerH,
  p1W,
  p2W,
  p3W,
}: {
  containerW: number;
  containerH: number;
  p1W: number; // portrait width → height = w * 4/3
  p2W: number; // square
  p3W: number; // motion  → height = w * 5/4
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: containerW, height: containerH }}
    >
      {/* ── ph1: portrait, bottom-left, –5° ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          width: p1W,
          height: Math.round(p1W * (4 / 3)),
          bottom: 16,
          left: 10,
          border: PRINT_BORDER,
          boxShadow: PHOTO_SHADOW,
          transform: "rotate(-5deg)",
          transformOrigin: "bottom left",
          zIndex: 1,
          animation: "ph-drop1 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s both",
        }}
      >
        {/* orange corner pip */}
        <span
          className="absolute top-0 left-0 z-10 block"
          style={{ width: 10, height: 10, background: ORANGE }}
          aria-hidden
        />
        <Image
          src={campaignUrbanBodega}
          alt=""
          fill
          className="object-cover"
          sizes={`${p1W}px`}
          priority
        />
      </div>

      {/* ── ph2: square StreetX, top-right, +7° ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          width: p2W,
          height: p2W,
          top: 8,
          right: 4,
          border: PRINT_BORDER,
          boxShadow: PHOTO_SHADOW,
          transform: "rotate(7deg)",
          transformOrigin: "top right",
          zIndex: 3,
          animation: "ph-drop2 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s both",
        }}
      >
        <Image
          src={service}
          alt=""
          fill
          className="object-cover"
          sizes={`${p2W}px`}
        />
        <span
          className="absolute bottom-1.5 left-2 text-[8px] font-semibold uppercase tracking-wider text-white/70"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          StreetX
        </span>
      </div>

      {/* ── ph3: motion blur, center, –10° ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          width: p3W,
          height: Math.round(p3W * (5 / 4)),
          top: 50,
          left: Math.round(containerW * 0.22),
          border: PRINT_BORDER,
          boxShadow: PHOTO_SHADOW,
          transform: "rotate(-10deg)",
          transformOrigin: "center",
          zIndex: 2,
          animation: "ph-drop3 0.7s cubic-bezier(0.16,1,0.3,1) 0.13s both",
        }}
      >
        <Image
          src={campaignMotionFocus}
          alt=""
          fill
          className="object-cover object-top blur-[2px] scale-110 saturate-[1.3] brightness-90"
          sizes={`${p3W}px`}
        />
      </div>

      {/* keyframe definitions — injected once via a style tag */}
      <style>{`
        @keyframes ph-drop1 {
          from { opacity: 0; transform: rotate(-5deg) translateY(24px) scale(0.88); }
          to   { opacity: 1; transform: rotate(-5deg) translateY(0)    scale(1);    }
        }
        @keyframes ph-drop2 {
          from { opacity: 0; transform: rotate(7deg)  translateY(20px) scale(0.88); }
          to   { opacity: 1; transform: rotate(7deg)  translateY(0)    scale(1);    }
        }
        @keyframes ph-drop3 {
          from { opacity: 0; transform: rotate(-10deg) translateY(22px) scale(0.88); }
          to   { opacity: 1; transform: rotate(-10deg) translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

// ─── meta bar ─────────────────────────────────────────────────────────────────

function MetaBar() {
  return (
    <div className="flex items-start justify-between pb-4 mb-10 border-b border-neutral-200/10 dark:border-white/[0.06]">
      <span
        className={cn("text-[10px] uppercase tracking-[0.2em]", MUTED_CLS)}
      >
        02 — Connecting
      </span>
      <p className={cn(bodyMicro, "text-right max-w-[230px]", MUTED_CLS)}>
        Detect environments, deploy controlled inputs into those spaces,
        measure response, establish causality.
      </p>
    </div>
  );
}

// ─── headline ─────────────────────────────────────────────────────────────────

function Headline({ style }: { style: React.CSSProperties }) {
  return (
    <div className="pl-5" style={{ borderLeft: `2.5px solid ${ORANGE}` }}>
      <span
        className={cn(
          "block mb-2.5 text-base tracking-[0.1em] uppercase font-normal",
          MUTED_CLS,
        )}
      >
        Map audience signals across
      </span>
      <p style={style} className={TEXT_CLS}>
        Brands,
        <br />
        <span className={ORANGE_CLS}>Creators</span>
        <span
          className="block"
          style={{
            color: "rgba(120,115,105,0.28)",
            fontSize: "1.25em",
            margin: "3px 0 1px",
          }}
        >
          And
        </span>
        <span className={ORANGE_CLS}>Communities.</span>
      </p>
    </div>
  );
}

// ─── bottom bar ───────────────────────────────────────────────────────────────

function BottomBar({ maxW }: { maxW: string }) {
  return (
    <div className="flex items-end justify-between gap-6 pt-5 border-t border-neutral-200/10 dark:border-white/[0.06]">
      <p className={cn("text-base",bodyMicro, MUTED_CLS)} style={{ maxWidth: maxW }}>
        Reach is no longer enough. Messages are far more effective when
        delivered through trusted voices operating within the right cultural,
        social, and emotional contexts.
      </p>
      <EditorialRuleCta align="end" href={SIGNUP_HREF}>
        <>
          Start your journey
          <ArrowRight
            className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-[#FF6B00]"
            aria-hidden
          />
        </>
      </EditorialRuleCta>
    </div>
  );
}

// ─── section ──────────────────────────────────────────────────────────────────

export function ConnectingHeroSection() {
  return (
    <section
      id="connecting"
      className={cn(
        "relative pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-20 md:pt-14",
        LANDING_PLATE_DEEP,
      )}
    >
      <div className={PAGE}>

        {/* ── Mobile / tablet ──────────────────────────────────── */}
        <div className="lg:hidden">

          <MaskedReveal delay={0}>
            <MetaBar />
          </MaskedReveal>

          {/* headline + collage side by side */}
          <div className="flex items-center justify-between gap-4">
            <MaskedReveal delay={0.1}>
              <Headline style={headlineMobile} />
            </MaskedReveal>

            {/* collage — no MaskedReveal so per-photo animations play freely */}
            <PhotoCollage
              containerW={175}
              containerH={230}
              p1W={92}
              p2W={82}
              p3W={86}
            />
          </div>

          <div className="mt-8">
            <MaskedReveal delay={0.28}>
              <BottomBar maxW="260px" />
            </MaskedReveal>
          </div>
        </div>

        {/* ── Desktop ──────────────────────────────────────────── */}
        <div className="hidden lg:block">

          <MaskedReveal delay={0}>
            <MetaBar />
          </MaskedReveal>

          {/* headline + collage side by side */}
          <div className="flex items-center justify-between gap-8">
            <MaskedReveal delay={0.1}>
              <Headline style={headlineDesktop} />
            </MaskedReveal>

            <PhotoCollage
              containerW={288}
              containerH={348}
              p1W={140}
              p2W={122}
              p3W={128}
            />
          </div>

          <div className="mt-10">
            <MaskedReveal delay={0.28}>
              <BottomBar maxW="340px" />
            </MaskedReveal>
          </div>
        </div>

      </div>
    </section>
  );
}


