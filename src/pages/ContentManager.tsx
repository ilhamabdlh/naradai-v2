import React, { useState } from "react";
import { Target, BarChart3, AlertTriangle, Sparkles, TrendingUp, MessageSquare, Trophy, Users } from "lucide-react";
import { cn } from "../components/ui/utils";

// Import managers
import { PriorityActionsTable } from "../components/PriorityActionsTable";
import { PriorityActionForm } from "../components/PriorityActionForm";
import { usePriorityActions } from "../hooks/usePriorityActions";
import { PriorityAction, PriorityActionFormData } from "../types/priorityAction";

import { DashboardStatsTable } from "../components/DashboardStatsTable";
import { DashboardStatForm } from "../components/DashboardStatForm";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStat, DashboardStatFormData } from "../types/dashboardStat";

import { RisksTable } from "../components/RisksTable";
import { RiskForm } from "../components/RiskForm";
import { useRisks } from "../hooks/useRisks";
import { Risk, RiskFormData } from "../types/risk";

import { OpportunitiesTable } from "../components/OpportunitiesTable";
import { OpportunityForm } from "../components/OpportunityForm";
import { useOpportunities } from "../hooks/useOpportunities";
import { Opportunity, OpportunityFormData } from "../types/opportunity";

import { SentimentTrendsTable } from "../components/SentimentTrendsTable";
import { SentimentTrendForm } from "../components/SentimentTrendForm";
import { useSentimentTrends } from "../hooks/useSentimentTrends";
import { SentimentTrend, SentimentTrendFormData } from "../types/sentimentTrend";

import { DiscussionTopicsTable } from "../components/DiscussionTopicsTable";
import { DiscussionTopicForm } from "../components/DiscussionTopicForm";
import { useDiscussionTopics } from "../hooks/useDiscussionTopics";
import { DiscussionTopic, DiscussionTopicFormData } from "../types/discussionTopic";

import { CompetitiveAnalysesTable } from "../components/CompetitiveAnalysesTable";
import { CompetitiveAnalysisForm } from "../components/CompetitiveAnalysisForm";
import { useCompetitiveAnalyses } from "../hooks/useCompetitiveAnalyses";
import { CompetitiveAnalysis, CompetitiveAnalysisFormData } from "../types/competitiveAnalysis";

import { ConversationClustersTable } from "../components/ConversationClustersTable";
import { ConversationClusterForm } from "../components/ConversationClusterForm";
import { useConversationClusters } from "../hooks/useConversationClusters";
import { ConversationCluster, ConversationClusterFormData } from "../types/conversationCluster";

import { Toaster } from "../components/ui/sonner";

type TabType = "priority-actions" | "dashboard-stats" | "risks" | "opportunities" | "sentiment-trends" | "discussion-topics" | "competitive-analyses" | "conversation-clusters";

const tabs = [
  { id: "priority-actions" as TabType, label: "Priority Actions", icon: Target },
  { id: "dashboard-stats" as TabType, label: "Dashboard Stats", icon: BarChart3 },
  { id: "risks" as TabType, label: "Risks", icon: AlertTriangle },
  { id: "opportunities" as TabType, label: "Opportunities", icon: Sparkles },
  { id: "sentiment-trends" as TabType, label: "Sentiment Trends", icon: TrendingUp },
  { id: "discussion-topics" as TabType, label: "Discussion Topics", icon: MessageSquare },
  { id: "competitive-analyses" as TabType, label: "Competitive Analysis", icon: Trophy },
  { id: "conversation-clusters" as TabType, label: "Conversation Clusters", icon: Users },
];

export function ContentManager() {
  const [activeTab, setActiveTab] = useState<TabType>("priority-actions");

  // Priority Actions state
  const { 
    actions, 
    loading: actionsLoading, 
    createAction, 
    updateAction, 
    deleteAction 
  } = usePriorityActions();
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<PriorityAction | null>(null);
  const [actionFormLoading, setActionFormLoading] = useState(false);

  // Dashboard Stats state
  const { 
    stats, 
    loading: statsLoading, 
    createStat, 
    updateStat, 
    deleteStat 
  } = useDashboardStats();
  const [statFormOpen, setStatFormOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<DashboardStat | null>(null);
  const [statFormLoading, setStatFormLoading] = useState(false);

  // Risks state
  const {
    risks,
    loading: risksLoading,
    createRisk,
    updateRisk,
    deleteRisk,
  } = useRisks();
  const [riskFormOpen, setRiskFormOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [riskFormLoading, setRiskFormLoading] = useState(false);

  // Opportunities state
  const {
    opportunities,
    loading: opportunitiesLoading,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  } = useOpportunities();
  const [opportunityFormOpen, setOpportunityFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [opportunityFormLoading, setOpportunityFormLoading] = useState(false);

  // Sentiment Trends state
  const {
    trends,
    loading: trendsLoading,
    createTrend,
    updateTrend,
    deleteTrend,
  } = useSentimentTrends();
  const [trendFormOpen, setTrendFormOpen] = useState(false);
  const [editingTrend, setEditingTrend] = useState<SentimentTrend | null>(null);
  const [trendFormLoading, setTrendFormLoading] = useState(false);

  // Discussion Topics state
  const {
    topics,
    loading: topicsLoading,
    createTopic,
    updateTopic,
    deleteTopic,
  } = useDiscussionTopics();
  const [topicFormOpen, setTopicFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<DiscussionTopic | null>(null);
  const [topicFormLoading, setTopicFormLoading] = useState(false);

  // Competitive Analyses state
  const {
    analyses,
    loading: analysesLoading,
    createAnalysis,
    updateAnalysis,
    deleteAnalysis,
  } = useCompetitiveAnalyses();
  const [analysisFormOpen, setAnalysisFormOpen] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [analysisFormLoading, setAnalysisFormLoading] = useState(false);

  // Conversation Clusters state
  const {
    clusters,
    loading: clustersLoading,
    createCluster,
    updateCluster,
    deleteCluster,
  } = useConversationClusters();
  const [clusterFormOpen, setClusterFormOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ConversationCluster | null>(null);
  const [clusterFormLoading, setClusterFormLoading] = useState(false);

  // Priority Actions handlers
  const handleCreateAction = () => {
    setEditingAction(null);
    setActionFormOpen(true);
  };

  const handleEditAction = (action: PriorityAction) => {
    setEditingAction(action);
    setActionFormOpen(true);
  };

  const handleDeleteAction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this action?")) {
      deleteAction(id);
    }
  };

  const handleActionFormSubmit = async (data: PriorityActionFormData) => {
    try {
      setActionFormLoading(true);
      if (editingAction && editingAction.id) {
        await updateAction(editingAction.id, data);
      } else {
        await createAction(data);
      }
      setActionFormOpen(false);
      setEditingAction(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setActionFormLoading(false);
    }
  };

  // Dashboard Stats handlers
  const handleCreateStat = () => {
    setEditingStat(null);
    setStatFormOpen(true);
  };

  const handleEditStat = (stat: DashboardStat) => {
    setEditingStat(stat);
    setStatFormOpen(true);
  };

  const handleDeleteStat = (id: string) => {
    if (window.confirm("Are you sure you want to delete this stat?")) {
      deleteStat(id);
    }
  };

  const handleStatFormSubmit = async (data: DashboardStatFormData) => {
    try {
      setStatFormLoading(true);
      if (editingStat && editingStat.id) {
        await updateStat(editingStat.id, data);
      } else {
        await createStat(data);
      }
      setStatFormOpen(false);
      setEditingStat(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setStatFormLoading(false);
    }
  };

  // Risks handlers
  const handleCreateRisk = () => {
    setEditingRisk(null);
    setRiskFormOpen(true);
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    setRiskFormOpen(true);
  };

  const handleDeleteRisk = (id: string) => {
    if (window.confirm("Are you sure you want to delete this risk?")) {
      deleteRisk(id);
    }
  };

  const handleRiskFormSubmit = async (data: RiskFormData) => {
    try {
      setRiskFormLoading(true);
      if (editingRisk && editingRisk.id) {
        await updateRisk(editingRisk.id, data);
      } else {
        await createRisk(data);
      }
      setRiskFormOpen(false);
      setEditingRisk(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setRiskFormLoading(false);
    }
  };

  // Opportunities handlers
  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setOpportunityFormOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setOpportunityFormOpen(true);
  };

  const handleDeleteOpportunity = (id: string) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      deleteOpportunity(id);
    }
  };

  const handleOpportunityFormSubmit = async (data: OpportunityFormData) => {
    try {
      setOpportunityFormLoading(true);
      if (editingOpportunity && editingOpportunity.id) {
        await updateOpportunity(editingOpportunity.id, data);
      } else {
        await createOpportunity(data);
      }
      setOpportunityFormOpen(false);
      setEditingOpportunity(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setOpportunityFormLoading(false);
    }
  };

  // Sentiment Trends handlers
  const handleCreateTrend = () => {
    setEditingTrend(null);
    setTrendFormOpen(true);
  };

  const handleEditTrend = (trend: SentimentTrend) => {
    setEditingTrend(trend);
    setTrendFormOpen(true);
  };

  const handleDeleteTrend = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sentiment trend?")) {
      deleteTrend(id);
    }
  };

  const handleTrendFormSubmit = async (data: SentimentTrendFormData) => {
    try {
      setTrendFormLoading(true);
      if (editingTrend && editingTrend.id) {
        await updateTrend(editingTrend.id, data);
      } else {
        await createTrend(data);
      }
      setTrendFormOpen(false);
      setEditingTrend(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setTrendFormLoading(false);
    }
  };

  // Discussion Topics handlers
  const handleCreateTopic = () => {
    setEditingTopic(null);
    setTopicFormOpen(true);
  };

  const handleEditTopic = (topic: DiscussionTopic) => {
    setEditingTopic(topic);
    setTopicFormOpen(true);
  };

  const handleDeleteTopic = (id: string) => {
    if (window.confirm("Are you sure you want to delete this discussion topic?")) {
      deleteTopic(id);
    }
  };

  const handleTopicFormSubmit = async (data: DiscussionTopicFormData) => {
    try {
      setTopicFormLoading(true);
      if (editingTopic && editingTopic.id) {
        await updateTopic(editingTopic.id, data);
      } else {
        await createTopic(data);
      }
      setTopicFormOpen(false);
      setEditingTopic(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setTopicFormLoading(false);
    }
  };

  // Competitive Analyses handlers
  const handleCreateAnalysis = () => {
    setEditingAnalysis(null);
    setAnalysisFormOpen(true);
  };

  const handleEditAnalysis = (analysis: CompetitiveAnalysis) => {
    setEditingAnalysis(analysis);
    setAnalysisFormOpen(true);
  };

  const handleDeleteAnalysis = (id: string) => {
    if (window.confirm("Are you sure you want to delete this competitive analysis?")) {
      deleteAnalysis(id);
    }
  };

  const handleAnalysisFormSubmit = async (data: CompetitiveAnalysisFormData) => {
    try {
      setAnalysisFormLoading(true);
      if (editingAnalysis && editingAnalysis.id) {
        await updateAnalysis(editingAnalysis.id, data);
      } else {
        await createAnalysis(data);
      }
      setAnalysisFormOpen(false);
      setEditingAnalysis(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setAnalysisFormLoading(false);
    }
  };

  const handleAnalysisFormSubmitAndAddNew = async (data: CompetitiveAnalysisFormData) => {
    try {
      setAnalysisFormLoading(true);
      await createAnalysis(data);
      // Reset form but keep popup open
      setEditingAnalysis(null);
      // Form will reset automatically because initialData becomes null
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setAnalysisFormLoading(false);
    }
  };

  // Conversation Clusters handlers
  const handleCreateCluster = () => {
    setEditingCluster(null);
    setClusterFormOpen(true);
  };

  const handleEditCluster = (cluster: ConversationCluster) => {
    setEditingCluster(cluster);
    setClusterFormOpen(true);
  };

  const handleDeleteCluster = (id: string) => {
    if (window.confirm("Are you sure you want to delete this conversation cluster?")) {
      deleteCluster(id);
    }
  };

  const handleClusterFormSubmit = async (data: ConversationClusterFormData) => {
    try {
      setClusterFormLoading(true);
      if (editingCluster && editingCluster.id) {
        await updateCluster(editingCluster.id, data);
      } else {
        await createCluster(data);
      }
      setClusterFormOpen(false);
      setEditingCluster(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setClusterFormLoading(false);
    }
  };

  const handleClusterFormSubmitAndAddNew = async (data: ConversationClusterFormData) => {
    try {
      setClusterFormLoading(true);
      await createCluster(data);
      // Reset form but keep popup open
      setEditingCluster(null);
      // Form will reset automatically because initialData becomes null
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setClusterFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Content Manager</h1>
              <p className="text-sm text-slate-600">Manage dashboard content and configurations</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Priority Actions Tab */}
            {activeTab === "priority-actions" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Priority Actions</h2>
                      <p className="text-sm text-slate-600">Manage priority actions for dashboard recommendations</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateAction}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Action</span>
                  </button>
                </div>

                <PriorityActionsTable
                  actions={actions}
                  onEdit={handleEditAction}
                  onDelete={handleDeleteAction}
                  loading={actionsLoading}
                />

                <PriorityActionForm
                  open={actionFormOpen}
                  onOpenChange={(open) => {
                    setActionFormOpen(open);
                    if (!open) setEditingAction(null);
                  }}
                  onSubmit={handleActionFormSubmit}
                  initialData={editingAction}
                  loading={actionFormLoading}
                />
              </>
            )}

            {/* Dashboard Stats Tab */}
            {activeTab === "dashboard-stats" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Dashboard Stats</h2>
                      <p className="text-sm text-slate-600">Manage stat cards displayed on the dashboard overview</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateStat}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Stat</span>
                  </button>
                </div>

                <DashboardStatsTable
                  stats={stats}
                  onEdit={handleEditStat}
                  onDelete={handleDeleteStat}
                  loading={statsLoading}
                />

                <DashboardStatForm
                  open={statFormOpen}
                  onOpenChange={(open) => {
                    setStatFormOpen(open);
                    if (!open) setEditingStat(null);
                  }}
                  onSubmit={handleStatFormSubmit}
                  initialData={editingStat}
                  loading={statFormLoading}
                />
              </>
            )}

            {/* Risks Tab */}
            {activeTab === "risks" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Risks</h2>
                      <p className="text-sm text-slate-600">Manage AI-detected threats and risk assessments</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateRisk}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Risk</span>
                  </button>
                </div>

                <RisksTable
                  risks={risks}
                  onEdit={handleEditRisk}
                  onDelete={handleDeleteRisk}
                  loading={risksLoading}
                />

                <RiskForm
                  open={riskFormOpen}
                  onOpenChange={(open) => {
                    setRiskFormOpen(open);
                    if (!open) setEditingRisk(null);
                  }}
                  onSubmit={handleRiskFormSubmit}
                  initialData={editingRisk}
                  loading={riskFormLoading}
                />
              </>
            )}

            {/* Opportunities Tab */}
            {activeTab === "opportunities" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Opportunities</h2>
                      <p className="text-sm text-slate-600">Manage growth opportunities from social intelligence</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateOpportunity}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Opportunity</span>
                  </button>
                </div>

                <OpportunitiesTable
                  opportunities={opportunities}
                  onEdit={handleEditOpportunity}
                  onDelete={handleDeleteOpportunity}
                  loading={opportunitiesLoading}
                />

                <OpportunityForm
                  open={opportunityFormOpen}
                  onOpenChange={(open) => {
                    setOpportunityFormOpen(open);
                    if (!open) setEditingOpportunity(null);
                  }}
                  onSubmit={handleOpportunityFormSubmit}
                  initialData={editingOpportunity}
                  loading={opportunityFormLoading}
                />
              </>
            )}

            {/* Sentiment Trends Tab */}
            {activeTab === "sentiment-trends" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Sentiment Trends</h2>
                      <p className="text-sm text-slate-600">Manage sentiment analysis trends for dashboard charts</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateTrend}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Sentiment Trend</span>
                  </button>
                </div>

                <SentimentTrendsTable
                  trends={trends}
                  onEdit={handleEditTrend}
                  onDelete={handleDeleteTrend}
                  loading={trendsLoading}
                />

                <SentimentTrendForm
                  open={trendFormOpen}
                  onOpenChange={(open) => {
                    setTrendFormOpen(open);
                    if (!open) setEditingTrend(null);
                  }}
                  onSubmit={handleTrendFormSubmit}
                  initialData={editingTrend}
                  loading={trendFormLoading}
                />
              </>
            )}

            {/* Discussion Topics Tab */}
            {activeTab === "discussion-topics" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Discussion Topics</h2>
                      <p className="text-sm text-slate-600">Manage top discussion topics for dashboard charts</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateTopic}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Topic</span>
                  </button>
                </div>

                <DiscussionTopicsTable
                  topics={topics}
                  onEdit={handleEditTopic}
                  onDelete={handleDeleteTopic}
                  loading={topicsLoading}
                />

                <DiscussionTopicForm
                  open={topicFormOpen}
                  onOpenChange={(open) => {
                    setTopicFormOpen(open);
                    if (!open) setEditingTopic(null);
                  }}
                  onSubmit={handleTopicFormSubmit}
                  initialData={editingTopic}
                  loading={topicFormLoading}
                />
              </>
            )}

            {/* Competitive Analysis Tab */}
            {activeTab === "competitive-analyses" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Competitive Analysis</h2>
                      <p className="text-sm text-slate-600">Manage competitive analysis data for dashboard charts</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateAnalysis}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Analysis</span>
                  </button>
                </div>

                <CompetitiveAnalysesTable
                  analyses={analyses}
                  onEdit={handleEditAnalysis}
                  onDelete={handleDeleteAnalysis}
                  loading={analysesLoading}
                />

                <CompetitiveAnalysisForm
                  open={analysisFormOpen}
                  onOpenChange={(open) => {
                    setAnalysisFormOpen(open);
                    if (!open) setEditingAnalysis(null);
                  }}
                  onSubmit={handleAnalysisFormSubmit}
                  onSubmitAndAddNew={handleAnalysisFormSubmitAndAddNew}
                  initialData={editingAnalysis}
                  loading={analysisFormLoading}
                />
              </>
            )}

            {/* Conversation Clusters Tab */}
            {activeTab === "conversation-clusters" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-violet-600" />
                    <div>
                      <h2 className="text-xl text-slate-900">Conversation Clusters</h2>
                      <p className="text-sm text-slate-600">Manage AI-detected conversation themes and clusters</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateCluster}
                    type="button"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <span className="whitespace-nowrap">+ Add New Cluster</span>
                  </button>
                </div>

                <ConversationClustersTable
                  clusters={clusters}
                  onEdit={handleEditCluster}
                  onDelete={handleDeleteCluster}
                  loading={clustersLoading}
                />

                <ConversationClusterForm
                  open={clusterFormOpen}
                  onOpenChange={(open) => {
                    setClusterFormOpen(open);
                    if (!open) setEditingCluster(null);
                  }}
                  onSubmit={handleClusterFormSubmit}
                  onSubmitAndAddNew={handleClusterFormSubmitAndAddNew}
                  initialData={editingCluster}
                  loading={clusterFormLoading}
                />
              </>
            )}
          </div>

          <Toaster />
        </main>
      </div>
    </div>
  );
}
