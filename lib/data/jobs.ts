// // Mock data for demonstration
// export const mockJobs = [
//     {
//         _id: '1',
//         values: {
//             title: 'Social Media Content Creator',
//             description: 'Looking for a creative content creator to manage our social media presence across multiple platforms. Must have experience with video editing and graphic design.',
//             payment: '50000',
//             location: 'Nairobi',
//             experience: 'Intermediate',
//             years: '2-3 years',
//             age: '25-35',
//             category: 'Content Creation',
//             priority: 'High',
//         },
//         skills: ['Video Editing', 'Photoshop', 'Social Media', 'Copywriting'],
//         contents: ['Short Videos', 'Reels', 'Stories'],
//         platforms: ['Instagram', 'TikTok', 'YouTube'],
//         proposals: [{ fee: '45000' }, { fee: '52000' }],
//         imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=2069&q=80',
//     },
//     {
//         _id: '2',
//         values: {
//             title: 'Digital Marketing Specialist',
//             description: 'Seeking an experienced digital marketer to develop and execute comprehensive marketing strategies.',
//             payment: '75000',
//             location: 'Remote',
//             experience: 'Expert',
//             years: '5+ years',
//             age: '28-40',
//             category: 'Marketing',
//             priority: 'Medium',
//         },
//         skills: ['SEO', 'Google Ads', 'Analytics', 'Content Marketing'],
//         contents: ['Blog Posts', 'Email Campaigns'],
//         platforms: ['LinkedIn', 'Twitter'],
//         proposals: [{ fee: '70000' }, { fee: '80000' }, { fee: '72000' }],
//         imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2069&q=80',
//     },
//     {
//         _id: '3',
//         values: {
//             title: 'Brand Ambassador',
//             description: 'We are looking for enthusiastic brand ambassadors to represent our company at events and on social media.',
//             payment: '30000',
//             location: 'Mombasa',
//             experience: 'Beginner',
//             years: '0-1 years',
//             age: '18-30',
//             category: 'Brand Marketing',
//             priority: 'Low',
//         },
//         skills: ['Communication', 'Public Speaking', 'Networking'],
//         contents: ['Live Streams', 'Stories'],
//         platforms: ['Instagram', 'Facebook'],
//         proposals: [{ fee: '28000' }],
//         imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2069&q=80',
//     },
//     {
//         _id: '4',
//         values: {
//             title: 'Video Producer',
//             description: 'Professional video producer needed for creating high-quality video content for corporate clients.',
//             payment: '100000',
//             location: 'Nairobi',
//             experience: 'Expert',
//             years: '4+ years',
//             age: '26-45',
//             category: 'Video Production',
//             priority: 'High',
//         },
//         skills: ['Premiere Pro', 'After Effects', 'Cinematography', 'Color Grading'],
//         contents: ['Long Videos', 'Documentaries', 'Commercials'],
//         platforms: ['YouTube', 'Vimeo'],
//         proposals: [],
//         imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2069&q=80',
//     },
//     {
//         _id: '5',
//         values: {
//             title: 'Influencer Relations Manager',
//             description: 'Manage relationships with influencers and coordinate marketing campaigns across social platforms.',
//             payment: '65000',
//             location: 'Remote',
//             experience: 'Intermediate',
//             years: '3-4 years',
//             age: '24-35',
//             category: 'Marketing',
//             priority: 'Medium',
//         },
//         skills: ['Relationship Management', 'Negotiation', 'Campaign Planning'],
//         contents: ['Sponsored Posts', 'Product Reviews'],
//         platforms: ['Instagram', 'YouTube', 'TikTok'],
//         proposals: [{ fee: '60000' }, { fee: '68000' }],
//         imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2069&q=80',
//     },
//     {
//         _id: '6',
//         values: {
//             title: 'Graphic Designer',
//             description: 'Creative graphic designer for social media graphics, brand materials, and digital illustrations.',
//             payment: '45000',
//             location: 'Kisumu',
//             experience: 'Intermediate',
//             years: '2-3 years',
//             age: '22-35',
//             category: 'Design',
//             priority: 'Low',
//         },
//         skills: ['Illustrator', 'Photoshop', 'Figma', 'Branding'],
//         contents: ['Graphics', 'Infographics'],
//         platforms: ['Instagram', 'Pinterest'],
//         proposals: [{ fee: '42000' }],
//         imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=2069&q=80',
//     },
// ];
//
//

// lib/api/jobs.ts
// lib/api/jobs.ts
import { pazaApi } from "@/lib/axiosClients";
import { Job, JobCreateRequest, JobProposal } from "@/types/job.types";

// Filters interface
export interface JobFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  sortBy?: 'createdAt' | 'payment';
  sortOrder?: 'ASC' | 'DESC';
}

// Backend response wrapper type (matching your campaign pattern)
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination response type
interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const jobsApi = {
  // Get all jobs with filters
  getAll: async (filters?: JobFilters) => {
    const response = await pazaApi.get<PaginatedApiResponse<Job[]>>("/api/jobs", {
      params: filters,
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // Get single job by ID
  getById: async (id: number) => {
    const response = await pazaApi.get<ApiResponse<Job>>(`/api/jobs/${id}`);
    return response.data.data;
  },

  // Get jobs by owner
  getByOwner: async (ownerId: number) => {
    const response = await pazaApi.get<ApiResponse<Job[]>>(`/api/jobs/owner/${ownerId}`);
    return response.data.data;
  },

  // Create new job
  create: async (data: JobCreateRequest) => {
    const response = await pazaApi.post<ApiResponse<Job>>("/api/jobs", data);
    return response.data.data;
  },

  // Update job
  update: async (id: number, data: Partial<JobCreateRequest>) => {
    const response = await pazaApi.patch<ApiResponse<Job>>(`/api/jobs/${id}`, data);
    return response.data.data;
  },

  // Delete job
  delete: async (id: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(`/api/jobs/${id}`);
    return response.data;
  },

  // Search jobs
  search: async (query: string, params?: { page?: number; limit?: number }) => {
    const response = await pazaApi.get<PaginatedApiResponse<Job[]>>("/api/jobs/search", {
      params: { query, ...params },
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // Get jobs by category
  getByCategory: async (category: string) => {
    const response = await pazaApi.get<ApiResponse<Job[]>>(`/api/jobs/category/${category}`);
    return response.data.data;
  },

  // PROPOSALS SECTION

  // Create a proposal
  createProposal: async (
    jobId: number,
    proposalData: {
      title: string;
      description?: string;
      proposedBudget?: string;
      deliverables?: string[];
    }
  ) => {
    const response = await pazaApi.post<ApiResponse<JobProposal>>(
      `/api/jobs/${jobId}/proposals`,
      proposalData
    );
    return response.data.data;
  },

  // Get proposals for a job
  getJobProposals: async (jobId: number) => {
    const response = await pazaApi.get<ApiResponse<JobProposal[]>>(
      `/api/jobs/${jobId}/proposals`
    );
    return response.data.data;
  },

  // Get user's own proposals
  getMyProposals: async () => {
    const response = await pazaApi.get<ApiResponse<JobProposal[]>>(
      "/api/proposals/my-proposals"
    );
    return response.data.data;
  },

  // Update proposal status
  updateProposalStatus: async (
    jobId: number,
    proposalId: number,
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  ) => {
    const response = await pazaApi.patch<ApiResponse<JobProposal>>(
      `/api/jobs/${jobId}/proposals/${proposalId}/status`,
      { status }
    );
    return response.data.data;
  },

  // Delete proposal
  deleteProposal: async (jobId: number, proposalId: number) => {
    const response = await pazaApi.delete<ApiResponse<void>>(
      `/api/jobs/${jobId}/proposals/${proposalId}`
    );
    return response.data;
  },

  // UTILITY METHODS

  // Get job statistics
  getStats: async (jobId: number) => {
    const response = await pazaApi.get<ApiResponse<{
      totalProposals: number;
      pendingProposals: number;
      acceptedProposals: number;
      rejectedProposals: number;
    }>>(`/api/jobs/${jobId}/stats`);
    return response.data.data;
  },

  // Check if user can apply to job
  canApply: async (jobId: number) => {
    const response = await pazaApi.get<ApiResponse<{ canApply: boolean }>>(
      `/api/jobs/${jobId}/can-apply`
    );
    return response.data.data;
  },
};
