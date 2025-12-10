export type StatTrend = "up" | "down";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: StatTrend;
  icon: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStatFormData {
  label: string;
  value: string;
  change: string;
  trend: StatTrend;
  icon: string;
  order: number;
  is_active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}



