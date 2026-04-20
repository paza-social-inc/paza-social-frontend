"use client";

import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects/projectTypes";

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  return Array.from(
    new Set(
      values
        .filter((v): v is string => Boolean(v && String(v).trim()))
        .map((v) => String(v).trim()),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export interface ShowcaseFilterState {
  category: string;
  location: string;
  tags: string[];
}

interface ShowcaseFilterControlsProps {
  projects: Project[];
  filters: ShowcaseFilterState;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function ShowcaseFilterControls({
  projects,
  filters,
  onCategoryChange,
  onLocationChange,
  onToggleTag,
  onClearFilters,
}: ShowcaseFilterControlsProps) {
  const { categories, locations, allTags } = useMemo(() => {
    const categories = uniqueSorted(projects.map((p) => p.category));
    const locations = uniqueSorted(projects.map((p) => p.location));
    const tagSet = new Set<string>();
    for (const p of projects) {
      for (const t of p.tags ?? []) {
        const s = String(t).trim();
        if (s) tagSet.add(s);
      }
    }
    const allTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));
    return { categories, locations, allTags };
  }, [projects]);

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.location ? 1 : 0) +
    filters.tags.length;

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 border-border bg-background",
                activeCount > 0 && "border-orange-500/60 text-foreground",
              )}
            >
              <Filter className="h-4 w-4" aria-hidden />
              Filters
              {activeCount > 0 ? (
                <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(calc(100vw-2rem),28rem)] max-h-[min(70vh,520px)] overflow-y-auto p-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">Filter projects</p>
                {activeCount > 0 ? (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0 space-y-2">
                  <Label htmlFor="showcase-filter-category" className="text-xs">
                    Category
                  </Label>
                  <Select
                    value={filters.category || "__all__"}
                    onValueChange={(v) => onCategoryChange(v === "__all__" ? "" : v)}
                  >
                    <SelectTrigger id="showcase-filter-category" className="h-9 w-full min-w-0">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">No categories found yet.</p>
                  ) : null}
                </div>

                <div className="min-w-0 space-y-2">
                  <Label htmlFor="showcase-filter-location" className="text-xs">
                    Location
                  </Label>
                  <Select
                    value={filters.location || "__all__"}
                    onValueChange={(v) => onLocationChange(v === "__all__" ? "" : v)}
                  >
                    <SelectTrigger id="showcase-filter-location" className="h-9 w-full min-w-0">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {locations.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">No locations found yet.</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Tags</p>
                <p className="text-[11px] text-muted-foreground">
                  Match projects that include all selected tags.
                </p>
                {allTags.length > 0 ? (
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                    {allTags.map((tag) => {
                      const checked = filters.tags.includes(tag);
                      return (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center gap-2 rounded-md py-1 text-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => onToggleTag(tag)}
                          />
                          <span className="truncate">{tag}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground">No tags found yet.</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {filters.category ? (
              <button
                type="button"
                onClick={() => onCategoryChange("")}
                className="inline-flex max-w-[200px] items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground hover:bg-muted"
              >
                <span className="truncate">Category: {filters.category}</span>
                <X className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </button>
            ) : null}
            {filters.location ? (
              <button
                type="button"
                onClick={() => onLocationChange("")}
                className="inline-flex max-w-[200px] items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground hover:bg-muted"
              >
                <span className="truncate">Location: {filters.location}</span>
                <X className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </button>
            ) : null}
            {filters.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className="inline-flex max-w-[200px] items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground hover:bg-muted"
              >
                <span className="truncate">#{tag}</span>
                <X className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              </button>
            ))}
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
