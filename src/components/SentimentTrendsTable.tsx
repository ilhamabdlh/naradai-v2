import { SentimentTrend } from "../types/sentimentTrend";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

interface SentimentTrendsTableProps {
  trends: SentimentTrend[];
  onEdit: (trend: SentimentTrend) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

export function SentimentTrendsTable({ trends, onEdit, onDelete, loading }: SentimentTrendsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No sentiment trends found</div>
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
            <TableHead>Period</TableHead>
            <TableHead className="text-center">Positive %</TableHead>
            <TableHead className="text-center">Negative %</TableHead>
            <TableHead className="text-center">Neutral %</TableHead>
            <TableHead className="text-center">Data Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trends.map((trend) => (
            <TableRow key={trend.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{trend.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{trend.title}</div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-700">{trend.period}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-emerald-600 font-medium">{trend.positive_percent}%</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-red-600 font-medium">{trend.negative_percent}%</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-slate-600 font-medium">{trend.neutral_percent}%</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm text-slate-600">{trend.trend_data?.length || 0} points</span>
              </TableCell>
              <TableCell>{getStatusBadge(trend.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(trend)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(trend.id)}
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

