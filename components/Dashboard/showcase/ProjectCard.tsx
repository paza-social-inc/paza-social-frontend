"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/projects/projectTypes";
import { EditProjectModal } from "./EditProjectModal";
import { MakePublicProjectModal } from "./MakePublicProjectModal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  MapPin,
  Target,
  Users,
  ClipboardCheck,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { projectsApi } from "@/lib/data/projects";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { decodeJwtPayload, getAccountTypeFromPayload } from "@/lib/jwtPayload";
import {
  resolveProjectThumbnail,
  resolveProjectThumbnailCandidates,
} from "@/lib/showcase/projectThumbnail";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

function getProjectId(project: Project): string {
  return project.id ?? (project as { _id?: string })._id ?? "";
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { user, token } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [makePublicOpen, setMakePublicOpen] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  const id = getProjectId(project);

  const isOwner = useMemo(() => {
    if (!user?.id || String(user.id).trim() === "") return false;
    const uid = Number(user.id);
    if (!Number.isFinite(uid)) return false;
    const creatorId = project.creator?.id;
    if (creatorId != null && Number(creatorId) === uid) return true;
    if (project.creatorId != null && String(project.creatorId).trim() !== "") {
      const cid = Number(project.creatorId);
      if (Number.isFinite(cid) && cid === uid) return true;
    }
    return false;
  }, [user?.id, project.creator?.id, project.creatorId]);

  const accountType = useMemo(() => {
    const u = user as { accountType?: string; account?: { accountType?: string } } | null;
    const direct = u?.accountType ?? u?.account?.accountType;
    if (direct && String(direct).trim() !== "") return String(direct).trim();
    const effectiveToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    return getAccountTypeFromPayload(decodeJwtPayload(effectiveToken));
  }, [user, token]);

  const isCreatorAccount = accountType.toLowerCase() === "creator";
  const showViewProposals = isOwner && isCreatorAccount;

  const categoryLabel = project.category?.trim() ?? "";
  const title = project.title?.trim() || "Untitled project";
  const description = project.description?.trim() ?? "";
  const locationLabel = project.location?.trim() ?? "";
  const tags = Array.isArray(project.tags)
    ? project.tags
        .map((t) => (typeof t === "string" ? t.trim() : String((t as { name?: string }).name ?? "").trim()))
        .filter(Boolean)
    : [];
  const goalCount = project.goalCount ?? project.goals?.length ?? 0;
  const interestedCount = project.interestedCount ?? 0;
  const tasksReceivedCount = project.tasksReceivedCount ?? 0;
  const collaboratorsCount = project.collaboratorsCount ?? 0;
  const thumb = resolveProjectThumbnail(project);
  const thumbCandidates = useMemo(() => {
    const preferred = thumb ? [thumb] : [];
    return Array.from(new Set([...preferred, ...resolveProjectThumbnailCandidates(project)]));
  }, [project, thumb]);
  const activeThumb = thumbCandidates[thumbIndex] ?? "";

  useEffect(() => {
    setThumbIndex(0);
  }, [id, thumb, thumbCandidates.length]);
  const isPublic = Boolean(project.isPublic);

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => projectsApi.delete(id),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  const goToProject = () => {
    if (!id) return;
    router.push(`/showcase/projects/${id}`);
  };

  const stats = [
    {
      key: "goals",
      label: "Goals",
      value: goalCount,
      icon: Target,
      bg: "bg-blue-500/15",
      fg: "text-blue-400",
    },
    {
      key: "interested",
      label: "Interested",
      value: interestedCount,
      icon: Users,
      bg: "bg-amber-500/15",
      fg: "text-amber-400",
    },
    {
      key: "tasks",
      label: "Tasks",
      value: tasksReceivedCount,
      icon: ClipboardCheck,
      bg: "bg-green-500/15",
      fg: "text-green-400",
    },
    {
      key: "collaborators",
      label: "Collabs",
      value: collaboratorsCount,
      icon: UserPlus,
      bg: "bg-purple-500/15",
      fg: "text-purple-400",
    },
  ] as const;

  return (
    <Card
      className={cn(
        "rounded-xl border border-border bg-card text-foreground overflow-hidden",
        "flex flex-col h-full transition-shadow hover:shadow-lg p-0",
        className
      )}
      onClick={(e) => {
        if (editOpen || makePublicOpen) return;
        // Prevent card navigation when interacting with dropdown/buttons inside the card.
        const target = e.target as HTMLElement | null;
        if (target?.closest("[data-prevent-card-click]")) return;
        goToProject();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (editOpen || makePublicOpen) return;
        if (e.key === "Enter" || e.key === " ") goToProject();
      }}
    >
      <div className="relative w-full aspect-16/10 bg-muted">
        {activeThumb ? (
          <Image
            src={activeThumb}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => {
              setThumbIndex((curr) => {
                if (curr + 1 < thumbCandidates.length) return curr + 1;
                return curr;
              });
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}

        {/* Bottom gradient + title/location overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
        <div className="absolute inset-x-3 bottom-2.5">
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow-sm">
            {title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="line-clamp-1">{locationLabel || "No location set"}</span>
          </p>
        </div>

        {/* Category / public badges, top-left */}
        {(categoryLabel || isPublic) ? (
          <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1.5">
            {categoryLabel ? (
              <span className="inline-flex items-center rounded-md bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[11px] font-medium text-white">
                {categoryLabel}
              </span>
            ) : null}
            {isPublic ? (
              <Badge className="bg-orange-500/25 text-orange-200 border-orange-500/40 text-[11px]">
                Public
              </Badge>
            ) : null}
          </div>
        ) : null}

        {isOwner && (
          <div className="absolute right-2 top-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-prevent-card-click
                  className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/45 text-white"
                  aria-label="Project actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-prevent-card-click>
                <DropdownMenuItem onSelect={() => setMakePublicOpen(true)}>
                  {isPublic ? "Visibility" : "Make Public"}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    if (!id) return;
                    deleteMutation.mutate();
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 p-3.5 sm:p-4 gap-3">
        {description ? (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        ) : null}

        {/* Stats — compact 2x2 icon grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {stats.map(({ key, label, value, icon: Icon, bg, fg }) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  bg
                )}
                aria-hidden
              >
                <Icon className={cn("h-3.5 w-3.5", fg)} />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="text-xs font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags — single line, no label, hidden if empty */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 ? (
              <span className="inline-flex items-center px-1 text-[11px] text-muted-foreground">
                +{tags.length - 4}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <Button
            variant="outline"
            className="w-full min-h-9 touch-manipulation border-border bg-muted/30 hover:bg-muted/50 text-foreground font-medium text-sm"
            asChild
          >
            <Link
              data-prevent-card-click
              href={id ? `/showcase/projects/${id}` : "#"}
            >
              View project
            </Link>
          </Button>
          {showViewProposals && id ? (
            <Button
              variant="outline"
              className="w-full min-h-9 touch-manipulation border-orange-500/50 bg-orange-500/10 text-foreground font-medium text-sm hover:bg-orange-500/20"
              asChild
            >
              <Link
                data-prevent-card-click
                href={`/showcase/projects/${id}/proposals`}
              >
                View proposals
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>

      {isOwner && (
        <>
          <EditProjectModal
            project={project}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <MakePublicProjectModal
            project={project}
            open={makePublicOpen}
            onOpenChange={setMakePublicOpen}
          />
        </>
      )}
    </Card>
  );
}