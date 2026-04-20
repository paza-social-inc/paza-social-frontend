"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiMapPinLine } from "@remixicon/react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { mockCreator } from "./showcaseData";
import { OpeningsListSheet } from "./OpeningsListSheet";
import type { CreatorProfile } from "./CreatorProfileModal";
import { OpeningDetailSheet } from "./OpeningDetailSheet";
import { CreateOpeningModal } from "./CreateOpeningModal";
import { CollaboratorSearchSheet } from "./CollaboratorSearchSheet";
import { RequestCollaborateModal } from "./RequestCollaborateModal";
import { cn } from "@/lib/utils";
import type { Project, ProjectTeamMember } from "@/types/projects/projectTypes";
import type { Opening } from "@/types/openings";
import { openingsApi } from "@/lib/data/openings";
import {
  projectProposalsApi,
  type CreatorProjectProposal,
  type CreatorProjectProposalMine,
} from "@/lib/data/projectProposals";
import { ProposalDetailsModal } from "@/components/Dashboard/showcase/ProposalDetailsModal";
import { useAuth } from "@/hooks/store/auth/useAuth";
import type { OpeningApplicant } from "./OpeningDetailSheet";

const socialIcons = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
];

export function ProjectSidebar({
  onOpenCreatorProfile,
  creator,
  project,
  projectId,
  projectTitle,
}: {
  onOpenCreatorProfile?: () => void;
  creator?: CreatorProfile;
  project?: Project;
  projectId?: string;
  projectTitle?: string;
}) {
  const { user } = useAuth();
  const [showAboutCreator, setShowAboutCreator] = useState(false);
  const profileCreator = creator ?? mockCreator;
  const [openingsListOpen, setOpeningsListOpen] = useState(false);
  const [openingDetailOpen, setOpeningDetailOpen] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);
  const [collaboratorSearchOpen, setCollaboratorSearchOpen] = useState(false);
  const [createOpeningModalOpen, setCreateOpeningModalOpen] = useState(false);
  const [requestCollaborateOpen, setRequestCollaborateOpen] = useState(false);
  const [proposalDetailOpen, setProposalDetailOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<CreatorProjectProposal | null>(null);

  const projectIdNumber = projectId ? Number(projectId) : NaN;
  const canFetchProposals =
    !Number.isNaN(projectIdNumber) && projectIdNumber > 0;

  /** True when the logged-in user is the showcase project owner (creator). */
  const isOwnProject = useMemo(() => {
    if (!project) return false;
    const uid =
      user?.id != null && String(user.id).trim() !== ""
        ? Number(user.id)
        : NaN;
    if (!Number.isFinite(uid)) return false;
    const creatorId = project.creator?.id;
    if (creatorId != null && Number(creatorId) === uid) return true;
    if (project.creatorId != null && String(project.creatorId).trim() !== "") {
      const cid = Number(project.creatorId);
      if (Number.isFinite(cid) && cid === uid) return true;
    }
    return false;
  }, [project, user?.id]);

  const {
    data: proposals = [],
    isLoading: proposalsLoading,
    isError: proposalsError,
  } = useQuery({
    queryKey: ["creator-project-proposals", projectIdNumber],
    queryFn: () => projectProposalsApi.getByProjectId(projectIdNumber),
    // Backend only allows the project owner to list proposals
    enabled: canFetchProposals && isOwnProject,
  });

  const { data: openingsForCount = [] } = useQuery({
    queryKey: ["openings", projectIdNumber, "count"],
    queryFn: () => openingsApi.getByProjectId(String(projectIdNumber)),
    enabled: !Number.isNaN(projectIdNumber) && projectIdNumber > 0,
  });

  const { data: myProposals = [] } = useQuery({
    queryKey: ["my-showcase-proposals", projectIdNumber],
    queryFn: () => projectProposalsApi.getMine(),
    enabled: canFetchProposals && !isOwnProject,
  });

  const myProposalForProject = useMemo(() => {
    if (!projectIdNumber || Number.isNaN(projectIdNumber)) return null;
    const rows = myProposals as CreatorProjectProposalMine[];
    return (
      rows.find((p) => Number(p.project?.id ?? p.project_id) === projectIdNumber) ?? null
    );
  }, [myProposals, projectIdNumber]);

  const hasAcceptedProposal =
    String(myProposalForProject?.status ?? "").toLowerCase() === "accepted";

  const resolvedProjectTitle = projectTitle ?? project?.title ?? "Project";
  const resolvedShortDescription = project?.description ?? "—";
  const openingsCount = openingsForCount.length;
  const openingsPercent =
    (project as unknown as { openingsPercent?: number }).openingsPercent ?? 0;

  const teamMembers = (project?.teamMembers ?? []) as ProjectTeamMember[];
  const openingApplicants = useMemo<OpeningApplicant[]>(() => {
    // Source applicants from collaboration proposals for this project.
    // Keep rejected/cancelled out of applicant list.
    const blocked = new Set(["rejected", "cancelled"]);
    const rows = (proposals ?? []).filter(
      (p) => !blocked.has(String(p.status ?? "").toLowerCase())
    );
    const mapped = rows
      .map((p) => {
        const proposer = p.proposer;
        if (!proposer) return null;
        const name =
          `${proposer.firstName ?? ""} ${proposer.lastName ?? ""}`.trim() || "Applicant";
        return {
          id: proposer.id,
          name,
          email: proposer.email,
          avatarUrl:
            proposer.profilePhotoUrl ??
            proposer.avatarUrl ??
            null,
          status: p.status,
        } as OpeningApplicant;
      })
      .filter((x): x is OpeningApplicant => Boolean(x));
    const seen = new Set<number>();
    return mapped.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [proposals]);

  const verifiedReach30d = (project as unknown as { verifiedReach30d?: number }).verifiedReach30d;
  const hasBrandSummary = verifiedReach30d != null;

  return (
    <aside className="flex flex-col w-full space-y-6">
      <ProposalDetailsModal
        open={proposalDetailOpen}
        onOpenChange={(open) => {
          setProposalDetailOpen(open);
          if (!open) setSelectedProposal(null);
        }}
        proposal={selectedProposal}
        projectId={projectIdNumber}
      />
      {/* Block 1: Creator + Project + Brand summary */}
      <Card className="border-border bg-card overflow-hidden rounded-xl w-full">
        <CardContent className="p-0">
          <button
            type="button"
            onClick={() => onOpenCreatorProfile?.()}
            className="w-full text-left p-4 hover:bg-muted/40 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden bg-muted">
                <Image
                  src={profileCreator.avatarUrl}
                  alt={profileCreator.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {profileCreator.name}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {profileCreator.profession}
                </p>
                <p className="text-xs sm:text-sm text-primary font-medium mt-0.5">
                  {profileCreator.reach}
                </p>
                <div className="flex items-center text-muted-foreground text-xs sm:text-sm mt-1">
                  <RiMapPinLine size={14} className="mr-1 shrink-0" />
                  <span className="truncate">{profileCreator.location}</span>
                </div>
              </div>
            </div>
          </button>
          <div className="border-t border-border px-4 py-3">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {resolvedProjectTitle}
            </h3>
            <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
              {resolvedShortDescription}
            </p>
          </div>
          {hasBrandSummary && (
            <div className="border-t border-border px-4 py-3 bg-muted/20">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                For brands
              </p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li>
                  Reach (30d): {verifiedReach30d?.toLocaleString()}
                </li>
                <li>
                  Audience:{" "}
                  {((project as unknown as { ownedAudience?: number }).ownedAudience ?? 0).toLocaleString()}
                </li>
                <li>
                  Fit:{" "}
                  {(project as unknown as { primaryFit?: string }).primaryFit}
                  {(project as unknown as { secondaryFit?: string }).secondaryFit
                    ? ` / ${(project as unknown as { secondaryFit?: string }).secondaryFit}`
                    : ""}
                </li>
                <li>
                  Budget: {(project as unknown as { budgetBand?: string }).budgetBand}
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Block 2: Actions */}
      <div className="space-y-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Actions
        </p>
        {!isOwnProject && !hasAcceptedProposal && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:opacity-90 h-10 touch-manipulation rounded-lg"
            size="default"
            onClick={() => setRequestCollaborateOpen(true)}
          >
            Collaborate
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted/50 h-10 touch-manipulation rounded-lg"
            size="default"
          >
            Decline
          </Button>
        </div>
        )}

        {isOwnProject && (
        <div
          id="project-proposals"
          className="scroll-mt-28 space-y-2 pt-1"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Proposals
            </p>
            {projectId && proposals.length > 0 ? (
              <Link
                href={`/showcase/projects/${projectId}/proposals`}
                className="text-[10px] font-medium text-primary hover:underline shrink-0"
              >
                View all
              </Link>
            ) : null}
          </div>
          {proposalsLoading ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : proposalsError ? (
            <p className="text-xs text-destructive">Failed to load proposals</p>
          ) : proposals.length === 0 ? (
            <p className="text-xs text-muted-foreground">No proposals yet</p>
          ) : (
            <div className="space-y-2">
              {proposals.slice(0, 3).map((p) => {
                const proposerName = p.proposer
                  ? `${p.proposer.firstName} ${p.proposer.lastName}`
                  : "—";
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      setSelectedProposal(p);
                      setProposalDetailOpen(true);
                    }}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground truncate">
                        {proposerName}
                      </p>
                      <p className="text-[10px] text-muted-foreground capitalize shrink-0">
                        {p.kind}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {p.reason}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.fee ? <span>• Fee: {p.fee}</span> : null}
                      {p.timeline ? <span>• {p.timeline}</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        )}

        <div className="flex items-center gap-2">
          {socialIcons.map(({ Icon, href, label }) => (
            <Button
              key={label}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-border touch-manipulation"
              asChild
            >
              <a href={href} aria-label={label}>
                <Icon className="h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>
        <div className="pt-1">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-semibold text-orange-500 underline underline-offset-2">
                Openings
              </span>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {openingsCount}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {projectId && isOwnProject && (
                <button
                  type="button"
                  onClick={() => setCreateOpeningModalOpen(true)}
                  className="text-xs text-orange-500 font-medium hover:underline touch-manipulation"
                >
                  Add
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpeningsListOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-orange-500 font-medium hover:underline touch-manipulation"
              >
                View
                <span
                  className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground"
                  aria-label={`${openingsCount} openings`}
                >
                  {openingsCount}
                </span>
              </button>
            </div>
          </div>
          <Progress
            value={openingsPercent}
            className="h-1.5"
          />
          <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground">
            <span>Complete</span>
            <span>{Math.round(openingsPercent)}%</span>
          </div>
          {projectId && isOwnProject && (
            <CreateOpeningModal
              open={createOpeningModalOpen}
              onOpenChange={setCreateOpeningModalOpen}
              projectId={projectId}
              projectTitle={resolvedProjectTitle}
            />
          )}
          <OpeningsListSheet
            open={openingsListOpen}
            onOpenChange={(open) => {
              setOpeningsListOpen(open);
              if (!open) setOpeningDetailOpen(false);
            }}
            projectId={projectId ?? ""}
            projectTitle={resolvedProjectTitle}
            projectDescription={resolvedShortDescription}
            projectCreatedAt={
              (project as unknown as { createdAt?: string }).createdAt
            }
            onSelectOpening={(opening) => {
              setSelectedOpening(opening);
              setOpeningDetailOpen(true);
            }}
          />
          <OpeningDetailSheet
            open={openingDetailOpen}
            onOpenChange={setOpeningDetailOpen}
            opening={selectedOpening}
            applicants={openingApplicants}
            onBack={() => {
              setOpeningDetailOpen(false);
              setOpeningsListOpen(true);
            }}
          />
        </div>
      </div>

      {/* Block 3: Team & interest */}
      <div className="space-y-4">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Team
        </p>
        <div className="flex flex-wrap gap-2">
          {teamMembers.length === 0 ? (
            <p className="text-xs text-muted-foreground w-full">
              No collaborators on the team yet. Approve a proposal to add someone.
            </p>
          ) : (
            teamMembers.map((m) => {
              const name =
                `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "Member";
              const photo = m.avatarUrl?.trim() || null;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 min-w-0"
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    {photo ? (
                      <AvatarImage src={photo} alt="" className="object-cover" />
                    ) : null}
                    <AvatarFallback className="text-[10px] font-medium bg-muted text-muted-foreground">
                      {(m.firstName?.[0] ?? "?").toUpperCase()}
                      {(m.lastName?.[0] ?? "").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
              <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{name}</p>
                    {m.role && m.role !== "member" ? (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-primary/10 text-primary truncate max-w-[72px] inline-block mt-0.5 capitalize">
                        {m.role}
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground mt-0.5 block">
                        Team
                      </span>
                    )}
                  </div>
                </div>
              );
            })
                )}
          {isOwnProject && (
          <button
            type="button"
            onClick={() => setCollaboratorSearchOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground touch-manipulation underline"
          >
            + Add
          </button>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden bg-muted">
              <Image src={profileCreator.avatarUrl} alt="" fill className="object-cover" sizes="36px" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{profileCreator.name}</p>
              <p className="text-[10px] text-muted-foreground">{profileCreator.location}</p>
            </div>
          </div>
          <p className={cn("text-xs text-muted-foreground", !showAboutCreator && "line-clamp-3")}>
            {profileCreator.about}
          </p>
          <button
            type="button"
            onClick={() => setShowAboutCreator((v) => !v)}
            className="text-xs text-primary font-medium mt-1 hover:underline touch-manipulation"
          >
            {showAboutCreator ? "Show less" : "Show more"}
          </button>
        </div>
      </div>

      <CollaboratorSearchSheet
        open={collaboratorSearchOpen}
        onOpenChange={setCollaboratorSearchOpen}
        projectId={projectId}
        existingMemberUserIds={teamMembers.map((m) => m.userId)}
      />

      {!isOwnProject && !hasAcceptedProposal && (
      <RequestCollaborateModal
        open={requestCollaborateOpen}
        onOpenChange={setRequestCollaborateOpen}
          projectId={projectId ?? ""}
      />
      )}
    </aside>
  );
}
