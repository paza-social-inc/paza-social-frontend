// Job board types inferred from job creation and listing UIs

export interface JobValues {
    title: string;
    description?: string;
    /** e.g. ["1x Video Review", "2x Stories", "1x Link in Bio"] */
    deliverables?: string[];
    creatorType?: string;
    startDate?: string;
    endDate?: string;
    gender?: string;
    availability?: string;
    location?: string;
    category?: string;
    age?: string;
    experience?: string;
    priority?: string;
    visibility?: string;
    payment?: string;
    paymentdesc?: string;
    link?: string;
    years?: string;
    /** Optional: link job to a campaign */
    campaignId?: number;
    campaignTitle?: string;
}

export interface JobCreateRequest {
    owner: string;
    values: JobValues;
    goals: string[];
    skills: string[];
    contents: string[];
    platforms: string[];
    /** Other brand user IDs who can co-manage this job (proposals, status). */
    collaboratorIds?: number[];
}

/** PUT /api/jobs/:id — backend expects flat fields (not nested `values`). */
export type JobUpdateBody = Partial<{
    title: string;
    description: string;
    goals: string[];
    deliverables: string[];
    creatorType: string;
    startDate: string;
    endDate: string;
    payment: string;
    paymentdesc: string;
    category: string;
    skills: string[];
    contents: string[];
    platforms: string[];
    campaignId: number | null;
    gender: string;
    availability: string;
    location: string;
    age: string;
    experience: string;
    priority: string;
    visibility: string;
    link: string;
    years: string;
    collaboratorIds: number[] | null;
}>;

export interface JobCreateResponse {
    message: string;
    job: {
        insertedId: string;
    };
}

export interface Job {
    id?: number;
    _id?: string;
    owner_id?: string;
    /** FK to campaigns — returned by API when job is linked to a campaign */
    campaign_id?: number | null;
    campaignId?: number | null;
    sourceCampaignId?: number | null;
    /** Top-level mirrors of values (when API returns public job shape) */
    title?: string;
    description?: string;
    owner?: { id?: string; firstname?: string; lastname?: string };
    values?: JobValues;
    goals?: string[];
    skills?: string[];
    contents?: string[];
    platforms?: string[];
    proposals?: JobProposal[];
    createdAt?: string;
    /** When returned by owner listing APIs */
    isActive?: boolean;
    /** Teammates who can manage proposals with the job owner */
    collaboratorIds?: number[] | null;
    collaborators?: Array<{
        id?: number;
        email?: string;
        firstName?: string;
        lastName?: string;
        accountType?: string;
    }>;
}

/** Proposal submitted by a creator to a job (brand). */
export interface JobProposal {
    id?: number;
    _id?: string;
    jobId?: number;
    title: string;
    description?: string;
    proposedBudget?: string;
    deliverables?: string[];
    /** Co-applicants (creator user IDs). */
    collaboratorIds?: number[] | null;
    /** When API enriches the response */
    collaborators?: Array<{
        id?: number;
        firstName?: string;
        lastName?: string;
        email?: string;
        accountType?: string;
    }>;
    status?: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
    proposer?: { id?: string; firstname?: string; lastname?: string };
    createdAt?: string;
}


