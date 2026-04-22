"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Paperclip, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { projectProposalsApi } from "@/lib/data/projectProposals";

type CollaborationKind = "support" | "task" | "campaign";

function getKindFromCollabType(collabType?: string): CollaborationKind {
  const v = (collabType ?? "").toLowerCase();
  if (!v) return "support";
  if (v.includes("task")) return "task";
  if (v.includes("campaign")) return "campaign";
  return "support";
}

const schema = z
  .object({
    collabType: z.string().min(1, "Select a collaboration type"),
    description: z
      .string()
      .min(5, "Please provide a short description")
      .max(2000, "Description is too long"),
    fee: z.string().optional().or(z.literal("")),
    timelineStart: z.string().optional().or(z.literal("")),
    timelineEnd: z.string().optional().or(z.literal("")),
    attachments: z.array(z.string()).optional(),
    collaborators: z.array(z.string()).optional(),
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

export interface RequestCollaborateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function RequestCollaborateModal({
  open,
  onOpenChange,
  projectId,
}: RequestCollaborateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      collabType: "",
      description: "",
      fee: "",
      timelineStart: "",
      timelineEnd: "",
      attachments: [],
      collaborators: [],
    },
  });

  const queryClient = useQueryClient();
  const projectIdNumber = Number(projectId);

  const fee = watch("fee");
  const attachments = watch("attachments");
  const collaborators = watch("collaborators");

  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputId = "collab-file-input";

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      projectIdNumber && !Number.isNaN(projectIdNumber)
        ? projectProposalsApi.create(projectIdNumber, {
        kind: getKindFromCollabType(data.collabType),
        collaborationType: data.collabType,
        reason: data.description,
        fee: data.fee?.trim() || null,
        timelineStart: data.timelineStart?.trim() || null,
        timelineEnd: data.timelineEnd?.trim() || null,
        attachments: data.attachments ?? null,
        collaborators: data.collaborators ?? null,
      })
        : Promise.reject(new Error("Invalid project id")),
    onSuccess: (resp) => {
      const message =
        (resp as { message?: string })?.message ??
        "Collaboration request sent";
      toast.success(message);
      reset();
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["creator-project-proposals", projectIdNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["my-showcase-proposals"] });
    },
    onError: (err: unknown) => {
      const ax = err as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const msg =
        ax.response?.data?.message ??
        ax.response?.data?.error ??
        ax.message ??
        "Failed to send request";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[calc(100vw-1.5rem)] sm:max-w-2xl h-[92dvh] sm:h-[85vh]",
          "flex flex-col p-0 gap-0 rounded-2xl border-border bg-background"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Request to Collaborate</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Request to Collaborate
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 touch-manipulation hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form must wrap the submit button — otherwise type="submit" does nothing */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-1 min-h-0 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5">
          {/* Collaboration type */}
          <Field>
            <FieldLabel>Collaboration type</FieldLabel>
            <Select
              value={watch("collabType")}
              onValueChange={(v) =>
                setValue("collabType", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full justify-between">
                <SelectValue placeholder="Select a collaboration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-off-support">One-off support</SelectItem>
                <SelectItem value="ongoing-task">Ongoing task</SelectItem>
                <SelectItem value="full-campaign">Full campaign</SelectItem>
              </SelectContent>
            </Select>
            {errors.collabType && (
              <FieldError>{errors.collabType.message}</FieldError>
            )}
          </Field>

          {/* Description */}
            <Field>
              <FieldLabel>Describe why you want to collaborate</FieldLabel>
              <Textarea
                {...register("description")}
                rows={4}
                placeholder="Write a small description"
                className="text-sm"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
          </Field>

          {/* Fee + timeline: one card, aligned labels, equal control height */}
          <div
            className={cn(
              "rounded-xl border border-border bg-muted/10 p-4 sm:p-5",
              "space-y-4"
            )}
          >
            <p className="text-sm font-medium text-foreground">Fee and schedule</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4 md:items-start">
              <Field className="gap-2">
                <FieldLabel className="text-sm">Set fee</FieldLabel>
                <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs">
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    Amount
                  </span>
                  <input
                    type="text"
                    {...register("fee")}
                    value={fee}
                    onChange={(e) => setValue("fee", e.target.value)}
                    placeholder="e.g. KES 50,000"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <FieldDescription className="text-xs leading-snug">
                  You can refine this together with the creator.
                </FieldDescription>
              </Field>
              <Field className="gap-2">
                <FieldLabel className="text-sm">Start date</FieldLabel>
                <Input
                  type="date"
                  {...register("timelineStart")}
                  className="h-12 min-h-12 w-full scheme-dark sm:min-w-0"
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel className="text-sm">End date</FieldLabel>
                <Input
                  type="date"
                  {...register("timelineEnd")}
                  className="h-12 min-h-12 w-full scheme-dark sm:min-w-0"
                />
              </Field>
            </div>
            {errors.timelineEnd && (
              <FieldError>{errors.timelineEnd.message}</FieldError>
            )}
            <FieldDescription className="text-xs leading-snug">
              Timeline is optional. If you set both dates, the end date must be on or after the start
              date.
            </FieldDescription>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Attachments
              </span>
              <span className="text-[10px] text-muted-foreground">
                Max. file size: 200Mb
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(fileInputId) as HTMLInputElement | null;
                el?.click();
              }}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline touch-manipulation"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Upload
            </button>
            <input
              key={fileInputKey}
              id={fileInputId}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;
                const names = files.map((f) => f.name);
                const current = attachments ?? [];
                setValue("attachments", [...current, ...names]);
                // reset input so selecting the same file again still fires change
                setFileInputKey((k) => k + 1);
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {(attachments ?? []).map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs"
                >
                  <span className="font-medium truncate max-w-[140px] sm:max-w-[220px]">
                    {name}
                  </span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const next = (attachments ?? []).filter((_, i) => i !== idx);
                      setValue("attachments", next);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          <div className="space-y-2">
            <FieldLabel>Add collaborators (optional)</FieldLabel>
            <input
              type="text"
              placeholder="Type a name or email and press Enter"
              className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = (e.currentTarget.value || "").trim();
                  if (!value) return;
                  const current = collaborators ?? [];
                  if (!current.includes(value)) {
                    setValue("collaborators", [...current, value]);
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
            {(collaborators ?? []).length > 0 && (
              <div className="space-y-2 mt-1">
                {(collaborators ?? []).map((name, idx) => (
                  <div
                    key={`${name}-${idx}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-muted" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                      aria-label={`Remove collaborator ${name}`}
                      onClick={() => {
                        const next = (collaborators ?? []).filter((_, i) => i !== idx);
                        setValue("collaborators", next);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-muted/20 px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="px-4 bg-orange-500 font-semibold text-black hover:bg-orange-600"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Sending…
                </>
              ) : (
                "Send request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

