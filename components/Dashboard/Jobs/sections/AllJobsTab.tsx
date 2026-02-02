"use client"

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobsApi } from "@/lib/data/jobs"; 
import { Job } from "@/types/job.types";
import { 
    RiMoneyDollarCircleLine, 
    RiWalletLine, 
    RiUser3Line, 
    RiBriefcaseLine, 
    RiTimerLine, 
    RiMapPinLine, 
    RiArrowUpCircleLine, 
    RiFolderLine, 
    RiCalendarCheckLine, 
    RiClipboardLine, 
    RiArrowLeftSLine, 
    RiArrowRightSLine, 
    RiCheckboxCircleLine 
} from "@remixicon/react";
import toast from "react-hot-toast";

interface DetailProps {
    title: string;
    caption: string | undefined;
    icon: any;
}

const Detail: React.FC<DetailProps> = ({ title, caption, icon: Icon }) => {
    return (
        <div className="w-36 flex my-2 mr-2 rounded-md border border-zinc-200 dark:border-zinc-800 p-2 space-x-2">
            <div>
                {Icon && <Icon className="h-5 w-5 text-primary" />}
            </div>
            <div className="text-sm space-y-2">
                <p>{title}</p>
                <p className="font-semibold capitalize">{caption || "-"}</p>
            </div>
        </div>
    );
};

interface AllJobsProps {
    initialJobId?: string;
    syncUrl?: boolean;
}

export default function AllJobs({ initialJobId, syncUrl = false }: AllJobsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const { data: jobsResponse, isLoading, isError } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const response = await jobsApi.getAll();
            return response;
        },
    });

    const jobs = useMemo(() => {
        if (!jobsResponse?.data) return [];
        return jobsResponse.data.map(job => ({
            ...job,
            _id: job.id.toString(), // Keep for backward compatibility
        }));
    }, [jobsResponse]);

    const initialIndex = useMemo(() => {
        if (jobs.length === 0) return 0;
        const idFromQuery = syncUrl ? searchParams?.get('alljobs') : undefined;
        const effectiveId = idFromQuery || initialJobId;
        if (!effectiveId) return 0;
        const idx = jobs.findIndex(j => j._id === effectiveId || j.id.toString() === effectiveId);
        return idx >= 0 ? idx : 0;
    }, [initialJobId, searchParams, syncUrl, jobs]);

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const currentJob = jobs[currentIndex];

    const { data: jobDetails } = useQuery({
        queryKey: ['job', currentJob?.id],
        queryFn: async () => {
            const response = await jobsApi.getById(currentJob!.id);
            return response;
        },
        enabled: !!currentJob?.id,
    });

    const createProposalMutation = useMutation({
        mutationFn: (data: {
            title: string;
            description?: string;
            proposedBudget?: string;
            deliverables?: string[];
        }) => jobsApi.createProposal(currentJob!.id, data),
        onSuccess: () => {
            toast.success("Proposal sent successfully!");
            queryClient.invalidateQueries({ queryKey: ['job', currentJob?.id] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to send proposal");
        },
    });

  // #still under  development
    const handleSendProposal = () => {
        if (!currentJob) return;
        
        // You can replace this with a modal/form
        const title = prompt("Enter proposal title:");
        if (!title) return;

        const description = prompt("Enter proposal description (optional):");
        const budget = prompt("Enter your proposed budget (optional):");

        createProposalMutation.mutate({
            title,
            description: description || undefined,
            proposedBudget: budget || undefined,
        });
    };

    const handleCopyLink = () => {
        if (!currentJob) return;
        const link = `${window.location.origin}/jobs/${currentJob.id}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'prev' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(jobs.length - 1, currentIndex + 1);
        
        setCurrentIndex(newIndex);
        
        if (syncUrl && jobs[newIndex]) {
            router.push(`/jobs?alljobs=${jobs[newIndex].id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-zinc-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load jobs</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!currentJob) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">No jobs available</p>
                <Button onClick={() => router.push('/jobs/create')}>
                    Create Your First Job
                </Button>
            </div>
        );
    }

    const detailedJob = jobDetails || currentJob;
    const proposalCount = detailedJob.proposals?.length || 0;

    return (
        <div className="tracking-wide leading-loose text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border bg-background">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-bold">{currentJob.title}</CardTitle>
                                    <p className="text-sm mt-1 text-muted-foreground">
                                        Posted by {currentJob.owner?.firstname} {currentJob.owner?.lastname}
                                    </p>
                                </div>
                                {proposalCount > 0 && (
                                    <Badge variant="secondary">
                                        {proposalCount} {proposalCount === 1 ? 'Proposal' : 'Proposals'}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap">
                                <Detail 
                                    title="Payment" 
                                    caption={currentJob.payment ? `KSh ${parseFloat(currentJob.payment).toLocaleString()}` : "-"} 
                                    icon={RiMoneyDollarCircleLine} 
                                />
                                <Detail 
                                    title="Budget" 
                                    caption={currentJob.payment ? `KSh ${parseFloat(currentJob.payment).toLocaleString()}` : "-"} 
                                    icon={RiWalletLine} 
                                />
                                <Detail 
                                    title="Age" 
                                    caption={currentJob.age} 
                                    icon={RiUser3Line} 
                                />
                                <Detail 
                                    title="Experience" 
                                    caption={currentJob.experience} 
                                    icon={RiBriefcaseLine} 
                                />
                                <Detail 
                                    title="Years" 
                                    caption={currentJob.years} 
                                    icon={RiTimerLine} 
                                />
                                <Detail 
                                    title="Location" 
                                    caption={currentJob.location} 
                                    icon={RiMapPinLine} 
                                />
                                <Detail 
                                    title="Gender" 
                                    caption={currentJob.gender} 
                                    icon={RiArrowUpCircleLine} 
                                />
                                <Detail 
                                    title="Category" 
                                    caption={currentJob.category} 
                                    icon={RiFolderLine} 
                                />
                                <Detail 
                                    title="Availability" 
                                    caption={currentJob.availability} 
                                    icon={RiTimerLine} 
                                />
                                <Detail 
                                    title="Priority" 
                                    caption={currentJob.priority} 
                                    icon={RiCalendarCheckLine} 
                                />
                            </div>

                            <Card className="mt-4 border bg-background">
                                <CardContent className="pt-4">
                                    <p className="font-semibold text-orange-700 text-base">About Job</p>
                                    <p className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                                        {currentJob.description}
                                    </p>
                                    {currentJob.paymentdesc && (
                                        <div className="mt-4">
                                            <p className="font-semibold text-primary">Payment Details:</p>
                                            <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                                                {currentJob.paymentdesc}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="space-y-6 mt-2">
                                {currentJob.goals && currentJob.goals.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-primary text-base">Goals & Objectives</p>
                                        <div className="mt-2 space-y-1">
                                            {currentJob.goals.map((goal: string, idx: number) => (
                                                <div className="flex space-x-2" key={idx}>
                                                    <p>{idx + 1}.</p>
                                                    <p className="capitalize">{goal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentJob.skills && currentJob.skills.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-primary text-base">Required Skills</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentJob.skills.map((skill, idx) => (
                                                <Badge key={idx} className="bg-primary p-2 px-4 text-white capitalize">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentJob.contents && currentJob.contents.length > 0 && (
                                        <div>
                                            <p className="font-semibold text-primary text-base">Content Format</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {currentJob.contents.map((content, idx) => (
                                                    <Badge key={idx} className="bg-primary text-foreground capitalize">
                                                        {content}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {currentJob.platforms && currentJob.platforms.length > 0 && (
                                        <div>
                                            <p className="font-semibold text-primary text-base">Platforms</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {currentJob.platforms.map((platform, idx) => (
                                                    <Badge key={idx} className="bg-primary text-foreground capitalize">
                                                        {platform}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Proposals Section (if job owner) */}
                            {detailedJob.proposals && detailedJob.proposals.length > 0 && (
                                <Card className="mt-6 border bg-background">
                                    <CardContent className="pt-4">
                                        <p className="font-semibold text-primary text-base mb-4">
                                            Proposals ({proposalCount})
                                        </p>
                                        <div className="space-y-3">
                                            {detailedJob.proposals.slice(0, 3).map((proposal) => (
                                                <div 
                                                    key={proposal.id} 
                                                    className="p-3 border rounded-md"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-semibold">{proposal.title}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                by {proposal.proposer?.firstname} {proposal.proposer?.lastname}
                                                            </p>
                                                        </div>
                                                        <Badge 
                                                            variant={
                                                                proposal.status === 'accepted' ? 'default' :
                                                                proposal.status === 'rejected' ? 'destructive' :
                                                                'secondary'
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {proposal.status}
                                                        </Badge>
                                                    </div>
                                                    {proposal.proposedBudget && (
                                                        <p className="text-sm mt-2">
                                                            Budget: KSh {parseFloat(proposal.proposedBudget).toLocaleString()}
                                                        </p>
                                                    )}
                                                    {proposal.description && (
                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                            {proposal.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                            {proposalCount > 3 && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full"
                                                    onClick={() => router.push(`/jobs/${currentJob.id}/proposals`)}
                                                >
                                                    View All {proposalCount} Proposals
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {currentJob.link && (
                        <Card className="border bg-background">
                            <CardContent className="pt-4">
                                <p className="text-primary text-base font-bold flex items-center gap-2">
                                    <RiFolderLine className="text-primary" /> Attachments
                                </p>
                                <a 
                                    href={currentJob.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-2 text-sm text-blue-600 hover:underline block break-all"
                                >
                                    View Attachment
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    <Button 
                        className="flex-1 w-full gap-2"
                        onClick={handleSendProposal}
                        disabled={createProposalMutation.isPending}
                    >
                        {createProposalMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RiCheckboxCircleLine className="h-5 w-5" />
                        )}
                        Send Proposal
                    </Button>

                    <div className="grid grid-cols-2 gap-2 text-zinc-500 font-bold">
                        <Card 
                            className="border border-primary p-4 bg-background cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => router.push(`/jobs/${currentJob.id}/tasks`)}
                        >
                            <div className="flex items-center space-x-4">
                                <RiFolderLine className="text-orange-700" />
                                <p>Tasks</p>
                            </div>
                        </Card>
                        <Card 
                            className="border border-primary p-4 bg-background cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => router.push(`/campaigns?jobId=${currentJob.id}`)}
                        >
                            <div className="flex items-center space-x-4">
                                <RiArrowUpCircleLine className="text-primary" />
                                <p>Campaigns</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="border bg-background">
                        <CardContent className="pt-4">
                            <p className="font-bold mb-2">Job Link</p>
                            <div 
                                className="p-4 flex items-center gap-2 font-bold rounded-md border cursor-pointer hover:bg-accent transition-colors"
                                onClick={handleCopyLink}
                            >
                                <p className="flex-1 line-clamp-1 text-sm">
                                    {typeof window !== 'undefined' && `${window.location.origin}/jobs/${currentJob.id}`}
                                </p>
                                <RiClipboardLine className="text-primary h-5 w-5" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click to copy
                            </p>
                        </CardContent>
                    </Card>

                    {/* Business Info (if exists) */}
                    {currentJob.business && (
                        <Card className="border bg-background">
                            <CardContent className="pt-4">
                                <p className="font-bold mb-2">Posted By</p>
                                <div className="space-y-2">
                                    {currentJob.business.logoUrl && (
                                        <img 
                                            src={currentJob.business.logoUrl}
                                            alt={currentJob.business.name}
                                            className="h-12 w-12 rounded-md object-cover mb-2"
                                        />
                                    )}
                                    <p className="font-semibold">{currentJob.business.name}</p>
                                    {currentJob.business.industry && (
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {currentJob.business.industry}
                                        </p>
                                    )}
                                    {currentJob.business.address && (
                                        <p className="text-sm text-muted-foreground">
                                            {currentJob.business.address}
                                        </p>
                                    )}
                                    {currentJob.business.websiteUrl && (
                                        <a 
                                            href={currentJob.business.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline block"
                                        >
                                            Visit Website
                                        </a>
                                    )}
                                    {currentJob.business.email && (
                                        <a 
                                            href={`mailto:${currentJob.business.email}`}
                                            className="text-sm text-blue-600 hover:underline block"
                                        >
                                            Contact Business
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Posted Date */}
                    <Card className="border bg-background">
                        <CardContent className="pt-4">
                            <p className="font-bold mb-2">Posted</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(currentJob.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                            {currentJob.updatedAt !== currentJob.createdAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Updated {new Date(currentJob.updatedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-2 w-full">
                        <Button
                            className="flex-1 border-primary"
                            variant="outline"
                            disabled={currentIndex <= 0}
                            onClick={() => handleNavigate('prev')}
                        >
                            <RiArrowLeftSLine className="h-5 w-5" />
                            Previous
                        </Button>
                        <Button
                            className="flex-1 border-primary"
                            variant="outline"
                            disabled={currentIndex >= jobs.length - 1}
                            onClick={() => handleNavigate('next')}
                        >
                            Next
                            <RiArrowRightSLine className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            {jobs.length > 1 && (
                <div className="flex items-center justify-center space-x-4 mb-4 mt-12">
                    {jobs.map((_, i: number) => (
                        <div
                            key={i}
                            className={`rounded-full h-4 w-4 cursor-pointer transition-all ${
                                i === currentIndex 
                                    ? 'bg-primary' 
                                    : 'bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400'
                            }`}
                            onClick={() => {
                                setCurrentIndex(i);
                                if (syncUrl && jobs[i]) {
                                    router.push(`/jobs?alljobs=${jobs[i].id}`);
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
