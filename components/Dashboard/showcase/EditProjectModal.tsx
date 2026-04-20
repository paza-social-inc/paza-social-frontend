"use client";

import { useEffect, useState } from "react";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import type { Project } from "@/types/projects/projectTypes";
import { projectsApi } from "@/lib/data/projects";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectFormSections,
  type ProjectFormBaseData,
} from "./ProjectFormSections";

const schema = z.object({
  title: z
    .string()
    .min(2, "Project title must be at least 2 characters")
    .max(200, "Project title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  category: z
    .string()
    .max(255, "Category must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(255, "Location must be 255 characters or less")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function getProjectId(project: Project): string {
  return project.id ?? (project as { _id?: string })._id ?? "";
}

export interface EditProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectModal({
  project,
  open,
  onOpenChange,
}: EditProjectModalProps) {
  const queryClient = useQueryClient();
  const id = project ? getProjectId(project) : "";

  /** Full project from GET /:id — list rows can be stale right after save; detail has discovery fields. */
  const {
    data: projectFromApi,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["creator-projects", id],
    queryFn: () => projectsApi.getById(id),
    enabled: open && Boolean(id),
    staleTime: 0,
  });

  const detailReady =
    projectFromApi != null || isError || !id;
  const showDetailLoading =
    open && Boolean(id) && isPending && projectFromApi === undefined && !isError;

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaInputValue, setMediaInputValue] = useState("");
  const [mediaUrlError, setMediaUrlError] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [campaignLink, setCampaignLink] = useState("");

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", category: "", location: "" },
  });

  const registerBase = register as UseFormRegister<ProjectFormBaseData>;
  const errorsBase = errors as FieldErrors<ProjectFormBaseData>;

  useEffect(() => {
    if (!open || !project) return;
    if (!detailReady) return;
    const p = projectFromApi ?? project;
    reset({
      title: p.title ?? "",
      description: p.description ?? "",
      category: p.category ?? "",
      location: p.location ?? "",
    });
    const media = p.mediaUrls ?? p.images ?? [];
    setMediaUrls(Array.isArray(media) ? [...media] : []);
    setMediaInputValue("");
    setMediaUrlError(null);
    setGoals(Array.isArray(p.goals) ? [...p.goals] : []);
    setGoalInput("");
    setTags(Array.isArray(p.tags) ? [...p.tags] : []);
    setTagInput("");
    const cid =
      p.sourceCampaignId != null && String(p.sourceCampaignId).trim() !== ""
        ? String(p.sourceCampaignId)
        : p.campaign_id != null
          ? String(p.campaign_id)
          : "";
    setCampaignLink(cid);
  }, [open, project, projectFromApi, detailReady, reset]);

  const addMediaUrl = () => {
    const url = mediaInputValue.trim();
    if (!url) {
      setMediaUrlError(null);
      return;
    }
    if (!isValidUrl(url)) {
      setMediaUrlError("Please enter a valid URL (e.g. https://...)");
      return;
    }
    setMediaUrlError(null);
    setMediaUrls((prev) => [...prev, url]);
    setMediaInputValue("");
  };

  const addGoal = () => {
    const g = goalInput.trim();
    if (g) {
      setGoals((prev) => [...prev, g]);
      setGoalInput("");
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!id) throw new Error("Missing project id");
      return projectsApi.update(id, {
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : [],
        goals: goals.length > 0 ? goals : [],
        category: data.category?.trim() ? data.category.trim() : null,
        location: data.location?.trim() ? data.location.trim() : null,
        tags: tags.length > 0 ? tags : null,
        taggedCollaboratorIds: [],
        taggedBrandIds: [],
        sourceCampaignId: campaignLink.trim() === "" ? "" : campaignLink.trim(),
      });
    },
    onSuccess: (updated) => {
      if (updated) {
        queryClient.setQueryData(["creator-projects", id], updated);
        queryClient.setQueriesData(
          { queryKey: ["creator-projects"], exact: false },
          (old: unknown) => {
            if (!Array.isArray(old)) return old;
            return old.map((row: Project) =>
              String(getProjectId(row)) === String(id) ? { ...row, ...updated } : row,
            );
          },
        );
      }
      toast.success("Project updated");
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects", id] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update project";
      toast.error(msg);
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90dvh,900px)] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4 text-left">
          <DialogTitle>Edit project</DialogTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Same sections as creating a project — details, media, collaborators, goals,
            plus campaign link.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {showDetailLoading ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
                <p className="text-sm">Loading project…</p>
              </div>
            ) : null}
            <div className={showDetailLoading ? "hidden" : "contents"}>
            <ProjectFormSections
              register={registerBase}
              errors={errorsBase}
              mediaUrls={mediaUrls}
              setMediaUrls={setMediaUrls}
              mediaInputValue={mediaInputValue}
              setMediaInputValue={setMediaInputValue}
              mediaUrlError={mediaUrlError}
              setMediaUrlError={setMediaUrlError}
              addMediaUrl={addMediaUrl}
              goals={goals}
              setGoals={setGoals}
              goalInput={goalInput}
              setGoalInput={setGoalInput}
              addGoal={addGoal}
              tags={tags}
              setTags={setTags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              addTag={addTag}
              collaboratorsHint="You can invite collaborators after saving from the project dashboard."
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Campaign link</CardTitle>
                <FieldDescription>
                  Optional. Link this project to a campaign you own. Leave empty to
                  unlink.
                </FieldDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={campaignLink}
                  onChange={(e) => setCampaignLink(e.target.value)}
                  placeholder="Campaign ID (number)"
                  className="min-h-12 text-base"
                  inputMode="numeric"
                />
              </CardContent>
            </Card>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border px-6 py-4 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={showDetailLoading || updateMutation.isPending || !id}
              className="min-h-11 bg-orange-500 font-semibold text-black hover:bg-orange-600"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
