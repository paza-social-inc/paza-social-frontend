"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// (sort UI removed to match simplified project listing)
import { projectsApi } from "@/lib/data/projects";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/projects/projectTypes";
import { Loader2 } from "lucide-react";
import type { ProjectNavTab } from "./ShowcaseSearch";
import {
  ShowcaseFilterControls,
  type ShowcaseFilterState,
} from "./ShowcaseFilterControls";

function normalizeProject(p: Project): Project {
  const rawId = p.id ?? (p as { _id?: string })._id;
  const id = rawId != null && rawId !== "" ? String(rawId) : "";
  return {
    ...p,
    id,
    goalCount: p.goalCount ?? p.goals?.length,
    tasksReceivedCount: p.tasksReceivedCount ?? (p.proposals as unknown[])?.length,
  };
}

interface MyProjectsGridProps {
  searchQuery?: string;
  activeNav?: ProjectNavTab;
}

const emptyFilters: ShowcaseFilterState = {
  category: "",
  location: "",
  tags: [],
};

function projectMatchesTags(project: Project, selected: string[]): boolean {
  if (selected.length === 0) return true;
  const projectTags = new Set(
    (project.tags ?? []).map((t) => String(t).toLowerCase().trim()),
  );
  return selected.every((t) => projectTags.has(t.toLowerCase().trim()));
}

export function MyProjectsGrid({
  searchQuery = "",
  activeNav = "My Projects",
}: MyProjectsGridProps) {
  const [filters, setFilters] = useState<ShowcaseFilterState>(emptyFilters);

  const isAllProjectsTab = activeNav === "All projects";
  const isCollaboratingTab = activeNav === "Collaborating";

  useEffect(() => {
    setFilters(emptyFilters);
  }, [activeNav]);

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: [
      "creator-projects",
      isAllProjectsTab ? "discover" : isCollaboratingTab ? "collaborations-mine" : "mine",
    ],
    queryFn: () =>
      isAllProjectsTab
        ? projectsApi.getDiscover()
        : isCollaboratingTab
          ? projectsApi.getMyCollaborations()
          : projectsApi.getAll(),
  });

  const filteredProjects = useMemo(() => {
    let list = projects.map(normalizeProject);

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const creatorName = p.creator
          ? `${p.creator.firstName ?? ""} ${p.creator.lastName ?? ""}`.toLowerCase()
          : "";
        return (
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q) ||
          (p.location ?? "").toLowerCase().includes(q) ||
          creatorName.includes(q) ||
          (p.tags ?? []).some((t) => String(t).toLowerCase().includes(q))
        );
      });
    }

    if (filters.category) {
      list = list.filter((p) => (p.category ?? "").trim() === filters.category);
    }

    if (filters.location) {
      list = list.filter((p) => (p.location ?? "").trim() === filters.location);
    }

    if (filters.tags.length > 0) {
      list = list.filter((p) => projectMatchesTags(p, filters.tags));
    }

    return list;
  }, [projects, searchQuery, filters]);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(emptyFilters);
  }, []);

  const hasActiveFiltersOrSearch =
    searchQuery.trim() !== "" ||
    Boolean(filters.category) ||
    Boolean(filters.location) ||
    filters.tags.length > 0;

  const count = filteredProjects.length;

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ShowcaseFilterControls
        projects={projects.map(normalizeProject)}
        filters={filters}
        onCategoryChange={(category) => setFilters((f) => ({ ...f, category }))}
        onLocationChange={(location) => setFilters((f) => ({ ...f, location }))}
        onToggleTag={toggleTag}
        onClearFilters={clearFilters}
      />

      <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
        {activeNav}({count})
      </h2>

      {count === 0 ? (
        <div className="rounded-xl border border-border bg-card/20 py-10 sm:py-16 text-center text-muted-foreground">
          {projects.length > 0 && hasActiveFiltersOrSearch ? (
            <>
              <p className="text-sm">No projects match your search or filters.</p>
              <p className="mt-1 text-xs">
                Try adjusting the filters, clearing the search, or choosing different tags.
              </p>
            </>
          ) : searchQuery.trim() ? (
            <>
              <p className="text-sm">No projects match your search.</p>
              <p className="mt-1 text-xs">Try a different term or clear the search.</p>
            </>
          ) : (
            <>
              <p className="text-sm">
                {activeNav === "My Projects"
                  ? "You don’t have any projects yet."
                  : activeNav === "Collaborating"
                    ? "You are not collaborating on any projects yet."
                    : "No projects found."}
              </p>
              <p className="mt-1 text-xs">
                {activeNav === "All projects"
                  ? "No creator projects are listed yet, or try again later."
                  : activeNav === "Collaborating"
                    ? "Accepted collaborations will appear here."
                  : "Create one to see it here."}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id ?? (project as { _id?: string })._id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}
