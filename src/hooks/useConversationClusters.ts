import { useState, useEffect, useCallback } from "react";
import { ConversationCluster, ConversationClusterFormData } from "../types/conversationCluster";
import { conversationClustersApi } from "../services/api";
import { toast } from "sonner";

export function useConversationClusters() {
  const [clusters, setClusters] = useState<ConversationCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClusters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conversationClustersApi.getAll();
      if (response.success && response.data) {
        setClusters(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch conversation clusters");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch conversation clusters";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const createCluster = useCallback(async (data: ConversationClusterFormData) => {
    try {
      const response = await conversationClustersApi.create(data);
      if (response.success && response.data) {
        setClusters((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Conversation cluster created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create conversation cluster");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create conversation cluster";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateCluster = useCallback(async (id: string, data: ConversationClusterFormData) => {
    try {
      const response = await conversationClustersApi.update(id, data);
      if (response.success && response.data) {
        setClusters((prev) =>
          prev.map((cluster) => (cluster.id === id ? response.data! : cluster))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Conversation cluster updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update conversation cluster");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update conversation cluster";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteCluster = useCallback(async (id: string) => {
    try {
      const response = await conversationClustersApi.delete(id);
      if (response.success) {
        setClusters((prev) => prev.filter((cluster) => cluster.id !== id));
        toast.success("Conversation cluster deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete conversation cluster");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete conversation cluster";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    clusters,
    loading,
    error,
    fetchClusters,
    createCluster,
    updateCluster,
    deleteCluster,
  };
}

