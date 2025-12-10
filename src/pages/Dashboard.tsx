import { ActionRecommendations } from "../components/ActionRecommendations";
import { RecentInsights } from "../components/RecentInsights";
import { AIAssistant } from "../components/AIAssistant";
import { StatsOverview } from "../components/StatsOverview";
import { RisksOpportunities } from "../components/RisksOpportunities";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative">
        <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
          {/* Action Recommendations */}
          <ActionRecommendations />
          
          {/* AI Assistant - Prominent position */}
          <AIAssistant />
          
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Risks & Opportunities */}
          <RisksOpportunities />
          
          {/* Recent Insights */}
          <RecentInsights />
        </main>
      </div>
    </div>
  );
}

