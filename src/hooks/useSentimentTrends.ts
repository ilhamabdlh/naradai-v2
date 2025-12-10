import { useState, useEffect, useCallback } from "react";
import { SentimentTrend, SentimentTrendFormData } from "../types/sentimentTrend";
import { sentimentTrendsApi } from "../services/api";
import { toast } from "sonner";

export function useSentimentTrends() {
  const [trends, setTrends] = useState<SentimentTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sentimentTrendsApi.getAll();
      if (response.success && response.data) {
        setTrends(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch sentiment trends");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch sentiment trends";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  const createTrend = useCallback(async (data: SentimentTrendFormData) => {
    try {
      const response = await sentimentTrendsApi.create(data);
      if (response.success && response.data) {
        setTrends((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Sentiment trend created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create sentiment trend");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create sentiment trend";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateTrend = useCallback(async (id: string, data: SentimentTrendFormData) => {
    try {
      const response = await sentimentTrendsApi.update(id, data);
      if (response.success && response.data) {
        setTrends((prev) =>
          prev.map((trend) => (trend.id === id ? response.data! : trend))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Sentiment trend updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update sentiment trend");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update sentiment trend";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteTrend = useCallback(async (id: string) => {
    try {
      const response = await sentimentTrendsApi.delete(id);
      if (response.success) {
        setTrends((prev) => prev.filter((trend) => trend.id !== id));
        toast.success("Sentiment trend deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete sentiment trend");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete sentiment trend";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    trends,
    loading,
    error,
    fetchTrends,
    createTrend,
    updateTrend,
    deleteTrend,
  };
}

