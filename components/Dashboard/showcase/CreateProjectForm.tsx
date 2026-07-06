"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
// Card components removed as they are unused
import { projectsApi } from "@/lib/data/projects";
import { campaignApi } from "@/lib/data/campaigns";
import { uploadPublicFileUrl } from "@/lib/data/uploads";
import { canManageCampaign } from "@/lib/campaignPermissions";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ArrowLeft, Loader2, Link as LinkIcon, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
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

interface CreateProjectFormProps {
  initialCampaignId?: number | null;
  onClose?: () => void;
  mode?: "page" | "embedded";
}

export default function CreateProjectForm({ initialCampaignId, onClose, mode = "page" }: CreateProjectFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const warnedCampaignPermissionRef = useRef(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaInputValue, setMediaInputValue] = useState("");
  const [mediaUrlError, setMediaUrlError] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [collaboratorEmailInput, setCollaboratorEmailInput] = useState("");
  const [collaboratorEmails, setCollaboratorEmails] = useState<string[]>([]);
  const [collaboratorEmailError, setCollaboratorEmailError] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState<number | null>(null);
  const [selectedCategory] = useState<string | null>(null);
  const [selectedSubCategory] = useState<string | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | undefined>();
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [objectiveDescription, setObjectiveDescription] = useState("");
  const [objectiveExtraDescription1, setObjectiveExtraDescription1] = useState("");
  const [objectiveExtraDescription2, setObjectiveExtraDescription2] = useState("");
  const [objectiveTarget1, setObjectiveTarget1] = useState("");
  const [objectiveTarget2, setObjectiveTarget2] = useState("");
  const [objectiveStart, setObjectiveStart] = useState("");
  const [objectiveEnd, setObjectiveEnd] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const campaignIdFromQuery = searchParams.get("campaignId") ?? undefined;
  const campaignId = mode === "embedded"
    ? (initialCampaignId ?? undefined)?.toString()
    : campaignIdFromQuery ?? (initialCampaignId ?? undefined)?.toString();

  const linkCampaignNumericId = useMemo(() => {
    const raw = String(campaignId ?? "").trim();
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [campaignId]);

  const { data: linkedCampaignForPermission, isLoading: linkedCampaignPermissionLoading } = useQuery({
    queryKey: ["campaign", linkCampaignNumericId],
    queryFn: () => campaignApi.getById(linkCampaignNumericId!),
    enabled: linkCampaignNumericId != null,
  });

  const mayLinkSelectedCampaign = useMemo(() => {
    if (!linkCampaignNumericId) return true;
    if (!linkedCampaignForPermission || !user?.id) return false;
    return canManageCampaign(linkedCampaignForPermission, {
      userId: String(user.id).trim(),
      emailLower: String(user.email ?? "").trim().toLowerCase(),
    });
  }, [linkCampaignNumericId, linkedCampaignForPermission, user]);

  useEffect(() => {
    if (
      !linkCampaignNumericId ||
      linkedCampaignPermissionLoading ||
      !linkedCampaignForPermission ||
      !user?.id
    ) {
      return;
    }
    if (!mayLinkSelectedCampaign && !warnedCampaignPermissionRef.current) {
      warnedCampaignPermissionRef.current = true;
      toast.error(
        "You can only link a showcase project to campaigns you own. This project will be created without that campaign link."
      );
    }
  }, [
    linkCampaignNumericId,
    linkedCampaignPermissionLoading,
    linkedCampaignForPermission,
    user?.id,
    mayLinkSelectedCampaign,
  ]);

  useEffect(() => {
    if (campaignId && initialCampaignId) {
      setWizardStep(1);
    }
  }, [campaignId, initialCampaignId]);

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };
  const isValidEmail = (s: string) => z.string().email().safeParse(s).success;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", category: "", location: "" },
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: async (project) => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
      queryClient.refetchQueries({ queryKey: ["creator-projects"] });
      const p = project as { id?: string | number; _id?: string };
      const id = p?.id != null ? String(p.id) : p?._id ?? undefined;
      setCreatedProjectId(id);
      if (id && collaboratorEmails.length > 0) {
        const settled = await Promise.allSettled(
          collaboratorEmails.map((email) =>
            projectsApi.inviteMember(id, {
              email,
            })
          )
        );
        const successCount = settled.filter((r) => r.status === "fulfilled").length;
        const failedCount = settled.length - successCount;
        if (successCount > 0) {
          toast.success(
            `${successCount} collaborator invite${successCount === 1 ? "" : "s"} sent`
          );
        }
        if (failedCount > 0) {
          toast.error(
            `${failedCount} invite${failedCount === 1 ? "" : "s"} could not be sent`
          );
        }
      }
      setWizardStep(5);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Failed to create project");
    },
  });

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
  const addCollaboratorEmail = () => {
    const email = collaboratorEmailInput.trim().toLowerCase();
    if (!email) {
      setCollaboratorEmailError(null);
      return;
    }
    if (!isValidEmail(email)) {
      setCollaboratorEmailError("Please enter a valid email address");
      return;
    }
    if (collaboratorEmails.includes(email)) {
      setCollaboratorEmailError("This email has already been added");
      return;
    }
    setCollaboratorEmailError(null);
    setCollaboratorEmails((prev) => [...prev, email]);
    setCollaboratorEmailInput("");
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
      setMediaUrls((prev) => [...prev, ...uploaded]);
      toast.success("File upload complete");
    } catch {
      toast.error("Could not upload one or more files");
    } finally {
      setUploadingFiles(false);
      setFileInputKey((k) => k + 1);
    }
  };

  const onSubmit = (data: FormData) => {
    const formCategory = data.category?.trim();
    const sourceCampaignId =
      linkCampaignNumericId != null
        ? mayLinkSelectedCampaign && !linkedCampaignPermissionLoading
          ? campaignId
          : undefined
        : campaignId;
    createMutation.mutate({
      title: data.title,
      description: data.description || undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      taggedCollaboratorIds: [],
      taggedBrandIds: [],
      goals: goals.length > 0 ? goals : undefined,
      category: formCategory || selectedSubCategory || selectedCategory || undefined,
      subCategory: selectedSubCategory || undefined,
      location: data.location?.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      sourceCampaignId,
    });
  };

  const handleDetailsContinue = () => {
    // Validate title/description before moving to next step
    handleSubmit(() => {
      setWizardStep(2);
    })();
  };

  return (
    <div className="min-h-dvh safe-area-inset-bottom pb-8">
      {mode === "page" && (
        <>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <Link
            href="/showcase"
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Back to showcase"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">Create project</h1>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 sm:py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ProjectFormSections
            register={register as UseFormRegister<ProjectFormBaseData>}
            errors={errors as FieldErrors<ProjectFormBaseData>}
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
          />

          <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse sm:gap-4">
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                (linkCampaignNumericId != null && linkedCampaignPermissionLoading)
              }
              className="min-h-12 flex-1 touch-manipulation text-base font-medium sm:flex-none sm:px-8"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create project"
              )}
            </Button>
            <Link href="/showcase" className="block sm:inline-block">
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
        </>
      )}

      {wizardStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#1b100c] text-white p-6 sm:p-8 shadow-2xl">
            {onClose && (
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setWizardStep(null);
                  onClose?.();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Simple stepper dots (5 steps: name/describe → collaborate → goals → attach → success) */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-6 rounded-full bg-zinc-700",
                    wizardStep === i && "bg-orange-500"
                  )}
                />
              ))}
            </div>

            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Name & Describe your Project
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    And don&apos;t worry, you can edit this later too.
                  </p>
                </div>

                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Project Name</FieldLabel>
                    <Input
                      {...register("title")}
                      placeholder="Project name"
                      className="h-11 bg-zinc-900/60 border-zinc-700"
                      aria-invalid={!!errors.title}
                    />
                    <FieldError errors={errors.title ? [errors.title] : []} />
                  </Field>

                  <Field>
                    <FieldLabel>Describe your project</FieldLabel>
                    <Textarea
                      {...register("description")}
                      placeholder="Describe your project"
                      className="min-h-24 bg-zinc-900/60 border-zinc-700"
                      aria-invalid={!!errors.description}
                    />
                  </Field>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    className="min-w-[140px] bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={handleDetailsContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Looking to Collaborate
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select what type of engagement you would like from the community.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Add collaborators</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-300 hover:bg-orange-500/10"
                      onClick={addCollaboratorEmail}
                    >
                      Add email
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      value={collaboratorEmailInput}
                      onChange={(e) => {
                        setCollaboratorEmailInput(e.target.value);
                        if (collaboratorEmailError) setCollaboratorEmailError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCollaboratorEmail();
                        }
                      }}
                      placeholder="Enter collaborator email"
                      className="h-11 bg-zinc-900/60 border-zinc-700"
                    />
                    {collaboratorEmailError ? (
                      <p className="text-xs text-destructive">{collaboratorEmailError}</p>
                    ) : null}
                    {collaboratorEmails.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {collaboratorEmails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-200"
                          >
                            <span className="max-w-[190px] truncate">{email}</span>
                            <button
                              type="button"
                              className="text-zinc-400 hover:text-red-400"
                              onClick={() =>
                                setCollaboratorEmails((prev) =>
                                  prev.filter((item) => item !== email)
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Add by email now. Invites will be sent automatically after the project is created.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setWizardStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="min-w-[140px] bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={() => setWizardStep(3)}
                  >
                    Continue
                  </Button>
                </div>
                </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">Goals</h2>
                  <p className="text-sm text-muted-foreground">
                    What do you want to accomplish?
                  </p>
                </div>

                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Describe</FieldLabel>
                    <Textarea
                      placeholder="Describe what you want to accomplish"
                      className="min-h-24 bg-zinc-900/60 border-zinc-700"
                      value={goals[0] ?? ""}
                      onChange={(e) => {
                        const first = e.target.value;
                        setGoals((prev) => {
                          const next = [...prev];
                          next[0] = first;
                          return next;
                        });
                      }}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Timeframe start</FieldLabel>
                      <Input
                        type="date"
                        className="h-11 bg-zinc-900/60 border-zinc-700"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Timeframe end</FieldLabel>
                      <Input
                        type="date"
                        className="h-11 bg-zinc-900/60 border-zinc-700"
                      />
                    </Field>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium">Objectives</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-300 hover:bg-orange-500/10"
                      onClick={() => setShowObjectiveModal(true)}
                    >
                      + Add Objective
                    </Button>
                  </div>
                  {goals.length > 1 && (
                    <div className="mt-3 space-y-2">
                      {goals.slice(1).map((g, i) => (
                        <div
                          key={i}
                          className="rounded-md border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-sm text-muted-foreground"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="leading-snug">{g}</p>
                            <button
                              type="button"
                              className="text-[11px] text-zinc-500 hover:text-red-400"
                              onClick={() =>
                                setGoals((prev) => prev.filter((_, idx) => idx !== i + 1))
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                 <div className="mt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setWizardStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="min-w-[140px] bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={() => setWizardStep(4)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Next, Attach Your Work
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                    A good title helps you post stand out to the right candidates. It&apos;s the first thing they see, make it good.
                  </p>
                </div>

                <div className="space-y-4">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-black/40 px-6 py-16 text-center transition-colors",
                      uploadingFiles && "opacity-80"
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files ?? []);
                      void handleFilesSelected(files);
                    }}
                  >
                    <div>
                      <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-300">
                        ↑
                      </div>
                      <p className="text-sm font-medium">Drag And Drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or{" "}
                        <button
                          type="button"
                          className="text-orange-400 hover:underline"
                          onClick={() => {
                            const input = document.getElementById(
                              "project-work-file-input"
                            ) as HTMLInputElement | null;
                            input?.click();
                          }}
                          disabled={uploadingFiles}
                        >
                          browse
                        </button>{" "}
                        your file to upload
                      </p>
                      <input
                        key={fileInputKey}
                        id="project-work-file-input"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          void handleFilesSelected(files);
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    {uploadingFiles
                      ? "Uploading files..."
                      : "PDF, JPG, DOCX or JPEG are allowed. Not more than 2GB."}
                  </p>

                  <Field>
                    <FieldLabel>Add Links</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        value={mediaInputValue}
                        onChange={(e) => {
                          setMediaInputValue(e.target.value);
                          if (mediaUrlError) setMediaUrlError(null);
                        }}
                        placeholder="Can include website links"
                        className="h-11 bg-zinc-900/60 border-zinc-700"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMediaUrl())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 border-orange-500 text-orange-300 hover:bg-orange-500/10"
                        aria-label="Add media link"
                        onClick={addMediaUrl}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {mediaUrlError && (
                      <p className="mt-1 text-xs text-destructive" role="alert">
                        {mediaUrlError}
                      </p>
                    )}
                    {mediaUrls.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {mediaUrls.map((url, i) => (
                          <li key={i} className="flex items-center justify-between gap-2">
                            <span className="truncate">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-destructive hover:text-destructive"
                              onClick={() =>
                                setMediaUrls((prev) => prev.filter((_, j) => j !== i))
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Field>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setWizardStep(3)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                     Back
                  </Button>
                  <Button
                    type="button"
                    disabled={
                      createMutation.isPending ||
                      uploadingFiles ||
                      (linkCampaignNumericId != null && linkedCampaignPermissionLoading)
                    }
                    className="min-w-[160px] bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={() => handleSubmit(onSubmit)()}
                  >
                    {createMutation.isPending || uploadingFiles ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadingFiles ? "Uploading..." : "Launching…"}
                      </>
                    ) : (
                      "Launch Project"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="space-y-6 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-emerald-400">
                  Success!
                </h2>
                <p className="text-sm text-emerald-300">
                  Your project was created successfully.
                </p>
                <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    type="button"
                    className="bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={() => {
                      if (createdProjectId) {
                        router.push(`/showcase?project=${createdProjectId}`);
                      } else {
                        router.push("/showcase");
                      }
                      onClose?.();
                    }}
                  >
                    View project
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setWizardStep(null);
                      onClose?.();
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showObjectiveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#1b100c] text-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              onClick={() => setShowObjectiveModal(false)}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold">Create Objective</h2>
                <p className="text-sm text-muted-foreground">
                  Select what type of engagement you would like from the community.
                </p>
              </div>

              <div className="space-y-4">
                <Field>
                  <FieldLabel>What do you want to accomplish?</FieldLabel>
                  <Textarea
                    placeholder="Describe"
                    className="min-h-24 bg-zinc-900/60 border-zinc-700"
                    value={objectiveDescription}
                    onChange={(e) => setObjectiveDescription(e.target.value)}
                  />
                </Field>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Set targets</p>

                  <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                    <Field>
                      <FieldLabel className="sr-only">Target description</FieldLabel>
                      <Input
                        placeholder="Add Description (optional)"
                        className="h-10 bg-zinc-900/60 border-zinc-700 text-sm"
                        value={objectiveExtraDescription1}
                        onChange={(e) => setObjectiveExtraDescription1(e.target.value)}
                      />
                    </Field>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-400">+ number</span>
                      <Input
                        placeholder="Target reach"
                        className="h-10 w-28 bg-zinc-900/60 border-zinc-700 text-xs"
                        value={objectiveTarget1}
                        onChange={(e) => setObjectiveTarget1(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                    <Field>
                      <FieldLabel className="sr-only">Secondary target description</FieldLabel>
                      <Input
                        placeholder="Add Description (optional)"
                        className="h-10 bg-zinc-900/60 border-zinc-700 text-sm"
                        value={objectiveExtraDescription2}
                        onChange={(e) => setObjectiveExtraDescription2(e.target.value)}
                      />
                    </Field>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-400">+ number</span>
                      <Input
                        placeholder="Target reach"
                        className="h-10 w-28 bg-zinc-900/60 border-zinc-700 text-xs"
                        value={objectiveTarget2}
                        onChange={(e) => setObjectiveTarget2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium">Timeframe</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Start</FieldLabel>
                      <Input
                        type="date"
                        className="h-11 bg-zinc-900/60 border-zinc-700"
                        value={objectiveStart}
                        onChange={(e) => setObjectiveStart(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>End</FieldLabel>
                      <Input
                        type="date"
                        className="h-11 bg-zinc-900/60 border-zinc-700"
                        value={objectiveEnd}
                        onChange={(e) => setObjectiveEnd(e.target.value)}
                      />
                    </Field>
                  </div>
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  To create a project, you are required to provide your location, age, national ID, banking and tax
                  information, email and mailing address. This information is important to prevent fraud, comply with
                  the law and – if your project is successful – to deliver funds. Please note, after launch, your
                  ability to edit, hide or delete a project will be limited.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto border-orange-500 text-orange-300 hover:bg-orange-500/10"
                    onClick={() => {
                      const summary = [
                        objectiveDescription,
                        objectiveExtraDescription1 && `Target 1: ${objectiveExtraDescription1} (${objectiveTarget1})`,
                        objectiveExtraDescription2 && `Target 2: ${objectiveExtraDescription2} (${objectiveTarget2})`,
                        objectiveStart && objectiveEnd && `Timeframe: ${objectiveStart} → ${objectiveEnd}`,
                      ]
                        .filter(Boolean)
                        .join(" • ");
                      if (summary) {
                        setGoals((prev) => [...prev, summary]);
                      }
                      setObjectiveDescription("");
                      setObjectiveExtraDescription1("");
                      setObjectiveExtraDescription2("");
                      setObjectiveTarget1("");
                      setObjectiveTarget2("");
                      setObjectiveStart("");
                      setObjectiveEnd("");
                    }}
                  >
                    + Add Objective
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-40 bg-orange-500 text-black hover:bg-orange-500/90"
                    onClick={() => {
                      const summary = [
                        objectiveDescription,
                        objectiveExtraDescription1 && `Target 1: ${objectiveExtraDescription1} (${objectiveTarget1})`,
                        objectiveExtraDescription2 && `Target 2: ${objectiveExtraDescription2} (${objectiveTarget2})`,
                        objectiveStart && objectiveEnd && `Timeframe: ${objectiveStart} → ${objectiveEnd}`,
                      ]
                        .filter(Boolean)
                        .join(" • ");
                      if (summary) {
                        setGoals((prev) => [...prev, summary]);
                      }
                      setShowObjectiveModal(false);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

