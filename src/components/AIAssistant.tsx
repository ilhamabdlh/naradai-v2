import { useState } from "react";
import { Sparkles, Send, Lightbulb } from "lucide-react";

export function AIAssistant() {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestions = [
    "What's causing the sentiment drop this week?",
    "Show me top product complaints",
    "Compare our performance vs competitors",
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-white to-cyan-50 backdrop-blur-sm border border-violet-200 p-8 shadow-lg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-100/20 to-cyan-100/20 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900">AI Intelligence Assistant</h2>
            <p className="text-sm text-slate-600">Ask anything about your social intelligence data</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI to explain insights, trends, or recommend actions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="w-full bg-white border border-slate-300 rounded-xl px-6 py-4 pr-14 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all shadow-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Suggested questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:border-violet-400 hover:bg-violet-50 transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}