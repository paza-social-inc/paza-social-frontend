"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { RiSearchLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobsApi } from "@/lib/data/jobs"; 
import JobCard from "../JobCard";
import EditJobModal from "../EditJobModal";
import { useAuth } from "@/hooks/store/auth/useAuth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface AllJobsProps {
    initialJobId?: string;
    syncUrl?: boolean;
    onOpenCreateJob?: () => void;
}

export default function AllJobs({ onOpenCreateJob }: AllJobsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [editJobId, setEditJobId] = useState<number | null>(null);
    const [deleteJobId, setDeleteJobId] = useState<number | null>(null);

    const { data: jobsResponse, isLoading, isError } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const response = await jobsApi.getAll();
            return response;
        },
    });

    const jobs = useMemo(() => {
        if (!jobsResponse?.data) return [];
        return jobsResponse.data.map((job) => ({
            ...job,
            _id: job.id.toString(),
            values: {
                title: job.title,
                description: job.description,
                category: job.category,
                experience: job.experience,
                priority: job.priority,
                location: job.location,
                payment: job.payment,
                age: job.age,
                availability: job.availability,
                gender: job.gender,
                visibility: job.visibility,
                paymentdesc: job.paymentdesc,
                link: job.link,
                years: job.years,
            },
        }));
    }, [jobsResponse]);

    const deleteJobMutation = useMutation({
        mutationFn: (id: number) => jobsApi.delete(id),
        onSuccess: () => {
            toast.success("Job removed from the board");
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["jobs", "owner", user?.id] });
            queryClient.invalidateQueries({ queryKey: ["user-jobs", user?.id] });
            queryClient.invalidateQueries({ queryKey: ["all-user-jobs-stats", user?.id] });
            setDeleteJobId(null);
        },
        onError: (err: unknown) => {
            const res = err as { response?: { data?: { message?: string } } };
            toast.error(res.response?.data?.message ?? "Failed to delete job");
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-zinc-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load jobs</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-background border sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-start justify-between mb-4">
                                    <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Jobs</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
                            </p>
                                </div>
                        {onOpenCreateJob && (
                            <Button onClick={onOpenCreateJob}>Create Job</Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8">
                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobs.map((job) => {
                            const isOwner =
                                String(job.owner_id ?? job.owner?.id ?? "") === String(user?.id ?? "");
                            const numericId = Number(job.id ?? job._id);
                            return (
                                <JobCard
                                    key={job._id}
                                    {...job}
                                    imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2069&q=80"
                                    canViewProposals={isOwner}
                                    isOwner={isOwner}
                                    onClick={() => router.push(`/jobs/${job.id ?? job._id}`)}
                                    onEdit={
                                        isOwner && Number.isFinite(numericId)
                                            ? () => setEditJobId(numericId)
                                            : undefined
                                    }
                                    onDelete={
                                        isOwner && Number.isFinite(numericId)
                                            ? () => setDeleteJobId(numericId)
                                            : undefined
                                    }
                                />
                            );
                        })}
                </div>
                ) : (
                    <div className="text-center py-16 flex flex-col items-center">
                        <RiSearchLine className="text-6xl text-gray-400 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No jobs yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            When jobs are posted they will appear here.
                        </p>
                        {onOpenCreateJob && (
                            <Button onClick={onOpenCreateJob} variant="outline">
                                Create a job
                            </Button>
                        )}
                </div>
            )}
            </div>

            <EditJobModal
                jobId={editJobId}
                open={editJobId != null}
                onOpenChange={(open) => {
                    if (!open) setEditJobId(null);
                }}
            />

            <Dialog open={deleteJobId != null} onOpenChange={(open) => !open && setDeleteJobId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete this job?</DialogTitle>
                        <DialogDescription>
                            This will remove the job from the board. You can post a new job anytime.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteJobId(null)}
                            disabled={deleteJobMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleteJobMutation.isPending}
                            onClick={() => {
                                if (deleteJobId != null) deleteJobMutation.mutate(deleteJobId);
                            }}
                        >
                            {deleteJobMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting…
                                </>
                            ) : (
                                "Delete job"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
