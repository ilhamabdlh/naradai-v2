import { DashboardStat } from "../types/dashboardStat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Users, TrendingDown, AlertTriangle, TrendingUp, BarChart3, Activity, Percent, Eye } from "lucide-react";
import { cn } from "./ui/utils";

interface DashboardStatsTableProps {
  stats: DashboardStat[];
  onEdit: (stat: DashboardStat) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Users,
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Percent,
  Eye,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || BarChart3;
};

const getTrendBadge = (trend: string) => {
  const config = {
    up: { label: "Up", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    down: { label: "Down", className: "bg-red-100 text-red-700 border-red-200" },
  };
  const cfg = config[trend as keyof typeof config] || config.up;
  return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
};

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

export function DashboardStatsTable({ stats, onEdit, onDelete, loading }: DashboardStatsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No dashboard stats found</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">Order</TableHead>
            <TableHead className="w-16">Icon</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <TableRow key={stat.id} className="hover:bg-slate-50">
                <TableCell className="text-slate-600 font-medium">{stat.order}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-violet-600" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{stat.label}</div>
                </TableCell>
                <TableCell>
                  <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded-full",
                    stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {stat.change}
                  </span>
                </TableCell>
                <TableCell>{getTrendBadge(stat.trend)}</TableCell>
                <TableCell>{getStatusBadge(stat.is_active)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(stat)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(stat.id)}
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



