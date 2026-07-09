"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { mockProject } from "./showcaseData";
import { AssetsFundingSection, mergeAssetsFundingFromProject } from "./AssetsFundingSection";
import { GuardrailsSection, mergeGuardrailsFromProject } from "./GuardrailsSection";
import { SlotsSection, mergeSlotsFromProject } from "./SlotsSection";
import { ProgressSection, mergeProgressFromProject } from "./ProgressSection";
import { AboutSection, mergeAboutFromProject } from "./AboutSection";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects/projectTypes";
import { ProjectQaSection } from "@/components/Dashboard/showcase/ProjectQaSection";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ImageLightbox } from "./ImageLightbox";

type ShowcaseTabId = "about" | "progress" | "assets-funding" | "slots" | "guardrails" | "qas";

const FALLBACK_PROJECT_IMAGE =
  mockProject.images?.[0] ??
  mockProject.imageUrl ??
  "https://images.unsplash.com/photo-1586228044731-58323b1387f4?auto=format&fit=crop&q=80&w=1031";

function looksLikeImageUrl(url: string): boolean {
  const s = url.trim().toLowerCase();
  if (!s) return false;
  if (s.startsWith("data:image/")) return true;
  if (s.includes("images.unsplash.com/")) return true;
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/.test(s);
}

export function ProjectCarousel({ project: projectProp }: { project?: Project }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<ShowcaseTabId>("about");
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const normalizedAccountType = String(
    (user as { accountType?: string; account?: { accountType?: string } } | null)?.accountType ??
      (user as { accountType?: string; account?: { accountType?: string } } | null)?.account?.accountType ??
      ""
  )
    .trim()
    .toLowerCase();
  const isBrandOrBusinessAccount =
    normalizedAccountType === "brand" || normalizedAccountType === "business";
  const isCreatorAccount = normalizedAccountType === "creator";
  const project = (projectProp ?? mockProject) as unknown as
    typeof mockProject & Project & Record<string, unknown>;
  const isOwner =
    user?.id != null &&
    project.creator?.id != null &&
    Number(user.id) === Number(project.creator.id);
  const isTeamMember = Boolean(
    user?.id &&
      project.teamMembers?.some((m) => Number(m.userId) === Number(user.id))
  );
  const hasRealProject = projectProp != null;
  const assetsFundingMerged = useMemo(
    () => mergeAssetsFundingFromProject(project as Project & Record<string, unknown>),
    [project]
  );
  const slotsMerged = useMemo(
    () => mergeSlotsFromProject(project as Project & Record<string, unknown>),
    [project]
  );
  const progressMerged = useMemo(
    () => mergeProgressFromProject(project as Project & Record<string, unknown>),
    [project]
  );
  const aboutMerged = useMemo(
    () => mergeAboutFromProject(project as Project & Record<string, unknown>),
    [project]
  );
  const guardrailsMerged = useMemo(
    () => mergeGuardrailsFromProject(project as Project & Record<string, unknown>),
    [project]
  );
  const resolvedTitle = project.title ?? mockProject.title;
  const images = useMemo(() => {
    const candidates = (
      project.images ??
      (project as unknown as { mediaUrls?: string[] }).mediaUrls ??
      []
    ) as string[];
    const cleaned = candidates
      .map((u) => String(u ?? "").trim())
      .filter(Boolean)
      .filter(looksLikeImageUrl);
    return cleaned.length > 0 ? cleaned : [FALLBACK_PROJECT_IMAGE];
  }, [project]);
  /**
   * Assets / Slots / Guardrails: owner can edit; accepted brand/business on the team can view only.
   * Creator accounts who are not the project owner do not see these tabs.
   */
  const showAssetsSlotsGuardrailsTabs = useMemo(() => {
    if (isOwner) return true;
    if (isCreatorAccount && !isOwner) return false;
    return isBrandOrBusinessAccount && isTeamMember;
  }, [
    isOwner,
    isCreatorAccount,
    isBrandOrBusinessAccount,
    isTeamMember,
  ]);

  const tabs: { id: ShowcaseTabId; label: string }[] = useMemo(() => {
    const baseTabs: { id: ShowcaseTabId; label: string }[] = [
      { id: "about", label: "About" },
      { id: "progress", label: "Progress" },
    ];
    if (showAssetsSlotsGuardrailsTabs) {
      baseTabs.push(
        { id: "assets-funding", label: "Assets & Funding" },
        { id: "slots", label: "Slots" },
        { id: "guardrails", label: "Guardrails" }
      );
    }
    baseTabs.push({ id: "qas", label: "Q&As" });
    return baseTabs;
  }, [showAssetsSlotsGuardrailsTabs]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("about");
    }
  }, [tabs, activeTab]);

  // Keep the dot indicators in sync with the carousel's actual current slide,
  // whether navigation happens via swipe, drag, keyboard, or the prev/next buttons.
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  return (
    <div className="flex flex-col w-full md:w-5/6 lg:w-11/12 min-w-0 mx-auto">
      <Carousel className="w-full max-w-5xl" setApi={setCarouselApi}>
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx}>
              <Card className="overflow-hidden shadow-lg p-0 border-border">
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    aria-label={`View ${resolvedTitle} slide ${idx + 1} full size`}
                    className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-muted block cursor-zoom-in group"
                  >
                    <Image
                      src={src}
                      alt={`${resolvedTitle} slide ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 1031px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 rounded-full bg-black/50 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                          <path d="M11 8v6M8 11h6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-primary text-primary-foreground hover:opacity-90 border-0 left-2 sm:left-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full touch-manipulation" />
        <CarouselNext className="bg-primary text-primary-foreground hover:opacity-90 border-0 right-2 sm:right-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full touch-manipulation" />
      </Carousel>

      <ImageLightbox
        images={images}
        open={lightboxOpen}
        index={lightboxIndex}
        onOpenChange={setLightboxOpen}
        onIndexChange={setLightboxIndex}
        alt={resolvedTitle}
      />

      <div className="flex gap-2 my-4 sm:my-6 mx-auto">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => carouselApi?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors",
              idx === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      <div className="pt-2 sm:pt-6 pb-2">
        <div className="flex sm:justify-center gap-4 sm:gap-14 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-2 sm:pb-3 font-medium text-sm sm:text-base whitespace-nowrap touch-manipulation transition-colors",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 py-4 sm:py-6 min-h-[200px]">
        {activeTab === "about" && (
          <AboutSection
            projectId={String(project.id ?? mockProject.id)}
            initial={aboutMerged}
            initialMediaUrls={
              (
                project.mediaUrls ??
                project.images ??
                (project as { media_urls?: string[] }).media_urls ??
                []
              ).filter((u): u is string => typeof u === "string" && u.trim() !== "")
            }
            canEdit={Boolean(isOwner)}
          />
        )}

        {activeTab === "progress" && (
          <ProgressSection
            projectId={String(project.id ?? mockProject.id)}
            initial={progressMerged}
            canEdit={Boolean(isOwner)}
          />
        )}

        {activeTab === "assets-funding" && (
          <AssetsFundingSection
            projectId={String(project.id ?? mockProject.id)}
            initial={assetsFundingMerged}
            canEdit={Boolean(isOwner)}
          />
        )}

        {activeTab === "slots" && (
          <SlotsSection
            projectId={String(project.id ?? mockProject.id)}
            initial={slotsMerged}
            canEdit={Boolean(isOwner)}
          />
        )}

        {activeTab === "guardrails" && (
          <GuardrailsSection
            projectId={String(project.id ?? mockProject.id)}
            initial={guardrailsMerged}
            canEdit={Boolean(isOwner)}
          />
        )}

        {activeTab === "qas" &&
          (hasRealProject ? (
            <ProjectQaSection
              projectId={String(project.id ?? "")}
              enabled
              isOwner={Boolean(isOwner)}
            />
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
              <p>Q&amp;A is available when viewing a saved showcase project.</p>
            </div>
          ))}
      </div>
    </div>
  );
}