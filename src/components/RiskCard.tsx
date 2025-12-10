import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Risk } from "../types/risk";

interface RiskCardProps {
  risk: Risk;
}

export function RiskCard({ risk }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityConfig = {
    critical: { color: "bg-red-100 border-red-300 text-red-700", dot: "bg-red-500" },
    high: { color: "bg-orange-100 border-orange-300 text-orange-700", dot: "bg-orange-500" },
    medium: { color: "bg-amber-100 border-amber-300 text-amber-700", dot: "bg-amber-500" },
    low: { color: "bg-slate-100 border-slate-300 text-slate-700", dot: "bg-slate-500" },
  };

  const config = severityConfig[risk.severity as keyof typeof severityConfig] || severityConfig.medium;
  const TrendIcon = risk.trend === "increasing" ? TrendingUp : risk.trend === "decreasing" ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${config.dot}`} />
              <span className={`text-xs px-2.5 py-1 rounded-full ${config.color} uppercase tracking-wider`}>
                {risk.severity}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendIcon className="w-3.5 h-3.5" />
                {risk.trend}
              </div>
            </div>
            <h4 className="text-slate-900 mb-1">{risk.title}</h4>
            <p className="text-sm text-slate-600">{risk.description}</p>
          </div>
        </div>

        {/* Probability Meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Probability</span>
            <span className="font-medium">{risk.probability}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${risk.probability}%` }}
            />
          </div>
        </div>

        {/* Quick Metrics - Indicators */}
        {risk.indicators && risk.indicators.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {risk.indicators.slice(0, 3).map((indicator, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">{indicator.label}</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-900">
                    {typeof indicator.value === 'number' && indicator.value < 1 && indicator.value > -1 
                      ? indicator.value.toFixed(2) 
                      : indicator.value}
                  </span>
                  {indicator.change !== 0 && (
                    <span className={`text-xs ${indicator.change > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {indicator.change > 0 ? '+' : ''}{indicator.change}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-violet-600 hover:text-violet-700 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'View risk details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-5 space-y-4">
          <div>
            <div className="text-sm text-slate-700 mb-2">Impact Assessment</div>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-slate-900">{risk.impact_assessment}</div>
            </div>
          </div>

          {risk.mitigation_strategy && risk.mitigation_strategy.length > 0 && (
            <div>
              <div className="text-sm text-slate-700 mb-2">Mitigation Strategy</div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <ul className="space-y-2 text-sm text-slate-700">
                  {risk.mitigation_strategy.map((strategy, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-violet-600 mt-1">•</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
