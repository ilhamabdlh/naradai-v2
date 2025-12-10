import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useConversationClusters } from "../hooks/useConversationClusters";
import { ConversationCluster } from "../types/conversationCluster";

export function ConversationClusters() {
  const { clusters, loading } = useConversationClusters();
  const [activeClusters, setActiveClusters] = useState<ConversationCluster[]>([]);

  useEffect(() => {
    // Get active clusters, sorted by order and size
    const active = clusters
      .filter(c => c.is_active)
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return b.size - a.size;
      });
    setActiveClusters(active);
  }, [clusters]);

  // Default data if no clusters found
  const defaultClusters = [
    {
      id: "default-1",
      theme: "Packaging Damage Issues",
      size: 2847,
      sentiment: -0.68,
      trend: "up" as const,
      keywords: ["broken", "damaged", "poor packaging", "arrived broken"],
      is_active: true,
      order: 0,
    },
    {
      id: "default-2",
      theme: "Excellent Product Quality",
      size: 1923,
      sentiment: 0.71,
      trend: "stable" as const,
      keywords: ["high quality", "durable", "worth it", "exceeded expectations"],
      is_active: true,
      order: 1,
    },
    {
      id: "default-3",
      theme: "Customer Support Delays",
      size: 2341,
      sentiment: -0.54,
      trend: "up" as const,
      keywords: ["slow response", "waiting", "no reply", "poor support"],
      is_active: true,
      order: 2,
    },
    {
      id: "default-4",
      theme: "Fast Shipping Praise",
      size: 1654,
      sentiment: 0.32,
      trend: "down" as const,
      keywords: ["quick delivery", "fast shipping", "arrived early", "prompt"],
      is_active: true,
      order: 3,
    },
  ];

  const displayClusters = activeClusters.length > 0 ? activeClusters : defaultClusters;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayClusters.map((cluster) => {
        const TrendIcon = cluster.trend === "up" ? TrendingUp : cluster.trend === "down" ? TrendingDown : Minus;
        const trendColor = cluster.trend === "up" ? "text-amber-600" : cluster.trend === "down" ? "text-cyan-600" : "text-slate-600";
        
        return (
          <div
            key={cluster.id}
            className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-violet-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-slate-900">{cluster.theme}</h4>
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-600">
                    {cluster.size.toLocaleString()} mentions
                  </span>
                  <span className={cluster.sentiment < 0 ? "text-red-600" : "text-emerald-600"}>
                    {cluster.sentiment > 0 ? '+' : ''}{cluster.sentiment.toFixed(2)} sentiment
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cluster.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2.5 py-1 bg-violet-100 border border-violet-200 rounded-md text-xs text-violet-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}