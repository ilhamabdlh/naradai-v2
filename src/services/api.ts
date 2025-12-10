import axios from 'axios';
import { PriorityAction, PriorityActionFormData, ApiResponse } from '../types/priorityAction';
import { DashboardStat, DashboardStatFormData, ApiResponse as StatApiResponse } from '../types/dashboardStat';
import { Risk, RiskFormData, ApiResponse as RiskApiResponse } from '../types/risk';
import { Opportunity, OpportunityFormData, ApiResponse as OppApiResponse } from '../types/opportunity';
import { SentimentTrend, SentimentTrendFormData, ApiResponse as SentimentTrendApiResponse } from '../types/sentimentTrend';
import { DiscussionTopic, DiscussionTopicFormData, ApiResponse as DiscussionTopicApiResponse } from '../types/discussionTopic';
import { CompetitiveAnalysis, CompetitiveAnalysisFormData, ApiResponse as CompetitiveAnalysisApiResponse } from '../types/competitiveAnalysis';
import { ConversationCluster, ConversationClusterFormData, ApiResponse as ConversationClusterApiResponse } from '../types/conversationCluster';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const priorityActionsApi = {
  // Get all priority actions
  getAll: async (params?: { priority?: string; status?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get<ApiResponse<PriorityAction[]>>('/priority-actions', { params });
    return response.data;
  },

  // Get single priority action by ID
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<PriorityAction>>(`/priority-actions/${id}`);
    return response.data;
  },

  // Create new priority action
  create: async (data: PriorityActionFormData) => {
    const response = await apiClient.post<ApiResponse<PriorityAction>>('/priority-actions', data);
    return response.data;
  },

  // Update existing priority action
  update: async (id: string, data: PriorityActionFormData) => {
    const response = await apiClient.put<ApiResponse<PriorityAction>>(`/priority-actions/${id}`, data);
    return response.data;
  },

  // Delete priority action
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/priority-actions/${id}`);
    return response.data;
  },

  // Update status only
  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.put<ApiResponse<PriorityAction>>(`/priority-actions/${id}/status`, { status });
    return response.data;
  },
};

export const dashboardStatsApi = {
  // Get all dashboard stats
  getAll: async (params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<StatApiResponse<DashboardStat[]>>('/dashboard-stats', { params });
    return response.data;
  },

  // Get single dashboard stat by ID
  getById: async (id: string) => {
    const response = await apiClient.get<StatApiResponse<DashboardStat>>(`/dashboard-stats/${id}`);
    return response.data;
  },

  // Create new dashboard stat
  create: async (data: DashboardStatFormData) => {
    const response = await apiClient.post<StatApiResponse<DashboardStat>>('/dashboard-stats', data);
    return response.data;
  },

  // Update existing dashboard stat
  update: async (id: string, data: DashboardStatFormData) => {
    const response = await apiClient.put<StatApiResponse<DashboardStat>>(`/dashboard-stats/${id}`, data);
    return response.data;
  },

  // Delete dashboard stat
  delete: async (id: string) => {
    const response = await apiClient.delete<StatApiResponse<void>>(`/dashboard-stats/${id}`);
    return response.data;
  },
};

export const risksApi = {
  // Get all risks
  getAll: async (params?: { is_active?: boolean; severity?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get<RiskApiResponse<Risk[]>>('/risks', { params });
    return response.data;
  },

  // Get single risk by ID
  getById: async (id: string) => {
    const response = await apiClient.get<RiskApiResponse<Risk>>(`/risks/${id}`);
    return response.data;
  },

  // Create new risk
  create: async (data: RiskFormData) => {
    const response = await apiClient.post<RiskApiResponse<Risk>>('/risks', data);
    return response.data;
  },

  // Update existing risk
  update: async (id: string, data: RiskFormData) => {
    const response = await apiClient.put<RiskApiResponse<Risk>>(`/risks/${id}`, data);
    return response.data;
  },

  // Delete risk
  delete: async (id: string) => {
    const response = await apiClient.delete<RiskApiResponse<void>>(`/risks/${id}`);
    return response.data;
  },
};

export const opportunitiesApi = {
  // Get all opportunities
  getAll: async (params?: { is_active?: boolean; potential?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get<OppApiResponse<Opportunity[]>>('/opportunities', { params });
    return response.data;
  },

  // Get single opportunity by ID
  getById: async (id: string) => {
    const response = await apiClient.get<OppApiResponse<Opportunity>>(`/opportunities/${id}`);
    return response.data;
  },

  // Create new opportunity
  create: async (data: OpportunityFormData) => {
    const response = await apiClient.post<OppApiResponse<Opportunity>>('/opportunities', data);
    return response.data;
  },

  // Update existing opportunity
  update: async (id: string, data: OpportunityFormData) => {
    const response = await apiClient.put<OppApiResponse<Opportunity>>(`/opportunities/${id}`, data);
    return response.data;
  },

  // Delete opportunity
  delete: async (id: string) => {
    const response = await apiClient.delete<OppApiResponse<void>>(`/opportunities/${id}`);
    return response.data;
  },
};

export const sentimentTrendsApi = {
  // Get all sentiment trends
  getAll: async (params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<SentimentTrendApiResponse<SentimentTrend[]>>('/sentiment-trends', { params });
    return response.data;
  },

  // Get single sentiment trend by ID
  getById: async (id: string) => {
    const response = await apiClient.get<SentimentTrendApiResponse<SentimentTrend>>(`/sentiment-trends/${id}`);
    return response.data;
  },

  // Create new sentiment trend
  create: async (data: SentimentTrendFormData) => {
    const response = await apiClient.post<SentimentTrendApiResponse<SentimentTrend>>('/sentiment-trends', data);
    return response.data;
  },

  // Update existing sentiment trend
  update: async (id: string, data: SentimentTrendFormData) => {
    const response = await apiClient.put<SentimentTrendApiResponse<SentimentTrend>>(`/sentiment-trends/${id}`, data);
    return response.data;
  },

  // Delete sentiment trend
  delete: async (id: string) => {
    const response = await apiClient.delete<SentimentTrendApiResponse<void>>(`/sentiment-trends/${id}`);
    return response.data;
  },
};

export const discussionTopicsApi = {
  // Get all discussion topics
  getAll: async (params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<DiscussionTopicApiResponse<DiscussionTopic[]>>('/discussion-topics', { params });
    return response.data;
  },

  // Get single discussion topic by ID
  getById: async (id: string) => {
    const response = await apiClient.get<DiscussionTopicApiResponse<DiscussionTopic>>(`/discussion-topics/${id}`);
    return response.data;
  },

  // Create new discussion topic
  create: async (data: DiscussionTopicFormData) => {
    const response = await apiClient.post<DiscussionTopicApiResponse<DiscussionTopic>>('/discussion-topics', data);
    return response.data;
  },

  // Update existing discussion topic
  update: async (id: string, data: DiscussionTopicFormData) => {
    const response = await apiClient.put<DiscussionTopicApiResponse<DiscussionTopic>>(`/discussion-topics/${id}`, data);
    return response.data;
  },

  // Delete discussion topic
  delete: async (id: string) => {
    const response = await apiClient.delete<DiscussionTopicApiResponse<void>>(`/discussion-topics/${id}`);
    return response.data;
  },
};

export const competitiveAnalysesApi = {
  // Get all competitive analyses
  getAll: async (params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<CompetitiveAnalysisApiResponse<CompetitiveAnalysis[]>>('/competitive-analyses', { params });
    return response.data;
  },

  // Get single competitive analysis by ID
  getById: async (id: string) => {
    const response = await apiClient.get<CompetitiveAnalysisApiResponse<CompetitiveAnalysis>>(`/competitive-analyses/${id}`);
    return response.data;
  },

  // Create new competitive analysis
  create: async (data: CompetitiveAnalysisFormData) => {
    const response = await apiClient.post<CompetitiveAnalysisApiResponse<CompetitiveAnalysis>>('/competitive-analyses', data);
    return response.data;
  },

  // Update existing competitive analysis
  update: async (id: string, data: CompetitiveAnalysisFormData) => {
    const response = await apiClient.put<CompetitiveAnalysisApiResponse<CompetitiveAnalysis>>(`/competitive-analyses/${id}`, data);
    return response.data;
  },

  // Delete competitive analysis
  delete: async (id: string) => {
    const response = await apiClient.delete<CompetitiveAnalysisApiResponse<void>>(`/competitive-analyses/${id}`);
    return response.data;
  },
};

export const conversationClustersApi = {
  // Get all conversation clusters
  getAll: async (params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const response = await apiClient.get<ConversationClusterApiResponse<ConversationCluster[]>>('/conversation-clusters', { params });
    return response.data;
  },

  // Get single conversation cluster by ID
  getById: async (id: string) => {
    const response = await apiClient.get<ConversationClusterApiResponse<ConversationCluster>>(`/conversation-clusters/${id}`);
    return response.data;
  },

  // Create new conversation cluster
  create: async (data: ConversationClusterFormData) => {
    const response = await apiClient.post<ConversationClusterApiResponse<ConversationCluster>>('/conversation-clusters', data);
    return response.data;
  },

  // Update existing conversation cluster
  update: async (id: string, data: ConversationClusterFormData) => {
    const response = await apiClient.put<ConversationClusterApiResponse<ConversationCluster>>(`/conversation-clusters/${id}`, data);
    return response.data;
  },

  // Delete conversation cluster
  delete: async (id: string) => {
    const response = await apiClient.delete<ConversationClusterApiResponse<void>>(`/conversation-clusters/${id}`);
    return response.data;
  },
};

