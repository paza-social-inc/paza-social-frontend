"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { scrollPageToTop } from "@/lib/scrollWithLenis";

export default function Footer({ showMain = true }: { showMain: boolean }) {
  const scrollToTop = () => scrollPageToTop();

  return (
    <footer className="border-t border-border bg-muted/20">
      {showMain && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="space-y-4">
              <p className="font-bold text-lg tracking-tight text-foreground">PAZA</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Where brands and creators build partnerships and run campaigns that matter.
              </p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-foreground">Explore</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-foreground transition-colors">Services</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-foreground">Contact</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:info@pazasocial.com" className="hover:text-foreground transition-colors">info@pazasocial.com</a></li>
                <li><a href="tel:+254422189529" className="hover:text-foreground transition-colors">+254 422 189 529</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Paza Social. All rights reserved.
          </p>
          <span className="hidden sm:inline text-muted-foreground/50">·</span>
          <nav className="flex items-center gap-4 text-xs text-muted-foreground" aria-label="Legal and support">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="rounded-xl h-10 w-10"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
