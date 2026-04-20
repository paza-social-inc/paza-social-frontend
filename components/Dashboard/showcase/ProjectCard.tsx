"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import { projectsApi } from "@/lib/data/projects";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { decodeJwtPayload, getAccountTypeFromPayload } from "@/lib/jwtPayload";
import { resolveProjectThumbnail } from "@/lib/showcase/projectThumbnail";

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
  const [thumbFailed, setThumbFailed] = useState(false);
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

  useEffect(() => {
    setThumbFailed(false);
  }, [id, thumb]);
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

  return (
    <Card
      className={cn(
        "rounded-xl border border-border bg-card text-foreground overflow-hidden",
        "flex flex-col h-full transition-shadow hover:shadow-lg",
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
      <div className="relative">
        <div className="relative w-full aspect-16/10 bg-muted">
          {thumb && !thumbFailed ? (
            // Dynamic CDN/user URLs — avoid next/image remotePatterns maintenance
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" aria-hidden />
          )}
          {isOwner && (
            <div className="absolute right-2 top-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-prevent-card-click
                    className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 text-foreground"
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
      </div>

      <CardContent className="flex flex-col flex-1 p-4 sm:p-5 gap-3 sm:gap-4">
        {(categoryLabel || isPublic) ? (
          <div className="flex flex-wrap justify-center gap-2">
            {categoryLabel ? (
              <span className="inline-flex items-center rounded-md border border-border bg-transparent px-3 py-1 text-xs font-medium text-foreground">
                {categoryLabel}
              </span>
            ) : null}
            {isPublic ? (
              <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40">
                Public
              </Badge>
            ) : null}
          </div>
        ) : null}

        <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description || "No description yet."}
        </p>
        {locationLabel ? (
          <p className="text-sm text-foreground">{locationLabel}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No location set</p>
        )}

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 8).map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-flex rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No tags yet</p>
          )}
        </div>

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{goalCount} goals/objectives</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
            <span>{interestedCount} interested</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{tasksReceivedCount} tasks received</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
            <span>{collaboratorsCount} collaborators</span>
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Button
            variant="outline"
            className="w-full min-h-11 touch-manipulation border-border bg-muted/30 hover:bg-muted/50 text-foreground font-medium"
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
              className="w-full min-h-11 touch-manipulation border-orange-500/50 bg-orange-500/10 text-foreground font-medium hover:bg-orange-500/20"
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
