"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const SHOWCASE_TABS = [
  "All projects",
  "My Projects",
  "Collaborating",
] as const;
export type ProjectNavTab = (typeof SHOWCASE_TABS)[number];

interface ShowcaseSearchProps {
  tabs: readonly ProjectNavTab[];
  activeNav: ProjectNavTab;
  onActiveNavChange: (tab: ProjectNavTab) => void;
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
}

export function ShowcaseSearch({
  tabs,
  activeNav,
  onActiveNavChange,
  searchQuery = "",
  onSearchQueryChange,
}: ShowcaseSearchProps) {
  return (
    <header className="w-full space-y-4 sm:space-y-5">
      {/* Page title + tagline */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Showcase
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeNav === "My Projects"
            ? "Manage and track your projects"
            : activeNav === "Collaborating"
              ? "Projects you were accepted to collaborate on"
              : "Discover projects and creators"}
        </p>
      </div>

      {/* Tabs + search in one row (mobile: stack) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <nav
          className="flex rounded-lg bg-muted/50 p-1 w-fit"
          aria-label="Showcase sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onActiveNavChange(tab)}
              className={cn(
                "min-h-9 px-4 rounded-md text-sm font-medium transition-colors touch-manipulation",
                activeNav === tab
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="relative w-full sm:max-w-xs lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, creators…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            className="pl-9 bg-background border-border min-h-10 rounded-lg"
          />
        </div>
      </div>
    </header>
  );
}
