import { Opportunity } from "../types/opportunity";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "./ui/utils";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getPotentialBadge = (potential: string) => {
  const config = {
    high: { label: "High Potential", className: "bg-emerald-600 text-white border-0" },
    medium: { label: "Medium Potential", className: "bg-cyan-500 text-white border-0" },
    low: { label: "Low Potential", className: "bg-slate-400 text-white border-0" },
  };
  const cfg = config[potential as keyof typeof config] || config.medium;
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
};

const getTrendIcon = (trend: string) => {
  const config = {
    increasing: { icon: TrendingUp, className: "text-emerald-600", label: "increasing" },
    stable: { icon: Minus, className: "text-slate-500", label: "stable" },
    decreasing: { icon: TrendingDown, className: "text-red-600", label: "decreasing" },
  };
  const cfg = config[trend as keyof typeof config] || config.stable;
  const Icon = cfg.icon;
  return (
    <span className={cn("flex items-center gap-1 text-sm", cfg.className)}>
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
};

const getTimeframeBadge = (timeframe: string) => {
  const config = {
    "Short-term": { className: "bg-violet-100 text-violet-700 border-violet-200" },
    "Medium-term": { className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    "Long-term": { className: "bg-slate-100 text-slate-700 border-slate-200" },
  };
  const cfg = config[timeframe as keyof typeof config] || config["Medium-term"];
  return <Badge variant="outline" className={cfg.className}>{timeframe}</Badge>;
};

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

export function OpportunitiesTable({ opportunities, onEdit, onDelete, loading }: OpportunitiesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No opportunities found</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Potential</TableHead>
            <TableHead className="text-center">Confidence</TableHead>
            <TableHead>Timeframe</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{opp.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{opp.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{opp.description}</div>
              </TableCell>
              <TableCell>{getPotentialBadge(opp.potential)}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${opp.confidence_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10">{opp.confidence_score}%</span>
                </div>
              </TableCell>
              <TableCell>{getTimeframeBadge(opp.timeframe)}</TableCell>
              <TableCell>
                <span className="text-sm text-slate-700">{opp.category}</span>
              </TableCell>
              <TableCell>{getTrendIcon(opp.trend)}</TableCell>
              <TableCell>{getStatusBadge(opp.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(opp)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(opp.id)}
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



