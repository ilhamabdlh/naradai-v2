import { Risk } from "../types/risk";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "./ui/utils";

interface RisksTableProps {
  risks: Risk[];
  onEdit: (risk: Risk) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getSeverityBadge = (severity: string) => {
  const config = {
    critical: { label: "Critical", className: "bg-red-600 text-white border-0" },
    high: { label: "High", className: "bg-orange-500 text-white border-0" },
    medium: { label: "Medium", className: "bg-amber-500 text-white border-0" },
    low: { label: "Low", className: "bg-slate-400 text-white border-0" },
  };
  const cfg = config[severity as keyof typeof config] || config.medium;
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
};

const getTrendIcon = (trend: string) => {
  const config = {
    increasing: { icon: TrendingUp, className: "text-red-600", label: "increasing" },
    stable: { icon: Minus, className: "text-slate-500", label: "stable" },
    decreasing: { icon: TrendingDown, className: "text-emerald-600", label: "decreasing" },
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

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

export function RisksTable({ risks, onEdit, onDelete, loading }: RisksTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No risks found</div>
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
            <TableHead>Severity</TableHead>
            <TableHead className="text-center">Probability</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Indicators</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => (
            <TableRow key={risk.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{risk.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{risk.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{risk.description}</div>
              </TableCell>
              <TableCell>{getSeverityBadge(risk.severity)}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        risk.probability >= 75 ? "bg-red-500" :
                        risk.probability >= 50 ? "bg-orange-500" : "bg-amber-500"
                      )}
                      style={{ width: `${risk.probability}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10">{risk.probability}%</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-700">{risk.impact_assessment}</span>
              </TableCell>
              <TableCell>{getTrendIcon(risk.trend)}</TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">{risk.indicators?.length || 0} indicators</span>
              </TableCell>
              <TableCell>{getStatusBadge(risk.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(risk)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(risk.id)}
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



