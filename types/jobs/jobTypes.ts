// Job board types inferred from job creation and listing UIs

export interface JobValues {
    title: string;
    description: string;
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
}

export interface JobCreateRequest {
    owner: string;
    values: JobValues;
    goals: string[];
    skills: string[];
    contents: string[];
    platforms: string[];
}

export interface JobCreateResponse {
    message: string;
    job: {
        insertedId: string;
    };
}

export interface Job {
    _id: string;
    owner_id?: string;
    values?: JobValues;
    goals?: string[];
    skills?: string[];
    contents?: string[];
    platforms?: string[];
    proposals?: any[];
}


