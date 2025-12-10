import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { DashboardStatsTable } from "../components/DashboardStatsTable";
import { DashboardStatForm } from "../components/DashboardStatForm";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStat, DashboardStatFormData } from "../types/dashboardStat";
import { Toaster } from "../components/ui/sonner";

export function DashboardStatsManager() {
  const { stats, loading, createStat, updateStat, deleteStat } = useDashboardStats();
  const [formOpen, setFormOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<DashboardStat | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = () => {
    setEditingStat(null);
    setFormOpen(true);
  };

  const handleEdit = (stat: DashboardStat) => {
    setEditingStat(stat);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this stat?")) {
      deleteStat(id);
    }
  };

  const handleFormSubmit = async (data: DashboardStatFormData) => {
    try {
      setFormLoading(true);
      if (editingStat && editingStat.id) {
        await updateStat(editingStat.id, data);
      } else {
        await createStat(data);
      }
      setFormOpen(false);
      setEditingStat(null);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-violet-600" />
          <div>
            <h2 className="text-2xl text-slate-900">Dashboard Stats Manager</h2>
            <p className="text-sm text-slate-600">Manage stat cards displayed on the dashboard</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          type="button"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          <span className="whitespace-nowrap">+ Add New Stat</span>
        </button>
      </div>

      {/* Table */}
      <DashboardStatsTable
        stats={stats}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Form Modal */}
      <DashboardStatForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingStat(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={editingStat}
        loading={formLoading}
      />

      <Toaster />
    </>
  );
}



