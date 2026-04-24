import JobDetails from "@/components/Dashboard/Jobs/JobDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params || {};
    return (
        <div>
            <JobDetails jobId={id} />
        </div>
    )
}
