import { PriorityAction } from "../types/priorityAction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Package, MessageSquare, Zap, AlertTriangle, Target, Circle, Clock, CheckCircle } from "lucide-react";
import { cn } from "./ui/utils";

interface PriorityActionsTableProps {
  actions: PriorityAction[];
  onEdit: (action: PriorityAction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

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

const getPriorityBadge = (priority: string) => {
  const config = {
    critical: { label: "Critical", className: "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0" },
    high: { label: "High", className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0" },
    medium: { label: "Medium", className: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0" },
  };
  const cfg = config[priority as keyof typeof config] || config.medium;
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
};

const getStatusBadge = (status?: string) => {
  const s = status || "not-started";
  const config = {
    "not-started": { icon: Circle, label: "Not Started", className: "bg-slate-100 text-slate-600 border-slate-200" },
    "in-progress": { icon: Clock, label: "In Progress", className: "bg-amber-100 text-amber-700 border-amber-200" },
    "completed": { icon: CheckCircle, label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };
  const cfg = config[s as keyof typeof config];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5", cfg.className)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  );
};

const getTrendBadge = (trend: string) => {
  const config = {
    increasing: { label: "Increasing", className: "bg-red-50 text-red-700 border-red-200" },
    decreasing: { label: "Decreasing", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    stable: { label: "Stable", className: "bg-slate-50 text-slate-700 border-slate-200" },
  };
  const cfg = config[trend as keyof typeof config] || config.stable;
  return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
};

export function PriorityActionsTable({ actions, onEdit, onDelete, loading }: PriorityActionsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No priority actions found</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">No</TableHead>
            <TableHead className="w-16">Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Effort</TableHead>
            <TableHead className="text-right">Mentions</TableHead>
            <TableHead className="text-right">Sentiment</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((action, index) => {
            const IconComponent = getIconComponent(action.icon);
            return (
              <TableRow key={action.id} className="hover:bg-slate-50">
                <TableCell className="text-slate-600">{index + 1}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-violet-600" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{action.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{action.description}</div>
                </TableCell>
                <TableCell>{getPriorityBadge(action.priority)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{action.impact}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{action.effort}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{action.mentions.toLocaleString()}</TableCell>
                <TableCell className={cn("text-right font-medium", action.sentiment < 0 ? "text-red-600" : "text-emerald-600")}>
                  {action.sentiment > 0 ? '+' : ''}{action.sentiment.toFixed(2)}
                </TableCell>
                <TableCell>{getTrendBadge(action.trend)}</TableCell>
                <TableCell>{getStatusBadge(action.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(action)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(action.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

