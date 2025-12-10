import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDiscussionTopics } from "../hooks/useDiscussionTopics";
import { DiscussionTopic } from "../types/discussionTopic";

export function TopicsChart() {
  const { topics, loading } = useDiscussionTopics();
  const [activeTopics, setActiveTopics] = useState<DiscussionTopic[]>([]);

  useEffect(() => {
    // Get active topics, sorted by order and volume
    const active = topics
      .filter(t => t.is_active)
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return b.volume - a.volume;
      });
    setActiveTopics(active);
  }, [topics]);

  // Default data if no topics found
  const defaultData = [
    { topic: "Packaging", mentions: 2847, sentiment: -0.68 },
    { topic: "Customer Service", mentions: 2341, sentiment: -0.54 },
    { topic: "Product Quality", mentions: 1923, sentiment: 0.71 },
    { topic: "Shipping Speed", mentions: 1654, sentiment: 0.32 },
    { topic: "Price Value", mentions: 1432, sentiment: 0.45 },
    { topic: "Mobile App", mentions: 892, sentiment: 0.12 },
  ];

  // Transform topics to chart format
  const chartData = activeTopics.length > 0
    ? activeTopics.map(topic => ({
        topic: topic.name,
        mentions: topic.volume,
        sentiment: topic.sentiment_score,
      }))
    : defaultData;

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
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            type="category" 
            dataKey="topic" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#0f172a',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "mentions") {
                return [value.toLocaleString(), "Mentions"];
              }
              return value;
            }}
          />
          <Bar 
            dataKey="mentions" 
            fill="url(#barGradient)" 
            radius={[0, 8, 8, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {chartData.slice(0, 3).map((item, index) => (
          <div key={`${item.topic}-${index}`} className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{item.topic}</span>
            <span className={item.sentiment < 0 ? "text-red-600" : "text-emerald-600"}>
              {item.sentiment > 0 ? '+' : ''}{item.sentiment.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}