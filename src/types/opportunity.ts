export type OpportunityPotential = "high" | "medium" | "low";
export type OpportunityTrend = "increasing" | "stable" | "decreasing";
export type OpportunityTimeframe = "Short-term" | "Medium-term" | "Long-term";

export interface KeyMetric {
  label: string;
  value: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  potential: OpportunityPotential;
  confidence_score: number;
  timeframe: OpportunityTimeframe;
  category: string;
  trend: OpportunityTrend;
  key_metrics: KeyMetric[];
  recommended_actions: string[];
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface OpportunityFormData {
  title: string;
  description: string;
  potential: OpportunityPotential;
  confidence_score: number;
  timeframe: OpportunityTimeframe;
  category: string;
  trend: OpportunityTrend;
  key_metrics: KeyMetric[];
  recommended_actions: string[];
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



