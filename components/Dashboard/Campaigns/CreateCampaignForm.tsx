"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { campaignApi } from "@/lib/data/campaigns";
import { uploadPublicFileUrl } from "@/lib/data/uploads";
import { CreateCampaignDto } from "@/types/campaigns/campaignTypes";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ArrowLeft, Link2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const schema = z
  .object({
    title: z
      .string()
      .min(2, "Campaign name must be at least 2 characters")
      .max(200, "Campaign name must be 200 characters or less"),
    description: z
      .string()
      .max(2000, "Description must be 2000 characters or less")
      .optional()
      .or(z.literal("")),
    objectives: z
      .string()
      .max(500, "Objectives must be 500 characters or less")
      .optional()
      .or(z.literal("")),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^\d+(\.\d+)?$/.test(val),
        "Budget must be a valid number"
      )
      .refine(
        (val) => !val || Number(val) >= 0,
        "Budget must be zero or greater"
      ),
    promoting: z.string().max(1000, "Must be 1000 characters or less").optional().or(z.literal("")),
    targetAndTiming: z.string().max(1000, "Must be 1000 characters or less").optional().or(z.literal("")),
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

export default function CreateCampaignForm() {
  const attachmentInputId = "campaign-form-attachment-upload";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
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
      router.push(`/campaigns/${campaign?.id ?? ""}`);
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
      goals: data.objectives
        ? data.objectives.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
        : undefined,
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

  return (
    <div className="min-h-dvh safe-area-inset-bottom pb-8">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <Link
            href="/campaigns"
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Back to campaigns"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">Create campaign</h1>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 sm:py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Campaign details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Campaign name</FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. Summer Launch 2025"
                  className="min-h-12 touch-manipulation text-base"
                  autoComplete="off"
                  aria-invalid={!!errors.title}
                />
                <FieldError errors={errors.title ? [errors.title] : []} />
              </Field>
              <Field>
                <FieldLabel>Overview / description</FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Describe the campaign goals and approach..."
                  className="min-h-24 resize-y text-base"
                  aria-invalid={!!errors.description}
                />
                <FieldError errors={errors.description ? [errors.description] : []} />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field>
                  <FieldLabel>Objectives</FieldLabel>
                  <Input
                    {...register("objectives")}
                    placeholder="e.g. Brand awareness, Sales (comma-separated)"
                    className="min-h-12 text-base"
                    aria-invalid={!!errors.objectives}
                  />
                </Field>
                <Field>
                  <FieldLabel>Start date</FieldLabel>
                  <Input
                    {...register("startDate")}
                    type="date"
                    className="min-h-12 text-base"
                    aria-invalid={!!errors.startDate}
                  />
                </Field>
                <Field>
                  <FieldLabel>End date</FieldLabel>
                  <Input
                    {...register("endDate")}
                    type="date"
                    className="min-h-12 text-base"
                    aria-invalid={!!errors.endDate}
                  />
                  <FieldError errors={errors.endDate ? [errors.endDate] : []} />
                </Field>
                <Field>
                  <FieldLabel>Budget</FieldLabel>
                  <Input
                    {...register("budget")}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 200000"
                    className="min-h-12 text-base"
                    aria-invalid={!!errors.budget}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Attachments / media */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Attachments / media</CardTitle>
              <FieldDescription>
                Paste a public link, or upload images, videos, or documents (optional).
              </FieldDescription>
            </CardHeader>
            <CardContent>
              {attachmentUploadPending && (
                <div className="flex items-center gap-2 mb-3 text-sm text-orange-600 animate-pulse font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading attachments...
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Input
                  value={attachmentInputValue}
                  onChange={(e) => {
                    setAttachmentInputValue(e.target.value);
                    if (attachmentError) setAttachmentError(null);
                  }}
                  placeholder="Paste a URL (https://...)"
                  className="min-h-12 flex-1 text-base"
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
                    className="min-h-12 min-w-12 touch-manipulation"
                    aria-label="Add pasted URL to list"
                    onClick={() => addAttachmentUrl(attachmentInputValue)}
                  >
                    <Link2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  type="file"
                  multiple
                  className="min-h-11 border-border bg-background file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleAttachmentFiles}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Selected files: {attachmentUrls.length + pendingAttachments.length}
              </p>
              {attachmentError && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {attachmentError}
                </p>
              )}
              {attachmentUrls.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
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
                        onClick={() =>
                          {
                            setAttachmentUrls((prev) => prev.filter((_, j) => j !== i));
                            setAttachmentMeta((prev) => {
                              const next = { ...prev };
                              delete next[url];
                              return next;
                            });
                          }
                        }
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {pendingAttachments.length > 0 && (
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>

          {/* Job post (brand) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Job post (brand)</CardTitle>
              <FieldDescription>
                What are you promoting, and who is it for? This helps match creators.
              </FieldDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>What are you promoting?</FieldLabel>
                <Textarea
                  {...register("promoting")}
                  placeholder="Product, event, or message you want to promote..."
                  className="min-h-20 resize-y text-base"
                  aria-invalid={!!errors.promoting}
                />
                <FieldError errors={errors.promoting ? [errors.promoting] : []} />
              </Field>
              <Field>
                <FieldLabel>Who is it for / when do they need it?</FieldLabel>
                <Textarea
                  {...register("targetAndTiming")}
                  placeholder="Target audience and deadline..."
                  className="min-h-20 resize-y text-base"
                  aria-invalid={!!errors.targetAndTiming}
                />
                <FieldError errors={errors.targetAndTiming ? [errors.targetAndTiming] : []} />
              </Field>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse sm:gap-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || attachmentUploadPending}
              className="min-h-12 flex-1 touch-manipulation text-base font-medium sm:flex-none sm:px-8"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create campaign"
              )}
            </Button>
            <Link href="/campaigns" className="block sm:inline-block">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full touch-manipulation sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
