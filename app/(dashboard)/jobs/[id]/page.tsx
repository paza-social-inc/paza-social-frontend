import JobDetails from "@/components/Dashboard/Jobs/JobDetails";

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params || {};
    return (
        <div>
            <JobDetails jobId={id} />
        </div>
    )
}
