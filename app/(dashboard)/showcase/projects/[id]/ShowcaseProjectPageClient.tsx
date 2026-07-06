"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProjectCarousel } from "@/components/Dashboard/showcase/ProjectCarousel";
import { ProjectSidebar } from "@/components/Dashboard/showcase/ProjectSidebar";
import { CreatorProfileModal } from "@/components/Dashboard/showcase/CreatorProfileModal";
import { buildCreatorProfileFromProject } from "@/lib/showcase/buildCreatorProfile";
import toast from "react-hot-toast";
import axios from "axios";

export default function ShowcaseProjectPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [creatorProfileOpen, setCreatorProfileOpen] = useState(false);
  const [handledInviteToken, setHandledInviteToken] = useState<string | null>(null);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["creator-projects", id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (token: string) => projectsApi.acceptMemberInvite(token),
    onSuccess: () => {
      toast.success("Invite accepted. You are now part of this project team.");
      queryClient.invalidateQueries({ queryKey: ["creator-projects", id] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: (err: unknown) => {
      let text = "";
      if (axios.isAxiosError(err)) {
        const m = err.response?.data?.message;
        if (typeof m === "string") text = m.trim();
      }
      toast.error(text || "Unable to accept this invite.");
    },
  });

  useEffect(() => {
    if (!project) return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#project-proposals") return;
    const el = document.getElementById("project-proposals");
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [project, id]);

  useEffect(() => {
    const token = String(searchParams.get("invite") ?? "").trim();
    if (!token) return;
    if (!id) return;
    if (handledInviteToken === token) return;
    setHandledInviteToken(token);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("invite");
      window.history.replaceState({}, "", url.toString());
    }
    acceptInviteMutation.mutate(token);
  }, [searchParams, id, handledInviteToken, acceptInviteMutation]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="outline">
          <Link href="/showcase">Back to Showcase</Link>
        </Button>
      </div>
    );
  }

  const projectTitle = (project as { title?: string }).title ?? "Project";
  const creatorProfile = buildCreatorProfileFromProject(project);

  return (
    <div className="min-h-dvh bg-background text-foreground">    

      <main className="w-full px-3 pt-1 pb-6 sm:px-4 sm:pt-2 sm:pb-8">
           <div className="flex items-center gap-3 mb-4">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                {projectTitle}
              </h1>
           </div>
        <section
          className="rounded-2xl border border-border bg-card/30 overflow-hidden"
          aria-label="Project details"
        >
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-0">
            <div className="w-full lg:flex-1 min-w-0 order-2 lg:order-1 p-4 sm:p-6 lg:border-r lg:border-border">
              <ProjectCarousel project={project} />
            </div>
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 order-1 lg:order-2 border-t lg:border-t-0 lg:border-l border-border bg-muted/10">
              <div className="sticky top-4 p-4 sm:p-5">
                <ProjectSidebar
                  creator={creatorProfile}
                  onOpenCreatorProfile={() => setCreatorProfileOpen(true)}
                  project={project}
                  projectId={id}
                  projectTitle={projectTitle}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <CreatorProfileModal
        open={creatorProfileOpen}
        onOpenChange={setCreatorProfileOpen}
        creator={creatorProfile}
        creatorUserId={project.creator?.id}
        contextProjectId={id}
      />
    </div>
  );
}
