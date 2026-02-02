// Task types as used in Campaign -> Tasks tab and task pages

export type TaskStatus = "Completed" | "In Progress" | string;

export interface TaskItem {
  _id?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  campaignId?: string;
  [key: string]: any;
}


