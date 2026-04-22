
export type Creator = {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    country: string;
    stateRegion: string;
    creatorname: string;
    about: string;
    experience: string;
    main: string;
    followers: string;
    instagram: string;
    tiktok: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    facebook: string;
    milestones: string;
    social: string;
    category: string;
    subCategory: string[];
    corevalue: string;
    coreValues: string[];
    subCoreValues: string[];
    topics: string[];
    collabs: string[];
    preview: string;
    avatar: string;
    avatarFile?: File;
    previewFile?: File;
    type: "Creator";
};

export type PersonalInfoStep = Pick<
    Creator,
    "firstName" | "lastName" | "gender" | "dateOfBirth" | "country" | "stateRegion"
>;

export type BasicInfoStep = Pick<
    Creator,
    "creatorname" | "about"
>;

export type SocialMediaStep = Pick<
    Creator,
    "instagram" | "tiktok" | "twitter" | "youtube" | "linkedin" | "facebook" | "followers" | "social"
>;

export type ExperienceStep = Pick<
    Creator,
    "experience" | "milestones" | "collabs"
>;

export type SocialCareerStep = Pick<
    Creator,
    | "instagram"
    | "tiktok"
    | "twitter"
    | "youtube"
    | "linkedin"
    | "facebook"
    | "followers"
    | "social"
    | "experience"
    | "milestones"
    | "collabs"
>;

export type CategoriesValuesStep = Pick<
    Creator,
    "category" | "subCategory" | "corevalue" | "coreValues" | "subCoreValues" | "topics"
>;

export type ProfileMediaStep = Pick<
    Creator,
    "avatar" | "preview" | "avatarFile" | "previewFile"
>;

// Props types for step components
export interface StepProps<T> {
    data: T;
    onUpdate: (data: Partial<T>) => void;
}

export type PersonalInfoStepProps = StepProps<PersonalInfoStep>;
export type BasicInfoStepProps = StepProps<BasicInfoStep>;
export type SocialMediaStepProps = StepProps<SocialMediaStep>;
export type ExperienceStepProps = StepProps<ExperienceStep>;
export type SocialCareerStepProps = StepProps<SocialCareerStep>;
export type CategoriesValuesStepProps = StepProps<CategoriesValuesStep>;
export type ProfileMediaStepProps = StepProps<ProfileMediaStep>;

// Initial creator data
export const initialCreatorData: Creator = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    country: "",
    stateRegion: "",
    creatorname: "",
    about: "",
    experience: "",
    main: "",
    followers: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    facebook: "",
    milestones: "",
    social: "",
    category: "",
    subCategory: [],
    corevalue: "",
    coreValues: [],
    subCoreValues: [],
    topics: [],
    collabs: [],
    preview: "",
    avatar: "",
    avatarFile: undefined,
    previewFile: undefined,
    type: "Creator",
};
