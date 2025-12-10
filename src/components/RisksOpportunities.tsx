import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { RiskCard } from "./RiskCard";
import { OpportunityCard } from "./OpportunityCard";
import { risksApi, opportunitiesApi } from "../services/api";
import { Risk } from "../types/risk";
import { Opportunity } from "../types/opportunity";

// Default data for fallback
const defaultRisks: Risk[] = [
  {
    id: "default-1",
    title: "Declining Brand Sentiment",
    description: "Negative sentiment increased by 14% over the last 7 days",
    severity: "high",
    probability: 85,
    impact_assessment: "Brand reputation",
    trend: "increasing",
    indicators: [
      { label: "Customer Service", value: -0.54, change: -12 },
      { label: "Product Quality", value: -0.28, change: -8 },
      { label: "Packaging", value: -0.68, change: -23 },
    ],
    mitigation_strategy: [
      "Monitor sentiment trends daily for early warning signs",
      "Prepare response communication templates",
      "Engage customer support team for rapid response",
    ],
    is_active: true,
    order: 0,
  },
  {
    id: "default-2",
    title: "Competitor Gaining Market Share",
    description: "Competitor B's share of voice increased 8% this month",
    severity: "medium",
    probability: 72,
    impact_assessment: "Market position",
    trend: "increasing",
    indicators: [
      { label: "Social Mentions", value: 24, change: 8 },
      { label: "Engagement Rate", value: 7.8, change: 12 },
      { label: "Positive Sentiment", value: 75, change: 6 },
    ],
    mitigation_strategy: [],
    is_active: true,
    order: 1,
  },
  {
    id: "default-3",
    title: "Product Launch Backlash Risk",
    description: "Early feedback on new feature shows 42% negative response",
    severity: "critical",
    probability: 68,
    impact_assessment: "Product adoption",
    trend: "stable",
    indicators: [
      { label: "Usability Issues", value: 156, change: 45 },
      { label: "Performance Complaints", value: 89, change: 23 },
      { label: "Design Criticism", value: 67, change: 12 },
    ],
    mitigation_strategy: [],
    is_active: true,
    order: 2,
  },
];

const defaultOpportunities: Opportunity[] = [
  {
    id: "default-1",
    title: "Sustainability Movement Alignment",
    description: "34% of conversations mention eco-friendly preferences",
    potential: "high",
    confidence_score: 88,
    timeframe: "Short-term",
    category: "Product positioning",
    trend: "increasing",
    key_metrics: [
      { label: "Conversation Volume", value: "4,521" },
      { label: "Growth Rate", value: "34%" },
      { label: "Sentiment Score", value: "0.76" },
    ],
    recommended_actions: [
      "Launch eco-friendly product line",
      "Highlight sustainable practices",
      "Partner with environmental organizations",
    ],
    is_active: true,
    order: 0,
  },
  {
    id: "default-2",
    title: "Untapped Mobile User Segment",
    description: "Mobile users show 2.3x higher engagement but underserved",
    potential: "high",
    confidence_score: 91,
    timeframe: "Medium-term",
    category: "Market expansion",
    trend: "increasing",
    key_metrics: [
      { label: "Segment Size", value: "156,000" },
      { label: "Engagement Rate", value: "12.4%" },
      { label: "Conversion Potential", value: "68%" },
    ],
    recommended_actions: [
      "Optimize mobile app experience",
      "Create mobile-first features",
      "Target mobile advertising",
    ],
    is_active: true,
    order: 1,
  },
  {
    id: "default-3",
    title: "Influencer Partnership Gap",
    description: "Competitors have 3x more influencer mentions",
    potential: "medium",
    confidence_score: 79,
    timeframe: "Short-term",
    category: "Brand awareness",
    trend: "stable",
    key_metrics: [
      { label: "Current Influencers", value: "12" },
      { label: "Competitor Average", value: "36" },
      { label: "Potential Reach", value: "2.4M" },
    ],
    recommended_actions: [
      "Identify micro-influencer partners",
      "Launch influencer campaign",
      "Create ambassador program",
    ],
    is_active: true,
    order: 2,
  },
];

export function RisksOpportunities() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch risks and opportunities in parallel
        const [risksResponse, opportunitiesResponse] = await Promise.all([
          risksApi.getAll({ is_active: true }),
          opportunitiesApi.getAll({ is_active: true }),
        ]);

        if (risksResponse.success && risksResponse.data && risksResponse.data.length > 0) {
          setRisks(risksResponse.data);
        } else {
          setRisks(defaultRisks);
        }

        if (opportunitiesResponse.success && opportunitiesResponse.data && opportunitiesResponse.data.length > 0) {
          setOpportunities(opportunitiesResponse.data);
        } else {
          setOpportunities(defaultOpportunities);
        }
      } catch (error) {
        console.error("Failed to fetch risks and opportunities:", error);
        // Use default data on error
        setRisks(defaultRisks);
        setOpportunities(defaultOpportunities);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use API data if available, otherwise use defaults
  const displayRisks = risks.length > 0 ? risks : defaultRisks;
  const displayOpportunities = opportunities.length > 0 ? opportunities : defaultOpportunities;

  if (loading) {
    return (
      <section>
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-violet-600" />
          <div>
            <h2 className="text-slate-900">Risks & Opportunities</h2>
            <p className="text-sm text-slate-600">AI-detected threats and growth opportunities from social intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loading skeleton for Risks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-slate-900">Risks</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Loading skeleton for Opportunities */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-slate-900">Opportunities</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-6 h-6 text-violet-600" />
        <div>
          <h2 className="text-slate-900">Risks & Opportunities</h2>
          <p className="text-sm text-slate-600">AI-detected threats and growth opportunities from social intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-slate-900">Risks</h3>
            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs">
              {displayRisks.length} Active
            </span>
          </div>
          <div className="space-y-4">
            {displayRisks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </div>

        {/* Opportunities Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-slate-900">Opportunities</h3>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
              {displayOpportunities.length} Identified
            </span>
          </div>
          <div className="space-y-4">
            {displayOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
