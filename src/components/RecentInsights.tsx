import { TrendingUp, MessageCircle, Package, Users, Trophy } from "lucide-react";
import { SentimentChart } from "./SentimentChart";
import { TopicsChart } from "./TopicsChart";
import { CompetitorComparison } from "./CompetitorComparison";
import { ConversationClusters } from "./ConversationClusters";

export function RecentInsights() {
  const insights = [
    {
      id: 1,
      title: "Sentiment Trends",
      subtitle: "Last 30 days",
      icon: TrendingUp,
      component: SentimentChart,
    },
    {
      id: 2,
      title: "Top Discussion Topics",
      subtitle: "By volume",
      icon: MessageCircle,
      component: TopicsChart,
    },
    {
      id: 3,
      title: "Competitive Analysis",
      subtitle: "Share of voice",
      icon: Trophy,
      component: CompetitorComparison,
    },
    {
      id: 4,
      title: "Conversation Clusters",
      subtitle: "AI-detected themes",
      icon: Users,
      component: ConversationClusters,
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-violet-600" />
        <div>
          <h2 className="text-slate-900">What's Happening</h2>
          <p className="text-sm text-slate-600">Real-time insights from social conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const Component = insight.component;
          return (
            <div
              key={insight.id}
              className="rounded-2xl bg-white backdrop-blur-sm border border-slate-200 hover:border-violet-300 transition-colors overflow-hidden shadow-sm hover:shadow-lg"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900">{insight.title}</h3>
                    <p className="text-sm text-slate-600">{insight.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Component />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}