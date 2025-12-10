import { DiscussionTopic } from "../types/discussionTopic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface DiscussionTopicsTableProps {
  topics: DiscussionTopic[];
  onEdit: (topic: DiscussionTopic) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>;
  }
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Inactive</Badge>;
};

const getSentimentColor = (score: number) => {
  if (score > 0) return "text-emerald-600";
  if (score < 0) return "text-red-600";
  return "text-slate-600";
};

export function DiscussionTopicsTable({ topics, onEdit, onDelete, loading }: DiscussionTopicsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">No discussion topics found</div>
      </div>
    );
  }

  // Find max volume for bar width calculation
  const maxVolume = Math.max(...topics.map(t => t.volume));

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">Order</TableHead>
            <TableHead>Topic Name</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead className="text-center">Sentiment Score</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => (
            <TableRow key={topic.id} className="hover:bg-slate-50">
              <TableCell className="text-slate-600 font-medium">{topic.order}</TableCell>
              <TableCell>
                <div className="font-medium text-slate-900">{topic.name}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                      style={{ width: `${(topic.volume / maxVolume) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16">{topic.volume.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn("font-medium", getSentimentColor(topic.sentiment_score))}>
                  {topic.sentiment_score > 0 ? '+' : ''}{topic.sentiment_score.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-slate-300"
                    style={{ background: topic.color || 'linear-gradient(to right, #8b5cf6, #06b6d4)' }}
                  />
                  <span className="text-xs text-slate-500 font-mono">{topic.color || 'default'}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(topic.is_active)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(topic)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(topic.id)}
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

