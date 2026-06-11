"use client";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AccountTypeMockupCard,
  EditorialLabel,
  EditorialRuleCta,
  HOW_PLATFORM_WORKS_STEPS,
  LANDING_PLATE,
  PAGE,
  PAGE_PAD,
  servicesQuoteTypography,
  SIGNUP_HREF,
} from "./LandingPage";
import { MaskedReveal } from "./MaskedReveal";
import { ArrowRight } from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────
type Step = (typeof HOW_PLATFORM_WORKS_STEPS)[number];

// ─── constants ────────────────────────────────────────────────────────────────
const ORANGE = "#FF6B00";

// ─── Step Row (vertical, reveals on scroll) ─────────────────────────────────────
function StepRow({ step, index, total }: { step: Step; index: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const mockOnLeft = index % 2 === 1;

  const content = (
    <div className={cn("relative z-10", mockOnLeft && "lg:order-2")}>
      <div
        className="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{ color: ORANGE }}
      >
        <span className="block h-px w-5" style={{ background: ORANGE }} />
        Step {step.id} of {String(total).padStart(2, "0")}
      </div>

      <h3
        className="mb-5 text-neutral-900 dark:text-[#EDE8DF]"
        style={{
          fontFamily: "'Bebas Neue', 'Impact', 'Arial Narrow', sans-serif",
          fontSize: "clamp(34px, 7vw, 60px)",
          lineHeight: 0.93,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
        }}
      >
        {step.title}
      </h3>

      <div className="max-w-[340px] text-[13px] font-light leading-[1.8] text-neutral-500 dark:text-neutral-400">
        {step.body}
      </div>
    </div>
  );

  const mock = (
    <div className={cn("flex justify-center", mockOnLeft ? "lg:order-1 lg:justify-start" : "lg:justify-end")}>
      <AccountTypeMockupCard />
    </div>
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-t border-neutral-200 dark:border-white/[0.06]"
    >
      <span
        className="pointer-events-none absolute -left-1 top-1 select-none font-semibold leading-[0.82] text-[clamp(80px,24vw,190px)] text-neutral-200 dark:text-white/[0.04] sm:-left-2"
        style={{ fontFamily: "'Bebas Neue', 'Impact', 'Arial Narrow', sans-serif", letterSpacing: "-0.02em" }}
        aria-hidden
      >
        {step.id}
      </span>

      <div
        className={cn(
          PAGE_PAD,
          "relative z-10 grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24"
        )}
      >
        {content}
        {mock}
      </div>
    </motion.div>
  );
}

// ─── Steps (vertical flow) ──────────────────────────────────────────────────────
function HowItWorksSteps() {
  const steps = [...HOW_PLATFORM_WORKS_STEPS].sort((a, b) => a.id.localeCompare(b.id));
  const total = steps.length;

  return (
    <div className="bg-zinc-100 dark:bg-[#050505]">
      {steps.map((step, i) => (
        <StepRow key={step.id} step={step} index={i} total={total} />
      ))}
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
        {/* Vertical step flow — each step reveals on scroll */}
        <HowItWorksSteps />

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
