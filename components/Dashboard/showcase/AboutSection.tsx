"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { projectsApi } from "@/lib/data/projects";
import type { Project } from "@/types/projects/projectTypes";

/** Prefer API `description`, then legacy/mock `aboutContent`. */
export function mergeAboutFromProject(project: Project & Record<string, unknown>): string {
  const p = project as { aboutContent?: string; description?: string };
  const desc = String(p.description ?? "").trim();
  if (desc) return String(p.description ?? "").trim();
  return String(p.aboutContent ?? "").trim();
}

type Props = {
  projectId: string;
  initial: string;
  canEdit: boolean;
};

export function AboutSection({ projectId, initial, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  const saveMutation = useMutation({
    mutationFn: (description: string) =>
      projectsApi.update(projectId, { description: description.trim() || "" }),
    onSuccess: () => {
      toast.success("About saved");
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["creator-projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: (err: unknown) => {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        "Could not save";
      toast.error(msg);
    },
  });

  const cancel = () => {
    setDraft(initial);
    setEditing(false);
  };

  if (editing && canEdit) {
    return (
      <div className="space-y-4">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={10}
          placeholder="Describe your project for brands and collaborators…"
          className="min-h-[180px] text-sm sm:text-base resize-y"
        />
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={cancel} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => saveMutation.mutate(draft)}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm sm:text-base text-muted-foreground">
      {initial.trim() ? (
        <p className="leading-relaxed whitespace-pre-wrap">{initial}</p>
      ) : (
        <p className="leading-relaxed italic text-muted-foreground/80">
          No description yet.{canEdit ? " Add a short overview of your project." : ""}
        </p>
      )}
      {canEdit && (
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
          {initial.trim() ? "Edit" : "Add description"}
        </Button>
      )}
    </div>
  );
}
