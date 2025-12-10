export interface DiscussionTopic {
  id: string;
  name: string;
  volume: number;
  sentiment_score: number;
  color: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiscussionTopicFormData {
  name: string;
  volume: number;
  sentiment_score: number;
  color: string;
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

