// Re-export job types for backward compatibility (lib/data/jobs.ts, AllJobsTab)
export type {
  Job,
  JobCreateRequest,
  JobProposal,
  JobUpdateBody,
  JobValues,
} from "./jobs/jobTypes";
