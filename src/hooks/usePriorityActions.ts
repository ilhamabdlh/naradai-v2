import { useState, useEffect, useCallback } from "react";
import { PriorityAction, PriorityActionFormData } from "../types/priorityAction";
import { priorityActionsApi } from "../services/api";
import { toast } from "sonner";

export function usePriorityActions() {
  const [actions, setActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await priorityActionsApi.getAll();
      if (response.success && response.data) {
        setActions(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch actions");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch actions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const createAction = useCallback(async (data: PriorityActionFormData) => {
    try {
      const response = await priorityActionsApi.create(data);
      if (response.success && response.data) {
        setActions((prev) => [response.data!, ...prev]);
        toast.success("Priority action created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create action");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create action";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateAction = useCallback(async (id: string, data: PriorityActionFormData) => {
    try {
      const response = await priorityActionsApi.update(id, data);
      if (response.success && response.data) {
        setActions((prev) => prev.map((action) => (action.id === id ? response.data! : action)));
        toast.success("Priority action updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update action");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update action";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteAction = useCallback(async (id: string) => {
    try {
      const response = await priorityActionsApi.delete(id);
      if (response.success) {
        setActions((prev) => prev.filter((action) => action.id !== id));
        toast.success("Priority action deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete action");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete action";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    actions,
    loading,
    error,
    fetchActions,
    createAction,
    updateAction,
    deleteAction,
  };
}

