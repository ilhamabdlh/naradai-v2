import React, { useState } from "react";
import { Target } from "lucide-react";
import { PriorityActionsTable } from "../components/PriorityActionsTable";
import { PriorityActionForm } from "../components/PriorityActionForm";
import { usePriorityActions } from "../hooks/usePriorityActions";
import { PriorityAction, PriorityActionFormData } from "../types/priorityAction";
import { Toaster } from "../components/ui/sonner";

export function PriorityActionsManager() {
  const { actions, loading, createAction, updateAction, deleteAction } = usePriorityActions();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<PriorityAction | null>(null);
  const [formLoading, setFormLoading] = useState(false);


  const handleCreate = () => {
    setEditingAction(null);
    setFormOpen(true);
  };

  const handleEdit = (action: PriorityAction) => {
    setEditingAction(action);
    setFormOpen(true);
  };


  const handleDelete = (id: string) => {
    console.log("Delete button clicked, id:", id);
    if (window.confirm("Are you sure you want to delete this action?")) {
      deleteAction(id);
    }
  };

  const handleFormSubmit = async (data: PriorityActionFormData) => {
    try {
      setFormLoading(true);
      console.log("Submitting form data:", data);
      if (editingAction && editingAction.id) {
        await updateAction(editingAction.id, data);
      } else {
        await createAction(data);
      }
      setFormOpen(false);
      setEditingAction(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      // Error already handled in hook
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-violet-600" />
              <div>
                <h2 className="text-2xl text-slate-900">Priority Actions Manager</h2>
                <p className="text-sm text-slate-600">Manage and configure priority actions for dashboard</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              type="button"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 shadow-lg px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              {/* <Plus className="w-4 h-2 flex-shrink-0" /> */}
              <span className="whitespace-nowrap">+ Add New Action</span>
            </button>
          </div>

          {/* Table */}
            <PriorityActionsTable
              actions={actions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />

          {/* Form Modal */}
          <PriorityActionForm
            open={formOpen}
            onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) {
                setEditingAction(null);
              }
            }}
            onSubmit={handleFormSubmit}
            initialData={editingAction}
            loading={formLoading}
          />

          <Toaster />
        </main>
      </div>
    </div>
  );
}

