import { useState, useEffect, useCallback } from "react";
import { Opportunity, OpportunityFormData } from "../types/opportunity";
import { opportunitiesApi } from "../services/api";
import { toast } from "sonner";

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunitiesApi.getAll();
      if (response.success && response.data) {
        setOpportunities(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch opportunities");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch opportunities";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const createOpportunity = useCallback(async (data: OpportunityFormData) => {
    try {
      const response = await opportunitiesApi.create(data);
      if (response.success && response.data) {
        setOpportunities((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Opportunity created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create opportunity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create opportunity";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateOpportunity = useCallback(async (id: string, data: OpportunityFormData) => {
    try {
      const response = await opportunitiesApi.update(id, data);
      if (response.success && response.data) {
        setOpportunities((prev) =>
          prev.map((opp) => (opp.id === id ? response.data! : opp))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Opportunity updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update opportunity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update opportunity";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteOpportunity = useCallback(async (id: string) => {
    try {
      const response = await opportunitiesApi.delete(id);
      if (response.success) {
        setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
        toast.success("Opportunity deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete opportunity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete opportunity";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    opportunities,
    loading,
    error,
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  };
}



