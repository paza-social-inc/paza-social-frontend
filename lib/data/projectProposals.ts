import { pazaApi } from "@/lib/axiosClients";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface CreatorProjectProposerLite {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  /** Present when API includes full user on proposer relation */
  isVerified?: boolean;
  profilePhotoUrl?: string | null;
  avatarUrl?: string | null;
}

export type CreatorProjectProposalKind = "support" | "task" | "campaign";

export interface CreatorProjectProposal {
  id: number;
  kind: CreatorProjectProposalKind;
  collaborationType: string;
  reason: string;
  fee: string | null;
  timeline: string | null;
  /** ISO YYYY-MM-DD when API returns structured dates */
  timelineStart?: string | null;
  timelineEnd?: string | null;
  attachments: string[] | null;
  collaborators: string[] | null;
  status: string;
  createdAt: string;
  proposer?: CreatorProjectProposerLite;
  project_id?: number;
  proposer_id?: number;
}

/** Prefer structured dates; fall back to legacy `timeline` text. */
export function formatProposalTimeline(p: Pick<CreatorProjectProposal, "timeline" | "timelineStart" | "timelineEnd">): string | null {
  const a = (p.timelineStart ?? "").trim();
  const b = (p.timelineEnd ?? "").trim();
  if (a && b) return `${a} – ${b}`;
  if (a) return `From ${a}`;
  if (b) return `Until ${b}`;
  const tl = (p.timeline ?? "").trim();
  return tl || null;
}

/** Proposals you sent; includes project summary from GET /proposals/mine */
export interface CreatorProjectProposalMine extends CreatorProjectProposal {
  project?: { id: number; title?: string };
}

export type CreatorProjectProposalStatusAction = "accepted" | "rejected";

export const projectProposalsApi = {
  getByProjectId: async (projectId: number) => {
    const response = await pazaApi.get<ApiResponse<CreatorProjectProposal[]>>(
      `/api/creator-projects/${projectId}/proposals`
    );
    return response.data?.data ?? [];
  },

  /** Collaboration proposals you submitted to others’ showcase projects */
  getMine: async () => {
    const response = await pazaApi.get<ApiResponse<CreatorProjectProposalMine[]>>(
      "/api/creator-projects/proposals/mine"
    );
    return response.data?.data ?? [];
  },

  /** Collaboration proposals received on your showcase projects (owner inbox) */
  getIncoming: async () => {
    const response = await pazaApi.get<ApiResponse<CreatorProjectProposalMine[]>>(
      "/api/creator-projects/proposals/incoming"
    );
    return response.data?.data ?? [];
  },

  /** Project owner accepts or rejects a pending proposal */
  updateStatus: async (
    projectId: number,
    proposalId: number,
    status: CreatorProjectProposalStatusAction
  ) => {
    // Use PUT (same pattern as job proposals); avoids PATCH blocked by some proxies
    const response = await pazaApi.put<ApiResponse<CreatorProjectProposal>>(
      `/api/creator-projects/${projectId}/proposals/${proposalId}`,
      { status }
    );
    return response.data?.data;
  },

  create: async (
    projectId: number,
    payload: {
      kind: CreatorProjectProposalKind;
      collaborationType: string;
      reason: string;
      fee?: string | null;
      timeline?: string | null;
      timelineStart?: string | null;
      timelineEnd?: string | null;
      attachments?: string[] | null;
      collaborators?: string[] | null;
    }
  ) => {
    const response = await pazaApi.post<ApiResponse<CreatorProjectProposal>>(
      `/api/creator-projects/${projectId}/proposals`,
      payload
    );
    return response.data?.data;
  },
};

