"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Upload, Link as LinkIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

function looksLikeValidUrl(v: string): boolean {
  const s = v.trim();
  if (!s) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return Boolean(u.hostname);
  } catch {
    return false;
  }
}

function normalizeUrl(v: string): string {
  const s = v.trim();
  if (!s) return s;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export function AboutSection({ projectId, initial, initialMediaUrls, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);
  const [newLinkInput, setNewLinkInput] = useState("");
  const primaryImageUrl = mediaUrls
    .map((url) => toAbsoluteUploadUrl(url))
    .find((url) => looksLikeImageUrl(url));

  const linkUrls = mediaUrls.filter((url) => url.trim() && !looksLikeImageUrl(toAbsoluteUploadUrl(url)));

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
    setNewLinkInput("");
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

  const addLink = () => {
    const trimmed = newLinkInput.trim();
    if (!trimmed) return;
    if (!looksLikeValidUrl(trimmed)) {
      toast.error("Enter a valid URL, e.g. https://example.com");
      return;
    }
    const normalized = normalizeUrl(trimmed);
    if (mediaUrls.includes(normalized)) {
      toast.error("That link is already added");
      return;
    }
    setMediaUrls((prev) => [...prev, normalized]);
    setNewLinkInput("");
  };

  const removeLink = (url: string) => {
    setMediaUrls((prev) => prev.filter((u) => u !== url));
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

        <div className="rounded-lg border border-border p-3 space-y-3">
          <p className="text-xs text-muted-foreground">Links</p>
          {linkUrls.length > 0 ? (
            <ul className="space-y-1.5">
              {linkUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/70 bg-muted/20 px-2.5 py-1.5"
                >
                  <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{url}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLink(url)}
                    aria-label="Remove link"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground/70 italic">No links added yet.</p>
          )}
          <div className="flex gap-2">
            <Input
              value={newLinkInput}
              onChange={(e) => setNewLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://your-portfolio.com"
              className="h-9 text-sm"
            />
            <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1" onClick={addLink}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>

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

      {linkUrls.length > 0 ? (
        <div className="space-y-1.5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Links
          </p>
          <ul className="space-y-1">
            {linkUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline truncate"
                >
                  <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{url}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canEdit && (
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
          {initial.trim() ? "Edit" : "Add description"}
        </Button>
      )}
    </div>
  );
}