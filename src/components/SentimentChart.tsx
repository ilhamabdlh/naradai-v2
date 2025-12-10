import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useSentimentTrends } from "../hooks/useSentimentTrends";
import { SentimentTrend } from "../types/sentimentTrend";

export function SentimentChart() {
  const { trends, loading } = useSentimentTrends();
  const [activeTrend, setActiveTrend] = useState<SentimentTrend | null>(null);

  useEffect(() => {
    // Get the first active trend, or first trend if no active ones
    const active = trends.find(t => t.is_active) || trends[0] || null;
    setActiveTrend(active);
  }, [trends]);

  // Default data if no trend found
  const defaultData = [
    { date: "Nov 1", positive: 68, negative: 22, neutral: 10 },
    { date: "Nov 5", positive: 72, negative: 18, neutral: 10 },
    { date: "Nov 9", positive: 75, negative: 15, neutral: 10 },
    { date: "Nov 13", positive: 71, negative: 19, neutral: 10 },
    { date: "Nov 17", positive: 65, negative: 25, neutral: 10 },
    { date: "Nov 21", positive: 62, negative: 28, neutral: 10 },
    { date: "Nov 25", positive: 58, negative: 32, neutral: 10 },
  ];

  // Transform trend_data to chart format
  const chartData = activeTrend?.trend_data?.map(point => ({
    date: point.date,
    positive: point.positive,
    negative: point.negative,
    neutral: 100 - point.positive - point.negative,
  })) || defaultData;

  const positivePercent = activeTrend?.positive_percent || 58;
  const negativePercent = activeTrend?.negative_percent || 32;
  const neutralPercent = activeTrend?.neutral_percent || 10;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b" 
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#0f172a',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="positive"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorPositive)"
          />
          <Area
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#colorNegative)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl text-emerald-600">{positivePercent.toFixed(0)}%</div>
          <div className="text-xs text-slate-600 mt-1">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-red-600">{negativePercent.toFixed(0)}%</div>
          <div className="text-xs text-slate-600 mt-1">Negative</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-slate-600">{neutralPercent.toFixed(0)}%</div>
          <div className="text-xs text-slate-600 mt-1">Neutral</div>
        </div>
      </div>
    </div>
  );
}