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
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { jobsApi } from "@/lib/data/jobs";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ProposalCollaboratorsField } from "./ProposalCollaboratorsField";
import type { JobCollaboratorPick } from "./JobCollaboratorsField";

const schema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  proposedBudget: z
    .string()
    .max(50, "Budget value too long")
    .optional()
    .or(z.literal("")),
  deliverablesText: z
    .string()
    .max(2000, "Deliverables must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

function parseDeliverablesList(text: string): string[] {
  return text
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

type FormData = z.infer<typeof schema>;

export interface SendProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  jobTitle?: string;
  jobOwnerUserId?: number | null;
}

export function SendProposalModal({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  jobOwnerUserId,
}: SendProposalModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<JobCollaboratorPick[]>([]);
  const currentUserId = user?.id != null ? Number(user.id) : NaN;

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
      proposedBudget: "",
      deliverablesText: "",
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      proposedBudget?: string;
      deliverables?: string[];
      collaboratorIds?: number[];
    }) => jobsApi.createProposal(jobId, data),
    onSuccess: () => {
      toast.success("Proposal sent successfully");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-proposals"] });
      setCollaborators([]);
      reset();
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(res.response?.data?.message ?? res.message ?? "Failed to send proposal");
    },
  });

  const onSubmit = (data: FormData) => {
    const parsed = parseDeliverablesList(data.deliverablesText ?? "");
    const collabIds = collaborators.map((c) => c.id);
    createProposalMutation.mutate({
      title: data.title,
      description: data.description || undefined,
      proposedBudget: data.proposedBudget?.trim() || undefined,
      deliverables: parsed.length > 0 ? parsed : undefined,
      collaboratorIds: collabIds.length > 0 ? collabIds : undefined,
    });
  };

  const handleCancel = () => {
    setCollaborators([]);
    reset();
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCollaborators([]);
      reset();
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto",
          "rounded-xl border-border bg-card p-0 gap-0"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Send a proposal</DialogTitle>

        <div className="p-4 sm:p-6">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to job
          </button>

          <h2 className="text-xl font-bold text-foreground">Send a proposal</h2>
          {jobTitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              Applying to: {jobTitle}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
            <Field>
              <FieldLabel>Proposal title *</FieldLabel>
              <Input
                {...register("title")}
                placeholder="e.g. Content package for Q2 campaign"
                className="border-border bg-background"
              />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Textarea
                {...register("description")}
                placeholder="Describe your approach, experience, and why you're a good fit."
                rows={4}
                className="border-border bg-background resize-none"
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Proposed budget (optional)</FieldLabel>
              <Input
                {...register("proposedBudget")}
                placeholder="e.g. 50000 or $1,200"
                className="border-border bg-background"
              />
              <FieldError>{errors.proposedBudget?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Deliverables you&apos;re offering (optional)</FieldLabel>
              <FieldDescription>
                Separate items with commas or new lines (e.g. 1x Video Review, 2x Stories).
              </FieldDescription>
              <Textarea
                {...register("deliverablesText")}
                placeholder="e.g. 1x Video Review, 2x Stories, 1x Reel"
                rows={4}
                className="mt-2 border-border bg-background min-h-[100px] resize-y text-base"
              />
              <FieldError>{errors.deliverablesText?.message}</FieldError>
            </Field>

            {Number.isFinite(currentUserId) && currentUserId > 0 ? (
              <ProposalCollaboratorsField
                currentUserId={currentUserId}
                jobOwnerUserId={jobOwnerUserId ?? null}
                value={collaborators}
                onChange={setCollaborators}
              />
            ) : (
              <Field>
                <FieldLabel>Collaborators (optional)</FieldLabel>
                <FieldDescription>Sign in as a creator to add proposal collaborators.</FieldDescription>
              </Field>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
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
                disabled={createProposalMutation.isPending}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {createProposalMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send proposal"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
