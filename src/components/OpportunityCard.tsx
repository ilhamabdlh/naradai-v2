import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Target } from "lucide-react";
import { useState } from "react";
import { Opportunity } from "../types/opportunity";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const potentialConfig = {
    high: { color: "bg-emerald-100 border-emerald-300 text-emerald-700", dot: "bg-emerald-500" },
    medium: { color: "bg-cyan-100 border-cyan-300 text-cyan-700", dot: "bg-cyan-500" },
    low: { color: "bg-slate-100 border-slate-300 text-slate-700", dot: "bg-slate-500" },
  };

  const config = potentialConfig[opportunity.potential as keyof typeof potentialConfig] || potentialConfig.medium;
  const TrendIcon = opportunity.trend === "increasing" ? TrendingUp : opportunity.trend === "decreasing" ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${config.dot}`} />
              <span className={`text-xs px-2.5 py-1 rounded-full ${config.color} uppercase tracking-wider`}>
                {opportunity.potential} Potential
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendIcon className="w-3.5 h-3.5" />
                {opportunity.trend}
              </div>
            </div>
            <h4 className="text-slate-900 mb-1">{opportunity.title}</h4>
            <p className="text-sm text-slate-600">{opportunity.description}</p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Confidence Score</span>
            <span className="font-medium">{opportunity.confidence_score}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${opportunity.confidence_score}%` }}
            />
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Timeframe</div>
            <div className="text-sm text-slate-900">{opportunity.timeframe}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Category</div>
            <div className="text-sm text-slate-900">{opportunity.category}</div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-violet-600 hover:text-violet-700 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'View opportunity details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-5 space-y-4">
          {/* Key Metrics */}
          {opportunity.key_metrics && opportunity.key_metrics.length > 0 && (
            <div>
              <div className="text-sm text-slate-700 mb-2">Key Metrics</div>
              <div className="grid grid-cols-3 gap-3">
                {opportunity.key_metrics.map((metric, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
                    <div className="text-slate-900">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {opportunity.recommended_actions && opportunity.recommended_actions.length > 0 && (
            <div>
              <div className="text-sm text-slate-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Recommended Actions
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <ul className="space-y-2 text-sm text-slate-700">
                  {opportunity.recommended_actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition-opacity">
            Create Action Plan
          </button>
        </div>
      )}
    </div>
  );
}
