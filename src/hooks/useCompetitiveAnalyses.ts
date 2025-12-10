import { useState, useEffect, useCallback } from "react";
import { CompetitiveAnalysis, CompetitiveAnalysisFormData } from "../types/competitiveAnalysis";
import { competitiveAnalysesApi } from "../services/api";
import { toast } from "sonner";

export function useCompetitiveAnalyses() {
  const [analyses, setAnalyses] = useState<CompetitiveAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await competitiveAnalysesApi.getAll();
      if (response.success && response.data) {
        setAnalyses(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch competitive analyses");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch competitive analyses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const createAnalysis = useCallback(async (data: CompetitiveAnalysisFormData) => {
    try {
      const response = await competitiveAnalysesApi.create(data);
      if (response.success && response.data) {
        setAnalyses((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Competitive analysis created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create competitive analysis");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create competitive analysis";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateAnalysis = useCallback(async (id: string, data: CompetitiveAnalysisFormData) => {
    try {
      const response = await competitiveAnalysesApi.update(id, data);
      if (response.success && response.data) {
        setAnalyses((prev) =>
          prev.map((analysis) => (analysis.id === id ? response.data! : analysis))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Competitive analysis updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update competitive analysis");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update competitive analysis";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteAnalysis = useCallback(async (id: string) => {
    try {
      const response = await competitiveAnalysesApi.delete(id);
      if (response.success) {
        setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id));
        toast.success("Competitive analysis deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete competitive analysis");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete competitive analysis";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    analyses,
    loading,
    error,
    fetchAnalyses,
    createAnalysis,
    updateAnalysis,
    deleteAnalysis,
  };
}

