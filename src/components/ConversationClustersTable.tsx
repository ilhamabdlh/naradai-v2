import { ConversationCluster } from "../types/conversationCluster";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConversationClustersTableProps {
  clusters: ConversationCluster[];
  onEdit: (cluster: ConversationCluster) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

const getTrendIcon = (trend: string) => {
  if (trend === "up") {
    return <TrendingUp className="w-4 h-4 text-amber-600" />;
  }
  if (trend === "down") {
    return <TrendingDown className="w-4 h-4 text-cyan-600" />;
  }
  return <Minus className="w-4 h-4 text-slate-600" />;
};

const getSentimentColor = (score: number) => {
  if (score > 0) return "text-emerald-600";
  if (score < 0) return "text-red-600";
  return "text-slate-600";
};

export function ConversationClustersTable({ clusters, onEdit, onDelete, loading }: ConversationClustersTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No conversation clusters found</div>
      </div>
    );
  }

  // Find max size for bar width calculation
  const maxSize = Math.max(...clusters.map(c => c.size));

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">Order</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Mentions</TableHead>
            <TableHead className="text-center">Sentiment</TableHead>
            <TableHead className="text-center">Trend</TableHead>
            <TableHead>Keywords</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => (
            <TableRow key={cluster.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{cluster.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{cluster.theme}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                      style={{ width: `${(cluster.size / maxSize) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-20">{cluster.size.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn("font-medium", getSentimentColor(cluster.sentiment))}>
                  {cluster.sentiment > 0 ? '+' : ''}{cluster.sentiment.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {getTrendIcon(cluster.trend)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {cluster.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-violet-100 border border-violet-200 rounded text-xs text-violet-700"
                    >
                      {keyword}
                    </span>
                  ))}
                  {cluster.keywords.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-slate-500">
                      +{cluster.keywords.length - 3}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(cluster.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(cluster)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cluster.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

