export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type RiskTrend = "increasing" | "stable" | "decreasing";

export interface RiskIndicator {
  label: string;
  value: number;
  change: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  probability: number;
  impact_assessment: string;
  trend: RiskTrend;
  indicators: RiskIndicator[];
  mitigation_strategy: string[];
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface RiskFormData {
  title: string;
  description: string;
  severity: RiskSeverity;
  probability: number;
  impact_assessment: string;
  trend: RiskTrend;
  indicators: RiskIndicator[];
  mitigation_strategy: string[];
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



