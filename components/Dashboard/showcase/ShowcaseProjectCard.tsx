"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Brand-view project card: Reach & Delivery, Attention Quality, Audience Snapshot, Inventory, Safety & Proof */
type ProjectCardData = {
  id?: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  verifiedReach30d?: number;
  ownedAudience?: number;
  activeNodes30d?: number;
  marketShareEstimate?: string;
  primaryFit?: string;
  secondaryFit?: string;
  activeWindow?: string;
  budgetBand?: string;
  deliverables?: string[];
};

export function ShowcaseProjectCard({
  project,
  className,
  onClick,
}: {
  project: ProjectCardData;
  className?: string;
  onClick?: () => void;
}) {
  const reach = project.verifiedReach30d ?? 0;
  const audience = project.ownedAudience ?? 0;
  const nodes = project.activeNodes30d ?? 0;

  return (
    <Card
      className={cn(
        "border-border bg-card overflow-hidden transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {project.imageUrl && (
        <div className="relative w-full aspect-video bg-muted">
          <Image
            src={project.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold line-clamp-2">{project.title}</CardTitle>
        {project.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {project.shortDescription}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Reach & Delivery */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Reach & delivery
          </p>
          <ul className="space-y-1 text-muted-foreground">
            <li>Verified reach (30d): {reach.toLocaleString()}</li>
            <li>Owned audience: {audience.toLocaleString()}</li>
            <li>Active nodes (30d): {nodes.toLocaleString()}</li>
          </ul>
        </div>
        {/* Attention quality / fit */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Fit
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.primaryFit && (
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                {project.primaryFit}
              </span>
            )}
            {project.secondaryFit && (
              <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs">
                {project.secondaryFit}
              </span>
            )}
          </div>
          {project.activeWindow && (
            <p className="text-xs text-muted-foreground mt-1">Window: {project.activeWindow}</p>
          )}
        </div>
        {/* Inventory / budget */}
        {(project.budgetBand || (project.deliverables && project.deliverables.length > 0)) && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Inventory
            </p>
            {project.budgetBand && (
              <p className="text-foreground font-medium">{project.budgetBand}</p>
            )}
            {project.deliverables && project.deliverables.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {project.deliverables.slice(0, 3).join(", ")}
              </p>
            )}
          </div>
        )}
        {/* Safety & proof (placeholder) */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Safety & proof
          </p>
          <p className="text-xs text-muted-foreground">
            Escrow & kill switch available. Proof of delivery required.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
