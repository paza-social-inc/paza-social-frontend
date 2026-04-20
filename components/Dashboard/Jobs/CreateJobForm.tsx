"use client";

import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import toast from "react-hot-toast";

const CREATOR_TYPES = [
  "Micro-influencer",
  "Mid-tier",
  "Macro",
  "Nano",
  "Any",
];

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
    description: z.string().max(2000, "Description must be 2000 characters or less").optional().or(z.literal("")),
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
    { message: "End date must be on or after start date", path: ["timelineEnd"] }
  );

type FormData = z.infer<typeof schema>;

export default function CreateJobForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isCreatorAccount =
    String(user?.accountType ?? "").toLowerCase() === "creator";

  useEffect(() => {
    if (isCreatorAccount) {
      router.replace("/jobs");
    }
  }, [isCreatorAccount, router]);

  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverablesText, setDeliverablesText] = useState<string>("");
  const [creatorType, setCreatorType] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [collaborators, setCollaborators] = useState<JobCollaboratorPick[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      queryClient.invalidateQueries({ queryKey: ["all-user-jobs-stats"] });
      const j = job as { id?: number; _id?: string };
      const id = j?.id ?? j?._id;
      router.push(id != null ? `/jobs/${id}` : "/jobs");
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Failed to create job");
    },
  });

  const parseDeliverablesText = (text: string) => {
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
    const goals = parsedDeliverables.length > 0 ? parsedDeliverables : [data.title];
    const skills: string[] = [];
    if (creatorType) skills.push(creatorType);

    const payload: JobCreateRequest = {
      owner: String(user.id),
      values: {
        title: data.title,
        // If description is empty, fall back to deliverables as a detailed description
        description: data.description || parsedDeliverables.join(", ") || undefined,
        deliverables: parsedDeliverables,
        creatorType: creatorType || undefined,
        startDate: data.timelineStart || undefined,
        endDate: data.timelineEnd || undefined,
        payment: data.budgetRange || undefined,
        paymentdesc: data.budgetRange === "Open to Bids" ? "Open to Bids" : undefined,
        category: creatorType || undefined,
      },
      goals,
      skills: skills.length > 0 ? skills : ["Content creation"],
      contents: parsedDeliverables,
      platforms: [],
      ...(collaborators.length > 0
        ? { collaboratorIds: collaborators.map((c) => c.id) }
        : {}),
    };
    createMutation.mutate(payload);
  };

  if (isCreatorAccount) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6 text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-dvh safe-area-inset-bottom pb-8">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex min-h-14 items-center gap-3 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <Link
            href="/jobs"
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Back to jobs"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">Create job</h1>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 sm:py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Job details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. Social content for product launch"
                  className="min-h-12 touch-manipulation text-base"
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
                  className="min-h-24 resize-y text-base"
                  aria-invalid={!!errors.description}
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Deliverables</CardTitle>
              <FieldDescription>
                Enter deliverables separated by commas or new lines.
                <br />
                Example: <span className="text-muted-foreground">1x Video Review, 2x Stories</span>
              </FieldDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  value={deliverablesText}
                  onChange={(e) => {
                    setDeliverablesText(e.target.value);
                    setDeliverables(parseDeliverablesText(e.target.value));
                  }}
                  placeholder="e.g. 1x Video Review, 2x Stories, 1x Reel"
                  className="min-h-24 resize-y"
                />
                {deliverables.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Parsed {deliverables.length} deliverable{deliverables.length === 1 ? "" : "s"}.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Creator type</CardTitle>
              <FieldDescription>Preferred creator tier.</FieldDescription>
            </CardHeader>
            <CardContent>
              <Select value={creatorType} onValueChange={setCreatorType}>
                <SelectTrigger className="min-h-12 w-full touch-manipulation text-base">
                  <SelectValue placeholder="Select creator type" />
                </SelectTrigger>
                <SelectContent>
                  {CREATOR_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="min-h-11">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Budget range</CardTitle>
              <FieldDescription>e.g. $500 – $2,000 or Open to Bids.</FieldDescription>
            </CardHeader>
            <CardContent>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger className="min-h-12 w-full touch-manipulation text-base">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b} className="min-h-11">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          </div>

          {user?.id != null && Number.isFinite(Number(user.id)) && Number(user.id) > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Brand collaborators</CardTitle>
                <FieldDescription>
                  Optional teammates who can help manage proposals for this job.
                </FieldDescription>
              </CardHeader>
              <CardContent>
                <JobCollaboratorsField
                  ownerUserId={Number(user.id)}
                  value={collaborators}
                  onChange={setCollaborators}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
              <FieldDescription>Start and end dates for the collaboration.</FieldDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Start date</FieldLabel>
                <Input
                  {...register("timelineStart")}
                  type="date"
                  className="min-h-12 text-base"
                  aria-invalid={!!errors.timelineStart}
                />
              </Field>
              <Field>
                <FieldLabel>End date</FieldLabel>
                <Input
                  {...register("timelineEnd")}
                  type="date"
                  className="min-h-12 text-base"
                  aria-invalid={!!errors.timelineEnd}
                />
                <FieldError errors={errors.timelineEnd ? [errors.timelineEnd] : []} />
              </Field>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse sm:gap-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="min-h-12 flex-1 touch-manipulation text-base font-medium sm:flex-none sm:px-8"
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
            <Link href="/jobs" className="block sm:inline-block">
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
