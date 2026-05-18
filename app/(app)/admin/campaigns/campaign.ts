export interface CampaignTask {
    id: number;
    title: string;
    status: "completed" | "in_progress" | "pending";
    assignedTo: number;
  }
  
  export interface AssignedCreator {
    id: number;
    name: string;
    status: string;
  }
  
  export interface SuggestedCreator {
    id: number;
    name: string;
    matchScore: number;
  }
  
  export interface BudgetTracking {
    total: number;
    allocated: number;
    spent: number;
    remaining: number;
  }
  
  export interface ContentPipelineItem {
    title: string;
    dueDate: string;
    deliveredCount: number;
  }
  
  export interface Campaign {
    id: number;
    name: string;
    brand: string;
    budget: number;
    status: string;
    statusPipeline: "draft" | "matching" | "live" | "review" | "completed";
    members: number;
    creatorsAssigned: number;
    creatorsNeeded: number;
    brief: string;
    requirements: string;
    tasks: CampaignTask[];
    assignedCreators: AssignedCreator[];
    suggestedCreators: SuggestedCreator[];
    budgetTracking: BudgetTracking;
    contentPipeline: ContentPipelineItem[];
    createdAt: string;
    startDate: string | null;
    endDate: string | null;
  }
  
  export type CampaignStatusFilter = "all" | "draft" | "matching" | "live" | "review" | "completed";
  export type CampaignSortField = "name" | "budget" | "createdAt";