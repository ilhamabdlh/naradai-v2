import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Users, BarChart3, Activity, Percent, Eye } from "lucide-react";
import { dashboardStatsApi } from "../services/api";
import { DashboardStat } from "../types/dashboardStat";

// Icon mapping
const iconMap: Record<string, any> = {
  Users,
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Percent,
  Eye,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || BarChart3;
};

// Default stats for fallback
const defaultStats = [
  { label: "Conversations Analyzed", value: "847.2K", change: "+12.5%", trend: "up" as const, icon: "Users" },
  { label: "Sentiment Score", value: "72", change: "-3.2%", trend: "down" as const, icon: "TrendingDown" },
  { label: "Active Issues", value: "23", change: "+8", trend: "up" as const, icon: "AlertTriangle" },
  { label: "Engagement Rate", value: "8.4%", change: "+2.1%", trend: "up" as const, icon: "TrendingUp" },
];

export function StatsOverview() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardStatsApi.getAll({ is_active: true });
        if (response.success && response.data && response.data.length > 0) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Use API data if available, otherwise fallback to defaults
  const displayStats = stats.length > 0 ? stats : defaultStats.map((s, i) => ({
    id: `default-${i}`,
    ...s,
    order: i,
    is_active: true,
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="w-16 h-6 rounded-full bg-slate-200" />
            </div>
            <div>
              <div className="h-8 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => {
        const Icon = getIconComponent(stat.icon);
        return (
          <div
            key={stat.id || stat.label}
            className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-sm border border-slate-200 p-6 hover:border-violet-300 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-violet-600" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm px-2.5 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-3xl text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}