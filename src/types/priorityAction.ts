export type Priority = "critical" | "high" | "medium";
export type Impact = "Critical" | "High" | "Medium" | "Low";
export type Effort = "Low" | "Medium" | "High";
export type Trend = "increasing" | "decreasing" | "stable";
export type Status = "not-started" | "in-progress" | "completed";

export interface PriorityAction {
  id: string;  // MongoDB ObjectID as string
  priority: Priority;
  title: string;
  description: string;
  impact: Impact;
  effort: Effort;
  recommendation: string;
  mentions: number;
  sentiment: number;
  trend: Trend;
  icon: string;
  status?: Status;
  created_at?: string;
  updated_at?: string;
}

export interface PriorityActionFormData {
  priority: Priority;
  title: string;
  description: string;
  impact: Impact;
  effort: Effort;
  recommendation: string;
  mentions: number;
  sentiment: number;
  trend: Trend;
  icon: string;
  status?: Status;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}

