// import { Campaign } from "@/types/campaigns/campaignTypes";
//
// export const mockCampaigns: Campaign[] = [
//   {
//     _id: "c1",
//     title: "Summer Launch 2025",
//     description: "Drive awareness for the summer collection with creators across IG and TikTok.",
//     goals: ["Brand Awareness", "Content Production", "Traffic"],
//     budget: 200000,
//     active: true,
//     createdby: "brand-1",
//     milestones: [
//       {
//         title: "Kickoff",
//         description: "Align teams and finalize deliverables",
//         category: "Major Milestone",
//         start: "2025-05-01",
//         end: "2025-05-03",
//         status: "Completed",
//         budget: 10000,
//       },
//       {
//         title: "Creator Content",
//         description: "Publish 30 short-form videos",
//         category: "Major Milestone",
//         start: "2025-05-04",
//         end: "2025-06-01",
//         status: "In Progress",
//         budget: 150000,
//       },
//     ],
//     teams: [
//       {
//         name: "Creators",
//         members: [
//           { name: "Aisha", email: "aisha@example.com" },
//           { name: "Liam", email: "liam@example.com" },
//         ],
//       },
//       {
//         name: "Brand Team",
//         members: [
//           { name: "Joy", email: "joy@example.com" },
//         ],
//       },
//     ],
//     feedback: [
//       { name: "PM", email: "pm@brand.com", feedback: "Great traction so far" },
//     ],
//   },
//   {
//     _id: "c2",
//     title: "Back to School Influencer Push",
//     description: "Influencer led campaign highlighting deals and bundles.",
//     goals: ["Sales", "UGC"],
//     budget: 120000,
//     active: true,
//     createdby: "brand-2",
//     milestones: [
//       {
//         title: "Recruitment",
//         description: "Onboard 15 micro creators",
//         category: "Minor Milestone",
//         start: "2025-07-01",
//         end: "2025-07-10",
//         status: "In Progress",
//       },
//     ],
//     teams: [
//       { name: "Creators", members: [{ name: "Rose", email: "rose@example.com" }] },
//     ],
//   },
//   {
//     _id: "c3",
//     title: "Holiday Mega Sale",
//     description: "High-impact sale with heavy creator support and referrals.",
//     goals: ["Sales", "Referral Growth"],
//     budget: 500000,
//     active: false,
//     createdby: "brand-3",
//     milestones: [
//       {
//         title: "Teasers",
//         description: "Pre-heat audience",
//         category: "Minor Milestone",
//         status: "Completed",
//       },
//     ],
//     teams: [
//       { name: "Creators", members: [] },
//       { name: "Affiliates", members: [] },
//     ],
//   },
// ];
//
//


// // lib/api/campaigns.ts
// import { pazaApi } from "@/lib/axiosClients";
// import { Campaign, CreateCampaignDto } from "@/types/campaign";
//
// export interface CampaignFilters {
//   search?: string;
//   active?: boolean;
//   minBudget?: number;
//   maxBudget?: number;
//   // Add more filters as your backend supports
// }
//
// export const campaignApi = {
//   // Get all campaigns
//   getAll: async (filters?: CampaignFilters) => {
//     const response = await pazaApi.get<Campaign[]>("/api/campaigns", {
//       params: filters,
//     });
//     return response.data;
//   },
//
//   // Get single campaign by ID
//   getById: async (id: number) => {
//     const response = await pazaApi.get<Campaign>(`/api/campaigns/${id}`);
//     return response.data;
//   },
//
//   // Create new campaign
//   create: async (data: CreateCampaignDto) => {
//     const response = await pazaApi.post<Campaign>("/api/campaigns", data);
//     return response.data;
//   },
//
//   // Update campaign
//   update: async (id: number, data: Partial<CreateCampaignDto>) => {
//     const response = await pazaApi.put<Campaign>(`/api/campaigns/${id}`, data);
//     return response.data;
//   },
//
//   // Delete campaign
//   delete: async (id: number) => {
//     const response = await pazaApi.delete(`/api/campaigns/${id}`);
//     return response.data;
//   },
//
//   // Toggle active status
//   toggleActive: async (id: number, active: boolean) => {
//     const response = await pazaApi.patch<Campaign>(`/api/campaigns/${id}/active`, { active });
//     return response.data;
//   },
// };


// lib/api/campaigns.ts
import { pazaApi } from "@/lib/axiosClients";
import {
  Campaign,
  CampaignFeedback,
  CreateCampaignDto,
} from "@/types/campaigns/campaignTypes";

export interface CampaignFilters {
  search?: string;
  active?: boolean;
  minBudget?: number;
  maxBudget?: number;
}

// Backend response wrapper type
interface ApiResponse<T> {
  message: string;
  data: T;
}

/** Coerce API campaign id (number or numeric string) for URLs and payloads. */
export function parseCampaignId(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
  const n = Number(String(raw).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

/**
 * Coerce a campaign payload from the API into our `Campaign` shape.
 * Handles `target_number` vs `targetNumber` and normalizes deadline to a string the UI can read.
 */
export function normalizeCampaign(raw: unknown): Campaign {
  if (raw == null || typeof raw !== "object") {
    return raw as Campaign;
  }
  const o = { ...(raw as Record<string, unknown>) };
  if (!("targetNumber" in o) && "target_number" in o) {
    o.targetNumber = o.target_number;
  }
  delete o.target_number;

  if (!("targetDescription" in o) && "target_description" in o) {
    o.targetDescription = o.target_description;
  }
  delete o.target_description;
  if (!("goalDetails" in o) && "goal_details" in o) {
    o.goalDetails = o.goal_details;
  }
  delete o.goal_details;

  if (o.targetNumber === undefined) {
    // leave undefined
  } else if (o.targetNumber === null || o.targetNumber === "") {
    o.targetNumber = null;
  } else {
    const n = Number(o.targetNumber);
    o.targetNumber = Number.isFinite(n) ? Math.trunc(n) : null;
  }

  if (o.deadline != null && String(o.deadline).trim() !== "") {
    const raw = String(o.deadline).trim();
    const ym = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
    if (ym) {
      o.deadline = `${ym[1]}-${ym[2]}-${ym[3]}`;
    } else {
      const d = o.deadline instanceof Date ? o.deadline : new Date(raw);
      o.deadline = Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
    }
  } else {
    o.deadline = null;
  }

  const normalizedGoalDetails = Array.isArray(o.goalDetails)
    ? o.goalDetails
        .map((row) => {
          if (row == null || typeof row !== "object") return null;
          const rec = row as Record<string, unknown>;
          const goal = String(rec.goal ?? "").trim();
          if (!goal) return null;
          const targetRaw = rec.targetNumber;
          const targetNumber =
            targetRaw == null || targetRaw === ""
              ? null
              : Number.isFinite(Number(targetRaw))
                ? Math.trunc(Number(targetRaw))
                : null;
          let deadline: string | null = null;
          if (rec.deadline != null && String(rec.deadline).trim() !== "") {
            const dRaw = String(rec.deadline).trim();
            const ym = /^(\d{4})-(\d{2})-(\d{2})/.exec(dRaw);
            if (ym) {
              deadline = `${ym[1]}-${ym[2]}-${ym[3]}`;
            } else {
              const d = new Date(dRaw);
              deadline = Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
            }
          }
          const targetDescription =
            rec.targetDescription == null || String(rec.targetDescription).trim() === ""
              ? null
              : String(rec.targetDescription).trim();
          return { goal, targetNumber, deadline, targetDescription };
        })
        .filter(Boolean)
    : [];
  const fallbackGoalDetails = Array.isArray(o.goals)
    ? o.goals
        .map((g) => String(g ?? "").trim())
        .filter(Boolean)
        .map((goal) => ({
          goal,
          targetNumber: o.targetNumber as number | null,
          deadline: o.deadline as string | null,
          targetDescription: (o.targetDescription as string | null) ?? null,
        }))
    : [];
  o.goalDetails = normalizedGoalDetails.length > 0 ? normalizedGoalDetails : fallbackGoalDetails;
  o.goals = (o.goalDetails as Array<{ goal: string }>).map((g) => g.goal);

  return o as unknown as Campaign;
}

function normalizeCampaignList(rows: unknown): Campaign[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => normalizeCampaign(r));
}

export const campaignApi = {
  // Get all campaigns
  getAll: async (filters?: CampaignFilters) => {
    const response = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns", {
      params: filters,
    });
    const rows = response.data?.data;
    return normalizeCampaignList(Array.isArray(rows) ? rows : []);
  },

  // Get single campaign by ID
  // getById: async (id: number) => {
  //   const response = await pazaApi.get<ApiResponse<Campaign>>(`/api/campaigns/${id}`);
  //   return response.data.data; // Extract the data property
  // },
  getById: async (id: number) => {
    const nid = parseCampaignId(id);
    if (nid == null) {
      throw new Error("Invalid campaign id");
    }
    const response = await pazaApi.get<ApiResponse<Campaign>>(`/api/campaigns/${nid}`);
    return normalizeCampaign(response.data.data);
  },
  // getById: async (id: number) => {
  //     const response = await pazaApi.get<ApiResponse<Job>>(`/api/jobs/${id}`);
  //     return response.data.data;
  //   },


  // Create new campaign (POST /api/campaigns/create)
  create: async (data: CreateCampaignDto) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>("/api/campaigns/create", data);
    return normalizeCampaign(response.data.data);
  },

  // Update campaign (PUT /api/campaigns/:id)
  update: async (id: number, data: Partial<CreateCampaignDto>) => {
    const response = await pazaApi.put<ApiResponse<Campaign>>(`/api/campaigns/${id}`, data);
    return normalizeCampaign(response.data.data);
  },

  // Delete campaign
  delete: async (id: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(`/api/campaigns/${id}`);
    return response.data;
  },

  // Add milestone
  addMilestone: async (campaignId: number, milestone: Record<string, unknown>) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/milestone`,
      milestone
    );
    return normalizeCampaign(response.data.data);
  },

  // Update milestone
  updateMilestone: async (campaignId: number, milestoneId: number, milestone: Record<string, unknown>) => {
    const response = await pazaApi.put<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/milestone/${milestoneId}`,
      milestone
    );
    return normalizeCampaign(response.data.data);
  },

  // Delete milestone
  deleteMilestone: async (campaignId: number, milestoneId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/campaigns/${campaignId}/milestone/${milestoneId}`
    );
    return response.data;
  },

  // Add team
  addTeam: async (campaignId: number, team: Record<string, unknown>) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/teams`,
      team
    );
    return normalizeCampaign(response.data.data);
  },

  // Update team name
  updateTeam: async (campaignId: number, teamId: number, payload: { name: string }) => {
    const response = await pazaApi.put<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/teams/${teamId}`,
      payload
    );
    return normalizeCampaign(response.data.data);
  },

  // Delete team
  deleteTeam: async (campaignId: number, teamId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/campaigns/${campaignId}/teams/${teamId}`
    );
    return response.data;
  },

  // Add member to a specific team
  addTeamMember: async (
    campaignId: number,
    teamId: number,
    member: { name: string; email: string; sendSignupInvite?: boolean }
  ) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/teams/${teamId}/members`,
      member
    );
    return normalizeCampaign(response.data.data);
  },

  removeTeamMember: async (campaignId: number, teamId: number, memberId: number) => {
    const response = await pazaApi.delete<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/teams/${teamId}/members/${memberId}`
    );
    return normalizeCampaign(response.data.data);
  },

  // Add feedback
  addFeedback: async (campaignId: number, feedback: Record<string, unknown>) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/feedback`,
      feedback
    );
    return normalizeCampaign(response.data.data);
  },

  // Get campaign feedback
  getFeedback: async (campaignId: number) => {
    const response = await pazaApi.get<ApiResponse<CampaignFeedback[]>>(
      `/api/campaigns/${campaignId}/feedback`
    );
    return response.data.data;
  },

  // Delete feedback
  deleteFeedback: async (campaignId: number, feedbackId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/campaigns/${campaignId}/feedback/${feedbackId}`
    );
    return response.data;
  },

  // Search campaigns
  search: async (query: string) => {
    const response = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns/search", {
      params: { query },
    });
    return normalizeCampaignList(response.data?.data);
  },

  // Get campaigns by user
  getByUser: async (createdby: string) => {
    const response = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns/user", {
      params: { createdby },
    });
    const rows = response.data?.data;
    return normalizeCampaignList(Array.isArray(rows) ? rows : []);
  },

  /**
   * Authenticated user's campaigns only (for task/job pickers).
   * GET /api/campaigns/user?mine=true — owner is resolved from the Authorization JWT (user id + email on server).
   * Do not send `createdby` here (avoids leaking email in the URL; backend ignores it when mine=true anyway).
   */
  getMine: async (): Promise<Campaign[]> => {
    const r = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns/user", {
      params: { mine: "true" },
    });
    return normalizeCampaignList(r.data?.data);
  },

  /** Users linked to the campaign (projects / creator) who are not on any team yet — for the create-team picker. */
  getAvailableTeamMembers: async (
    campaignId: number
  ): Promise<Array<{ id: number; email: string; firstName: string; lastName: string }>> => {
    const nid = parseCampaignId(campaignId);
    if (nid == null) {
      throw new Error("Invalid campaign id");
    }
    const response = await pazaApi.get<{
      success?: boolean;
      message?: string;
      data: Array<{ id: number; email: string; firstName: string; lastName: string }>;
    }>(`/api/campaigns/${nid}/available-team-members`);
    const rows = response.data?.data;
    return Array.isArray(rows) ? rows : [];
  },

  /**
   * Other campaigns you own that have an accepted creator job proposal (hired),
   * excluding the campaign you are linking from.
   */
  getLinkableAccepted: async (campaignId: number): Promise<Campaign[]> => {
    const nid = parseCampaignId(campaignId);
    if (nid == null) {
      throw new Error("Invalid campaign id");
    }
    const response = await pazaApi.get<ApiResponse<Campaign[]>>(
      `/api/campaigns/${nid}/linkable-accepted`
    );
    const rows = response.data?.data;
    return normalizeCampaignList(Array.isArray(rows) ? rows : []);
  },

  /** Persist link on current campaign (`cocampaign` = linked campaign id). */
  linkToAcceptedCampaign: async (
    campaignId: number,
    linkedCampaignId: number
  ): Promise<Campaign> => {
    const nid = parseCampaignId(campaignId);
    const lid = parseCampaignId(linkedCampaignId);
    if (nid == null || lid == null) {
      throw new Error("Invalid campaign id");
    }
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${nid}/link-campaign`,
      { linkedCampaignId: lid }
    );
    return normalizeCampaign(response.data.data);
  },
};
