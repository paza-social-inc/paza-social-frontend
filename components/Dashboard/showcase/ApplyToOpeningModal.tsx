"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Loader2, Paperclip, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { openingsApi } from "@/lib/data/openings";
import { uploadPublicFileUrl } from "@/lib/data/uploads";
import type { Opening } from "@/types/openings";

const schema = z
  .object({
    coverLetter: z
      .string()
      .min(10, "Please include a short cover letter")
      .max(2500, "Cover letter is too long"),
    fee: z.string().optional().or(z.literal("")),
    timelineStart: z.string().optional().or(z.literal("")),
    timelineEnd: z.string().optional().or(z.literal("")),
    attachments: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const start = data.timelineStart?.trim();
      const end = data.timelineEnd?.trim();
      if (!start || !end) return true;
      return new Date(start) <= new Date(end);
    },
    { message: "End date must be on or after start date", path: ["timelineEnd"] }
  );

type FormData = z.infer<typeof schema>;

export function ApplyToOpeningModal({
  open,
  onOpenChange,
  projectId,
  opening,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  opening: Opening | null;
}) {
  const queryClient = useQueryClient();
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputId = "opening-apply-file-input";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      coverLetter: "",
      fee: "",
      timelineStart: "",
      timelineEnd: "",
      attachments: [],
    },
  });

  const attachments = watch("attachments");
  const openingId = String(opening?.id ?? opening?._id ?? "").trim();

  const applyMutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!projectId.trim() || !openingId) {
        return Promise.reject(new Error("Missing project/opening id"));
      }
      return openingsApi.apply(projectId, openingId, {
        coverLetter: data.coverLetter.trim(),
        fee: data.fee?.trim() || null,
        timelineStart: data.timelineStart?.trim() || null,
        timelineEnd: data.timelineEnd?.trim() || null,
        attachments: data.attachments ?? null,
      });
    },
    onSuccess: () => {
      toast.success("Application sent");
      queryClient.invalidateQueries({ queryKey: ["openings", projectId] });
      queryClient.invalidateQueries({ queryKey: ["my-opening-applications"] });
      reset();
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const ax = err as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      toast.error(
        ax.response?.data?.message ??
          ax.response?.data?.error ??
          ax.message ??
          "Failed to submit application"
      );
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    setUploadingFiles(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadPublicFileUrl(file);
        uploaded.push(url);
      }
      const current = attachments ?? [];
      setValue("attachments", [...current, ...uploaded], {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Attachment upload complete");
    } catch {
      toast.error("Could not upload one or more files");
    } finally {
      setUploadingFiles(false);
      setFileInputKey((k) => k + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[calc(100vw-1.5rem)] sm:max-w-xl h-[88dvh] sm:h-[80vh]",
          "flex flex-col p-0 gap-0 rounded-2xl border-border bg-background"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Apply to opening</DialogTitle>

        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Apply to opening</h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {opening?.title ?? "Opening"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => applyMutation.mutate(data))}
          className="flex flex-1 min-h-0 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5">
            <Field>
              <FieldLabel>Cover letter *</FieldLabel>
              <Textarea
                {...register("coverLetter")}
                placeholder="Why are you a good fit for this opening?"
                className="min-h-32 resize-none"
                aria-invalid={!!errors.coverLetter}
              />
              <FieldError>{errors.coverLetter?.message}</FieldError>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Expected fee (optional)</FieldLabel>
                <Input {...register("fee")} placeholder="e.g. 500 USD" className="min-h-11" />
              </Field>
              <Field>
                <FieldLabel>Start date (optional)</FieldLabel>
                <Input type="date" {...register("timelineStart")} className="min-h-11 scheme-dark" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>End date (optional)</FieldLabel>
                <Input type="date" {...register("timelineEnd")} className="min-h-11 scheme-dark" />
                <FieldError>{errors.timelineEnd?.message}</FieldError>
              </Field>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Attachments
                </span>
                {uploadingFiles ? (
                  <span className="text-[10px] text-muted-foreground">Uploading...</span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(fileInputId) as HTMLInputElement | null;
                  el?.click();
                }}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                disabled={uploadingFiles}
              >
                <Paperclip className="h-3.5 w-3.5" />
                Upload files
              </button>
              <input
                key={fileInputKey}
                id={fileInputId}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  void handleFilesSelected(files);
                }}
              />
              <div className="space-y-1">
                {(attachments ?? []).map((url, idx) => {
                  const label =
                    (() => {
                      try {
                        const pathname = new URL(url).pathname;
                        return decodeURIComponent(pathname.split("/").pop() || "Attachment");
                      } catch {
                        return "Attachment";
                      }
                    })();
                  return (
                    <div
                      key={`${url}-${idx}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs"
                    >
                      <span className="truncate pr-2">{label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = (attachments ?? []).filter((_, i) => i !== idx);
                          setValue("attachments", next, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-muted/20 px-4 py-3 sm:px-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-black hover:bg-orange-600"
              disabled={applyMutation.isPending || uploadingFiles || !openingId}
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
