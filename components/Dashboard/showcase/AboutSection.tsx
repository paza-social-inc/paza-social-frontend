"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { projectsApi } from "@/lib/data/projects";
import { DEFAULT_API_URL, pazaApi } from "@/lib/axiosClients";
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
  initialMediaUrls: string[];
  canEdit: boolean;
};

function looksLikeImageUrl(url: string): boolean {
  const v = String(url ?? "").trim();
  if (!v) return false;
  if (v.startsWith("blob:") || v.startsWith("data:image/")) return true;
  try {
    const u = new URL(v);
    const path = u.pathname.toLowerCase();
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(path);
  } catch {
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(v.toLowerCase());
  }
}

function toAbsoluteUploadUrl(url: string): string {
  const v = String(url ?? "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v) || v.startsWith("blob:") || v.startsWith("data:")) {
    return v;
  }
  if (v.startsWith("/uploads/")) {
    const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
    return `${base}${v}`;
  }
  return v;
}

export function AboutSection({ projectId, initial, initialMediaUrls, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);
  const primaryImageUrl = mediaUrls
    .map((url) => toAbsoluteUploadUrl(url))
    .find((url) => looksLikeImageUrl(url));

  const [mediaUploadPending, setMediaUploadPending] = useState(false);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);
  useEffect(() => {
    setMediaUrls(initialMediaUrls);
  }, [initialMediaUrls]);

  const saveMutation = useMutation({
    mutationFn: ({ description, nextMediaUrls }: { description: string; nextMediaUrls: string[] }) =>
      projectsApi.update(projectId, {
        description: description.trim() || "",
        mediaUrls: nextMediaUrls,
      }),
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
    setMediaUrls(initialMediaUrls);
    setEditing(false);
  };

  const uploadMediaImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const endpoints = ["/api/uploads/image", "/api/uploads/file"];

    for (const endpoint of endpoints) {
      try {
        const res = await pazaApi.post(endpoint, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res?.data?.data?.url;
        if (typeof url === "string" && url.trim()) {
          return url.trim();
        }
        throw new Error("Upload succeeded but no file URL was returned.");
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          // Try the next compatible upload endpoint only when route is missing.
          continue;
        }
        throw err;
      }
    }

    throw new Error("Upload endpoint not available on this backend.");
  };

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    try {
      setMediaUploadPending(true);
      const url = await uploadMediaImage(file);
      // Make latest upload the primary project image.
      setMediaUrls((prev) => [url, ...prev]);
      toast.success("Project image uploaded");
    } catch (err: unknown) {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        (err as Error)?.message ||
        "Failed to upload image";
      toast.error(msg);
    } finally {
      setMediaUploadPending(false);
    }
  };

  if (editing && canEdit) {
    return (
      <div className="min-w-0 max-w-full space-y-4">
        <div className="rounded-lg border border-border p-3">
          <p className="mb-2 text-xs text-muted-foreground">Project image</p>
          {primaryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImageUrl}
              alt="Project primary"
              className="mb-3 h-36 w-full rounded-md object-cover"
            />
          ) : null}
          <input
            id="about-project-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMediaFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={mediaUploadPending}
            onClick={() => document.getElementById("about-project-image-upload")?.click()}
          >
            {mediaUploadPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Change image
              </>
            )}
          </Button>
        </div>
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
            onClick={() => saveMutation.mutate({ description: draft, nextMediaUrls: mediaUrls })}
            disabled={saveMutation.isPending || mediaUploadPending}
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
    <div className="min-w-0 max-w-full space-y-4 text-sm sm:text-base text-muted-foreground">
      {initial.trim() ? (
        <p className="min-w-0 max-w-full leading-relaxed whitespace-pre-wrap wrap-anywhere">
          {initial}
        </p>
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
