"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiMapPinLine } from "@remixicon/react";
import { Globe, ChevronDown, Loader2, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { projectsApi } from "@/lib/data/projects";
import { projectProposalsApi } from "@/lib/data/projectProposals";
import type { Project } from "@/types/projects/projectTypes";
import { RequestCollaborateModal } from "@/components/Dashboard/showcase/RequestCollaborateModal";
import toast from "react-hot-toast";

export type CreatorProfile = {
  id: string;
  name: string;
  profession: string;
  reach: string;
  location: string;
  avatarUrl: string;
  about: string;
  coverImageUrl?: string;
  website?: string;
  projectsFinished?: number;
  projectsInProgress?: number;
  joinDate?: string;
  aboutLong?: string;
  galleryImages?: string[];
  platformStats?: { platform: string; description: string; link: string; highlighted?: boolean }[];

  // ── Creator DNA — previously collected but never shown on the showcase ──
  originStoryTags?: string[];
  toneEmotional?: string[];
  toneProfessional?: string[];
  toneCultural?: string[];
  toneLifestyle?: string[];
  availabilityType?: string;
  personalityTags?: string[];
  preferredCommunication?: string;
  engagementType?: string[];
  deliverables?: string[];
  equipmentAndSoftware?: string;
  skillLevel?: string;
  creatorType?: string[];
  domainShards?: string[];
  assetClassPrimary?: string;
  valueProp?: string[];
  whatPeopleComeTo?: string[];
  audienceDescription?: string;
  languages?: string[];
  genderMale?: number;
  genderFemale?: number;
  locales?: { country: string; city?: string }[];
  dailyRoutineText?: string;
  dailyCarryText?: string;
  nostalgicProductsText?: string;
  dreamBrandCollaboration?: string[];
  alwaysRecommend?: string[];
  collabMindedPeople?: string;
  dreamCollaborator?: string;
  meaningfulProject?: string;
  primaryVerticals?: string[];
};

type TabId = "about" | "projects" | "requests";

/** Proposals / "Requests" are creator-only; brands (Individual | Business) must not see them here. */
function viewerIsCreatorAccount(accountType: string | undefined): boolean {
  return String(accountType ?? "").trim().toLowerCase() === "creator";
}

function resolveCreatorId(p: Project): number {
  const c = p.creator?.id;
  if (typeof c === "number" && Number.isFinite(c)) return c;
  if (p.creatorId != null) {
    const n = Number(p.creatorId);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function projectThumbUrl(project: Project): string | undefined {
  const urls = project.mediaUrls ?? project.images ?? [];
  const first = urls.find((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim()));
  return first?.trim();
}

function proposalStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const s = String(status).toLowerCase();
  if (s === "accepted") return "default";
  if (s === "rejected") return "destructive";
  return "secondary";
}

function TagRow({ label, values }: { label: string; values?: string[] }) {
  if (!values || values.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="text-[11px] px-2 py-0.5">
            {v}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function TextRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

/**
 * Renders the profile sections that used to be collected on the dashboard but
 * dropped before reaching the showcase (Narrative, Tone, Working Style,
 * Creative Capabilities, Audience, Behavioral prompts, Brand Affinity,
 * Project Signature). Only renders fields that actually have data.
 */
function CreatorDnaSection({ creator }: { creator: CreatorProfile }) {
  const genderSplit =
    creator.genderMale != null || creator.genderFemale != null
      ? `Male ${creator.genderMale ?? 0}% · Female ${creator.genderFemale ?? 0}%`
      : undefined;
  const topRegions = (creator.locales ?? [])
    .filter((l) => l?.country)
    .map((l) => (l.city ? `${l.city}, ${l.country}` : l.country));

  const hasAnyContent =
    (creator.originStoryTags?.length ?? 0) > 0 ||
    (creator.toneEmotional?.length ?? 0) > 0 ||
    (creator.toneProfessional?.length ?? 0) > 0 ||
    (creator.toneCultural?.length ?? 0) > 0 ||
    (creator.toneLifestyle?.length ?? 0) > 0 ||
    !!creator.availabilityType ||
    (creator.personalityTags?.length ?? 0) > 0 ||
    !!creator.preferredCommunication ||
    (creator.engagementType?.length ?? 0) > 0 ||
    (creator.deliverables?.length ?? 0) > 0 ||
    !!creator.equipmentAndSoftware ||
    !!creator.skillLevel ||
    (creator.creatorType?.length ?? 0) > 0 ||
    (creator.domainShards?.length ?? 0) > 0 ||
    !!creator.assetClassPrimary ||
    (creator.valueProp?.length ?? 0) > 0 ||
    !!creator.audienceDescription ||
    (creator.languages?.length ?? 0) > 0 ||
    !!genderSplit ||
    topRegions.length > 0 ||
    !!creator.dailyRoutineText ||
    !!creator.dailyCarryText ||
    !!creator.nostalgicProductsText ||
    (creator.dreamBrandCollaboration?.length ?? 0) > 0 ||
    (creator.alwaysRecommend?.length ?? 0) > 0 ||
    !!creator.collabMindedPeople ||
    !!creator.dreamCollaborator ||
    !!creator.meaningfulProject ||
    (creator.primaryVerticals?.length ?? 0) > 0;

  if (!hasAnyContent) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border space-y-8">
      <h3 className="text-base font-semibold text-foreground">Creator DNA</h3>

      {((creator.originStoryTags?.length ?? 0) > 0 ||
        creator.toneEmotional?.length ||
        creator.toneProfessional?.length ||
        creator.toneCultural?.length ||
        creator.toneLifestyle?.length) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TagRow label="Narrative identity" values={creator.originStoryTags} />
          <TagRow label="Tone — emotional" values={creator.toneEmotional} />
          <TagRow label="Tone — professional" values={creator.toneProfessional} />
          <TagRow label="Tone — cultural" values={creator.toneCultural} />
          <TagRow label="Tone — lifestyle" values={creator.toneLifestyle} />
        </div>
      )}

      {(creator.availabilityType ||
        creator.personalityTags?.length ||
        creator.preferredCommunication ||
        creator.engagementType?.length ||
        creator.deliverables?.length ||
        creator.equipmentAndSoftware) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextRow label="Availability" value={creator.availabilityType} />
          <TextRow label="Preferred communication" value={creator.preferredCommunication} />
          <TagRow label="Personality" values={creator.personalityTags} />
          <TagRow label="Engagement models" values={creator.engagementType} />
          <TagRow label="Standard deliverables" values={creator.deliverables} />
          <TextRow label="Equipment & software" value={creator.equipmentAndSoftware} />
        </div>
      )}

      {(creator.skillLevel ||
        creator.creatorType?.length ||
        creator.domainShards?.length ||
        creator.assetClassPrimary ||
        creator.valueProp?.length) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextRow label="Skill level" value={creator.skillLevel} />
          <TextRow label="Primary asset class" value={creator.assetClassPrimary} />
          <TagRow label="Creator type" values={creator.creatorType} />
          <TagRow label="Domain shards" values={creator.domainShards} />
          <TagRow label="Value proposition" values={creator.valueProp} />
        </div>
      )}

      {(creator.audienceDescription || creator.languages?.length || genderSplit || topRegions.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextRow label="Audience" value={creator.audienceDescription} />
          <TagRow label="Languages" values={creator.languages} />
          <TextRow label="Gender split" value={genderSplit} />
          <TagRow label="Top regions" values={topRegions} />
        </div>
      )}

      {(creator.dailyRoutineText || creator.dailyCarryText || creator.nostalgicProductsText) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextRow label="Daily routine" value={creator.dailyRoutineText} />
          <TextRow label="Always carries" value={creator.dailyCarryText} />
          <TextRow label="Nostalgic product" value={creator.nostalgicProductsText} />
        </div>
      )}

      {(creator.dreamBrandCollaboration?.length ||
        creator.alwaysRecommend?.length ||
        creator.collabMindedPeople ||
        creator.dreamCollaborator) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TagRow label="Dream brand collaborations" values={creator.dreamBrandCollaboration} />
          <TagRow label="Always recommends" values={creator.alwaysRecommend} />
          <TextRow label="Meaningful collaborators" value={creator.collabMindedPeople} />
          <TextRow label="Future collaboration wishlist" value={creator.dreamCollaborator} />
        </div>
      )}

      {(creator.meaningfulProject || creator.primaryVerticals?.length) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextRow label="Most meaningful project" value={creator.meaningfulProject} />
          <TagRow label="Primary verticals" values={creator.primaryVerticals} />
        </div>
      )}
    </div>
  );
}

export function CreatorProfileModal({
  open,
  onOpenChange,
  creator,
  creatorUserId,
  /** When the profile is opened from a project page, collaboration uses this project (no picker). */
  contextProjectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator: CreatorProfile;
  /** Numeric user id of the profiled creator — enables Projects / Requests data */
  creatorUserId?: number | null;
  contextProjectId?: string | null;
}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [requestCollaborateOpen, setRequestCollaborateOpen] = useState(false);
  const [collaborateProjectId, setCollaborateProjectId] = useState("");
  const [pickProjectOpen, setPickProjectOpen] = useState(false);

  const viewerId = user?.id != null ? Number(user.id) : null;
  const hasViewer =
    viewerId != null && Number.isFinite(viewerId);
  const hasCreator =
    creatorUserId != null && Number.isFinite(creatorUserId) && creatorUserId > 0;
  const isOwnProfile =
    hasViewer && hasCreator && viewerId === creatorUserId;

  const showRequestsTab = viewerIsCreatorAccount(user?.accountType);

  useEffect(() => {
    if (!open) setActiveTab("about");
  }, [open]);

  useEffect(() => {
    if (open && activeTab === "requests" && !showRequestsTab) {
      setActiveTab("about");
    }
  }, [open, activeTab, showRequestsTab]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    ...(showRequestsTab ? [{ id: "requests" as const, label: "Requests" }] : []),
  ];
  const coverUrl = creator.coverImageUrl;
  const website = creator.website;
  const projectsFinished = creator.projectsFinished ?? 0;
  const projectsInProgress = creator.projectsInProgress ?? 0;
  const joinDate = creator.joinDate ?? "";
  const aboutLong = creator.aboutLong ?? creator.about;
  const galleryImages = creator.galleryImages ?? [];
  const platformStats = creator.platformStats ?? [];

  const contextProjectIdTrimmed = String(contextProjectId ?? "").trim();

  /**
   * Owners: load for Projects / Requests tabs.
   * Visitors from a project page: load only when Projects or (creator-only) Requests tab needs the list.
   * Other visitors: load immediately (Reach out may need the list or picker).
   */
  const shouldLoadCreatorProjects =
    open &&
    hasCreator &&
    (isOwnProfile
      ? activeTab === "projects" || activeTab === "requests"
      : contextProjectIdTrimmed
        ? activeTab === "projects" || (activeTab === "requests" && showRequestsTab)
        : true);

  const { data: projectsForCreator = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["creator-profile-projects", creatorUserId, isOwnProfile],
    queryFn: async () => {
      const rows = isOwnProfile
        ? await projectsApi.getAll()
        : await projectsApi.getDiscover();
      return rows.filter((p) => resolveCreatorId(p) === creatorUserId);
    },
    enabled: shouldLoadCreatorProjects,
  });

  const openCollaborateForProject = (projectId: string) => {
    if (!projectId.trim()) return;
    setCollaborateProjectId(projectId);
    setRequestCollaborateOpen(true);
  };

  const handleReachOut = () => {
    if (isOwnProfile) return;
    if (!user) {
      toast.error("Sign in to send a collaboration request.");
      return;
    }
    if (!hasCreator) {
      toast.error("This profile isn’t linked to a creator account yet.");
      return;
    }
    if (contextProjectIdTrimmed) {
      openCollaborateForProject(contextProjectIdTrimmed);
      return;
    }
    if (projectsLoading) {
      toast("Loading projects…", { duration: 2000 });
      return;
    }
    const list = projectsForCreator;
    if (list.length === 0) {
      toast.error("This creator has no showcase projects yet.");
      return;
    }
    if (list.length === 1) {
      const pid = String(list[0].id ?? (list[0] as { _id?: string })._id ?? "").trim();
      if (!pid) {
        toast.error("Could not open collaboration form for this project.");
        return;
      }
      openCollaborateForProject(pid);
      return;
    }
    setPickProjectOpen(true);
  };

  const reachOutNeedsProjectList = !contextProjectIdTrimmed;

  const { data: incomingProposals = [], isLoading: incomingLoading } = useQuery({
    queryKey: ["creator-profile-incoming-proposals"],
    queryFn: () => projectProposalsApi.getIncoming(),
    enabled: open && isOwnProfile && activeTab === "requests",
  });

  const { data: mineProposals = [], isLoading: mineLoading } = useQuery({
    queryKey: ["creator-profile-my-proposals"],
    queryFn: () => projectProposalsApi.getMine(),
    enabled: open && !isOwnProfile && !!user && activeTab === "requests",
  });

  const visitorRequests = useMemo(() => {
    if (isOwnProfile) return [];
    const ids = new Set(
      projectsForCreator
        .map((p) => Number(p.id))
        .filter((n) => Number.isFinite(n))
    );
    return mineProposals.filter(
      (m) => m.project_id != null && ids.has(Number(m.project_id))
    );
  }, [isOwnProfile, projectsForCreator, mineProposals]);

  const requestsLoading =
    activeTab === "requests" &&
    (isOwnProfile
      ? incomingLoading
      : Boolean(user) && (mineLoading || projectsLoading));

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-hidden flex flex-col",
          "rounded-xl border-border"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{creator.name} – Creator profile</DialogTitle>

        {/* Cover image */}
        <div className="relative w-full h-32 sm:h-40 bg-muted shrink-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <DialogClose className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70 p-1.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* Profile summary card overlapping cover */}
        <div className="relative z-10 mx-4 sm:mx-6 -mt-10 sm:-mt-12">
          <Card className="border-border bg-card shadow-lg overflow-hidden rounded-xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden bg-muted border-2 border-background">
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                      {creator.name}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {creator.profession}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RiMapPinLine className="h-3.5 w-3.5 shrink-0" />
                        {creator.location}
                      </span>
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Globe className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{website}</span>
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Projects: {projectsFinished} Finished, {projectsInProgress} in Progress
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined on {joinDate}
                    </p>
                  </div>
                </div>
                {!isOwnProfile && (
                  <Button
                    type="button"
                    className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg h-10 px-4 w-full sm:w-auto"
                    size="default"
                    onClick={handleReachOut}
                    disabled={
                      !hasCreator ||
                      (reachOutNeedsProjectList &&
                        (projectsLoading ||
                          (!projectsLoading && projectsForCreator.length === 0)))
                    }
                    title={
                      !hasCreator
                        ? undefined
                        : reachOutNeedsProjectList &&
                            !projectsLoading &&
                            projectsForCreator.length === 0
                          ? "This creator has no showcase projects yet"
                          : undefined
                    }
                  >
                    {reachOutNeedsProjectList && projectsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        Loading…
                      </>
                    ) : (
                      "Reach out"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-4 border-b border-border">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 font-medium text-sm border-b-2 -mb-px transition-colors touch-manipulation",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content - scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 py-4 sm:py-6">
          {activeTab === "about" && (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>{aboutLong}</p>
                </div>
              </div>
            )}

          {activeTab === "projects" && (
            <div className="space-y-3">
              {!hasCreator && (
                <p className="text-sm text-muted-foreground">
                  Project list is unavailable for this profile.
                </p>
              )}
              {hasCreator && projectsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading projects…
                </div>
              )}
              {hasCreator && !projectsLoading && projectsForCreator.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No showcase projects yet.
                </p>
              )}
              {hasCreator &&
                !projectsLoading &&
                projectsForCreator.map((p) => {
                  const pid = String(p.id ?? p._id ?? "");
                  const thumb = projectThumbUrl(p);
                  const title = p.title?.trim() || "Untitled project";
                  return (
                    <Link
                      key={pid}
                      href={`/showcase/projects/${pid}`}
                      className="flex gap-3 rounded-xl border border-border bg-card/50 p-3 hover:bg-accent/40 transition-colors"
                    >
                      <div className="relative w-24 sm:w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
                        {thumb ? (
                          <Image src={thumb} alt="" fill className="object-cover" sizes="120px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground px-1 text-center">
                            No media
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {title}
                        </p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {p.description}
                          </p>
                        )}
                        <span className="text-xs text-primary mt-2 inline-block">
                          View project →
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-3">
              {!hasCreator && (
                <p className="text-sm text-muted-foreground">
                  Collaboration requests are unavailable for this profile.
                </p>
              )}
              {hasCreator && !user && (
                <p className="text-sm text-muted-foreground">
                  Sign in to see collaboration requests relevant to this creator.
                </p>
              )}
              {hasCreator && user && requestsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading…
                </div>
              )}
              {hasCreator &&
                user &&
                !requestsLoading &&
                isOwnProfile &&
                incomingProposals.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No collaboration proposals on your projects yet. Others can send proposals from your project pages.
                  </p>
                )}
              {hasCreator &&
                user &&
                !requestsLoading &&
                !isOwnProfile &&
                visitorRequests.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You don&apos;t have any collaboration proposals to this creator&apos;s projects yet. Open a project and submit a proposal to collaborate.
                  </p>
                )}
              {hasCreator &&
                user &&
                !requestsLoading &&
                isOwnProfile &&
                incomingProposals.map((row) => {
                  const pid = row.project_id != null ? String(row.project_id) : "";
                  const proposer = row.proposer;
                  const name =
                    [proposer?.firstName, proposer?.lastName].filter(Boolean).join(" ").trim() ||
                    proposer?.email ||
                    "Someone";
                  const projectTitle =
                    (row.project && typeof row.project === "object" && "title" in row.project
                      ? String((row.project as { title?: string }).title ?? "")
                      : "") || "Project";
                  const dateStr = row.createdAt
                    ? (() => {
                        try {
                          return format(new Date(row.createdAt), "dd MMM yyyy");
                        } catch {
                          return "";
                        }
                      })()
                    : "";
                  return (
                    <div
                      key={row.id}
                      className="rounded-xl border border-border bg-card/50 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <p className="text-sm font-medium text-foreground">{projectTitle}</p>
                        <Badge variant={proposalStatusVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From <span className="text-foreground font-medium">{name}</span>
                        {dateStr ? ` · ${dateStr}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {row.collaborationType}
                        {row.fee ? ` · ${row.fee}` : ""}
                      </p>
                      {pid && (
                        <Link
                          href={`/showcase/projects/${pid}#project-proposals`}
                          className="text-xs font-medium text-primary hover:underline inline-block"
                        >
                          Review on project →
                        </Link>
                      )}
                    </div>
                  );
                })}
              {hasCreator &&
                user &&
                !requestsLoading &&
                !isOwnProfile &&
                visitorRequests.map((row) => {
                  const pid = row.project_id != null ? String(row.project_id) : "";
                  const projectTitle =
                    (row.project && typeof row.project === "object" && "title" in row.project
                      ? String((row.project as { title?: string }).title ?? "")
                      : "") || "Project";
                  const dateStr = row.createdAt
                    ? (() => {
                        try {
                          return format(new Date(row.createdAt), "dd MMM yyyy");
                        } catch {
                          return "";
                        }
                      })()
                    : "";
                  return (
                    <div
                      key={row.id}
                      className="rounded-xl border border-border bg-card/50 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <p className="text-sm font-medium text-foreground">{projectTitle}</p>
                        <Badge variant={proposalStatusVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your proposal · {row.collaborationType}
                        {dateStr ? ` · ${dateStr}` : ""}
                      </p>
                      {row.reason && (
                        <p className="text-xs text-muted-foreground line-clamp-3">{row.reason}</p>
                      )}
                      {pid && (
                        <Link
                          href={`/showcase/projects/${pid}`}
                          className="text-xs font-medium text-primary hover:underline inline-block"
                        >
                          Open project →
                        </Link>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* Platform stats - under About tab */}
          {activeTab === "about" && platformStats.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-base font-semibold text-foreground mb-4">
                Platform stats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {platformStats.map((stat, i) => (
                  <Card
                    key={i}
                    className={cn(
                      "border-border bg-card rounded-xl overflow-hidden",
                      stat.highlighted && "ring-2 ring-primary border-primary"
                    )}
                  >
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm font-medium">
                        {stat.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {stat.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Link: {stat.link}
                      </p>
                      {stat.highlighted && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View more
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Creator DNA - narrative, tone, working style, capabilities, audience, affinity */}
          {activeTab === "about" && <CreatorDnaSection creator={creator} />}
        </div>
      </DialogContent>
    </Dialog>

      <Dialog open={pickProjectOpen} onOpenChange={setPickProjectOpen}>
        <DialogContent
          className="sm:max-w-md border-border bg-card"
          showCloseButton
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Choose a project</DialogTitle>
            <DialogDescription>
              Collaboration requests are sent for a specific showcase project.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[min(60vh,320px)] space-y-2 overflow-y-auto py-1">
            {projectsForCreator.map((p) => {
              const pid = String(p.id ?? (p as { _id?: string })._id ?? "").trim();
              const title = p.title?.trim() || "Untitled project";
              const thumb = projectThumbUrl(p);
              if (!pid) return null;
              return (
                <button
                  key={pid}
                  type="button"
                  className="flex w-full gap-3 rounded-xl border border-border bg-card/80 p-3 text-left transition-colors hover:bg-accent/50 touch-manipulation"
                  onClick={() => {
                    setPickProjectOpen(false);
                    openCollaborateForProject(pid);
                  }}
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {thumb ? (
                      <Image src={thumb} alt="" fill className="h-full w-full object-cover" sizes="80px" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{title}</p>
                    <span className="text-xs text-primary mt-1 inline-block">Collaborate on this project →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <RequestCollaborateModal
        open={requestCollaborateOpen}
        onOpenChange={(next) => {
          setRequestCollaborateOpen(next);
          if (!next) setCollaborateProjectId("");
        }}
        projectId={collaborateProjectId}
      />
    </>
  );
}
