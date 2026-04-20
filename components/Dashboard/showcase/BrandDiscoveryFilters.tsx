"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = ["Merchant", "Broadcast", "Culture"] as const;
const GEO_OPTIONS = ["All regions", "Kenya", "East Africa", "Nigeria", "South Africa", "Global"];
const TIME_WINDOWS = ["Last 7d", "Last 30d", "Last 90d"] as const;

export function BrandDiscoveryFilters({
  mode,
  geo,
  timeWindow,
  onModeChange,
  onGeoChange,
  onTimeWindowChange,
  className,
}: {
  mode: string;
  geo: string;
  timeWindow: string;
  onModeChange: (v: string) => void;
  onGeoChange: (v: string) => void;
  onTimeWindowChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:gap-3", className)}>
      <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Filters:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 min-w-28 justify-between border-border"
          >
            {mode || "Mode"}
            <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {MODES.map((m) => (
            <DropdownMenuItem key={m} onClick={() => onModeChange(m)}>
              {m}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 min-w-28 justify-between border-border"
          >
            {geo || "Geo"}
            <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {GEO_OPTIONS.map((g) => (
            <DropdownMenuItem key={g} onClick={() => onGeoChange(g)}>
              {g}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 min-w-28 justify-between border-border"
          >
            {timeWindow || "Time"}
            <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {TIME_WINDOWS.map((t) => (
            <DropdownMenuItem key={t} onClick={() => onTimeWindowChange(t)}>
              {t}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
