"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { jobsApi } from "@/lib/data/jobs";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { ProposalCollaboratorsField } from "./ProposalCollaboratorsField";
import type { JobCollaboratorPick } from "./JobCollaboratorsField";
import type { JobProposalListItem } from "@/lib/jobs/viewerProposalOnJob";

const schema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .refine((val) => {
      if (!val) return true;
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
      return wordCount <= 500;
    }, "Description must be 500 words or less")
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

interface SendProposalFormProps {
  jobId: number;
  jobTitle?: string;
  jobOwnerUserId?: number | null;
  /** When set, the form is hidden — user already has a proposal on this job. */
  existingProposal?: JobProposalListItem | null;
}

export function SendProposalForm({
  jobId,
  jobTitle,
  jobOwnerUserId,
  existingProposal = null,
}: SendProposalFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<JobCollaboratorPick[]>([]);
  const currentUserId = user?.id != null ? Number(user.id) : NaN;

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      router.push(`/jobs/${jobId}`);
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

  if (existingProposal) {
    return (
      <div className="mx-auto min-w-0 max-w-2xl px-4 py-6 sm:py-8">
        <Link
          href={`/jobs/${jobId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job
        </Link>
        <Card className="min-w-0 overflow-x-hidden rounded-xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Proposal already sent</CardTitle>
            {jobTitle ? (
              <p className="mt-0.5 text-sm text-muted-foreground">Job: {jobTitle}</p>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              You can only submit one proposal per job. Yours is recorded
              {existingProposal.status ? ` as ${existingProposal.status}` : ""}.
            </p>
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href={`/jobs/${jobId}`}>View job</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-2xl px-4 py-6 sm:py-8">
      <Link
        href={`/jobs/${jobId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to job
      </Link>

      <Card className="min-w-0 overflow-x-hidden rounded-xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Send a proposal</CardTitle>
          {jobTitle && (
            <p className="text-sm text-muted-foreground mt-0.5">Applying to: {jobTitle}</p>
          )}
        </CardHeader>
        <CardContent className="min-w-0 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 space-y-5">
            <Field>
              <FieldLabel>Proposal title *</FieldLabel>
              <Input
                {...register("title")}
                placeholder="e.g. Content package for Q2 campaign"
                className="border-border"
              />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Textarea
                {...register("description")}
                placeholder="Describe your approach, experience, and why you're a good fit."
                rows={5}
                className="border-border min-h-[120px] resize-y"
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Proposed budget (optional)</FieldLabel>
              <Input
                {...register("proposedBudget")}
                placeholder="e.g. 50000 or $1,200"
                className="border-border"
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
                className="mt-2 border-border min-h-[100px] resize-y text-base"
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
                onClick={() => router.push(`/jobs/${jobId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProposalMutation.isPending}
                className="bg-primary text-primary-foreground"
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
        </CardContent>
      </Card>
    </div>
  );
}
