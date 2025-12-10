import { AlertTriangle, Target, MessageSquare, Package, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ActionDetailsModal } from "./ActionDetailsModal";
import { Share2, CheckCircle, Clock, Circle } from "lucide-react";
import { PriorityAction } from "../types/priorityAction";
import { priorityActionsApi } from "../services/api";
import { toast } from "sonner";

// Icon mapping
const iconMap: Record<string, any> = {
  Package,
  MessageSquare,
  Zap,
  AlertTriangle,
  Target,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Package;
};

export function ActionRecommendations() {
  const [actions, setActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<PriorityAction | null>(null);
  const [actionStatuses, setActionStatuses] = useState<Record<string, string>>({});
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  
  // Carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await priorityActionsApi.getAll();
        if (response.success && response.data) {
          setActions(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch actions");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch actions";
        setError(errorMessage);
        console.error("Error fetching actions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  const priorityColors = {
    critical: "from-red-500 to-orange-500",
    high: "from-orange-500 to-amber-500",
    medium: "from-amber-500 to-yellow-500",
  };

  // Carousel calculations
  const totalPages = Math.ceil(actions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleActions = actions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleStatusChange = async (actionId: string, status: string) => {
    try {
      const response = await priorityActionsApi.updateStatus(actionId, status);
      if (response.success) {
    setActionStatuses((prev) => ({ ...prev, [actionId]: status }));
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId ? { ...action, status: status as any } : action
          )
        );
        toast.success("Status updated successfully");
      } else {
        throw new Error(response.error || "Failed to update status");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
      console.error("Error updating status:", error);
    }
  };

  const handleShare = (actionId: string, method: string) => {
    const action = actions.find((a) => a.id === actionId);
    if (!action) return;

    const shareText = `Priority Action: ${action.title}\n\n${action.description}\n\nRecommendation: ${action.recommendation}`;
    
    if (method === "copy") {
      navigator.clipboard.writeText(shareText);
      setShowShareMenu(null);
    } else if (method === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(action.title)}&body=${encodeURIComponent(shareText)}`;
      setShowShareMenu(null);
    }
  };

  const getStatusBadge = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    const status = actionStatuses[actionId] || action?.status || "not-started";
    const statusConfig = {
      "not-started": { icon: Circle, label: "Not Started", color: "bg-slate-100 text-slate-600" },
      "in-progress": { icon: Clock, label: "In Progress", color: "bg-amber-100 text-amber-700" },
      "completed": { icon: CheckCircle, label: "Completed", color: "bg-emerald-100 text-emerald-700" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["not-started"];
    const StatusIcon = config.icon;
    
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${config.color}`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
        <Target className="w-6 h-6 text-violet-600" />
        <div>
          <h2 className="text-slate-900">Priority Actions</h2>
          <p className="text-sm text-slate-600">AI-recommended actions based on urgent issues</p>
        </div>
      </div>

        {/* Carousel Navigation */}
        {!loading && !error && actions.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading priority actions...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

      {!loading && !error && actions.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">No priority actions found</div>
        </div>
      )}

      {!loading && !error && actions.length > 0 && (
        <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleActions.map((action) => {
              const Icon = getIconComponent(action.icon);
          return (
            <div
              key={action.id}
              className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-sm border border-slate-200 hover:border-violet-300 transition-all group shadow-sm hover:shadow-lg"
            >
              {/* Priority indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityColors[action.priority as keyof typeof priorityColors]}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(action.id)}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareMenu(showShareMenu === action.id ? null : action.id);
                        }}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Share action"
                      >
                        <Share2 className="w-4 h-4 text-slate-600" />
                      </button>
                      {showShareMenu === action.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden z-10 min-w-[160px]">
                          <button
                            onClick={() => handleShare(action.id, "copy")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
                          >
                            Copy link
                          </button>
                          <button
                            onClick={() => handleShare(action.id, "email")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700 border-t border-slate-100 cursor-pointer"
                          >
                            Send via email
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-slate-900 mb-2">{action.title}</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {action.description}
                </p>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Impact</div>
                    <div className="text-sm text-slate-900">{action.impact}</div>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Effort</div>
                    <div className="text-sm text-slate-900">{action.effort}</div>
                  </div>
                </div>

                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-violet-900 leading-relaxed">
                      {action.recommendation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Mentions</div>
                        <div className="text-slate-900">{action.mentions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Sentiment</div>
                        <div className={action.sentiment < 0 ? "text-red-600" : "text-emerald-600"}>
                          {action.sentiment > 0 ? '+' : ''}{action.sentiment.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Trend</div>
                        <div className="text-slate-900 capitalize">{action.trend}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAction(action)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
                >
                  View Details & Take Action
                </button>
              </div>
            </div>
          );
        })}
      </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentPage === index
                      ? "bg-violet-500 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedAction && (
        <ActionDetailsModal
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          onStatusChange={handleStatusChange}
          currentStatus={actionStatuses[selectedAction.id] || selectedAction.status || "not-started"}
        />
      )}
    </section>
  );
}
