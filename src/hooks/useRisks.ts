import { useState, useEffect, useCallback } from "react";
import { Risk, RiskFormData } from "../types/risk";
import { risksApi } from "../services/api";
import { toast } from "sonner";

export function useRisks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await risksApi.getAll();
      if (response.success && response.data) {
        setRisks(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch risks");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch risks";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const createRisk = useCallback(async (data: RiskFormData) => {
    try {
      const response = await risksApi.create(data);
      if (response.success && response.data) {
        setRisks((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Risk created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create risk");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create risk";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateRisk = useCallback(async (id: string, data: RiskFormData) => {
    try {
      const response = await risksApi.update(id, data);
      if (response.success && response.data) {
        setRisks((prev) =>
          prev.map((risk) => (risk.id === id ? response.data! : risk))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Risk updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update risk");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update risk";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteRisk = useCallback(async (id: string) => {
    try {
      const response = await risksApi.delete(id);
      if (response.success) {
        setRisks((prev) => prev.filter((risk) => risk.id !== id));
        toast.success("Risk deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete risk");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete risk";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    risks,
    loading,
    error,
    fetchRisks,
    createRisk,
    updateRisk,
    deleteRisk,
  };
}



