"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useDocumentThemeIsDark } from "@/lib/useDocumentThemeIsDark";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/theme-toggle";
import { DemoRequestModal } from "@/components/Home/DemoRequestModal";

const NAV_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const NAV_ITEM = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Build wa.me link from env; set NEXT_PUBLIC_WHATSAPP_URL or NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local */
const WHATSAPP_HREF = (() => {
  const url = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  if (url) return url;
  const n = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (n) return `https://wa.me/${n.replace(/\D/g, "")}`;
  return "https://wa.me/";
})();

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.37a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function NavBar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  /** Radix Sheet IDs differ SSR vs client — mount sheet only after hydration. */
  const [mobileSheetReady, setMobileSheetReady] = useState(false);
  const path = usePathname();
  const docIsDark = useDocumentThemeIsDark();
  const isHome = path === "/";
  const isAbout = path === "/about";
  const isServices = path === "/services";
  /** Home, About, Services — editorial layout + CTAs */
  const isDarkMarketing = isHome || isAbout || isServices;
  /**
   * Dark “film” nav only when `<html class="dark">` is present — tied to the DOM so it never
   * lags behind `setTheme` (next-themes can update the class before React re-renders `useTheme`).
   */
  // Only use dark chrome when the active marketing page is actually in dark theme.
  const darkMarketingChrome = isDarkMarketing && docIsDark;

  useEffect(() => {
    if (path === "/") setActive("Home");
    else if (path === "/services") setActive("Services");
    else if (path === "/about") setActive("About");
    else if (path === "/login") setActive("Login");
    else setActive("");
  }, [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    setMobileSheetReady(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services", hash: path === "/" ? "#our-services" : undefined },
    { name: "About", href: "/about", hash: path === "/" ? "#who-is-paza" : undefined },
  ];

  const minimalMarketingNav = darkMarketingChrome;

  return (
    /* Full-width fixed wrapper — lets page content scroll behind the nav so backdrop-blur works */
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-filter transition-all duration-500 pt-[env(safe-area-inset-top,0px)]",
        darkMarketingChrome
          ? scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/8 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]"
            : "bg-transparent border-b border-transparent"
          : isDarkMarketing
            ? scrolled
              ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
              : "bg-background/88 backdrop-blur-md border-b border-border/40"
            : scrolled
              ? "bg-background/75 backdrop-blur-xl border-b border-border/40 shadow-sm"
              : "bg-background border-b border-transparent",
      )}
    >
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative mx-auto flex w-full max-w-[1320px] min-w-0 items-center justify-between gap-2 transition-all duration-500 sm:gap-3",
        "min-h-14 h-auto py-2 sm:h-14 sm:py-0 px-3 sm:px-6 md:px-10 lg:px-12 xl:px-[60px]",
        isDarkMarketing && "mt-0",
        darkMarketingChrome ? "text-white" : "text-foreground",
      )}
    >
      {/* Left: wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="flex min-w-0 shrink-0 items-center"
      >
        <Link
          href="/"
          className={cn(
            "font-extrabold text-base tracking-tight leading-none transition-colors",
            "text-xl max-[380px]:text-lg sm:text-[30px] lg:text-[28px]",
            darkMarketingChrome ? "text-white hover:text-[#FF6B00]" : "text-foreground hover:text-primary"
          )}
        >
          PAZA
        </Link>
      </motion.div>

        {/* Center: primary links (Centered via flex-1) */}
        <motion.div
          variants={NAV_CONTAINER}
          initial="hidden"
          animate="show"
          className="hidden flex-1 justify-center min-w-0 md:flex"
        >
          <nav aria-label="Primary" className="flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={NAV_ITEM} className="flex flex-col items-center gap-1.5">
                <Link
                  href={link.hash ? `${link.href}${link.hash}` : link.href}
                  onClick={() => setActive(link.name)}
                  className={cn(
                    "inline-flex shrink-0 items-center px-1 text-sm lg:text-base font-semibold tracking-[0.05em] transition-colors touch-manipulation",
                    isDarkMarketing && active === link.name && "text-[#FF6B00]",
                    darkMarketingChrome && active !== link.name && "font-normal text-[#d9d9d9] hover:text-white",
                    isDarkMarketing && !darkMarketingChrome && active !== link.name && "font-normal text-muted-foreground hover:text-foreground",
                    !isDarkMarketing &&
                    (active === link.name
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"),
                  )}
                >
                  {link.name}
                </Link>
                {isDarkMarketing && active === link.name && (
                  <span
                    className={cn(
                      "h-px w-8 lg:w-12 max-w-full",
                      darkMarketingChrome ? "bg-[#FF6B00]" : "bg-primary",
                    )}
                    aria-hidden
                  />
                )}
              </motion.div>
            ))}
          </nav>
        </motion.div>

      {/* Right: Login, WhatsApp, Request a demo */}
      <motion.div
        variants={NAV_CONTAINER}
        initial="hidden"
        animate="show"
        className={cn(
          "flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2 md:gap-2",
        )}
      >
        <Button
          asChild
          variant="outline"
          className={cn(
            "hidden h-8 rounded px-2.5 text-[10px] font-semibold uppercase tracking-wider sm:h-9 sm:inline-flex sm:rounded-md sm:px-3 sm:text-[11px] md:text-xs",
            darkMarketingChrome &&
              "border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white",
          )}
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button
          asChild
          className={cn(
            "hidden h-8 gap-1 rounded px-2.5 text-[10px] font-semibold uppercase tracking-wider shadow-none sm:h-9 sm:inline-flex sm:gap-1.5 sm:rounded-md sm:px-3 sm:text-[11px] md:text-xs md:px-3.5",
            darkMarketingChrome
              ? "border border-white/45 bg-transparent text-white hover:bg-white/10"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
            <WhatsAppGlyph className="size-3.5 shrink-0 sm:size-4" />
            <span>WhatsApp</span>
          </a>
        </Button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          {/* <Button
            asChild
            className={cn(
              "h-10 min-w-[140px] rounded-none px-4 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-none sm:h-10 sm:min-w-[175px] sm:px-5 sm:text-[12.5px]",
              minimalMarketingNav
                ? "border-0 bg-white text-neutral-900 hover:bg-zinc-100"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link  href="/waitlist"
            className="whitespace-nowrap">
              Request a demo
            </Link>
          </Button> */}
          <Button
            onClick={() => setDemoModalOpen(true)}
            className={cn(
              "h-10 min-w-[140px] rounded-none px-4 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-none sm:h-10 sm:min-w-[175px] sm:px-5 sm:text-[12.5px]",
              minimalMarketingNav
                ? "border-0 bg-white text-neutral-900 hover:bg-zinc-100"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            JOIN OUR WAITLIST
          </Button>
        </motion.div>
        {darkMarketingChrome ? (
          <AnimatedThemeToggler className="inline-flex h-9 w-9 max-[360px]:h-8 max-[360px]:w-8 shrink-0 touch-manipulation rounded-full border border-white/35 bg-white/10 text-white hover:bg-white/15 [&_svg]:text-white sm:h-9 sm:w-9" />
        ) : (
          <AnimatedThemeToggler className="inline-flex h-9 w-9 max-[360px]:h-8 max-[360px]:w-8 shrink-0 touch-manipulation rounded-full border border-border bg-background sm:h-9 sm:w-9 md:inline-flex md:border-border" />
        )}

        <div className="flex shrink-0 md:hidden">
          {!mobileSheetReady ? (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-9 w-9 min-h-[44px] min-w-[44px] max-[360px]:h-8 max-[360px]:w-8 max-[360px]:min-h-[40px] max-[360px]:min-w-[40px] touch-manipulation rounded-xl",
                darkMarketingChrome && "text-white hover:bg-white/10 hover:text-white",
              )}
              aria-hidden
              tabIndex={-1}
              disabled
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 min-h-[44px] min-w-[44px] max-[360px]:h-8 max-[360px]:w-8 max-[360px]:min-h-[40px] max-[360px]:min-w-[40px] touch-manipulation rounded-xl",
                  darkMarketingChrome && "text-white hover:bg-white/10 hover:text-white"
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                "z-60 w-[min(20rem,calc(100vw-1rem))] max-w-[min(20rem,90vw)] rounded-l-2xl border-l p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-none",
                darkMarketingChrome && "border-white/10 bg-zinc-950 text-white",
              )}
            >
              <SheetHeader className="space-y-1 text-left">
                <SheetTitle
                  className={cn("text-lg font-bold", darkMarketingChrome && "text-white")}
                >
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                <p
                  className={cn(
                    "px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
                    darkMarketingChrome ? "text-zinc-500" : "text-muted-foreground",
                  )}
                >
                  Pages
                </p>
                {navLinks.map((link) => (
                  <SheetClose key={link.name} asChild>
                    <Link
                      href={link.hash ? `${link.href}${link.hash}` : link.href}
                      onClick={() => setActive(link.name)}
                      className={cn(
                        "flex min-h-[48px] items-center rounded-xl px-4 py-3 text-base font-semibold uppercase tracking-wide",
                        darkMarketingChrome
                          ? active === link.name
                            ? "bg-white/10 text-[#FF6B00]"
                            : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          : active === link.name
                            ? "bg-primary/10 text-primary"
                            : "text-foreground",
                      )}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                <p
                  className={cn(
                    "mt-4 px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
                    darkMarketingChrome ? "text-zinc-500" : "text-muted-foreground",
                  )}
                >
                  Get started
                </p>
                <SheetClose asChild>
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-base font-semibold text-white"
                  >
                    <WhatsAppGlyph className="size-5 shrink-0" />
                    WhatsApp
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className={cn(
                      "flex min-h-[48px] items-center justify-center rounded-xl border px-4 text-base font-semibold",
                      darkMarketingChrome
                        ? "border-white/20 bg-zinc-900 text-white hover:bg-zinc-800"
                        : "border-border bg-background text-foreground",
                    )}
                  >
                    Login
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/account-type"
                    className={cn(
                      "flex min-h-[48px] items-center justify-center rounded-xl border px-4 text-base font-semibold",
                      darkMarketingChrome
                        ? "border-white/30 bg-white/5 text-white hover:bg-white/10"
                        : "border-border bg-muted/40 text-foreground hover:bg-muted/60",
                    )}
                  >
                    Sign up
                  </Link>
                </SheetClose>
                {/* <SheetClose asChild>
                  <Link
                    href="/#contact"
                    className={cn(
                      "mt-1 flex min-h-[48px] items-center justify-center rounded-xl text-sm font-semibold uppercase tracking-wide",
                      darkMarketingChrome
                        ? "bg-white text-neutral-900 hover:bg-zinc-100"
                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    Request a demo
                  </Link>
                </SheetClose> */}
                <SheetClose asChild>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className={cn(
                    "mt-1 flex min-h-[48px] w-full items-center justify-center rounded-xl text-sm font-semibold uppercase tracking-wide",
                    darkMarketingChrome
                      ? "bg-white text-neutral-900 hover:bg-zinc-100"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                JOIN OUR WAITLIST
                </button>
              </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          )}
        </div>
      </motion.div>
    </motion.nav>
    <DemoRequestModal
      open={demoModalOpen}
      onOpenChange={setDemoModalOpen}
    />
    </div>
  );
}
