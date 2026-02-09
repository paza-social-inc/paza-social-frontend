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
import { Campaign, CreateCampaignDto } from "@/types/campaign";

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

export const campaignApi = {
  // Get all campaigns
  getAll: async (filters?: CampaignFilters) => {
    const response = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns", {
      params: filters,
    });
    return response.data.data; // Extract the data property
  },

  // Get single campaign by ID
  // getById: async (id: number) => {
  //   const response = await pazaApi.get<ApiResponse<Campaign>>(`/api/campaigns/${id}`);
  //   return response.data.data; // Extract the data property
  // },
  getById: async (id: number) => {
    const response = await pazaApi.get<ApiResponse<Campaign>>(`/api/campaigns/${id}`);
    //                                                        ^ PARENTHESIS here
    // console.log(response.data)
    return response.data.data;
  },

  // Create new campaign
  create: async (data: CreateCampaignDto) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>("/api/campaigns", data);
    return response.data.data; // Extract the data property
  },

  // Update campaign
  update: async (id: number, data: Partial<CreateCampaignDto>) => {
    const response = await pazaApi.put<ApiResponse<Campaign>>(`/api/campaigns/${id}`, data);
    return response.data.data; // Extract the data property
  },

  // Delete campaign
  delete: async (id: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(`/api/campaigns/${id}`);
    return response.data;
  },

  // Add milestone
  addMilestone: async (campaignId: number, milestone: any) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/milestone`,
      milestone
    );
    return response.data.data;
  },

  // Update milestone
  updateMilestone: async (campaignId: number, milestoneId: number, milestone: any) => {
    const response = await pazaApi.put<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/milestone/${milestoneId}`,
      milestone
    );
    return response.data.data;
  },

  // Delete milestone
  deleteMilestone: async (campaignId: number, milestoneId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/campaigns/${campaignId}/milestone/${milestoneId}`
    );
    return response.data;
  },

  // Add team
  addTeam: async (campaignId: number, team: any) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/team`,
      team
    );
    return response.data.data;
  },

  // Delete team
  deleteTeam: async (campaignId: number, teamId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/campaigns/${campaignId}/team/${teamId}`
    );
    return response.data;
  },

  // Add feedback
  addFeedback: async (campaignId: number, feedback: any) => {
    const response = await pazaApi.post<ApiResponse<Campaign>>(
      `/api/campaigns/${campaignId}/feedback`,
      feedback
    );
    return response.data.data;
  },

  // Get campaign feedback
  getFeedback: async (campaignId: number) => {
    const response = await pazaApi.get<ApiResponse<any[]>>(
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
    return response.data.data;
  },

  // Get campaigns by user
  getByUser: async (createdby: string) => {
    const response = await pazaApi.get<ApiResponse<Campaign[]>>("/api/campaigns/user", {
      params: { createdby },
    });
    return response.data.data;
  },
};
