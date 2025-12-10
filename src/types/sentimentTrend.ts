export interface SentimentDataPoint {
  date: string;
  positive: number;
  negative: number;
}

export interface SentimentTrend {
  id: string;
  title: string;
  period: string;
  positive_percent: number;
  negative_percent: number;
  neutral_percent: number;
  trend_data: SentimentDataPoint[];
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SentimentTrendFormData {
  title: string;
  period: string;
  positive_percent: number;
  negative_percent: number;
  neutral_percent: number;
  trend_data: SentimentDataPoint[];
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

