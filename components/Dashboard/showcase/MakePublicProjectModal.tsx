"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

import type { Project } from "@/types/projects/projectTypes";
import { projectsApi } from "@/lib/data/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function getProjectId(project: Project): string {
  return project.id ?? (project as { _id?: string })._id ?? "";
}

export interface MakePublicProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MakePublicProjectModal({
  project,
  open,
  onOpenChange,
}: MakePublicProjectModalProps) {
  const queryClient = useQueryClient();
  const id = project ? getProjectId(project) : "";
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (open && project) {
      setIsPublic(Boolean(project.isPublic));
    }
  }, [open, project]);

  const updateMutation = useMutation({
    mutationFn: (next: boolean) => {
      if (!id) throw new Error("Missing project id");
      return projectsApi.update(id, { isPublic: next });
    },
    onSuccess: (_, next) => {
      toast.success(
        next
          ? "Project is now public on the showcase"
          : "Project is now private"
      );
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects", id] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not update visibility";
      toast.error(msg);
    },
  });

  const title = project?.title ?? "Project";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Visibility — {title}</DialogTitle>
          <DialogDescription>
            Public projects can appear in showcase discovery so brands and other
            creators can find and collaborate with you. Private projects stay
            in your dashboard only.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isPublic ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"
            }`}
          >
            {isPublic ? (
              <Globe className="h-5 w-5" aria-hidden />
            ) : (
              <Lock className="h-5 w-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="project-public-switch" className="text-sm font-medium">
                Show on public showcase
              </Label>
              <Switch
                id="project-public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={updateMutation.isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isPublic
                ? "Others may discover this project when browsing the showcase."
                : "Only you see this project in My Projects until you make it public."}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-orange-500 font-semibold text-black hover:bg-orange-600"
            disabled={updateMutation.isPending || !id}
            onClick={() => updateMutation.mutate(isPublic)}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save visibility"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
