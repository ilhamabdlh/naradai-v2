export interface CompetitiveAnalysis {
  id: string;
  name: string;
  share_of_voice: number;
  sentiment: number;
  engagement: number;
  position: string;
  gap_to_leader: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CompetitiveAnalysisFormData {
  name: string;
  share_of_voice: number;
  sentiment: number;
  engagement: number;
  position: string;
  gap_to_leader: string;
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

