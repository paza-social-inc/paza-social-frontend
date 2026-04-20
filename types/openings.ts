/** Role types for project openings (showcase) */
export const OPENING_ROLE_TYPES = [
  "Co-Creator",
  "Distributor",
  "Talent",
  "Operator",
  "IP Owner",
] as const;

export type OpeningRoleType = (typeof OPENING_ROLE_TYPES)[number];

/** Compensation types for openings */
export const OPENING_COMPENSATION_TYPES = [
  "Service exchange",
  "Fixed fee",
  "Open to discussion",
  "IP ownership",
  "Revenue share",
  "Mutual growth",
] as const;

export type OpeningCompensationType = (typeof OPENING_COMPENSATION_TYPES)[number];

/** Payload for creating an opening on a creator project */
export interface CreateOpeningRequest {
  title: string;
  roleType: OpeningRoleType;
  compensation: OpeningCompensationType;
  description?: string;
}

/** Opening returned from API (list/detail) */
export interface Opening {
  id?: string;
  _id?: string;
  projectId?: string;
  title: string;
  roleType?: OpeningRoleType;
  compensation?: OpeningCompensationType;
  description?: string;
  status?: string;
  createdAt?: string;
  /** Filled when opening has applicant(s) */
  applicant?: { name?: string; email?: string; avatarUrl?: string };
}
