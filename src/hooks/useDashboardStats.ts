import { useState, useEffect, useCallback } from "react";
import { DashboardStat, DashboardStatFormData } from "../types/dashboardStat";
import { dashboardStatsApi } from "../services/api";
import { toast } from "sonner";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardStatsApi.getAll();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch stats");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const createStat = useCallback(async (data: DashboardStatFormData) => {
    try {
      const response = await dashboardStatsApi.create(data);
      if (response.success && response.data) {
        setStats((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Dashboard stat created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create stat");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create stat";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateStat = useCallback(async (id: string, data: DashboardStatFormData) => {
    try {
      const response = await dashboardStatsApi.update(id, data);
      if (response.success && response.data) {
        setStats((prev) => 
          prev.map((stat) => (stat.id === id ? response.data! : stat))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Dashboard stat updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update stat");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update stat";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteStat = useCallback(async (id: string) => {
    try {
      const response = await dashboardStatsApi.delete(id);
      if (response.success) {
        setStats((prev) => prev.filter((stat) => stat.id !== id));
        toast.success("Dashboard stat deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete stat");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete stat";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    createStat,
    updateStat,
    deleteStat,
  };
}



