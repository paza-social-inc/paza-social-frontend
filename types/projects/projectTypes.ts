// Project-related types derived from create and detail flows

export interface ProjectCreateRequest {
  creatorId: string;
  email?: string;
  [key: string]: any;
  images?: string[];
  proposals: any[];
  milestones: any[];
}

export interface Project {
  _id: string;
  creatorId: string;
  title?: string;
  description?: string;
  images?: string[];
  values?: Record<string, any>;
  proposals?: any[];
  milestones?: any[];
}

export interface ProjectCreateResponse {
  message?: string;
  success?: boolean;
  project?: Project;
}

export interface ProjectGetResponse extends Project {}


