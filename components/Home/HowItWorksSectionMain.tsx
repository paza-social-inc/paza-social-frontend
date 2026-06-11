"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { EditorialLabel, EditorialRuleCta, LANDING_PLATE, PAGE, PAGE_PAD, servicesQuoteTypography, SIGNUP_HREF } from "./LandingPage";
import { AccountTypeMockupCard } from "./LandingPage";
import { HOW_PLATFORM_WORKS_STEPS } from "./LandingPage";
import { MaskedReveal } from "./MaskedReveal";
import { ArrowRight } from "lucide-react";
// import { EditorialLabel, EditorialRuleCta, ArrowRight } from "@/components/ui"; // adjust imports as needed

// ─── types ────────────────────────────────────────────────────────────────────
type Step = (typeof HOW_PLATFORM_WORKS_STEPS)[number];

// ─── constants ────────────────────────────────────────────────────────────────
const ORANGE = "#FF6B00";
const OVERLAP = 0.07;

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute inset-x-0 top-0 z-50 h-[3px] bg-neutral-200 dark:bg-white/10">
      <motion.div
        className="h-full"
        style={{ width, backgroundColor: ORANGE }}
      />
    </div>
  );
}

// ─── Scroll Prompt ───────────────────────────────────────────────────────────
function ScrollPrompt({ direction = "down" }: { direction?: "down" | "up" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
    >
      <span>{direction === "down" ? "Scroll to continue" : "Scroll up"}</span>
      
      <motion.div
        animate={{ 
          y: direction === "down" ? [0, 8, 0] : [-8, 0, -8] 
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="text-lg"
      >
        {direction === "down" ? "↓" : "↑"}
      </motion.div>
    </motion.div>
  );
}
// ─── Step Dots ────────────────────────────────────────────────────────────────
function StepDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === active ? 16 : 5,
            backgroundColor: i === active ? ORANGE : "rgba(120,116,108,0.4)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="h-[5px] rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Desktop Step Slide ───────────────────────────────────────────────────────
function DesktopStepSlide({
  step,
  index,
  total,
  progress,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    progress,
    [start, start + OVERLAP, end - OVERLAP, end],
    [0, 1, 1, 0]
  );

  const ghostX = useTransform(progress, [start, start + OVERLAP], ["-6%", "0%"]);
  const contentY = useTransform(progress, [start, start + OVERLAP], ["22px", "0px"]);
  const mockScale = useTransform(progress, [start, start + OVERLAP], [0.92, 1]);
  const mockX = useTransform(progress, [start, start + OVERLAP], ["18px", "0px"]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center"
      aria-hidden={index !== 0}
    >
      <motion.span
        className="pointer-events-none absolute -left-1 top-[6%] select-none font-semibold leading-[0.82] text-[clamp(88px,26vw,200px)] text-neutral-200 dark:text-white/[0.04] sm:-left-2 sm:top-[10%]"
        style={{
          x: ghostX,
          fontFamily: "'Bebas Neue', 'Impact', 'Arial Narrow', sans-serif",
          letterSpacing: "-0.02em",
        }}
        aria-hidden
      >
        {step.id}
      </motion.span>

      <div className={cn(PAGE_PAD, "relative z-10 grid w-full grid-cols-1 items-center gap-10 pt-28 sm:pt-24 lg:grid-cols-2 lg:gap-16 lg:pt-16")}>
        <motion.div style={{ y: contentY }}>
          <div className="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
            <span className="block h-px w-5" style={{ background: ORANGE }} />
            Step {step.id} of {String(total).padStart(2, "0")}
          </div>

          <h3
            className="mb-5 text-neutral-900 dark:text-[#EDE8DF]"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', 'Arial Narrow', sans-serif",
              fontSize: "clamp(34px, 8vw, 60px)",
              lineHeight: 0.93,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
            }}
          >
            {step.title}
          </h3>

          <div className="text-[13px] leading-[1.8] text-neutral-500 dark:text-neutral-400 font-light max-w-[340px]">
            {step.body}
          </div>
        </motion.div>

        <motion.div style={{ scale: mockScale, x: mockX }} className="flex justify-center lg:justify-end">
          <AccountTypeMockupCard />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── HowItWorksSections (Desktop Scroll Version) ─────────────────────────────
function HowItWorksSections() {
  const steps = [...HOW_PLATFORM_WORKS_STEPS].sort((a, b) => a.id.localeCompare(b.id));
  const total = steps.length;
  const reduceMotion = useReducedMotion();
  const driverRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: driverRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActiveStep(Math.min(total - 1, Math.floor(p * total)));
  });

  const driverH = `${total * 150}dvh`;

  if (reduceMotion) {
    return (
      <div className="bg-zinc-100 dark:bg-[#050505]">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(PAGE_PAD, "grid grid-cols-1 items-center gap-10 py-14 border-t border-neutral-200 dark:border-white/[0.06] lg:grid-cols-2 lg:gap-16 lg:py-20")}
          >
            {/* Reduced motion content */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                <span className="block h-px w-5" style={{ background: ORANGE }} />
                Step {step.id} of {String(total).padStart(2, "0")}
              </div>
              <h3 className="mb-5 text-neutral-900 dark:text-[#EDE8DF]" style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(34px,8vw,60px)", lineHeight: 0.93, textTransform: "uppercase" }}>
                {step.title}
              </h3>
              <div className="text-[13px] leading-[1.8] text-neutral-500 dark:text-neutral-400 font-light max-w-[340px]">
                {step.body}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <AccountTypeMockupCard />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={driverRef} style={{ height: driverH }} className="relative block">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-zinc-100 dark:bg-[#050505]">
        <ProgressBar progress={smoothProgress} />

        <div className={cn(PAGE_PAD, "absolute inset-x-0 top-0 z-50 flex items-center justify-between pt-7")}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            How it works
          </span>
          <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: ORANGE }}>
            {String(activeStep + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {steps.map((step, i) => (
          <DesktopStepSlide
            key={step.id}
            step={step}
            index={i}
            total={total}
            progress={smoothProgress}
          />
        ))}

        {activeStep === 0 && <ScrollPrompt direction="down" />}
        {activeStep === total - 1 && <ScrollPrompt direction="up" />}

        <StepDots count={total} active={activeStep} />
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative">
      {/* Header */}
      <div className="border-b border-border bg-zinc-100 py-10 text-neutral-900 dark:border-white/10 dark:bg-black dark:text-white sm:py-12 md:py-16 lg:py-20">
        <div className={PAGE}>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
            <MaskedReveal delay={0}>
              <h2 className="m-3 shrink-0 p-0 font-[inherit] font-normal leading-none">
                <EditorialLabel>How It Works</EditorialLabel>
              </h2>
            </MaskedReveal>

            <MaskedReveal delay={0.06}>
              <div className="flex min-w-0 flex-1 justify-center">
                <p
                  className="m-0 max-w-[min(100%,52rem)] uppercase text-neutral-900 dark:text-white"
                  style={servicesQuoteTypography}
                >
                  Identify, organize, activate, and track aligned audiences.
                </p>
              </div>
            </MaskedReveal>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn("py-6 sm:py-8 md:py-10 lg:py-12", LANDING_PLATE)}>
        {/* Scroll-driven step experience — runs on all viewports */}
        <HowItWorksSections />

        {/* CTA */}
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
