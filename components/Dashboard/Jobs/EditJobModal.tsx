"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { useAuth } from "@/hooks/store/auth/useAuth";
import type { JobUpdateBody } from "@/types/jobs/jobTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Megaphone, Users } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import {
  JobCollaboratorsField,
  type JobCollaboratorPick,
} from "@/components/Dashboard/Jobs/JobCollaboratorsField";
import type { Campaign } from "@/types/campaigns/campaignTypes";
import { canManageCampaign } from "@/lib/campaignPermissions";
import {
  decodeJwtPayload,
  getEmailFromPayload,
  getUserIdStringFromPayload,
} from "@/lib/jwtPayload";

/** Select value when no campaign should be linked on save. */
const NO_CAMPAIGN = "__none__";

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
] as const;

function budgetSelectOptions(current: string): string[] {
  const c = current.trim();
  const preset = BUDGET_OPTIONS as readonly string[];
  if (c && !preset.includes(c)) {
    return [c, ...BUDGET_OPTIONS];
  }
  return [...BUDGET_OPTIONS];
}

function creatorSelectOptions(current: string): string[] {
  const c = current.trim();
  if (c && !CREATOR_TYPES.includes(c)) {
    return [c, ...CREATOR_TYPES];
  }
  return [...CREATOR_TYPES];
}

const schema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(200, "Title must be 200 characters or less"),
    description: z.string().max(2000).optional().or(z.literal("")),
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

function toDateInputValue(d: string | Date | null | undefined): string {
  if (d == null) return "";
  const x = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(x.getTime())) return "";
  return x.toISOString().slice(0, 10);
}

function parseDeliverablesText(text: string): string[] {
  return text
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

type ApiJob = {
  id?: number;
  title?: string;
  description?: string;
  deliverables?: string[] | null;
  goals?: string[];
  creatorType?: string | null;
  category?: string | null;
  payment?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  skills?: string[];
  contents?: string[] | null;
  platforms?: string[] | null;
  campaign_id?: number | null;
  campaignId?: number | null;
  sourceCampaignId?: string | null;
  owner_id?: number;
  owner?: { id?: number };
  collaboratorIds?: number[] | null;
  collaborators?: Array<{ id?: number; firstName?: string; lastName?: string; email?: string }>;
  campaign?: { id?: number; title?: string } | null;
  values?: {
    title?: string;
    description?: string;
    deliverables?: string[];
    creatorType?: string;
    category?: string;
    payment?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    campaignId?: number;
    campaignTitle?: string;
  };
};

function getLinkedCampaign(job: ApiJob): { id: number; title: string } | null {
  const rawId =
    job.campaign_id ??
    job.campaignId ??
    job.values?.campaignId ??
    job.campaign?.id ??
    (job.sourceCampaignId != null && String(job.sourceCampaignId).trim() !== ""
      ? Number(job.sourceCampaignId)
      : undefined);
  if (rawId == null || rawId === "") return null;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const title =
    (job.campaign && typeof job.campaign === "object" && job.campaign.title
      ? job.campaign.title
      : undefined) ??
    job.values?.campaignTitle?.trim() ??
    `Campaign #${id}`;
  return { id, title };
}

interface EditJobModalProps {
  jobId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditJobModal({ jobId, open, onOpenChange }: EditJobModalProps) {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const [deliverablesText, setDeliverablesText] = useState("");
  const [creatorType, setCreatorType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [linkCampaignChoice, setLinkCampaignChoice] = useState(NO_CAMPAIGN);
  const [collaborators, setCollaborators] = useState<JobCollaboratorPick[]>([]);

  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const tokenPayload = useMemo(() => decodeJwtPayload(effectiveToken), [effectiveToken]);
  const currentUserId = String(user?.id ?? getUserIdStringFromPayload(tokenPayload) ?? "");
  const currentUserEmail = String(user?.email ?? getEmailFromPayload(tokenPayload) ?? "").toLowerCase();
  const campaignActor = useMemo(
    () => ({
      userId: currentUserId.trim(),
      emailLower: currentUserEmail.trim().toLowerCase(),
    }),
    [currentUserId, currentUserEmail]
  );
  const budgetOptions = useMemo(() => budgetSelectOptions(budgetRange), [budgetRange]);
  const creatorOptions = useMemo(() => creatorSelectOptions(creatorType), [creatorType]);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getById(jobId!),
    enabled: open && jobId != null && jobId > 0,
  });

  const linkedCampaign = useMemo(
    () => (job ? getLinkedCampaign(job as ApiJob) : null),
    [job]
  );

  const jobOwnerId = useMemo(() => {
    if (!job) return NaN;
    const j = job as ApiJob;
    const raw = j.owner_id ?? j.owner?.id;
    if (raw == null) return NaN;
    return Number(raw);
  }, [job]);

  const isJobOwner = jobOwnerId > 0 && Number(user?.id) === jobOwnerId;

  const { data: mineCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "mine", "edit-job", user?.id],
    queryFn: () => campaignApi.getMine(),
    enabled: open && jobId != null && jobId > 0,
  });

  const editableCampaigns = useMemo(() => {
    const raw = ((mineCampaigns ?? []) as Campaign[]).filter((c) => parseCampaignId(c.id) != null);
    return raw.filter((c) => canManageCampaign(c, campaignActor));
  }, [mineCampaigns, campaignActor]);

  useEffect(() => {
    if (open) setLinkCampaignChoice(NO_CAMPAIGN);
  }, [open, jobId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      timelineStart: "",
      timelineEnd: "",
    },
  });

  useEffect(() => {
    if (!job) return;
    const j = job as ApiJob;
    const v = j.values;
    const title = j.title ?? v?.title ?? "";
    const description = j.description ?? v?.description ?? "";
    const dels =
      (Array.isArray(j.deliverables) && j.deliverables.length > 0
        ? j.deliverables
        : Array.isArray(j.goals) && j.goals.length > 0
          ? j.goals
          : Array.isArray(j.contents) && j.contents.length > 0
            ? j.contents
            : []) ?? [];
    const delText = dels.join(", ");
    const ct = j.creatorType ?? v?.creatorType ?? j.category ?? v?.category ?? "";
    const pay = j.payment ?? v?.payment ?? "";
    const sd = j.startDate ?? v?.startDate;
    const ed = j.endDate ?? v?.endDate;

    reset({
      title,
      description: description ?? "",
      timelineStart: toDateInputValue(sd),
      timelineEnd: toDateInputValue(ed),
    });
    setDeliverablesText(delText);
    setCreatorType(ct || "");
    setBudgetRange(pay || "");
    const apiCollabs = j.collaborators;
    if (Array.isArray(apiCollabs) && apiCollabs.length > 0) {
      setCollaborators(
        apiCollabs
          .map((c) => {
            const id = Number(c.id);
            if (!Number.isFinite(id) || id <= 0) return null;
            const name =
              [c.firstName, c.lastName].filter(Boolean).join(" ").trim() ||
              c.email ||
              `User ${id}`;
            return { id, name };
          })
          .filter((x): x is JobCollaboratorPick => x != null)
      );
    } else {
      const ids = j.collaboratorIds;
      setCollaborators(
        Array.isArray(ids) && ids.length > 0
          ? ids.map((id) => ({ id: Number(id), name: `User ${id}` }))
          : []
      );
    }
  }, [job, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: JobUpdateBody }) => jobsApi.update(id, body),
    onSuccess: (_, variables) => {
      toast.success("Job updated");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "owner", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user-jobs", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["all-user-jobs-stats", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", "mine", "edit-job", user?.id] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Failed to update job");
    },
  });

  const onSubmit = (data: FormData) => {
    if (jobId == null || jobId <= 0) return;
    const parsedDeliverables = parseDeliverablesText(deliverablesText);
    if (parsedDeliverables.length === 0) {
      toast.error("Please enter at least one deliverable");
      return;
    }
    const goals = parsedDeliverables.length > 0 ? parsedDeliverables : [data.title];
    const skills: string[] = [];
    if (creatorType) skills.push(creatorType);

    const body: JobUpdateBody = {
      title: data.title,
      description: data.description || parsedDeliverables.join(", ") || undefined,
      deliverables: parsedDeliverables,
      creatorType: creatorType || undefined,
      startDate: data.timelineStart || undefined,
      endDate: data.timelineEnd || undefined,
      payment: budgetRange || undefined,
      paymentdesc: budgetRange === "Open to Bids" ? "Open to Bids" : undefined,
      category: creatorType || undefined,
      goals,
      skills: skills.length > 0 ? skills : ["Content creation"],
      contents: parsedDeliverables,
      platforms: [],
    };

    if (!linkedCampaign && linkCampaignChoice !== NO_CAMPAIGN) {
      const cid = Number(linkCampaignChoice);
      if (Number.isFinite(cid) && cid > 0) {
        body.campaignId = cid;
      }
    }

    if (isJobOwner) {
      body.collaboratorIds = collaborators.map((c) => c.id);
    }

    updateMutation.mutate({ id: jobId, body });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,800px)] w-[calc(100%-1.25rem)] max-w-2xl overflow-y-auto gap-0 p-0 sm:max-w-2xl">
        <div className="border-b border-border px-4 py-4 sm:px-6">
          <DialogHeader className="text-left">
            <DialogTitle>Edit job</DialogTitle>
            <DialogDescription>
              Update your job post. Changes apply immediately for applicants.
            </DialogDescription>
          </DialogHeader>
        </div>

        {isLoading || !job ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
            <Card className="border-orange-500/25 bg-orange-500/5 dark:bg-orange-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Megaphone className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden />
                  Linked campaign
                </CardTitle>
                <FieldDescription>
                  Link this job to a campaign you manage to keep work and reporting in one place.
                </FieldDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {linkedCampaign ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{linkedCampaign.title}</p>
                      <p className="text-xs text-muted-foreground">Campaign ID · {linkedCampaign.id}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="shrink-0" asChild>
                      <Link href={`/campaigns/${linkedCampaign.id}`}>View campaign</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No campaign linked yet. Choose one of your campaigns below and save—this job will
                      appear under that campaign.
                    </p>
                    {campaignsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading your campaigns…
                      </div>
                    ) : editableCampaigns.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        You don&apos;t have any campaigns yet.{" "}
                        <Link
                          href="/campaigns"
                          className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-500 dark:text-orange-400"
                        >
                          Create a campaign
                        </Link>{" "}
                        first, then link it here.
                      </p>
                    ) : (
                      <Field>
                        <FieldLabel>Link to campaign</FieldLabel>
                        <Select value={linkCampaignChoice} onValueChange={setLinkCampaignChoice}>
                          <SelectTrigger className="min-h-11 w-full text-base">
                            <SelectValue placeholder="Select a campaign" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NO_CAMPAIGN}>No campaign (skip)</SelectItem>
                            {editableCampaigns.map((c) => {
                              const cid = parseCampaignId(c.id);
                              if (cid == null) return null;
                              return (
                                <SelectItem key={cid} value={String(cid)}>
                                  {c.title ?? `Campaign #${cid}`}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          Choose a campaign you manage, then save. Leave on &quot;No campaign&quot; to
                          keep this job unlinked.
                        </FieldDescription>
                      </Field>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Job details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    {...register("title")}
                    className="min-h-11 text-base"
                    autoComplete="off"
                    aria-invalid={!!errors.title}
                  />
                  <FieldError errors={errors.title ? [errors.title] : []} />
                </Field>
                <Field>
                  <FieldLabel>Description (optional)</FieldLabel>
                  <Textarea
                    {...register("description")}
                    className="min-h-24 resize-y text-base"
                    aria-invalid={!!errors.description}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Deliverables</CardTitle>
                <FieldDescription>
                  Comma or line separated (same as when you created the job).
                </FieldDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  className="min-h-24 resize-y text-base"
                  placeholder="e.g. 1x Video Review, 2x Stories"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Creator type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={creatorType} onValueChange={setCreatorType}>
                    <SelectTrigger className="min-h-11 w-full text-base">
                      <SelectValue placeholder="Select creator type" />
                    </SelectTrigger>
                    <SelectContent>
                      {creatorOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Budget range</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger className="min-h-11 w-full text-base">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Start date</FieldLabel>
                  <Input {...register("timelineStart")} type="date" className="min-h-11 text-base" />
                </Field>
                <Field>
                  <FieldLabel>End date</FieldLabel>
                  <Input {...register("timelineEnd")} type="date" className="min-h-11 text-base" />
                  <FieldError errors={errors.timelineEnd ? [errors.timelineEnd] : []} />
                </Field>
              </CardContent>
            </Card>

            {isJobOwner && jobOwnerId > 0 && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
                    Collaborators
                  </CardTitle>
                  <FieldDescription>
                    Teammates who can view proposals and update proposal status with you. Remove all to clear
                    collaborators.
                  </FieldDescription>
                </CardHeader>
                <CardContent>
                  <JobCollaboratorsField
                    ownerUserId={jobOwnerId}
                    value={collaborators}
                    onChange={setCollaborators}
                    campaignId={linkedCampaign?.id}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/30 px-0 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
