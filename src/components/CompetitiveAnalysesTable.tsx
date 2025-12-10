import { CompetitiveAnalysis } from "../types/competitiveAnalysis";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface CompetitiveAnalysesTableProps {
  analyses: CompetitiveAnalysis[];
  onEdit: (analysis: CompetitiveAnalysis) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

export function CompetitiveAnalysesTable({ analyses, onEdit, onDelete, loading }: CompetitiveAnalysesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No competitive analyses found</div>
      </div>
    );
  }

  // Find max share of voice for bar width calculation
  const maxShareOfVoice = Math.max(...analyses.map(a => a.share_of_voice));

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">Order</TableHead>
            <TableHead>Brand/Competitor Name</TableHead>
            <TableHead>Share of Voice %</TableHead>
            <TableHead>Sentiment Score</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Gap to Leader</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow key={analysis.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{analysis.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{analysis.name}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                      style={{ width: `${(analysis.share_of_voice / maxShareOfVoice) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12">{analysis.share_of_voice.toFixed(1)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-900">{analysis.sentiment.toFixed(1)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-900">{analysis.engagement.toFixed(1)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">{analysis.position || "-"}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-emerald-600">{analysis.gap_to_leader || "-"}</span>
              </TableCell>
              <TableCell>{getStatusBadge(analysis.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(analysis)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(analysis.id)}
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

