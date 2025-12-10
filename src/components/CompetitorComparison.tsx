import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useCompetitiveAnalyses } from "../hooks/useCompetitiveAnalyses";
import { CompetitiveAnalysis } from "../types/competitiveAnalysis";

export function CompetitorComparison() {
  const { analyses, loading } = useCompetitiveAnalyses();
  const [activeAnalyses, setActiveAnalyses] = useState<CompetitiveAnalysis[]>([]);
  const [yourBrandData, setYourBrandData] = useState<CompetitiveAnalysis | null>(null);

  useEffect(() => {
    // Get active analyses, sorted by order and share_of_voice
    const active = analyses
      .filter(a => a.is_active)
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return b.share_of_voice - a.share_of_voice;
      });
    setActiveAnalyses(active);

    // Find "Your Brand" for summary cards
    // Priority 1: Brand with position and gap_to_leader filled (usually "Your Brand")
    let yourBrand = active.find(a => a.position && a.position.trim() !== "" && a.gap_to_leader && a.gap_to_leader.trim() !== "");
    
    // Priority 2: Try name patterns
    if (!yourBrand) {
      yourBrand = active.find(a => {
        const nameLower = a.name.toLowerCase();
        return nameLower.includes("your brand") || 
               nameLower.includes("yourbrand") ||
               nameLower.includes("our brand") ||
               nameLower.includes("ourbrand") ||
               nameLower === "your brand" ||
               nameLower === "our brand";
      });
    }
    
    // Priority 3: Brand with lowest order (usually "Your Brand" is order 0)
    if (!yourBrand) {
      yourBrand = active.find(a => a.order === 0) || active[0] || null;
    }
    
    setYourBrandData(yourBrand);
  }, [analyses]);

  // Default data if no analyses found
  const defaultData = [
    { 
      name: "Your Brand",
      shareOfVoice: 32,
      sentiment: 72,
      engagement: 8.4,
    },
    { 
      name: "Competitor A",
      shareOfVoice: 28,
      sentiment: 68,
      engagement: 7.2,
    },
    { 
      name: "Competitor B",
      shareOfVoice: 24,
      sentiment: 75,
      engagement: 6.8,
    },
    { 
      name: "Competitor C",
      shareOfVoice: 16,
      sentiment: 65,
      engagement: 5.9,
    },
  ];

  // Transform analyses to chart format
  const chartData = activeAnalyses.length > 0
    ? activeAnalyses.map(analysis => ({
        name: analysis.name,
        shareOfVoice: analysis.share_of_voice,
        sentiment: analysis.sentiment,
        engagement: analysis.engagement,
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
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={60}
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
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#475569' }}
          />
          <Bar dataKey="shareOfVoice" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Share of Voice %" />
          <Bar dataKey="sentiment" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Sentiment Score" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Your Position</div>
          <div className="text-slate-900">{yourBrandData?.position || "#1 in Share of Voice"}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Gap to Leader</div>
          <div className="text-emerald-600">{yourBrandData?.gap_to_leader || "Leading by 4%"}</div>
        </div>
      </div>
    </div>
  );
}