"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobsApi } from "@/lib/data/jobs";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { JobCreateRequest } from "@/types/jobs/jobTypes";
import {
  JobCollaboratorsField,
  type JobCollaboratorPick,
} from "@/components/Dashboard/Jobs/JobCollaboratorsField";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const CREATOR_TYPES = ["Micro-influencer", "Mid-tier", "Macro", "Nano", "Any"];

const BUDGET_OPTIONS = [
  "Open to Bids",
  "$500 - $1,000",
  "$1,000 - $2,000",
  "$2,000 - $5,000",
  "$5,000+",
];

const schema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(200, "Title must be 200 characters or less"),
    description: z.string().max(2000).optional().or(z.literal("")),
    budgetRange: z.string().optional(),
    timelineStart: z.string().optional(),
    timelineEnd: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = data.timelineStart;
      const end = data.timelineEnd;
      if (!start || !end) return true;
      return new Date(end) >= new Date(start);
    },
    {
      message: "End date must be on or after start date",
      path: ["timelineEnd"],
    },
  );

type FormData = z.infer<typeof schema>;

export interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: link this job to an existing campaign */
  campaignId?: number;
  campaignTitle?: string;
}

export function CreateJobModal({
  open,
  onOpenChange,
  campaignId,
  campaignTitle,
}: CreateJobModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [deliverablesText, setDeliverablesText] = useState<string>("");
  const [creatorType, setCreatorType] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [collaborators, setCollaborators] = useState<JobCollaboratorPick[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      budgetRange: "",
      timelineStart: "",
      timelineEnd: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: JobCreateRequest) => jobsApi.create(data),
    onSuccess: (job: unknown) => {
      toast.success("Job created successfully");
      queryClient.invalidateQueries({ queryKey: ["user-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["all-user-jobs-stats"] });
      reset();
      setDeliverablesText("");
      setCreatorType("");
      setBudgetRange("");
      setCollaborators([]);
      onOpenChange(false);
      const j = job as { id?: number; _id?: string };
      const id = j?.id ?? j?._id;
      if (id != null) router.push(`/jobs/${id}`);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Failed to create job");
    },
  });

  const parseDeliverablesText = (text: string): string[] => {
    return text
      .split(/[,\\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const onSubmit = (data: FormData) => {
    if (!user?.id) {
      toast.error("You must be logged in to create a job");
      return;
    }
    const parsedDeliverables = parseDeliverablesText(deliverablesText);
    if (parsedDeliverables.length === 0) {
      toast.error("Please enter at least one deliverable");
      return;
    }

    // Backend requires at least one goal and one skill; derive them from form fields
    const goals =
      parsedDeliverables.length > 0 ? parsedDeliverables : [data.title];
    const skills: string[] = [];
    if (creatorType) skills.push(creatorType);

    const payload: JobCreateRequest = {
      owner: String(user.id),
      values: {
        title: data.title,
        // If description is empty, fall back to deliverables as a detailed description
        description:
          data.description || parsedDeliverables.join(", ") || undefined,
        deliverables: parsedDeliverables,
        creatorType: creatorType || undefined,
        startDate: data.timelineStart || undefined,
        endDate: data.timelineEnd || undefined,
        payment: data.budgetRange || undefined,
        paymentdesc:
          data.budgetRange === "Open to Bids" ? "Open to Bids" : undefined,
        category: creatorType || undefined,
        campaignId,
        campaignTitle: campaignTitle || undefined,
      },
      goals,
      skills: skills.length > 0 ? skills : ["Content creation"],
      contents: parsedDeliverables,
      platforms: [],
      ...(collaborators.some((c) => c.id != null)
        ? {
            collaboratorIds: collaborators
              .map((c) => c.id)
              .filter((id): id is number => id != null),
          }
        : {}),
      ...(collaborators.some((c) => c.id == null && c.email)
        ? {
            collaboratorEmails: collaborators
              .filter((c) => c.id == null && c.email)
              .map((c) => c.email as string),
          }
        : {}),
    };
    createMutation.mutate(payload);
  };

  const handleCancel = () => {
    reset();
    setDeliverablesText("");
    setCreatorType("");
    setBudgetRange("");
    setCollaborators([]);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
      setDeliverablesText("");
      setCreatorType("");
      setBudgetRange("");
      setCollaborators([]);
    }
    onOpenChange(next);
  };

  const ownerNumericId = Number(user?.id);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90dvh] overflow-hidden flex flex-col p-0 gap-0",
          "rounded-xl border-border bg-card",
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Create job</DialogTitle>

        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground touch-manipulation"
            aria-label="Close"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-lg font-semibold truncate">Create job</h2>
            {campaignTitle && (
              <p className="text-xs text-muted-foreground truncate">
                For campaign:{" "}
                <span className="font-medium text-foreground">
                  {campaignTitle}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            id="create-job-modal-form"
          >
            <div className="space-y-4">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. Social content for product launch"
                  className="min-h-11 border-border bg-background"
                  autoComplete="off"
                  aria-invalid={!!errors.title}
                />
                <FieldError errors={errors.title ? [errors.title] : []} />
              </Field>
              <Field>
                <FieldLabel>Description (optional)</FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="What should the creator deliver? Any guidelines..."
                  className="min-h-20 resize-y border-border bg-background"
                  aria-invalid={!!errors.description}
                />
              </Field>
            </div>

            <div>
              <FieldLabel className="mb-2 block">Deliverables</FieldLabel>
              <FieldDescription className="mb-2">
                Enter deliverables separated by commas or new lines.
                <br />
                <span className="text-muted-foreground">
                  Example: 1x Video Review, 2x Stories
                </span>
              </FieldDescription>
              <Textarea
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                placeholder="Type deliverables..."
                rows={5}
                className="min-h-24 resize-y border-border bg-background"
              />
              {deliverablesText.trim().length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Parsed {parseDeliverablesText(deliverablesText).length}{" "}
                  deliverable
                  {parseDeliverablesText(deliverablesText).length === 1
                    ? ""
                    : "s"}
                  .
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Creator type</FieldLabel>
                <Select value={creatorType} onValueChange={setCreatorType}>
                  <SelectTrigger className="min-h-11 w-full border-border bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREATOR_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Budget range</FieldLabel>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger className="min-h-11 w-full border-border bg-background">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {Number.isFinite(ownerNumericId) && ownerNumericId > 0 && (
              <div className="rounded-lg border border-border bg-muted/10 p-4">
                <JobCollaboratorsField
                  ownerUserId={ownerNumericId}
                  value={collaborators}
                  onChange={setCollaborators}
                  campaignId={campaignId}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Start date</FieldLabel>
                <Input
                  {...register("timelineStart")}
                  type="date"
                  className="min-h-11 border-border bg-background"
                  aria-invalid={!!errors.timelineStart}
                />
              </Field>
              <Field>
                <FieldLabel>End date</FieldLabel>
                <Input
                  {...register("timelineEnd")}
                  type="date"
                  className="min-h-11 border-border bg-background"
                  aria-invalid={!!errors.timelineEnd}
                />
                <FieldError>{errors.timelineEnd?.message}</FieldError>
              </Field>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-border"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-job-modal-form"
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create job"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
