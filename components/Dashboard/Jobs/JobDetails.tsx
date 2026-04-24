"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    RiArrowLeftLine,
    RiSendPlaneLine,
    RiMapPinLine, 
    RiMoneyDollarCircleLine, 
    RiTimeLine, 
    RiMedalLine, 
    RiCheckboxCircleLine,
} from "@remixicon/react";
import Image from "next/image";
import { Loader2, Users } from "lucide-react";
import { SendProposalModal } from "./SendProposalModal";
import JobProposalsList from "./JobProposalsList";
import { useAuth } from "@/hooks/store/auth/useAuth";
import type { Job, JobValues } from "@/types";

/** API may return extra top-level fields not on the base `Job` type. */
type JobDetailRecord = Job & {
    business?: { logoUrl?: string; name?: string; industry?: string };
    campaign?: {
        id?: number;
        title?: string;
        goals?: string[] | null;
        goalDetails?: Array<{ goal?: string | null }> | null;
    };
};

interface JobDetailsProps {
    jobId: string;
}

function resolveJobOwnerId(job: {
    owner_id?: number | string;
    owner?: { id?: number | string };
}): number | null {
    const raw = job.owner_id ?? job.owner?.id;
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
}

export default function JobDetails({ jobId }: JobDetailsProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [proposalModalOpen, setProposalModalOpen] = useState(false);

    const { data: job, isLoading, isError } = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const response = await jobsApi.getById(parseInt(jobId));
            return response;
        },
        enabled: !!jobId,
    });

    const { data: stats } = useQuery({
        queryKey: ['job-stats', jobId],
        queryFn: async () => {
            const response = await jobsApi.getStats(parseInt(jobId));
            return response;
        },
        enabled: !!jobId,
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Error state
    if (isError || !job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load job</p>
                <Button onClick={() => router.push('/jobs')}>
                    Back to Jobs
                </Button>
            </div>
        );
    }
    //
    // const {
    //     title,
    //     description,
    //     payment,
    //     location,
    //     experience,
    //     years,
    //     age,
    //     category,
    //     priority,
    //     skills = [],
    //     contents = [],
    //     platforms = [],
    //     goals = [],
    //     owner,
    //     business,
    //     createdAt,
    // } = job;

  // Extract data — API may mirror fields on the job or under `values`
  const jb = job as JobDetailRecord;
  const v: JobValues = Object.assign({ title: "" }, jb.values ?? {});
  const title = jb.title ?? v.title ?? "";
  const description = jb.description ?? v.description ?? "";
  const payment = v.payment;
  const location = v.location;
  const experience = v.experience;
  const years = v.years;
  const category = v.category;
  const priority = v.priority;
  const availability = v.availability;
  const visibility = v.visibility;
  const link = v.link;
  const skills = jb.skills ?? [];
  const contents = jb.contents ?? [];
  const platforms = jb.platforms ?? [];
  const campaignGoalsFromDetails =
    Array.isArray(jb.campaign?.goalDetails)
      ? jb.campaign.goalDetails
          .map((g) => String(g?.goal ?? "").trim())
          .filter(Boolean)
      : [];
  const campaignGoals =
    campaignGoalsFromDetails.length > 0
      ? campaignGoalsFromDetails
      : Array.isArray(jb.campaign?.goals)
        ? jb.campaign.goals.filter((g): g is string => typeof g === "string" && g.trim().length > 0)
        : [];
  const goals = campaignGoals.length > 0 ? campaignGoals : (jb.goals ?? []);
  const owner = jb.owner;
  const business = jb.business;
  const createdAt = jb.createdAt;

    const collaborators =
        (job as { collaborators?: Array<{ id?: number; firstName?: string; lastName?: string; email?: string }> })
            .collaborators ?? [];
    const collaboratorIds =
        (job as { collaboratorIds?: number[] | null }).collaboratorIds ?? [];

    const viewerId = user?.id != null ? Number(user.id) : NaN;
    const jobOwnerId = resolveJobOwnerId(job as { owner_id?: number | string; owner?: { id?: number | string } });
    const isJobOwner =
        Number.isFinite(viewerId) &&
        jobOwnerId != null &&
        viewerId === jobOwnerId;

    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative h-64 w-full overflow-hidden border">

                {business?.logoUrl ? (
                    <Image 
                        src={business.logoUrl} 
                        alt={title} 
                        fill
                        className="object-cover" 
                        unoptimized
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-white/90">
                                {category && (
                                    <Badge className="bg-blue-600 text-white capitalize">
                                        {category}
                                    </Badge>
                                )}
                                {priority && (
                                    <Badge className="bg-rose-600 text-white capitalize">
                                        {priority}
                                    </Badge>
                                )}
                                <span className="inline-flex items-center gap-1 text-sm">
                                    <RiMapPinLine className="h-4 w-4" /> {location || 'Remote'}
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="outline" onClick={() => router.push('/jobs')}>
                                <RiArrowLeftLine className="mr-2 h-4 w-4" /> Back to Jobs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-700">
                            <RiMoneyDollarCircleLine className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Payment</p>
                            <p className="font-semibold">
                                {payment ? `KSh ${parseFloat(payment).toLocaleString()}` : 'Negotiable'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <RiMedalLine className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Experience</p>
                            <p className="font-semibold capitalize">{experience || 'Any'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                            <RiTimeLine className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Years</p>
                            <p className="font-semibold">{years || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-700">
                            <RiMapPinLine className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-semibold">{location || 'Remote'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-3">
                <div className="lg:col-span-2 space-y-4">
                    {/* About Section */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold">About this job</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Owner/Business Info */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-3">Posted by</h3>
                            <div className="flex items-center gap-3">
                                {business ? (
                                    <>
                                        {business.logoUrl && (
                                            <Image 
                                                src={business.logoUrl} 
                                                alt={business.name || ""}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover"
                                                unoptimized
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold">{business.name}</p>
                                            {business.industry && (
                                                <p className="text-sm text-muted-foreground">{business.industry}</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <p className="font-semibold">
                                            {owner?.firstname} {owner?.lastname}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Individual</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {((collaborators && collaborators.length > 0) ||
                        (collaboratorIds && collaboratorIds.length > 0)) && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground" aria-hidden />
                                    Collaborators
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Teammates who can help manage proposals for this job.
                                </p>
                                <ul className="space-y-2">
                                    {collaborators && collaborators.length > 0
                                        ? collaborators.map((c) => (
                                              <li key={c.id ?? c.email} className="text-sm">
                                                  <span className="font-medium">
                                                      {[c.firstName, c.lastName].filter(Boolean).join(" ") ||
                                                          "User"}
                                                  </span>
                                                  {c.email ? (
                                                      <span className="text-muted-foreground"> · {c.email}</span>
                                                  ) : null}
                                                  {c.id != null ? (
                                                      <span className="text-muted-foreground"> · ID {c.id}</span>
                                                  ) : null}
                                              </li>
                                          ))
                                        : (collaboratorIds ?? []).map((id) => (
                                              <li key={id} className="text-sm font-mono">
                                                  User ID {id}
                                              </li>
                                          ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Goals */}
                    {goals && goals.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold">Campaign Goals</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {goals.map((goal, i) => (
                                        <Badge key={i} className="bg-green-600 text-white capitalize">
                                            {goal}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold">Required skills</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <Badge key={i} className="bg-primary text-white capitalize">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Content & Platforms */}
                    {((contents && contents.length > 0) || (platforms && platforms.length > 0)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contents && contents.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold">Content format</h3>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {contents.map((content, i) => (
                                                <Badge key={i} variant="secondary" className="capitalize">
                                                    {content}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {platforms && platforms.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold">Platforms</h3>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {platforms.map((platform, i) => (
                                                <Badge key={i} variant="secondary" className="capitalize">
                                                    {platform}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Proposal List for Owners */}
                    {isJobOwner && (
                        <div className="mt-8 border-t border-border pt-8">
                            <JobProposalsList jobId={parseInt(jobId, 10)} campaignId={jb.campaign?.id ?? jb.campaignId ?? jb.campaign_id ?? null} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            {!isJobOwner ? (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => setProposalModalOpen(true)}
                                    >
                                        <RiCheckboxCircleLine className="mr-2 h-4 w-4" />
                                        Send Proposal
                                    </Button>
                                    <SendProposalModal
                                        open={proposalModalOpen}
                                        onOpenChange={setProposalModalOpen}
                                        jobId={parseInt(jobId, 10)}
                                        jobTitle={title}
                                        jobOwnerUserId={jobOwnerId}
                                    />
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                                    You posted this job. Creators can send proposals here; you can review them from your job dashboard.
                                </p>
                            )}
                            <Button 
                                className="w-full"
                                variant="outline"
                                onClick={() => router.push(`/inbox?user=${owner?.id}`)}
                            >
                                <RiSendPlaneLine className="mr-2 h-4 w-4" />
                                Message Creator
                            </Button>
                            
                            {/* Proposal Stats */}
                            {stats && (
                                <div className="pt-4 border-t space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground">
                                            {stats.totalProposals}
                                        </span> proposal{stats.totalProposals !== 1 ? 's' : ''} received
                                    </p>
                                    {stats.pendingProposals > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-semibold text-orange-600">
                                                {stats.pendingProposals}
                                            </span> pending review
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Posted Date */}
                            <p className="text-xs text-muted-foreground pt-2 border-t">
                                Posted{" "}
                                {createdAt
                                    ? new Date(createdAt).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "—"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Job Details Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                            <div className="space-y-3 text-sm">
                                {availability && (
                                    <div>
                                        <p className="text-muted-foreground">Availability</p>
                                        <p className="font-medium capitalize">{availability}</p>
                                    </div>
                                )}
                                {visibility && (
                                    <div>
                                        <p className="text-muted-foreground">Visibility</p>
                                        <Badge variant="outline" className="capitalize">
                                            {visibility.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                )}
                                {link && (
                                    <div>
                                        <p className="text-muted-foreground">External Link</p>
                                        <a 
                                            href={link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm break-all"
                                        >
                                            {link}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
