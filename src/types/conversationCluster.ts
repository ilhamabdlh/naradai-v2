export interface ConversationCluster {
  id: string;
  theme: string;
  size: number; // mentions count
  sentiment: number;
  trend: "up" | "down" | "stable";
  keywords: string[];
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationClusterFormData {
  theme: string;
  size: number;
  sentiment: number;
  trend: "up" | "down" | "stable";
  keywords: string[];
  is_active: boolean;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}

