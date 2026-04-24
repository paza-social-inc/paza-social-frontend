"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { campaignApi } from "@/lib/data/campaigns";
import { uploadPublicFileUrl } from "@/lib/data/uploads";
import { CreateCampaignDto } from "@/types/campaigns/campaignTypes";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ArrowLeft, ArrowRight, Link2, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const TOTAL_STEPS = 4;

const schema = z
  .object({
    title: z.string().min(2, "Campaign name must be at least 2 characters").max(200, "Campaign name must be 200 characters or less"),
    description: z.string().max(2000).optional().or(z.literal("")),
    objectives: z.string().max(500).optional().or(z.literal("")),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || /^\d+(\.\d+)?$/.test(val), "Budget must be a valid number")
      .refine((val) => !val || Number(val) >= 0, "Budget must be zero or greater"),
    promoting: z.string().max(1000).optional().or(z.literal("")),
    targetAndTiming: z.string().max(1000).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const start = data.startDate;
      const end = data.endDate;
      if (!start || !end) return true;
      return new Date(end) >= new Date(start);
    },
    { message: "End date must be on or after start date", path: ["endDate"] }
  );

type FormData = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormData)[][] = [
  ["title", "description", "objectives"],
  ["startDate", "endDate", "budget"],
  [],
  ["promoting", "targetAndTiming"],
];

const STEP_META: { title: string; description: string }[] = [
  { title: "Campaign details", description: "Name your campaign and set the main goals." },
  { title: "Timeline & budget", description: "When it runs and how much you're investing." },
  { title: "Attachments", description: "Add briefs or reference links (optional)." },
  { title: "Confirm your details", description: "Last step for your campaign launch, almost done!" },
];

export interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (campaign: { id?: number | string; title?: string }) => void;
  redirectOnSuccess?: boolean;
}

export function CreateCampaignModal({
  open,
  onOpenChange,
  onCreated,
  redirectOnSuccess = true,
}: CreateCampaignModalProps) {
  const attachmentInputId = "campaign-modal-attachment-upload";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [attachmentMeta, setAttachmentMeta] = useState<
    Record<string, { name: string; isImage: boolean }>
  >({});
  const [attachmentInputValue, setAttachmentInputValue] = useState("");
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [attachmentUploadPending, setAttachmentUploadPending] = useState(false);
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<
    Array<{
      id: string;
      name: string;
      previewUrl: string | null;
      uploadedUrl?: string;
      isImage: boolean;
      status: "uploading" | "uploaded" | "failed";
    }>
  >([]);

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const addAttachmentUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setAttachmentError(null);
      return;
    }
    if (!isValidUrl(trimmed)) {
      setAttachmentError("Please enter a valid URL (e.g. https://...)");
      return;
    }
    setAttachmentError(null);
    setAttachmentUrls((prev) => [...prev, trimmed]);
    setAttachmentMeta((prev) => ({
      ...prev,
      [trimmed]: {
        name: (() => {
          try {
            const pathname = new URL(trimmed).pathname;
            const last = pathname.split("/").filter(Boolean).pop();
            return decodeURIComponent(last || "Link attachment");
          } catch {
            return "Link attachment";
          }
        })(),
        isImage: /\.(png|jpe?g|gif|webp|svg)$/i.test(trimmed),
      },
    }));
    setAttachmentInputValue("");
  };

  const handleAttachmentFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;
    if (!fileList?.length) return;
    const selectedFiles = Array.from(fileList);
    e.currentTarget.value = "";
    setAttachmentUploadPending(true);
    try {
      const picked = selectedFiles.map((file, idx) => {
        const isImage = file.type.startsWith("image/");
        return {
          id: `${Date.now()}-${idx}-${file.name}`,
          name: file.name,
          previewUrl: isImage ? URL.createObjectURL(file) : null,
          isImage,
          file,
          status: "uploading" as const,
        };
      });
      setPendingAttachments((prev) => [...prev, ...picked]);

      const urls: string[] = [];
      for (const item of picked) {
        try {
          const uploadedUrl = await uploadPublicFileUrl(item.file);
          urls.push(uploadedUrl);
          setAttachmentMeta((prev) => ({
            ...prev,
            [uploadedUrl]: {
              name: item.name,
              isImage: item.isImage,
            },
          }));
          setPendingAttachments((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, uploadedUrl, status: "uploaded" }
                : p
            )
          );
        } catch {
          setPendingAttachments((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: "failed" } : p))
          );
        }
      }
      setAttachmentUrls((prev) => [...prev, ...urls]);
      setPendingAttachments((prev) => {
        prev.forEach((p) => {
          if (p.status === "uploaded" && p.previewUrl) URL.revokeObjectURL(p.previewUrl);
        });
        return prev.filter((p) => p.status !== "uploaded");
      });
      toast.success(urls.length === 1 ? "Attachment uploaded" : `${urls.length} attachments uploaded`);
    } catch (err: unknown) {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        (err as Error)?.message ||
        "Failed to upload attachment";
      toast.error(msg);
    } finally {
      setAttachmentUploadPending(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      objectives: "",
      startDate: "",
      endDate: "",
      budget: "",
      promoting: "",
      targetAndTiming: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCampaignDto) => campaignApi.create(data),
    onSuccess: (campaign) => {
      toast.success("Campaign created successfully");
      void queryClient.invalidateQueries({
        queryKey: ["campaigns"],
        refetchType: "all",
      });
      reset();
      setStep(1);
      setAttachmentUrls([]);
      setAttachmentMeta({});
      pendingAttachments.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      setPendingAttachments([]);
      setAttachmentInputValue("");
      onOpenChange(false);
      onCreated?.(campaign ?? {});
      const id = campaign?.id;
      if (redirectOnSuccess && id != null) router.push(`/campaigns/${id}`);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Failed to create campaign");
    },
  });

  const onSubmit = (data: FormData) => {
    const payload: CreateCampaignDto = {
      title: data.title,
      description: data.description || undefined,
      goals: data.objectives ? data.objectives.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : undefined,
      createdby: user?.email || user?.id || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      budget: data.budget ? Number(data.budget) || data.budget : undefined,
      promoting: data.promoting || undefined,
      targetAndTiming: data.targetAndTiming || undefined,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
    };
    createMutation.mutate(payload);
  };

  const handleNext = async () => {
    const fields = STEP_FIELDS[step - 1];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleCancel = () => {
    reset();
    setStep(1);
    setAttachmentUrls([]);
    setAttachmentMeta({});
    pendingAttachments.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    setPendingAttachments([]);
    setAttachmentInputValue("");
    setAttachmentError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
      setStep(1);
      setAttachmentUrls([]);
      setAttachmentMeta({});
      pendingAttachments.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      setPendingAttachments([]);
      setAttachmentInputValue("");
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90dvh] overflow-hidden flex flex-col p-0 gap-0",
          "rounded-xl border-border bg-card"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Create campaign</DialogTitle>

        {/* Numbered circle stepper with connecting lines */}
        <div className="flex items-center justify-center gap-0 border-b border-border px-4 py-5 sm:px-6 shrink-0">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <React.Fragment key={i}>
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card",
                    !isCompleted && !isCurrent && "border-2 border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={isCompleted ? `Step ${stepNum} completed` : `Step ${stepNum}`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      "h-0.5 min-w-[20px] flex-1 max-w-[40px] sm:max-w-[56px] transition-colors",
                      stepNum < step ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} id="create-campaign-modal-form" className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            {/* Step title and description */}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground">
                {STEP_META[step - 1].title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {STEP_META[step - 1].description}
              </p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel>Campaign name *</FieldLabel>
                  <Input
                    {...register("title")}
                    placeholder="e.g. Summer Launch 2025"
                    className="min-h-11 border-border bg-background"
                    autoComplete="off"
                    aria-invalid={!!errors.title}
                  />
                  <FieldError>{errors.title?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Overview / description</FieldLabel>
                  <Textarea
                    {...register("description")}
                    placeholder="Describe the campaign goals and approach..."
                    className="min-h-20 resize-y border-border bg-background"
                    aria-invalid={!!errors.description}
                  />
                  <FieldError>{errors.description?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Objectives</FieldLabel>
                  <Input
                    {...register("objectives")}
                    placeholder="e.g. Brand awareness, Sales (comma-separated)"
                    className="min-h-11 border-border bg-background"
                    aria-invalid={!!errors.objectives}
                  />
                  <FieldError>{errors.objectives?.message}</FieldError>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel>Start date</FieldLabel>
                  <Input
                    {...register("startDate")}
                    type="date"
                    className="min-h-11 border-border bg-background"
                    aria-invalid={!!errors.startDate}
                  />
                </Field>
                <Field>
                  <FieldLabel>End date</FieldLabel>
                  <Input
                    {...register("endDate")}
                    type="date"
                    className="min-h-11 border-border bg-background"
                    aria-invalid={!!errors.endDate}
                  />
                  <FieldError>{errors.endDate?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Budget</FieldLabel>
                  <Input
                    {...register("budget")}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 200000"
                    className="min-h-11 border-border bg-background"
                    aria-invalid={!!errors.budget}
                  />
                  <FieldError>{errors.budget?.message}</FieldError>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FieldLabel>Attachments / media</FieldLabel>
                <FieldDescription>
                  Paste a public link, or upload images, videos, or documents (optional).
                </FieldDescription>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Input
                    value={attachmentInputValue}
                    onChange={(e) => {
                      setAttachmentInputValue(e.target.value);
                      if (attachmentError) setAttachmentError(null);
                    }}
                    placeholder="Paste a URL (https://...)"
                    className="min-h-11 flex-1 border-border bg-background"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAttachmentUrl(attachmentInputValue);
                      }
                    }}
                  />
                  <input
                    id={attachmentInputId}
                    ref={attachmentFileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleAttachmentFiles}
                  />
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="min-h-11 min-w-11"
                      aria-label="Add pasted URL to list"
                      onClick={() => addAttachmentUrl(attachmentInputValue)}
                    >
                      <Link2 className="h-5 w-5" />
                    </Button>
                    <Button
                      asChild
                      type="button"
                      variant="outline"
                      size="icon"
                      className="min-h-11 min-w-11"
                      aria-label="Upload files from your device"
                      disabled={attachmentUploadPending}
                    >
                      <label htmlFor={attachmentInputId}>
                        {attachmentUploadPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Upload className="h-5 w-5" />
                        )}
                      </label>
                    </Button>
                  </div>
                </div>
                <div>
                  <Input
                    type="file"
                    multiple
                    className="min-h-11 border-border bg-background file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleAttachmentFiles}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected files: {attachmentUrls.length + pendingAttachments.length}
                </p>
                {attachmentError && (
                  <p className="text-sm text-destructive" role="alert">{attachmentError}</p>
                )}
                {attachmentUrls.length > 0 && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {attachmentUrls.map((url, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 p-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {attachmentMeta[url]?.isImage ? (
                            <Image
                              src={url}
                              alt={attachmentMeta[url]?.name ?? "Attachment preview"}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded border border-border text-xs">File</div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-foreground">{attachmentMeta[url]?.name ?? url}</p>
                            <p className="truncate text-xs">{url}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            setAttachmentUrls((prev) => prev.filter((_, j) => j !== i));
                            setAttachmentMeta((prev) => {
                              const next = { ...prev };
                              delete next[url];
                              return next;
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                {pendingAttachments.length > 0 && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pendingAttachments.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 p-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {item.isImage && item.previewUrl ? (
                            <Image
                              src={item.previewUrl}
                              alt={item.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded border border-border text-xs">File</div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-foreground">{item.name}</p>
                            <p className="truncate text-xs">
                              {item.status === "uploading"
                                ? "Uploading..."
                                : item.status === "uploaded"
                                  ? "Uploaded"
                                  : "Upload failed"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <FieldLabel>Job post (brand)</FieldLabel>
                <FieldDescription>What are you promoting, and who is it for? This helps match creators.</FieldDescription>
                <Field>
                  <FieldLabel>What are you promoting?</FieldLabel>
                  <Textarea
                    {...register("promoting")}
                    placeholder="Product, event, or message you want to promote..."
                    className="min-h-20 resize-y border-border bg-background"
                    aria-invalid={!!errors.promoting}
                  />
                  <FieldError>{errors.promoting?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel>Who is it for / when do they need it?</FieldLabel>
                  <Textarea
                    {...register("targetAndTiming")}
                    placeholder="Target audience and deadline..."
                    className="min-h-20 resize-y border-border bg-background"
                    aria-invalid={!!errors.targetAndTiming}
                  />
                  <FieldError>{errors.targetAndTiming?.message}</FieldError>
                </Field>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 shrink-0 bg-muted/20">
            <div>
              {step > 1 ? (
                <Button type="button" variant="outline" className="border-border" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
            {step < TOTAL_STEPS ? (
              <Button type="button" onClick={handleNext} className="bg-primary text-primary-foreground hover:opacity-90">
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                form="create-campaign-modal-form"
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Launching…
                  </>
                ) : (
                  "Launch Campaign"
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
